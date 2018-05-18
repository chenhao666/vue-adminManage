<template>
	<div class="construction">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/orderManage/orderList' }">订单管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">施工</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-tabs v-model="activeName" @tab-click="handleClick" type="card">
			<!--阶段-->
			<el-tab-pane label="阶段" name="first"></el-tab-pane>
			<el-tab-pane label="日志" name="second"></el-tab-pane>
		</el-tabs>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>{{ activeName=='first'?'施工阶段':'施工日志' }}</span>
			</div>
			<div class="line"></div>
			<!--施工阶段-->
			<div class="constructionStep" v-if="activeName=='first'?true:false">
				<!--步骤条-->
				<el-steps :active="activeNum">
					<el-step title="开工" icon="iconfont icon-gongdikaifang">
						<template slot="icon">
							<span class="iconfont icon-gongdikaifang" @click="stepInfo(0)" :style="clickColorFloag==0?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
					<el-step title="水电" icon="iconfont icon-shuidian">
						<template slot="icon">
							<span class="iconfont icon-shuidian" @click="stepInfo(1)" :style="clickColorFloag==1?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
					<el-step title="泥木" icon="iconfont icon-nimu-copy">
						<template slot="icon">
							<span class="iconfont icon-nimu-copy" @click="stepInfo(2)" :style="clickColorFloag==2?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
					<el-step title="油漆" icon="iconfont icon-youqi">
						<template slot="icon">
							<span class="iconfont icon-youqi" @click="stepInfo(3)" :style="clickColorFloag==3?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
					<el-step title="安装" icon="iconfont icon-anzhuang">
						<template slot="icon">
							<span class="iconfont icon-anzhuang" @click="stepInfo(4)" :style="clickColorFloag==4?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
					<el-step title="竣工" icon="iconfont icon-jungongyanshou">
						<template slot="icon">
							<span class="iconfont icon-jungongyanshou" @click="stepInfo(5)" :style="clickColorFloag==5?'color:rgb(255, 208, 75)':''"></span>
						</template>
					</el-step>
				</el-steps>
				
				<div class="stepInfo" v-model="detailList">
					<ul>
						<li v-for="(item,key) in detailList" :key="key">
							<div class="title">
								{{ key+1+'、'+(item.sProjectTitle?item.sProjectTitle:'无') }}<span class="stepFinish" v-if="item.status">完成</span>
								<span class="finishTime" v-if="item.status">{{ item.endTimeP?timeFomit(item.endTimeR):'' }}</span>
								<div class="clear"></div>
							</div>
							<div class="stepIntroduce">{{ item.sProjectContent?item.sProjectContent:'无' }}</div>
						</li>
					</ul>
				</div>
			</div>
			
			<!--施工日志-->
			<div class="constructionLog" v-if="activeName=='second'?true:false">
				<ul>
					<li class="active" v-if="constructionLogEmpty">
						<!--圆-->
						<div class="circle"></div>
						<!--连线-->
						<div class="linkLine"></div>
						<div class="logInfo">
							<div class="logDate">
								<p class="logYear">暂无日志</p>
							</div>
						</div>
					</li>
					<li v-for="(item,key) in logList" :class="key==0?'active':''" :key="key">
						<!--圆-->
						<div class="circle"></div>
						<!--连线-->
						<div class="linkLine"></div>
						<div class="logInfo">
							<div class="logDate">
								<p class="logYear">{{ item.timeDate }}</p>
								<p class="logDay">{{ item.timeYear }}</p>
							</div>
							<div class="logIntroduce">
								{{ item.logContents }}
							</div>
							
							<div class="photo">
								<ul>
									<li v-for="(pic,index) in item.logPicList">
										<div class="imgBox" :style="{background: 'url('+pic.url+')'}" @click="scalePic(key,index)">

										</div>
									</li>
									<div class="clear"></div>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</el-card>
		<!--图片放大-->
		<el-dialog 
			v-if="dialogVisible"
			:visible.sync="dialogVisible" 
			width="86%"
			class="dialogHide"
			:append-to-body="true"
			:before-close="handleClose">	
			<el-carousel type="card" :initial-index="activeImg" indicator-position="none" height="500px" :autoplay="false">
				<el-carousel-item v-for="(item,index) in showImg" :key="index">
					<img :src="item.url" alt="" :width="item.width" :height="item.height" :style="'max-width:'+item.maxWidth"/>
				</el-carousel-item>
			</el-carousel>	
		</el-dialog>

	</div>
