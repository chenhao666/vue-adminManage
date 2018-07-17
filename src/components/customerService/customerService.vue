<template>
	<div class="customerServer">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>客服</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">即时通讯</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<!--box-card-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>即时通讯</span>
			</div>
			<div class="line"></div>
			
			<div class="chat">
				<div class="friend_list">
					<ul>
						<li class="empty" v-show="friendList.length>0?false:true">暂无消息</li>
						<li v-for="(item,index) in friendList" :key='index' @click="selectChat(index)">
							<div class="left">
								<img :src="item.pic || require('../../assets/defaultPhoto.png')" alt="" />
							</div>
							<div class="right">
								<div class="userName">
									{{ item.name }}
								</div>
								<div class="userMsg" v-html="item.lastMsg">
									<!--{{ item.msg[item.msg.length-1].name }}: {{item.msg[item.msg.length-1].info }}--> 
								</div>
								<el-badge v-show='item.num!=0' :value="item.num" class="item item_icon">
								</el-badge>
							</div>
							<div class="clear"></div>
							<div class="close_chat" @click="removeFriend(index)">X</div>
						</li>
					</ul>
				</div>
				
				<div class="chat_content" v-show="chatShow">
					<div class="content">
						<div class="content_header">{{ chatTitle }}</div>
						<div class="content_chat" id="chatContainer" @scroll="paperScroll()">
							<div class="loadingHistory" v-show="loadingFlag"><i class="el-icon-loading"></i>&nbsp;&nbsp;<span>加载中...</span></div>
							<div class="more" v-show='!loadingFlag' @click="lookHistory"><span class="iconfont icon-lishijilu-copy-copy"></span>查看更多消息</div>
							<ul>
								<div class="list_chat" v-for="(value,key) in nowChat" :key="key">
									<div class="chatTime"><span>{{ formatDate(key) }}</span></div>
									<li v-for="(item,index) in value" :key="index" :class="item.name==chatTitle?'customer_chat':'server_chat'">
										<div class="out_box">
											<img src="../../assets/defaultPhoto.png" alt="" v-if="item.name==chatTitle"/>
											<img src="../../assets/server.jpg" alt="" v-if="item.name!=chatTitle"/>
											<div class="chat_border" v-html='item.info'>
												
											</div>
											<div class="clear"></div>
										</div>
									</li>
								</div>
							</ul>
						</div>
					</div>
					<div class="send_content">
						<div class="tools">
							<span class="iconfont icon-biaoqing" @click="expressionFlag=!expressionFlag"></span>
							<span class="iconfont icon-tupian">
								<!--<el-upload
									class="uploadPic"
								  	action="https://jsonplaceholder.typicode.com/posts/"
								  	list-type="picture-card"
								  	accept="image/*"
								  	:file-list="fileList"
								  	:on-change="uploadPic"
								  	:auto-upload="false"
								  	:multiple="false">
								  	<i class="el-icon-plus"></i>
								</el-upload>-->
								<form method="post" enctype="multipart/form-data" id="form" action="upload">
									<input class="uploadPic" type="file" name="file" @change="uploadPic"/>
								</form>
							</span>
							
							<!--<span class="history_find right">消息记录</span>-->
							<span class="customer_change right" @click="updateTransfer">客服转接</span>
							<div class="clear"></div>
						</div>
						<div class="sendMsg">
							<!--autofocus-->
							 <el-input type="textarea" rows="3"  resize="none" v-model="desc"></el-input>
						</div>
						<div class="btn_group">
							<el-button @click="sendMsg">发送</el-button>
						</div>
						<div class="clear"></div>
					</div>
					
					<div class="expression" v-show="expressionFlag">
						<ul>
							<li v-for="(value,key) in expressionList">
								<img :src="expressionPath+value" alt="" @click="selectExpression(key)"/>
							</li>
							<div class="clear"></div>
						</ul>
					</div>
				</div>
				<div class="clear"></div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name:'customerServer',
		data(){
			return {
				friendList:this.$store.state.friendList,
				chatShow:false,//聊天窗口显示
				chatTitle:'',//聊天标题
				chatPhoto:'',//聊天对象头像
				expressionList:WebIM.Emoji.map,//表情列表对象
				expressionFlag:false,//表情列表是否展示
				desc:'',//输入框内容
				expressionPath:WebIM.Emoji.path,//表情路径
				nowChat:[],//当前聊天内容
				selectIndex:0,//选中聊天的idnex
				loadingFlag:false,//加载中
				uploadPicUrl:'',//上传图片
				inputFlag:true,
				scrollTop:0,//初始top值
				imgObj:{},//图片信息
				chatUserType:1,//聊天对象类型
			}
		},
		mounted(){
			//console.log(this.$store.state.friendList)
			//console.log(this.expressionList)
			/*console.log(this.$route.fullPath)
			if(this.$route.fullPath=="/designer/chat"){
				this.chatUserType=3;
			}*/
		},
		computed: { 
            listenFriend() {  
                return this.$store.state.friendList;  
            },
            listenRoute(){
            	return this.$route.fullPath;
            }
        }, 
		methods:{
			//选择聊天对象
			selectChat(index){
				this.selectIndex=index;
				var list=this.friendList;
				this.chatTitle=list[index].name;
				this.$store.commit("changeNum",index);
				this.nowChat=list[index].msg;
				this.chatShow=true;
				this.curPage=0;
				//跳转到底部
				this.$nextTick(() => {
			       var container = this.$el.querySelector("#chatContainer");
			       container.scrollTop = container.scrollHeight;
			    })
			},
			//移除聊天
			removeFriend(index){
				this.$confirm('是否删除当前聊天(删除聊天会清空当前聊天信息)?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.friendList.splice(index,1);
		        	//this.nowChat=[];
		        	sessionStorage.setItem('chat',JSON.stringify(this.friendList));
		          	this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消删除'
		          	});          
		        });
			},
			//选择表情
			selectExpression(index){
				this.desc+=index;
				this.expressionFlag=false;
			},
			//查看历史记录
			lookHistory(){
				this.loadingFlag=true;
				var list=this.friendList;
				var num=this.selectIndex;
				var msgArr=list[num].msg;
				var length=0;
				//console.log(msgArr)
				for(var i in msgArr){
					length+=msgArr[i].length;
				}
				messagesHistory(this,length);
			},
			//客服转接
			updateTransfer(){
				const loading =openLoad(this);
				var that=this;
				this.$ajax.post(this.$store.state.localIP+'updateTransfer', {
					"userName":that.chatTitle,
					"empName":Base64.decode(sessionStorage.getItem(Base64.encode('IMUser')))
				})
				.then((response)=>{
					loading.close();
					//console.log(response)
					if(response.data.retCode==0){
						var num=this.selectIndex;
						this.friendList.splice(num,1);
		        		this.nowChat=[];
		        		this.chatShow=false;
		        		sessionStorage.setItem('chat',JSON.stringify(this.friendList));
						this.$message({
					          message: '客服转接成功！',
					          type: 'success'
					    });
					}
				})
				.catch((err)=>{
					loading.close();
					console.log(err);
					that.$message.error('客服转接失败！');
				})
			},
			paperScroll(){
				var scroll=$("#chatContainer").scrollTop();
				if(scroll==0){
					this.lookHistory();
				}
			},
			//发送消息
			sendMsg(){
				var that=this;
				// 单聊发送文本消息
				if(this.desc==""){
					that.$message.error('发送内容不能为空！');
				}else{					
					sendPrivateText(this);
				}
			},
			//图片处理
			uploadPic(event){
				const loading =openLoad(this);
				var file = event.target.files[0];
				//七牛直传
				let d = new Date()
				let type = file.name.split('.')
				var formData= new FormData() // 创建form对象
				formData.append('file', file)
		      	// 先从自己的服务端拿到token
		        this.$ajax.post(this.$store.state.localIP+'qiNiuToken',{})
		        .then((response)=>{
		        	//console.log(response);
		        	if(response.data.retCode==0){
		        		var qiniutoken=response.data.token;
		        		formData.append('token',qiniutoken)
		        		//获取图片宽高
		        		var imgSrc = window.URL.createObjectURL(file);
						const image = new Image();
						image.src = imgSrc;
						image.onload = () => {
						    this.imgObj={
						    	width:image.width,
						    	height:image.height
						    }
						    this.uploading(formData)
						};	
		        	}else{
		        		this.$message.error('图片发送失败！');
		        	}
		        	loading.close();
		        })
		        .catch((error)=>{
		        	loading.close();
					this.$message.error('图片发送失败！');
				})
				//this.fileList=[];
				document.getElementById("form").reset();
			},
			//上传七牛
			uploading (formData) {   // 定义在data里的uploading函数
	         	this.$ajax.post('https://up.qiniu.com/',formData)
	          	.then(response => {
	            	//console.log(response,1)  // 这个key是你上传图片成功后七牛返回给你的图片key
	            	var key = this.$store.state.qiniuUrl+response.data.key
	            	this.uploadPicUrl=key;
	            	sendPrivatePic(this);
	            // 现在已经获取到你选择图片的路径，相当于一个网络路径，你就可以进行你的先一步操作了。
	          })
	       },
			//时间戳转换
			formatDate(timeStamp){
		   		var date = new Date();  
			    date.setTime(timeStamp);  
			    var y = date.getFullYear();      
			    var m = date.getMonth() + 1;      
			    m = m < 10 ? ('0' + m) : m;      
			    var d = date.getDate();      
			    d = d < 10 ? ('0' + d) : d;      
			    var h = date.getHours();    
			    h = h < 10 ? ('0' + h) : h;    
			    var minute = date.getMinutes();    
			    var second = date.getSeconds();    
			    minute = minute < 10 ? ('0' + minute) : minute;      
			    second = second < 10 ? ('0' + second) : second;     
			    return y + '-' + m + '-' + d+' '+h+':'+minute;      	
		   	}
		},
		//监听消息
		watch: {  
            listenFriend:{
			    handler(newName, oldName){
			    	//console.log(newName)
			     	if(newName.length>1){			     		
			     		this.friendList=JSON.parse(newName);
			     		var index=this.selectIndex;
			     		var list=this.friendList;
			     		if(list.length>0){			     			
			     			this.nowChat=list[index].msg;
			     		}
			     	}
			    },
			    immediate:true,
			    deep: true
			},
			listenRoute:{
			    handler(newName, oldName){
			    	//console.log(newName,1,oldName)
			     	if(newName==="/designer/chat"){
						this.chatUserType=3;
					}else{
						this.chatUserType=1;
					}
					//console.log(this.chatUserType)
			    },
			    immediate:true,
			    deep: true
			},
			nowChat() {
			    this.$nextTick(() => {
			       	var container = this.$el.querySelector("#chatContainer");
			       	//console.log(container.scrollTop)
			       	//console.log(this.scrollTop)
			       	//console.log(container.scrollHeight)
			       	//console.log(container.clientHeight)
			       	//console.log(Math.abs(container.scrollHeight-container.scrollTop-container.clientHeight))
			       	//判断滚动条距离底部的距离
			       	if(Math.abs(this.scrollTop-container.scrollTop-container.clientHeight)<20){
				       	container.scrollTop = container.scrollHeight;
			       	}else{
			       		if(this.scrollTop==0 && container.scrollTop==0){
				       		container.scrollTop=0;
				       	}else{
				       		if(container.scrollTop<20){
			       				container.scrollTop=container.scrollHeight-this.scrollTop;
			       			}	
				       	} 		
			       	}
			       	this.scrollTop=container.scrollHeight;
			    })
			}
        }
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
	//发送消息
	function sendPrivateText(that) {
	    var id = that.$imconn.getUniqueId();                 // 生成本地消息id
	    var msg = new WebIM.message('txt', id);      // 创建文本消息
	    var dataMsg=that.desc;
	    dataMsg = dataMsg.replace(/\r\n/g, '<br/>'); //IE9、FF、chrome  
        dataMsg = dataMsg.replace(/\n/g, '<br/>'); //IE7-8  
        dataMsg = dataMsg.replace(/\s/g, ' '); //空格处理
        that.$ajax.post(that.$store.state.localIP+'sendMessage', {
			"from":Base64.decode(sessionStorage.getItem(Base64.encode('IMUser'))),
			"target": [that.chatTitle],
			"msg":that.desc,
			"userType":that.chatUserType,
			"type":1//文本1 图片2
		}).then((response)=>{
			//console.log(response)
			if(response.data.retCode==0){
				//console.log(1)
				var date = new Date(response.data.createTime);
    			var time = date.getTime();
    			var timeTarget=parseInt(time/60000);//时间标记
				var list=that.friendList;
		        var num=that.selectIndex;
		        //替换表情文件
		        var  expressionList=that.expressionList;
		        for(var i in expressionList){
		        	//使用正则替换原有表情符号
		        	dataMsg=dataMsg.replace(i,"<img src='"+that.expressionPath+expressionList[i]+"' style='vertical-align:middle;'>");
		        }
		        dataMsg=dataMsg.replace(/((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,"<a target='_black' href='$&'>$&</a>");
		        //console.log(dataMsg)
		        var info={
		        	name:Base64.decode(sessionStorage.getItem(Base64.encode('IMUser'))),
		        	//time:time,
		        	info:dataMsg
		        }
		        
		        var msgArr=list[num].msg;
		        var timeFlag=0;//时间标记
		        for(var i in msgArr){
		        	if(Math.abs(parseInt(i/60000)-timeTarget)<4){
		        		msgArr[i].push(info);
		        		timeFlag=1;
		        	}
		        }
		        if(!timeFlag){
		        	msgArr[time]=[info];
		        }
		        list[num].msg=msgArr;
		        that.nowChat=list[num].msg;
		        list[num].num=0;
		        list[num].lastMsg=dataMsg;
		        //console.log(list[num])
		        that.desc="";
		        sessionStorage.setItem('chat',JSON.stringify(list));
		        //跳转到底部
				that.$nextTick(() => {
			       var container = that.$el.querySelector("#chatContainer");
			       container.scrollTop = container.scrollHeight;
			    })
			}else{
				that.$message.error('消息发送失败！');
			}
		}).catch((error)=>{
			that.$message.error('消息发送失败！');
		})
	};
	//发送图片消息
	function sendPrivatePic(that) {
		that.$ajax.post(that.$store.state.localIP+'sendMessage', {
			"from":Base64.decode(sessionStorage.getItem(Base64.encode('IMUser'))),
			"target": [that.chatTitle],
			"msg":that.uploadPicUrl,
			"userType":that.chatUserType,
			"width":that.imgObj.width,
			"height":that.imgObj.height,
			"type":2//文本1 图片2
		}).then((response)=>{
			//console.log(response)
			if(response.data.retCode==0){
				//console.log(1)
				var date = new Date(response.data.createTime);
    			var time = date.getTime();
    			var timeTarget=parseInt(time/60000);//时间标记
				var list=that.friendList;
		        var num=that.selectIndex;
		        var dataMsg='<a href="'+that.uploadPicUrl+'" target="_blank"><img src='+that.uploadPicUrl+' width="80"></a>';
		        //console.log(dataMsg)
		        var info={
		        	name:Base64.decode(sessionStorage.getItem(Base64.encode('IMUser'))),
		        	//time:time,
		        	info:dataMsg
		        }
		        
		        var msgArr=list[num].msg;
		        var timeFlag=0;//时间标记
		        for(var i in msgArr){
		        	if(Math.abs(parseInt(i/60000)-timeTarget)<4){
		        		msgArr[i].push(info);
		        		timeFlag=1;
		        	}
		        }
		        if(!timeFlag){
		        	msgArr[time]=[info];
		        }
		        list[num].msg=msgArr;
		        that.nowChat=list[num].msg;
		        list[num].num=0;
		        list[num].lastMsg=dataMsg;
		        //console.log(list[num])
				that.friendList=[];
				that.friendList=list;
		        that.desc="";
		        sessionStorage.setItem('chat',JSON.stringify(list));
		        //跳转到底部
				/*that.$nextTick(() => {
			       var container = that.$el.querySelector("#chatContainer");
			       container.scrollTop = container.scrollHeight;
			    })*/
			}else{
				that.$message.error('消息发送失败！');
			}
		}).catch((error)=>{
			that.$message.error('消息发送失败！');
		})
	}
	//历史记录
	function messagesHistory(that,length){
		that.$ajax.post(that.$store.state.localIP+'messagesHistory', {
			"from":Base64.decode(sessionStorage.getItem(Base64.encode('IMUser'))),
			"target":that.chatTitle,
			"curPage":length
		}).then((response)=>{
			//console.log(response)
			if(response.data.retCode==0){
				var list=response.data.messageList;
				var friendList=that.friendList;//好友信息列表
				var num=that.selectIndex;//当前的index
				var msgArr=friendList[num].msg;//msg对象
				//console.log(msgArr)
				var timeFlag=0;//标记
				for(var i=0;i<list.length;i++){
					if(list[i].type==2){
						list[i].msg='<a href="'+list[i].msg+'" target="_blank"><img src='+list[i].msg+' width="80"></a>'
					}
					//替换图片表情
					var  expressionList=that.expressionList;
					for(var x in expressionList){
			        	//使用正则替换原有表情符号
			        	list[i].msg=list[i].msg.replace(x,"<img src='"+that.expressionPath+expressionList[x]+"' style='vertical-align:middle;'>");
			        }
					list[i].msg=list[i].msg.replace(/((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,"<a target='_black' href='$&'>$&</a>");
					var time=parseInt(list[i].createTime/60000);
					let info={
						name:list[i].froms,
						info:list[i].msg
					}
					for(var j in msgArr){	
						if(Math.abs(time-parseInt(j/60000))<4){
							timeFlag=1;
							msgArr[j].unshift(info);
						}
					}
					if(!timeFlag){
						msgArr[list[i].createTime]=[info];
					}
				}
				var newObj=sortObj(msgArr);
				friendList[num].msg=newObj;
				that.nowChat=newObj;
				//console.log(newObj)
				that.friendList=[];
				that.friendList=friendList;
				sessionStorage.setItem('chat',JSON.stringify(that.friendList));
				that.loadingFlag=false;
			}else{
				that.loadingFlag=false;
				that.$message.error('查询历史记录失败！');
			}
		}).catch((error)=>{
			that.loadingFlag=false;
			console.log(error);
			that.$message.error('查询历史记录失败！');
		})
	}
	//排序
	function sortObj(obj){
		var newObj={};
		var arr=[];
		for(var i in obj){
			arr.push(i);
		}
		arr.sort(function(a,b){return a-b});
		for(var i=0;i<arr.length;i++){
			newObj[arr[i]]=obj[arr[i]];
		}
		return newObj;
	}
</script>

<style scoped>
	.chat{
		width: 800px;
		margin: 0 auto;
		height: 600px;
		border: 1px solid #cccccc;
		margin-top: 20px;
	}
	.friend_list{
		width: 240px;
		height: 600px;
		float: left;
		border-right: 1px solid #cccccc;
		box-sizing: border-box;
		overflow-y: auto;
	}
	.friend_list ul li{
		width: 100%;
		height: 80px;
		border-bottom: 1px solid #cccccc;
		box-sizing: border-box;
		cursor: pointer;
		position: relative;
	}
	.friend_list ul li:hover{
		background: #F4F4F5;
	}
	.friend_list ul li .left img{
		float: left;
		width: 50px;
		height:50px;
		margin-top: 15px;
		border-radius: 50%;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		margin-left: 10px;
	}
	.friend_list ul li .right{
		width: 160px;
		float: left;
		margin-top: 15px;
		position: relative;
	}
	.friend_list ul li .right div{
		text-align: left;
		margin-left: 10px;
	}
	.userName{
		font-size: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.userMsg{
		margin-top: 6px;
		color: #999999;
		font-size: 14px;
		height: 20px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.item_icon{
		position: absolute;
		top: 5px;
		right: 6px;
	}
	.chat_content{
		width: 560px;
		height: 600px;
		float: left;	
		position: relative;
	}
	.chat_content .content{
		width: 100%;
		height:420px;
		box-sizing: border-box;
		border-bottom: 1px solid #cccccc;
	}
	.close_chat{
		position: absolute;	
		top: 5px;
		right: 5px;
		color: #999999;
		font-size: 12px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
	}
	.close_chat:hover{
		background: red;
		color: #ffffff;
	}
	.content_header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-bottom: 1px solid #cccccc;
		box-sizing: border-box;
	}
	.tools{
		width: 100%;
		height: 30px;
		line-height: 30px;
	}
	.tools span {
		margin-left: 10px;
		text-align: center;
		cursor: pointer;
	}
	.tools span.iconfont{
		float: left;
		width: 30px;
		height: 30px;
	}
	.tools span:hover{
		background:#F2F6FC ;
	}
	.sendMsg .el-textarea{
		font-size: 18px;
		word-break: break-all;
		white-space:normal; 
	}
	.btn_group{
		width: 100%;
		text-align: right;
	}
	.btn_group .el-button{
		margin-right:15px;
		margin-top: 5px;
	}
	.expression{
		position: absolute;
		bottom: 190px;
		width: 380px;
		height: 180px;
		border: 1px solid #E4E4E4;
		left: 20px;
		overflow-y: auto;
		text-align: center;
		background: #ffffff;
		box-shadow: 2px 2px 3px 3px #ccc;
	}
	.expression ul li{
		float: left;
		width: 40px;
		height: 40px;
		text-align: center;
		line-height: 40px;
	}
	.expression ul{
		width:360px;
		display: inline-block;
	}
	.expression ul img{
		cursor: pointer;
		display: block;
		margin-left: 4px;
		margin-top: 4px;
	}
	.empty{
		text-align: center;
		line-height: 80px;
		color: #999999;
	}
	.content_chat{
		width: 100%;
		height: 380px;
		padding-bottom: 20px;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.content_chat ul li{
		width: 100%;
	}
	.content_chat img{
		float: left;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border:1px solid #cccccc;
	}
	.customer_chat img{
		float: left;
	}
	.server_chat img{
		float: right;
		border: none;
	}
	.out_box{
		margin-top: 20px;
		padding:0px 20px;
	}

	.content_chat .chat_border{
		padding: 10px;
		border-radius: 10px;
		margin: 0px 20px;
		letter-spacing: 3px;
		position: relative;
		min-height: 20px;
		min-width: 40px;
		max-width: 400px;
		line-height: 32px;
	}
	.customer_chat .chat_border{
		float: left;
		background: #ACD9F8;
		color: #157CCC;
		word-break: break-all;
		white-space:normal; 
	}
	.server_chat .chat_border{
		float: right;
		background: #F4C54B;
		color: #4E000C;
		word-break: break-all;
		white-space:normal; 
	}
	.customer_chat .chat_border:before{
		content:'';
		position: absolute;
	  	top: 10px;
	  	left: -10px;
	  	border-top: 10px solid transparent;
	  	border-right: 10px solid #ACD9F8;
	  	border-bottom: 10px solid transparent;
	}
	.server_chat .chat_border:after{
		content:'';
		position: absolute;
	  	top: 10px;
	  	right: -10px;
	  	border-top: 10px solid transparent;
	  	border-left: 10px solid #F4C54B;
	  	border-bottom: 10px solid transparent;
	}
	.tools span.right{
		float: right;
		font-size: 14px;
		height: 30px;
		line-height: 30px;
		margin-right: 10px;
		padding:0px  10px;
	}
	.more{
		width: 100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 14px;
		color: #009BDB;
		cursor: pointer;
	}
	.chatTime{
		width:100%;
		text-align: center;	
		margin: 20px 0px;
	}
	.chatTime span{
		padding: 5px 10px;
		background: #cccccc;
		border-radius: 15px;
		font-size: 12px;
	}
	.loadingHistory{
		color: #009BDB;
		font-size: 14px;
		text-align: center;
		height: 40px;
		line-height: 40px;
	}
	.el-icon-loading:before{
		font-size: 20px;
	}
	.icon-tupian{
		position: relative;
		z-index: 10;
		cursor: pointer;
	}
	.uploadPic{
		position: absolute;
		top: 0px;
		left: 0px;
		width: 30px;
		height: 30px;
		opacity: 0;
		z-index: 20;
		overflow: hidden;
		cursor: pointer;
	}
</style>