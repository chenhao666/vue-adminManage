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
					<el-button @click="addBanner" type="primary"><span class="iconfont icon-crm11"></span>添加图片</el-button>
					<div class="clear"></div>
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
				          style="margin: 5px 5px;"
				          @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
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
		
		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  :title="dialogTitle"
			  :visible.sync="dialogVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  :before-close="handleClose">
			  <!--表单开始-->
			  <el-form  v-loading="formLoading" ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">			  	
				
				<el-form-item label="封面图：" prop='pic'>
					<el-upload
					  action="https://up.qbox.me/"
					  list-type="picture-card"
					  :file-list="ruleForm.fileList"
					  :on-success="uploadSuccess"
					  ref="upload"
					  :on-error="uploadError"
					  :on-change="changePic"
					  :data="ruleForm.uploadData"
					  :auto-upload="false">
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-alert
					    title="图片尺寸为750*560像素"
					    type="success"
					    style="margin-top: 20px;">
					</el-alert>
				</el-form-item>
				
				<el-form-item label="跳转类型：" prop='urlKey' @change="inputFlag=1">
					<el-select v-model="ruleForm.urlKey" placeholder="请选择">
					    <el-option
					      v-for="item in ruleForm.keysArr"
					      :key="item.index"
					      :label="item.value"
					      :value="item.index">
					    </el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="URL：" prop='url' v-show="ruleForm.urlKey==3">
					<el-input v-model="ruleForm.url"  @change="inputFlag=1"></el-input>
				</el-form-item>
				<el-form-item label="套餐选择：" prop='package'  @change="inputFlag=1" v-show="ruleForm.urlKey==2">
					<el-select v-model="ruleForm.designId" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in ruleForm.packageArr"
					      :key="index"
					      :label="item.comboName"
					      :value="item.designId">
					    </el-option>
					</el-select>
				</el-form-item>
			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.disabled">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name:'bannerManage',
		data () {
			//封面图验证
			let checkPic=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				if(this.ruleForm.fileList.length==0){
					callback(new Error('请选择楼盘封面！'))
				}else{
					callback();
				}
			};
			//URL验证
			let checkURL=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				if(this.ruleForm.urlKey==3){
					if(this.ruleForm.url==""){							
						callback(new Error('请选择楼盘封面！'))
					}else{
						callback();
					}
				}else{
					callback();
				}
			};
			//套餐验证
			let checkPackage=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				if(this.ruleForm.urlKey==2){
					if(this.ruleForm.designId==""){							
						callback(new Error('请选择套餐！'))
					}else{
						callback();
					}
				}else{
					callback();
				}
			};
			return {
				tableData:[],
				currentPage:1,//当前页数
				pageTotal:0,//总数
				pageSize:5,//分页默认每页条数
				dialogVisible: false,//弹窗状态
		        dialogTitle:'提示',
		        dialogFlag:0,
		        inputFlag:0,//表单修改标记
		        formLoading:true,//弹窗数据加载
				ruleForm:formInit(),
				rules:{
		        	url:[
		        		{  required: true, validator: checkURL, trigger: 'blur' }
		        	],
		        	package:[
		        		{  required: true, validator: checkPackage, trigger: 'blur' }
		        	],
		        	urlKey:[
		        		{ required: true, message: '请选择跳转类型', trigger: 'blur' }
		        	],
		        	pic:[
		        		{  required: true, validator: checkPic, trigger: 'blur' }
		        	]
		        }
			}
		},
		mounted(){
			bannerList(this);
		},
		methods:{
			//添加图片
	      	addBanner(){
	      		packageList(this,function(){});
	      		this.ruleForm=formInit();
		      	this.dialogTitle="添加图片";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
	      	},
	      	//dialog弹窗
		    handleClose(done) {
		    	if(this.inputFlag){
		    		this.$confirm('当前有未保存内容,确认关闭?', '提示', {
			        	confirmButtonText: '确定',
			        	cancelButtonText: '取消',
		        		type: 'warning'
		        	})
		    		.then(_ => {
			          done();
			          this.inputFlag=0;
			      })
			      .catch(_ => {});
		    	}else{
		    		done();
		    		this.inputFlag=0;
		    	}
		    },
		    //编辑
      		handleUpdate(index, row) {
      			//console.log(row)
      			this.dialogFlag=row.id;
      			this.ruleForm=formInit();
      			//console.log(row)
      			this.dialogTitle="编辑图片";
        		//修改信息
        		this.ruleForm.coverPic=row.bannerImg;//图片
        		this.ruleForm.fileList.push({name:"banner",url:row.bannerImg});
        		this.ruleForm.urlKey=parseInt(row.type);
        		if(row.type==3){
					this.ruleForm.url=row.content;
				}
        		var that=this;
				packageList(this,function(){
					if(row.type==2){
						that.ruleForm.designId=row.content;
					}
					that.dialogVisible = true;//打开弹窗
      			});
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
		    //图片上传
		    uploadSuccess(response, file, fileList){
	      		this.ruleForm.coverPic=this.$store.state.qiniuUrl+response.key;
				var data={
					"type":this.ruleForm.urlKey,
					"bannerImg":this.ruleForm.coverPic
				}
				if(this.ruleForm.urlKey==1){
					data.content="designer";
				}
				if(this.ruleForm.urlKey==2){
					data.content=this.ruleForm.designId;
				}
				if(this.ruleForm.urlKey==3){
					data.content=this.ruleForm.url;
				}
				if(this.dialogFlag!=0){
	      			data.id=this.dialogFlag;
	      		}
				addBanner(this,data);
		    },
		    //改变图片
		    changePic(file, fileList){
		    	//console.log(fileList);
		    	var len=fileList.length;
		    	this.ruleForm.fileList=[fileList[len-1]];
		    	this.ruleForm.picChange=1;
		    },
		    //上传失败
		    uploadError(err, file, fileList){
		    	this.$message.error('图片上传失败！');
		    	this.ruleForm.disabled=false;
		    },
		    //提交表单
		    submitForm(formName) {
		      	this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	this.ruleForm.disabled=true;
			        	const loading =openLoad(this,"Loading...");
			        	if(this.ruleForm.picChange){
			        		this.$ajax.post(this.$store.state.localIP+'qiNiuToken',{})
					        .then((response)=>{
					        	//console.log(response);
					        	loading.close();
					        	if(response.data.retCode==0){
					        		var qiniutoken=response.data.token;
					        		this.ruleForm.uploadData.token=response.data.token;
					        		//console.log(this.uploadData)
					        		//上传图片信息
					        		this.$refs.upload.submit();
					        	}else{
					        		this.ruleForm.disabled=false;
					        		loading.close();
					        		this.$message.error('获取token失败！');
					        	}
					        	
					        })
					        .catch((error)=>{
					        	this.ruleForm.disabled=false;
					        	console.log(error)
					        	loading.close();
								this.$message.error('获取token失败！');
							})
			        	}else{
			        		var data={
								"type":this.ruleForm.urlKey,
								"bannerImg":this.ruleForm.coverPic
							}
							if(this.ruleForm.urlKey==1){
								data.content="designer";
							}
							if(this.ruleForm.urlKey==2){
								data.content=this.ruleForm.designId;
							}
							if(this.ruleForm.urlKey==3){
								data.content=this.ruleForm.url;
							}
							if(this.dialogFlag!=0){
				      			data.id=this.dialogFlag;
				      		}
			        		loading.close();
							addBanner(this,data);
			        	}
			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
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
				obj.pageTotal-=1;
				if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
					obj.currentPage-=1;
				}
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
	//表单初始化
	function formInit(){
		let data={
         		fileList:[],//图片列表
         		uploadData:{'token':''},//上传图片附带的token
         		coverPic:"",//banner图
         		picChange:0,
         		urlKey:'',//跳转Key
         		url:'',//跳转URL
         		packageArr:[],//套餐包数组
         		designId:'',//选中方案ID
				keysArr:[
					{
						index:1,
						value:'设计师'
					},{
						index:2,
						value:'方案'
					},{
						index:3,
						value:'web链接'
					}
				],//跳转key数组
         		disabled:false//按钮禁用
	        }
		return data;
	}
	//新增banner
	function addBanner(obj,data){
		obj.ruleForm.picChange=0;
		obj.$ajax.post(obj.$store.state.localIP+"saveBanner",data)
		.then(response=>{
			//console.log(response)
			if(response.data.retMsg==0){
				obj.ruleForm.disabled=false;
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
				obj.dialogVisible = false;//关闭弹窗
				obj.dialogFlag=0;
				bannerList(obj);
			}else{
				obj.$message.error('新增banner信息失败！');
			}
		})
		.catch((error)=>{
			obj.ruleForm.disabled=false;
	        console.log(error)
			obj.$message.error('新增banner信息失败！');
		})
	}
	//获取套餐列表
	function packageList(obj,callback){
		obj.formLoading=true;
		obj.ruleForm.disabled=true;
		obj.$ajax.post(obj.$store.state.localIP+"queryDesignInfo",{})
		.then(response=>{
			obj.formLoading=false;
			obj.ruleForm.disabled=false;
			//console.log(response)
			if(response.data.retMsg==0){
				obj.ruleForm.packageArr=response.data.designInfos;
				callback();
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