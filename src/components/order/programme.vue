<template>
	<div class="programme">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/orderManage/orderList' }">订单管理</el-breadcrumb-item>
			<el-breadcrumb-item class="fontWeight">方案</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<!--设计图-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>设计图</span>
			</div>
			<div class="line"></div>
			
			<div id="cardImg">

			</div>
		</el-card>
		
		<!--户型图-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>户型图</span>
			</div>
			<div class="line"></div>
			
			<div class="cardImg">
				<img src="/ourHouse/static/img/2.jpg" alt="" />
			</div>
		</el-card>
		
		<!--施工图-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>施工图</span>
			</div>
			<div class="line"></div>
			
			<div class="cardImg">
				<img src="/ourHouse/static/img/3.jpg" alt="" />
			</div>
		</el-card>
	</div>
</template>

<script>
export default{
	name:'programme',
	data () {
		return {
			
		}
	},
	mounted(){
		getImg('/ourHouse/static/img/1.jpg');
		/*window.onresize=()=>{
			getImg('/ourHouse/static/img/1.jpg');
		}*/
	},
	methods:{
		
	}
}
function getImg(url){
	let div = document.getElementById('cardImg');
	let PSV = new PhotoSphereViewer({
			panorama: url,
			container: div,
			time_anim: false,
			navbar: true,
			//allow_scroll_to_zoom:false,//鼠标滚动
			navbar_style: {
				backgroundColor: 'rgba(58, 67, 77, 0.7)'
			}
	});
	let divWidth=div.offsetWidth;
	let divHeight;
	let Img = new Image();
	Img.src=url;
	Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
	    let width=Img.width, //确保canvas的尺寸和图片一样
	    	height=Img.height; 
	    divHeight=(divWidth/width)*height
	   $("#cardImg").height(divHeight)
	}   
}
</script>

<style scoped>
	#cardImg{
		width: 100%;
		margin-top: 30px;
	}
	.cardImg{
		margin-top: 30px;
		text-align: center;
	}
	.cardImg img{
		display: inline-block;
		max-width: 100%;
	}
</style>
