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
								<img src="../../assets/defaultPhoto.png" alt="" />
							</div>
							<div class="right">
								<div class="userName">
									{{ item.name }}
								</div>
								<div class="userMsg">
									{{ item.msg[item.msg.length-1].name }}: {{item.msg[item.msg.length-1].info }} 
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
					</div>
					<div class="send_content">
						<div class="tools">
							<span class="iconfont icon-biaoqing" @click="expressionFlag=!expressionFlag"></span>
							<span class="iconfont icon-tupian"></span>
							<div class="clear"></div>
						</div>
						<div class="sendMsg">
							 <el-input type="textarea" rows="3" autofocus resize="none" v-model="desc"></el-input>
						</div>
						<div class="btn_group">
							<el-button>发送</el-button>
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
				expressionPath:WebIM.Emoji.path//表情路径
			}
		},
		mounted(){
			console.log(this.$store.state.friendList)
		},
		computed: { 
            listenFriend() {  
                return this.$store.state.friendList;  
                console.log(weqw)
                console.log(this.$store.state.friendList)
            }  
        }, 
		methods:{
			//选择聊天对象
			selectChat(index){
				var list=this.friendList;
				this.chatTitle=list[index].name;
				this.$store.commit("changeNum",index);
				this.chatShow=true;
			},
			//移除聊天
			removeFriend(index){
				this.$confirm('是否删除当前聊天?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.friendList.splice(index,1);
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
				this.desc=index;
				this.expressionFlag=false;
			}
		},
		//监听消息
		watch: {  
            listenFriend:{
			    handler(newName, oldName){
			     	if(newName.length>1){			     		
			     		this.friendList=JSON.parse(newName);
			     	}
			    },
			    immediate:true,
			    deep: true
			}
        },  
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
		overflow-y: auto;
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
	}
	.tools{
		width: 100%;
		height: 30px;
		line-height: 30px;
	}
	.tools span{
		float: left;
		margin-left: 10px;
		width: 30px;
		height: 30px;
		text-align: center;
		cursor: pointer;
	}
	.tools span:hover{
		background:#F2F6FC ;
	}
	.sendMsg .el-textarea{
		font-size: 18px;
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
</style>