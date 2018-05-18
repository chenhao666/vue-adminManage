<template>
  <div id="app">
		<router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
.pg-canvas{
	width: 99% !important; 
	height: 99% !important;
}
#app{
	margin: 0px;
	padding: 0px;
	min-height: 100%;
}
.el-breadcrumb{
	height: 60px;
	line-height: 60px !important;
	border-bottom: 1px solid #adadad;
	padding-left: 60px;
	box-sizing: border-box;
}
</style>
