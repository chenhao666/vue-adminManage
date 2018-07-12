<template>
  <div class="indexP">
		<v-header class="v-header"></v-header>
		<v-nav class="v-aside" @collapseP="collapseP" :style="overFlow"></v-nav>
		<transition name="slide-fade" mode="out-in">
			<!--<keep-alive>-->
				<router-view class="v-content" :style="contentL"></router-view>
			<!--</keep-alive>-->
		</transition>
  </div>
</template>

<script>
import Header from './layout/header'
import Nav from './layout/nav'

export default {
  name: 'indexP',
  data () {
  	return {
  		overFlow:'overflow-y: auto;',
  		contentL:'padding-left: 200px'	
  	}
  },mounted(){
  	var that=this;
  	//登录环信
		if(sessionStorage.getItem(Base64.encode('IMUser')) && sessionStorage.getItem(Base64.encode('IMPsw'))){
		  this.$imoption.user=Base64.decode(sessionStorage.getItem(Base64.encode('IMUser')));
			this.$imoption.pwd=Base64.decode(sessionStorage.getItem(Base64.encode('IMPsw')));
			this.$imconn.open(this.$imoption);
		}
  	//设置监听
  	this.$imconn.listen({
  		//登录监听
  			onOpened: function ( message ) {          //连接成功回调
		        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
		        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
		        // 则无需调用conn.setPresence();
		        //console.log(message)
		        //设置心跳
		        //that.$imconn.heartBeat(that.$imconn);
		        console.log("连接成功");
		    }, 
		    //接收文本消息
		    onTextMessage: function ( message ) {
		    	console.log(message);
		    	that.$store.commit("friendList",message);
		    	that.$notify.info({
	          title: '消息',
	          message: '您有新的消息',
	          duration:2000,
	          onClick:function(){
	          	that.$router.push({path:'/customerService/servicePersonal'})
	          }
	       });
		    },
		    //收到表情消息
		    onEmojiMessage: function (message) {
		        // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
		        // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
		        // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
		        //console.log('Emoji');
		        that.$store.commit("friendEmojiMessage",message);
		        that.$notify.info({
		          title: '消息',
		          message: '您有新的消息',
		          duration:2000,
		          onClick:function(){
		          	that.$router.push({path:'/customerService/servicePersonal'})
		          }
		       	});
		        var data = message.data;
		        //console.log(message)
		        /*for(var i = 0 , l = data.length ; i < l ; i++){
		            console.log(data[i]);
		        }*/
		    },   
		    //接收图片监听
		    onPictureMessage: function (message) {
		    	that.$store.commit("friendList",message);
		    	that.$notify.info({
	          title: '消息',
	          message: '您有新的消息',
	          duration:2000,
	          onClick:function(){
	          	that.$router.push({path:'/customerService/servicePersonal'})
	          }
	       	});
				  console.log("Location of Picture is ", message.url);
				}, 
				//关闭连接
				onClosed: function ( message ) {
					console.log("连接断开");
					that.$message.error("即时通讯连接断开,请重新登录！");
					that.$router.push({path:'/login'});
					//登录环信
					/*if(sessionStorage.getItem(Base64.encode('IMUser')) && sessionStorage.getItem(Base64.encode('IMPsw'))){
					  that.$imoption.user=Base64.decode(sessionStorage.getItem(Base64.encode('IMUser')));
						that.$imoption.pwd=Base64.decode(sessionStorage.getItem(Base64.encode('IMPsw')));
						that.$imconn.open(that.$imoption);
					}*/
				}
		});
  },
  methods: {
  	collapseP (flag) {
  		if(flag){
  			this.contentL='padding-left: 64px'	
  			this.overFlow=''
  		}else{
  			this.contentL='padding-left: 200px'
  			this.overFlow='overflow-y: auto;'
  		}
  	}
  },
  components:{ 'v-header':Header,'v-nav':Nav }
}
</script>

<style>
.v-header{
	position: absolute;
	z-index: 3;
	top: 0px;
	width: 100%;
}
.v-aside{
	position: absolute;
	height: 100%;
	top: 0px;
	z-index: 2;
	padding-top: 61px;
	background:#657576;
	box-sizing: border-box;
}

.v-content{
	position: absolute;
	top: 0px;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	padding-top: 61px;
	box-sizing: border-box;
	z-index: 1;
}
.v-aside,.v-content{
	-moz-transition: all 0.4s ease 0s;
	-webkit-transition: all 0.4s ease 0s;
	-ms-transition: all 0.4s ease 0s;
	-o-transition: all 0.4s ease 0s;
	transition: all 0.4s ease 0s;
}
.el-breadcrumb{
	height: 60px;
	line-height: 60px;
	border-bottom: 1px solid #adadad;
	padding-left: 2%;
	box-sizing: border-box;
}
.el-breadcrumb .el-breadcrumb__item:first-child{
	margin-left: 40px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
