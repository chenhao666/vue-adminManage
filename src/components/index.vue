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
