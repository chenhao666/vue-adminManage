<template>
	<div class="bannerManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">轮播图</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>轮播图</span>
			</div>
			<div class="line"></div>
			<div class="banner_list">
				<!--批量操作-->
				<div class="editBtn">
					<el-button type="primary" style="float: left;">图片上传</el-button>
					<el-alert
					    title="banner图上传尺寸为750*560像素"
					    :closable="false"
					    type="success">
					</el-alert>
					
					<div class="clear"></div>
					<form method="post" enctype="multipart/form-data" id="form" action="upload">
						<input class="uploadPic" type="file" name="file" @change="uploadPic"/>
					</form>
				</div>
				
				<el-table border :data="tableData" :stripe="true" tooltip-effect="dark">
					<el-table-column prop="url" label="banner图" width="500">
						<template slot-scope="props">
							<div><img :src="props.row.bannerImg" alt="" style="width: 150px;height: 112px;"/></div>
						</template>
					</el-table-column>
				
					<el-table-column label="操作">
				      <template slot-scope="scope">
				        <el-button
				          size="mini"
				          @click="handleEdit(scope.$index, scope.row)">{{ scope.row.isUsed==0 ? "撤回" : "使用" }}</el-button>
				        <el-button
				          size="mini"
				          type="danger"
				          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				      </template>
				    </el-table-column>
				</el-table>
			</div>
			<!--分页-->
			<div class="curPageCss">
			    <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[5, 10, 15, 20]"
			      :page-size="pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="pageTotal">
			    </el-pagination>
			</div>
			<div class="clear"></div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name:'bannerManage',
		data () {
			return {
				tableData:[],
				currentPage:1,//当前页数
				pageTotal:0,//总数
				pageSize:5,//分页默认每页条数
			}
		},
		mounted(){
			bannerList(this);
		},
		methods:{
			//选择图片
			uploadPic(event){
				const loading =openLoad(this,"获取token中...");
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
						    if(image.width!=750 || image.height!=560){
						    		this.$message.error('请上传750*560像素的banner！');					    	
						    }else{
						    	this.uploading(formData)
						    }
						};	
		        	}else{
		        		this.$message.error('获取token失败！');
		        	}
		        	loading.close();
		        })
		        .catch((error)=>{
		        	console.log(error)
		        	loading.close();
					this.$message.error('获取token失败！');
				})
				//this.fileList=[];
				document.getElementById("form").reset();
			},
			//上传七牛
			uploading (formData) {   // 定义在data里的uploading函数
				const loading =openLoad(this,"图片上传中...");
	         	this.$ajax.post('http://up.qiniu.com/',formData)
	          	.then(response => {
	          		loading.close();
	            	//console.log(response,1)  // 这个key是你上传图片成功后七牛返回给你的图片key
	            	var key = this.$store.state.qiniuUrl+response.data.key
	            	this.uploadLocation(key)
	            	// 现在已经获取到你选择图片的路径，相当于一个网络路径，你就可以进行你的先一步操作了。
	          	})
	          	.catch((error)=>{
	          		loading.close();
	          		console.log(error)
					this.$message.error('图片上传失败1！');
				})
	       	},
			//图片上传服务器
			uploadLocation(url){
				const loading =openLoad(this,"上传服务器中...");
				this.$ajax.post(this.$store.state.localIP+'saveBanner',{
					"bannerImg":url
				})
				.then(response => {
					loading.close();
					if(response.data.retCode==0){
						this.$message({
				          message: '图片上传成功!',
				          type: 'success'
				       	});
				       	bannerList(this);
					}else{
						this.$message.error('图片上传失败！');
					}
	          	})
	          	.catch((error)=>{
	          		console.log(error);
	          		loading.close();
					this.$message.error('图片上传失败！');
				})
			},
			//分页方法
		    handleSizeChange(val) {
		      //console.log(`每页 ${val} 条`);
		      this.pageSize=val;
		      bannerList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      bannerList(this);
		    },
		    //应用banner
		    handleEdit(index, row){
		    	this.$confirm('确定修改当前状态吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		       }).then(() => {
		       		var data={
		       			isUsed:Math.abs(row.isUsed-1),
		       			id:row.id
		       		}
		          	changeState(this,data);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消操作'
		          });          
		        });
		    },
		    //删除banner
		    handleDelete(index, row){
		    	this.$confirm('确定要删除当前banner吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		       	}).then(() => {
		       		var id=row.id;
		          	deleteBanner(this,id);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消操作'
		          });          
		        });
		    },
		}
	}
	//打开loading
	function openLoad(obj,txt){
		const loading=obj.$loading({
	      lock: true,
	      text: txt,
	      fullscreen:false,
	      spinner: 'el-icon-loading',
	      background: 'rgba(0, 0, 0, 0.6)'
	    });
	    return loading;
	}
	//获取图片列表
	function bannerList(obj){
		const loading =openLoad(obj,"列表获取...");
		obj.$ajax.post(obj.$store.state.localIP+"queryBannerList",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.tableData=response.data.banners;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('列表获取失败！');
			}
		})
		.catch((error)=>{
	        loading.close();
	        console.log(error)
			obj.$message.error('列表获取失败！');
		})
	}
	//修改当前状态
	function changeState(obj,data){
		const loading =openLoad(obj,"Loading");
		obj.$ajax.post(obj.$store.state.localIP+"saveBanner",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.$message({
				  	message: '操作成功!',
				  	type: 'success'
				});
				bannerList(obj);
			}else{
				obj.$message.error('操作失败！');
			}
		})
		.catch((error)=>{
	        loading.close();
	        console.log(error)
			obj.$message.error('操作失败！');
		})
	}
	//删除当前banner
	function deleteBanner(obj,id){
		const loading =openLoad(obj,"Loading");
		obj.$ajax.post(obj.$store.state.localIP+"deleteBanner",{
			id:id
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.$message({
				  	message: '操作成功!',
				  	type: 'success'
				});
				bannerList(obj);
			}else{
				obj.$message.error('操作失败！');
			}
		})
		.catch((error)=>{
	        loading.close();
	        console.log(error)
			obj.$message.error('操作失败！');
		})
	}
</script>

<style scoped="scoped">
	.editBtn{
    	margin-top: 20px;
    	margin-bottom: 20px;
    	text-align: right;
    	position: relative;
	}
	#form input{
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100px;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}
	.el-alert{
		float: left;
		display: inline-block;
		width: auto;
		margin-left: 30px;
	}
	.el-table{
		margin-top: 30px;
	}
</style>