<template>
	<div>
		<el-menu class="el-menu-demo" @select="handleSelect" mode="horizontal"  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<div class="header">
				<div class="left"><img src="../../assets/logo.png" alt="" /></div>
				<div class="right">
					<div class="role">{{ roleName }}</div>
					<el-submenu index="2">
					    <template slot="title">{{ adminUser }}</template>
					    <el-menu-item index="2-1">个人信息</el-menu-item>
					    <el-menu-item index="2-2">切换账户</el-menu-item>
					    <el-menu-item index="2-3">退出</el-menu-item>
					</el-submenu>
				</div>
				<div class="clear"></div>
			</div>
		</el-menu>
	</div>
</template>

<script>
export default {
    data() {
      return {
		adminUser:this.$store.state.userName,
		roleName:this.$store.state.roleName
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        //console.log(key, keyPath);
        //退出登录
        if(key=="2-3"){
        	this.$message({
		          message: '退出成功！',
		          type: 'success'
		    });
		    //let Base64=new Base64();
		    this.$imconn..close();
        	sessionStorage.removeItem(Base64.encode('username'));
	      	sessionStorage.removeItem(Base64.encode('loginFlag'));
	      	this.$router.push('/login');
        }
      }
    }
  }
</script>

<style scoped>
	.header{
		width: 100%;
		height: 60px;
		line-height: 60px;
	}
	.header img{
		position: absolute;
		top: 12px;
		width: 100px;
		height: auto;
	}
	.header .el-submenu .el-menu-item{
		min-width: auto;
	}
	.left{
		float: left;
		color: #ffffff;
		padding-left: 20px;
	}
	.right{
		float: right;
		padding-right: 20px;
	}
	.role{
		float: left;
	    height: 60px;
	    line-height: 60px;
	    margin: 0;
	    cursor: pointer;
	    position: relative;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    border-bottom: 2px solid transparent;
	    color: #ffffff;
	}
	.el-submenu{
		float: left;
		position: relative;
		height: 60px;
	}
	.el-menu--horizontal{
		border-bottom: 1px solid rgba(230,230,230,0.5);
	}
</style>