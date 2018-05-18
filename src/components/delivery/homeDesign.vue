<template>
	<div class="homeDesign">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">套餐设计</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>家装设计</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="fullClick">全屏展示</el-button>
			</div>
			<div class="line"></div>
			<!--酷家乐设计模块-->
			<div class="designModules">
				<iframe :src="designUrl" class="iframe" scrolling="no" frameborder="0"></iframe>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name:'homeDesign',
	data(){
		return{
			designUrl:'https://www.kujiale.com/v/auth?accesstoken='+this.$store.state.accessToken+'&dest=4'
		}
	},
	//挂载
	mounted(){		
		postMessage(this);
		//全屏展示
		fullScreen();
	},
	beforeDestroy(){
		$(".fullscreen").remove();
	},
	methods: {
		//全屏
		fullClick(){
			fullScreen();
		}
	}
}
//全屏展示
function fullScreen(){
	$("body").append("<div class='fullscreen'></div>");
	let html=$(".designModules").html();
	$(".designModules").html("");
	$(".fullscreen").html(html);
}
function postMessage(obj){
	if (window.postMessage) {
	    var callback = function(ev) {
	        //console ? console.log(ev) : alert(ev.data);
	        if (ev.origin === 'http://www.kujiale.com' ||
	            ev.origin === 'http://yun.kujiale.com' ||
	            ev.origin === 'https://www.kujiale.com' ||
	            ev.origin === 'https://yun.kujiale.com') {
	            // handle message in ev ...
	            //console.log(typeof(ev.data))
	            var data;
	            if(ev.data){
	            	if(typeof(ev.data)!="object"){	            	
		            	data = JSON.parse(ev.data)
		            }else{
		            	data =ev.data;
		            }
		            if(data.action){
		            	if(data.action=="kjl_completed"){
		            		/*console.log(data.action)*/
		            		obj.$message({
					          	message: '设计保存成功!',
					          	type: 'success'
					       	}); 
					       	let html=$(".designModules").html();
					       	$(".designModules").html(html);
					       	obj.$router.push({path:'/delivery/addPackage/'+data.desid})
		            	}
		            }
	            }
	            
	        }
	    };
	    if ('addEventListener' in document) {
	        window.addEventListener('message', callback, false);
	    } else if ('attachEvent' in document) {
	        window.attachEvent('onmessage', callback);
	    }
	} else {
	    // 如果不支持postMessage， 则使用ie6/7的window共有属性navigator进行hack
	    window.navigator.listenKJL = function(msg) {
	        //console.log(msg)
	        // var data = JSON.parse(ev.data)
	        var data;
	        if(ev.data){
	        	if(typeof(ev.data)!="object"){	            	
		        	data = JSON.parse(ev.data)
		        }else{
		        	data =ev.data;
		        }
		        if(data.action){
		        	if(data.action=="kjl_completed"){
		        		/*console.log(data.action)*/
		        		obj.$message({
				          	message: '设计保存成功!',
				          	type: 'success'
				       	}); 
		        	}
		        	let html=$(".designModules").html();
					$(".designModules").html(html);
					obj.$router.push({path:'/delivery/addPackage/'+data.desid})
		        }
	        }
	    };
	}
}

</script>

<style scoped>
	.designModules{
		margin-top: 30px;
	}
	.iframe{
		width: 100%;
		height: 700px;
	}
</style>