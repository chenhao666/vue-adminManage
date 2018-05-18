<template>
	<div id="particles">
		<div class="loginBg">
			<div class="loginForm">
				<div class="login_title">系统登录</div>
				<el-input placeholder="请输入用户名" v-model="username" class="loginInput" autofocus>
				    <template slot="prepend"><span class="iconfont icon-yonghuming"></span></template>
				</el-input>
				<el-input type="password" @keyup.enter.native="submitForm" placeholder="请输入密码" v-model="password" auto-complete="off" class="loginInput">
				    <template slot="prepend"><span class="iconfont icon-mima"></span></template>
				</el-input>
				<el-button type="primary" class="loginSubmit" @click="submitForm">登录</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import '../../../static/js/base64.js'
export default{
	name:'login',
	data () {
		return {
			username:'',
			password:''
		}
	},
	mounted () {
		$('#particles').particleground({
		    dotColor: '#0078DE',
		    lineColor:'#0078DE',
		    proximity:60
		});
	},
	methods:{
		submitForm(){
			if(!this.username){
				this.$message({
		          message: '用户名不能为空！',
		          type: 'warning'
		        });
		        return;
			}
			if(!this.password){
				this.$message({
		          message: '密码不能为空！',
		          type: 'warning'
		        });
		        return;
			}
			let pswTest=/^.{6,20}$/;
			if(!pswTest.test(this.password)){
				this.$message({
		          message: '请输出长度在6~20之间的密码!',
		          type: 'warning'
		        });
				return
			}
			let loading=openLoad(this);
			//发送ajax请求
			this.$ajax.post(this.$store.state.localIP+'empLogin', {
				"personName":this.username,
			    "password": this.password
			})
			.then((response)=>{
          		//console.log(response)
          		if(response.status==200){
          			loading.close();
          			if(response.data.retCode==0){
						this.$message({
					          message: '登陆成功！',
					          type: 'success'
					    });
					    //Base64加密
					    let base64 = new Base64();  
				       //登录成功存储sessionStorage
						sessionStorage.setItem(base64.encode('username'),base64.encode(this.username));
						sessionStorage.setItem(base64.encode('userCode'),base64.encode(response.data.empInfo.id.toString()));
						sessionStorage.setItem(base64.encode('roleName'),base64.encode(response.data.empInfo.roleName));
						sessionStorage.setItem(base64.encode('loginFlag'),base64.encode("true"));
						//设置权限
						
						let base64Power=base64.encode(JSON.stringify(response.data.allMsg));
						//console.log(JSON.stringify(response.data.allMsg))
						sessionStorage.setItem(base64.encode('userPower'),base64Power);
						
						//城市信息
						sessionStorage.setItem('cityID',response.data.empInfo.cityID);
						sessionStorage.setItem('cityName',response.data.empInfo.city);
						//酷家乐accessToken
						if(response.data.accessToken){							
							sessionStorage.setItem(base64.encode('token'),response.data.accessToken);
						}
						//设计师
						if(response.data.empInfo.appuid){							
							sessionStorage.setItem(base64.encode('appuid'),base64.encode(response.data.empInfo.appuid.toString()));
						}
						this.$store.commit("loginFlag");
						//this.$router.push({path:'/'});
				    }else{
				    	this.$message.error(response.data.retMsg);
				    }
          		}
          	})
          	.catch((error)=>{
          		loading.close();
          		console.log(error)
          		this.$message.error('网络出错啦~~');
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
</script>

<style scoped>
.login_title{
	width: 100%;
	height: 30px;
	line-height: 30px;
	text-align: center;
	font-size: 20px;
	letter-spacing: 5px;
	font-weight: bold;
	color: deepskyblue;
}
#particles{
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	position: absolute;
	background: rgb(20, 26, 72);
	z-index: 1;
}
.loginBg{
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -170px;
	margin-left: -200px;
	width: 400px;
	height: 340px;
	/*border: 1px solid red;*/
	background: rgba(255,255,255,0.5);
	z-index: 2;
}
.loginForm{
	width: 80%;
	margin-left: 10%;
	margin-top: 40px;
}
.loginInput{
	margin-top: 30px;
}
.el-input {
    width:100%;
  }
 .loginSubmit{
 	display: block;
 	width: 100%;
 	margin: 0 auto;
 	margin-top: 30px;
 	font-size: 16px;
 	letter-spacing: 5px;
 	cursor: pointer;
 }
</style>