<template>
	<div>
		<el-menu
			:default-active="activaNav"
			:unique-opened="true"
			class="el-menu-vertical-demo"
			@open="handleOpen"
			@close="handleClose"
			:collapse="isCollapse"
			:router="true"
			background-color="#657576"
			text-color="#fff"
			@select="menuSelect"
			active-text-color="#ffd04b">
			<el-menu-item  @click="collapse()" index="0" :route="{path:'#'}">
				<i :class="isCollapse ? rightArrow : leftArrow"></i>
				<span slot="title">展开/收起</span>
			</el-menu-item>
			<el-menu-item  v-for="item in navMenu" v-if="!item.sonList.length" :index="item.id.toString()" :key="item.id" @click='goPage(item.id)' :route="{path:'/'+item.fitField}">
				<i :class="'iconfont icon-'+item.fitField"></i>
				<span slot="title">{{ item.functionName }}</span>
			</el-menu-item>
			<el-submenu  v-for="item in navMenu" v-if="item.sonList.length" :index="item.id.toString()" :key="item.id" >
				<template slot="title">
					<i :class="'iconfont icon-'+item.fitField"></i>
					<span slot="title">{{ item.functionName }}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item v-for="child in item.sonList" :key="child.id" :index="child.id.toString()" @click='goPage(child.id)' :route="{path:'/'+child.fitField }"><div class="navItem iconfont icon-jiantouarrow496"></div>{{ child.functionName }}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
 export default {
 	data() {
      return {
        isCollapse: false,
        leftArrow:'iconfont icon-shouqi',
        rightArrow:'iconfont icon-collapse-right',
        activaNav:sessionStorage.getItem('nav'),
        //导航菜单
        navMenu:this.$store.state.userPower
      };
   },
    methods: {
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
      //菜单跳转
      goPage(urlId){
      	this.$ajax.post(this.$store.state.localIP+"selectRoleauthList",{roleID:parseInt(this.$store.state.roleID),functionAuthorityID:urlId})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				if(response.data.retCode==0){
					var power=response.data.roleauthorities[0].roleOperation;
					if(power.indexOf('0')==-1){
						this.$message.error("！");
						this.$router.go(-1);
					}else{
						sessionStorage.setItem('roleAuthList',power);
						this.$store.commit("powerFlag");
					}
				}else{
					this.$message.error("获取用户权限失败！");
					this.$router.go(-1);
				}
			}
		})
		.catch((error)=>{
			console.log(error);
			this.$message.error("网络连接错误~~");
			this.$router.go(-1);
		})
      },
      //选中菜单
      menuSelect(index,indexPath){
      	//console.log(this.activaNav)
      	let navIndex=0;
      	if(indexPath.length==1){
      		navIndex=indexPath[0];
      	}else{
      		navIndex=indexPath[indexPath.length-1];
      	}
      	sessionStorage.setItem('nav',navIndex);
      },
      collapse () {
      	this.isCollapse=!this.isCollapse;
      	this.$emit('collapseP',this.isCollapse);
      }
    }
  }
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    box-sizing: border-box;
    min-height: 100%;
 }
 .el-menu{
 	border-right: none;
 }
 .el-menu-item.is-active a{
 	color: rgb(255, 208, 75);
 }
 .el-menu-item a{
 	color: #ffffff;
 }
</style>