</template>

<script>
export default{
	name:'construction',
	data(){
		return{
			orderID:'',
			imgWidth:[
				{"width":"100"},
				{"width":"100"},
				{"width":"100"},
				{"width":"100"},
				{"width":"100"},
				{"width":"100"}
			],
			clickColorFloag:-1,
			dialogVisible:false,
			activeName: 'first',//tab
			activeNum:0,//step
			constructionLogEmpty:false,
			stageList:[],//所有
			detailList:[],//详情
			logList:[],//日志数据
			activeImg:0,//放大图片初始位置
			showImg:[]//放大数组
		}
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	mounted(){
		let orderID=this.$route.params.code || '';
		if(orderID){
			let base64=new Base64();
			this.orderID=base64.decode(orderID);
			//console.log(orderID)
		}
		//获取施工信息
		constructionInfo(this);
	},
	methods: {
      	handleClick(tab, event) {
       		//console.log(tab.index);
       		if(tab.index==0){
       			constructionInfo(this);
       		}else{
       			constructionLog(this);
       		}
      	},
      	stepInfo(index){
      		this.clickColorFloag=index;
      		//console.log(index)
      		this.detailList=this.stageList[index].detailList;
      		//console.log(this.stageList)
      	},
      	//图片放大
      	scalePic(key,index){
      		let obj=this;
      		let width=[];
      		this.activeImg=index;
      		//this.showImg=this.logList[key].logPicList;
      		//this.dialogVisible=true;
      		getImg(this.logList[key].logPicList,0,width,function(widthArr){
      			//console.log(widthArr)
      			obj.activeImg=index;
      			obj.showImg=widthArr;
      			obj.dialogVisible=true;
      		})  		
      	},
      	//关闭弹窗
      	handleClose(done) {
      		done();
	    },
      	//时间格式化
	    timeFomit(timeDate){
	      	//console.log(timeDate)
	      	return (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	    }
    }
}
function getImg(urlArr,start,widthArr,callback){
	var len=urlArr.length;
	if(start<len){
		var Img = new Image();
	    Img.src=urlArr[start].url;
	    Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
	        var width=Img.width, //确保canvas的尺寸和图片一样
	            height=Img.height; 
	        if(width>=height){
	        	var info={
		        	"url":urlArr[start].url,
		        	"width":width,
		        	"maxWidth":'100%',
		        	"height":'auto'
		        }
	        }else{
	        	var newWidth=(500/height)*width;
		        var info={
		        	"url":urlArr[start].url,
		        	"width":newWidth,
		        	"maxWidth":'100%',
		        	"height":500
		        }
	        }  
	        widthArr.push(info);
	        start++;
	        getImg(urlArr,start,widthArr,callback);
	    };
	}else{
		callback(widthArr);
	}
}
//获取施工信息
function constructionInfo(obj){
	const loading =openLoad(obj);	
	obj.$ajax.post(obj.$store.state.localIP+"queryProjectStageList",{orderID:obj.orderID})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					let list=response.data.stageList;
					if(list.length>0){
						obj.stageList=list;
						obj.activeNum=response.data.projectStage-1;
						obj.detailList=list[response.data.projectStage-1].detailList;
					}else{
						obj.$message({
				          message: '暂无施工信息',
				          type: 'warning'
				        });
					}
					
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
		})
		.catch((error)=>{
			loading.close();
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
}
//获取施工日志
function constructionLog(obj){
	const loading =openLoad(obj);	
	obj.$ajax.post(obj.$store.state.localIP+"queryLogList",{orderID:obj.orderID})
		.then((response)=>{
			//console.log(response);
			//console.log(obj)
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					let list=response.data.logList;
					if(list.length>0){
						obj.constructionLogEmpty=false;
						for(let i=0;i<list.length;i++){
							let time=obj.timeFomit(list[i].recordTime);
							let timeArr=time.split(' ');
							let dateArr=timeArr[0].split('-');
							list[i].timeYear=dateArr[0];
							list[i].timeDate=dateArr[1]+'月'+dateArr[2]+'日';
							list[i].timeTime=timeArr[1];
						}
						obj.logList=list;
					}else{
						obj.constructionLogEmpty=true;
					}
					
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
		})
		.catch((error)=>{
			loading.close();
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
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
</script>

<style scoped>
	.el-tabs__nav-wrap::after{
		background: none !important;
	}
	.constructionStep .el-step{
		margin: 20px 0px;
	}
	.constructionStep .el-steps .iconfont{
		font-size: 24px;
		margin: 0 auto;
		cursor: pointer;
	}
	.box-card{
		margin-top: 0px;
	}
	.el-tabs__header{
		margin: 0px;
	}
	.el-tabs{
		width: 96%;
		margin: 0 auto;
		margin-top: 20px;
	}
	.constructionStep .el-steps{
		margin-top: 20px;
	}
	.stepInfo{
		margin-top: 20px;
	}
	.stepFinish{
		color: #409EFF;
		margin-left: 15px;
	}
	.stepInfo ul li{
		width: 100%;
		padding: 10px 0px;
		border-bottom: 1px solid #ccc;
	}
	.stepInfo ul li:last-child{
		border-bottom: none;
	}
	.stepIntroduce{
		margin: 5px 0px;
		font-size: 14px;
		color: #999;
	}
	.finishTime{
		float: right;
		color:#999;
		font-size: 14px;
	}
	
	.constructionLog ul{
		margin-top: 20px;
	}
	
	.constructionLog ul li{
		width: 100%;
		height: auto;
		position: relative;
	}
	
	.circle{
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		-webkit-border-radius: 50%;
		-o-border-radius: 50%;
		-ms-border-radius: 50%;
		-moz-border-radius: 50%;
		border: 3px solid #ccc;
		background: #fff;
		z-index: 10;
	}
	.constructionLog ul li.active .circle{
		border: 3px solid #67c23a;
	}
	.linkLine{
		position: absolute;
		width: 1px;
		height: 100%;
		background-color: #666;
		left: 11px;
		z-index: 2;
	}
	.logInfo{
		width: 100%;
		padding:0px 35px;
		box-sizing: ;
	}
	.logYear{
		font-weight: bold;
		font-size: 18px;
	}
	.logDay{
		font-size: 14px;
		color: #666;
		height: 30px;
		line-height: 30px;
	}
	.logIntroduce{
		padding: 20px 0px;
		color: #333;
		text-indent: 32px;
	}
	.constructionLog .el-col{
		padding-bottom: 20px;
	}
	.imgBox{
		width: 160px;
		margin: 0 auto;
		height: 160px;
		position:relative;
		overflow: hidden;
		cursor: pointer;
		background-repeat: no-repeat !important;
		background-position:center center !important;
		background-size: 100% 100% !important;
	}
	.constructionLog .photo{
		text-align: center;
	}
	.constructionLog .photo ul{
		display: inline-block;
		width: 100%;
		padding-right: 20px;
		box-sizing: border-box;
	}
	.constructionLog .photo ul li{
		float: left;
		margin-left: 20px;
		width: 160px;
		margin-bottom: 20px;
	}
	.el-dialog .el-carousel__item{
		text-align: center;
	}
	.el-dialog img{
		position:absolute;
		top: 50%;
		left: 50%;
		transform:translate(-50%,-50%);
		display: inline-block;
		/*width: 100%;*/
	}
	.el-carousel__mask{
		opacity: 0;
	}
</style>