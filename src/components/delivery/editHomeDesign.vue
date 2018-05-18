<template>
	<div class="editHomeDesign">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">编辑方案</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>编辑方案</span>
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
	name:'editHomeDesign',
	data(){
		return{
			id:'',
			listingId:'',
			designUrl:''
		}
	},
	//挂载
	mounted(){
		let obj=this;
		let base64=new Base64();
		if(this.$route.params.code){			
			this.id=base64.decode(this.$route.params.code);
		}else{
			window.history.go(-1);
		}
		//通道信息
		packageInfo(this,function(){
			postMessage(obj);
		});
	},
	updated(){
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
	console.log(html)
}
//打开loading
function openLoad(obj){
	const loading=obj.$loading({
      lock: true,
      text: 'Loading',
      fullscreen:false,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)'
    });
    return loading;
}
function packageInfo(obj,callback){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'queryDsignMsgById',{'id':obj.id})
	.then(response=>{
		loading.close();
		//console.log(response)
		if(response.data.retCode==0){
			let list=response.data.designInfoList;
			obj.listingId=list[0].listingId;
			obj.designUrl='https://www.kujiale.com/v/auth?accesstoken='+obj.$store.state.accessToken+'&dest=1'+'&designid='+list[0].designId
			callback();
		}else{
			obj.$message.error(response.data.retMsg);
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
function postMessage(obj){	
	let base64=new Base64();
	let num=base64.encode(obj.id);
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
					       	const loading=obj.$loading({
						      	lock: true,
						      	text: '清单同步中',
						      	fullscreen:false,
						      	spinner: 'el-icon-loading',
						      	background: 'rgba(0, 0, 0, 0.6)'
						    });
						    let data={
								'url':'https://openapi.kujiale.com/v2/listing/'+obj.listingId+'/sync',
								'KujiaLe':{
									'appuid':obj.$store.state.userCode
								},
								'params':'',
								'method':'post'
							}
					       	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
							.then(res=>{
								loading.close();
								//console.log(res,1);
								if(res.data.c==0){
									obj.$message({
								        message: '清单同步成功!',
								        type: 'success'
								    });
									obj.$router.push({path:'/delivery/package'})
								}
							})
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
					obj.$router.push({path:'/delivery/package'})
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