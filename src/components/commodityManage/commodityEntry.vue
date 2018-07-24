<template>
	<div class="commodityManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">商品管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">商品录入</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品录入</span>
			</div>
			<div class="line"></div>
			
			<!--筛选条件-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left" style="width: 200px;">
						<el-input v-model="goodsName" placeholder="请输入商品名"></el-input>
					</div>
					<div class="left" style="width: 200px;margin-left: 20px;">
						<el-input v-model="packageName" placeholder="请输入分类名"></el-input>
					</div>
					<div class="left" style="margin-left: 10px;">
						<el-button type="success" @click="searchUser"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addClass" type="primary"><span class="iconfont icon-crm11"></span>添加商品</el-button>
				<div class="clear"></div>
			</div>
			
			<!--商品列表-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="goodsName" label="商品名称" width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="goodsCode" label="商品编码">
				</el-table-column>
				<el-table-column prop="model" label="商品型号">
				</el-table-column>
				<el-table-column prop="brandName" label="商品品牌" width="80">
				</el-table-column>
				<el-table-column prop="unitPrice" label="商品价格" width="100">
				</el-table-column>
				<el-table-column prop="specifications" label="商品规格">
				</el-table-column>
				<el-table-column prop="material" label="颜色材质">
				</el-table-column>
				<el-table-column prop="packageName" label="所属分类" width="80">
				</el-table-column>

				<el-table-column label="操作"  width="180">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			
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
			  <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">
				
			  	<el-form-item label="商品名称" prop="goodsName">
			  		<el-input v-model="ruleForm.goodsName"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品编码" prop="goodsCode">
			  		<el-input v-model="ruleForm.goodsCode"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品型号" prop="model">
			  		<el-input v-model="ruleForm.model"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品价格" prop="unitPrice">
			  		<el-input v-model="ruleForm.unitPrice"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品规格" prop="specifications">
			  		<el-input v-model="ruleForm.specifications"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="颜色材质" prop="material">
			  		<el-input v-model="ruleForm.material"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品品牌" prop="brand">
			  		<el-select v-model="ruleForm.brand" placeholder="请选择品牌"  @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.brandList" :key="key" :label="item.brandName" :value="item.brandId+','+item.brandName"></el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品包" prop="package">
			  		<el-select v-model="ruleForm.package" placeholder="选择分类"  @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.packageList" :key="key" :label="item.packgeName" :value="item.packageId+','+item.packgeName"></el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="图片上传" prop='pic'>
					<el-upload
					  action="https://up.qbox.me/"
					  list-type="picture-card"
					  :file-list="ruleForm.fileList"
					  :on-remove="removePic"
					  :on-success="uploadSuccess"
					  ref="upload"
					  :on-error="uploadError"
					  :on-change="changePic"
					  :data="ruleForm.uploadData"
					  :auto-upload="false">
					  <i class="el-icon-plus"></i>
					</el-upload>
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
		name:'commodityManage',
		data () {
			//图片验证
			let checkPic=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				if(this.ruleForm.fileList.length==0){
					callback(new Error('请上传商品图！'))
				}else{
					callback();
				}
			};
			return {
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:5,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogFlag:0,//标记
		        inputFlag:0,//表单修改标记
		        dialogTitle:'提示',
		        ruleForm:formInit(),
		        goodsName:'',//搜索商品
		        packageName:'',//搜索包
		        rules:{
		        	goodsName:[
		        		{ required: true, message: '请输入商品名称', trigger: 'blur' }
		        	],
		        	goodsCode:[
		        		{ required: true, message: '请输入商品编码', trigger: 'blur' }
		        	],
		        	model:[
		        		{ required: true, message: '请输入商品型号', trigger: 'blur' }
		        	],
		        	unitPrice:[
		        		{ required: true, message: '请输入商品价格', trigger: 'blur' }
		        	],
		        	specifications:[
		        		{ required: true, message: '请输入商品规格', trigger: 'blur' }
		        	],
		        	material:[
		        		{ required: true, message: '请输入颜色材质', trigger: 'blur' }
		        	],
		        	brand:[
		        		{ required: true, message: '请选择商品品牌', trigger: 'blur' }
		        	],
		        	package:[
		        		{ required: true, message: '请选择分类', trigger: 'blur' }
		        	],
		        	pic:[
		        		{  required: true, validator: checkPic, trigger: 'blur' }
		        	]
		        }
			}
		},
		mounted(){
			goodsList(this);
		},
		beforeDestroy(){
			this.dialogVisible=false;
		},
		methods:{
			//全选
		    toggleSelection() {
		    	//更改状态
		    	this.multipleFlag=!this.multipleFlag;
		      if (this.multipleFlag) {
		        let rows=this.tableData;
		        rows.forEach(row => {
		          this.$refs.multipleTable.toggleRowSelection(row);
		        });
		      } else {
		        this.$refs.multipleTable.clearSelection();
		      }
		    },
		    handleSelectionChange(val) {
		      this.multipleSelection = val;
		    },
			//批量删除
		    delQuery(){
		    	//console.log(this.multipleSelection);
		    	if(this.multipleSelection.length==0){
		    		 this.$message({
			        	showClose: true,
			        	message: '请选择要删除的选项！',
			        	type: 'warning'
			      });
		    	}else{
			    	this.$confirm('确定删除当前用户吗?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			      }).then(() => {
			      	let delArr=[];
			      	let multi=this.multipleSelection;
			      	for(let i=0;i<multi.length;i++){
			      		delArr.push(multi[i].id);
			      	}
			      	let data={"id":delArr.join(',')};
			      	delGoods(this,data);
			      }).catch(() => {
			        this.$message({
			          type: 'info',
			          message: '已取消删除'
			        });          
			      });
			  }
		    },
		    //分页方法
		    handleSizeChange(val) {
		      //console.log(`每页 ${val} 条`);
		      this.pageSize=val;
		      goodsList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      goodsList(this);
		    },
		    //添加分类
		    addClass(){
		    	this.ruleForm=formInit();
		      	this.dialogTitle="添加分类";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		      	brandList(this,function(){});
		    },
		    //编辑
      		handleEdit(index, row) {
      			//console.log(row)
				this.ruleForm=formInit();
		      	this.dialogTitle="编辑分类";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.id;
		      	var that=this;
		      	brandList(this,function(){
		      		that.ruleForm.goodsName=row.goodsName;//商品名称
				    that.ruleForm.goodsCode=row.goodsCode;//商品编码
				    that.ruleForm.model=row.model;//产品型号
				    that.ruleForm.brand=row.brandId+','+row.brandName;//商品品牌
				    that.ruleForm.unitPrice=row.unitPrice;//商品价格
				    that.ruleForm.specifications=row.specifications;//商品规格
				    that.ruleForm.material=row.material;//颜色材质
				    that.ruleForm.package=row.packageId+','+row.packageName;//商品包
				    //图片列表
				    if(row.goodsImages){
				    	var pic=row.goodsImages;
					    var picArr=[];
					    if(pic.indexOf(',')>-1){
					    	picArr=pic.split(',');
					    }else{
					    	picArr=[pic];
					    }
					    that.ruleForm.picNum=picArr.length;
					    for(var i=0;i<picArr.length;i++){
					    	that.ruleForm.fileList.push({name:i,url:picArr[i]})
					    }
				    }
		      	});
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前分类吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"id":row.id};
		          delGoods(this,data);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
	      	},
	      	//图片上传
		    uploadSuccess(response, file, fileList){
		    	//console.log(response)
		    	//console.log(fileList)
		    	var list=this.ruleForm.fileList;
		    	//console.log(list)
		    	var num=this.ruleForm.picNum;
		    	list[num].url=this.$store.state.qiniuUrl+response.key;
		    	num++;
		    	this.ruleForm.picNum=num;
		    	var len=fileList.length;
	      		if(len==num){
	      			var coverPic='';
	      			var coverPicArr=[];
	      			for(var i=0;i<list.length;i++){
	      				coverPicArr.push(list[i].url);
	      			}
	      			coverPic=coverPicArr.join(',');
	      			var brandArr=this.ruleForm.brand.split(',');
		      		var packageArr=this.ruleForm.package.split(',');
					var data={
						goodsName:this.ruleForm.goodsName,//商品名称
				        goodsCode:this.ruleForm.goodsCode,//商品编码
				        model:this.ruleForm.model,//产品型号
				        brandId:brandArr[0],//商品品牌ID
				        brandName:brandArr[1],//商品品牌名称
				        unitPrice:this.ruleForm.unitPrice,//商品价格
				        specifications:this.ruleForm.specifications,//商品规格
				        material:this.ruleForm.material,//颜色材质
				        packageId:packageArr[0],//商品包ID
				        packageName:packageArr[1],//包名称
				        goodsImages:coverPic//图片列表
					}
					addGoods(this,data);	
	      		}
		    },
		    //改变图片
		    changePic(file, fileList){
		    	this.ruleForm.fileList=[];
		    	this.ruleForm.fileList=fileList;
		    	this.ruleForm.picChange=1;
		    },
		    //移除图片
		    removePic(file, fileList){
		    	this.ruleForm.fileList=[];
		    	this.ruleForm.fileList=fileList;
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
			        	//console.log(this.ruleForm.picChange)
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
			        		loading.close();
			        		var list=this.ruleForm.fileList;
			        		var coverPic='';
			      			var coverPicArr=[];
			      			for(var i=0;i<list.length;i++){
			      				coverPicArr.push(list[i].url);
			      			}
			      			coverPic=coverPicArr.join(',');
			      			var brandArr=this.ruleForm.brand.split(',');
				      		var packageArr=this.ruleForm.package.split(',');
							var data={
								goodsName:this.ruleForm.goodsName,//商品名称
						        goodsCode:this.ruleForm.goodsCode,//商品编码
						        model:this.ruleForm.model,//产品型号
						        brandId:brandArr[0],//商品品牌ID
						        brandName:brandArr[1],//商品品牌名称
						        unitPrice:this.ruleForm.unitPrice,//商品价格
						        specifications:this.ruleForm.specifications,//商品规格
						        material:this.ruleForm.material,//颜色材质
						        packageId:packageArr[0],//商品包ID
						        packageName:packageArr[1],//包名称
						        goodsImages:coverPic//图片列表
							}
							addGoods(this,data);	
			        	}
			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
		      	});
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
		    //搜索
		    searchUser(){
		    	goodsList(this);
		    }
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
	//表单初始化
	function formInit(){
		let data={
				fileList:[],//图片列表
		       	goodsName:'',//商品名称
		        goodsCode:'',//商品编码
		        model:'',//产品型号
		        brand:'',//商品品牌
		        brandList:[],//品牌列表
		        unitPrice:'',//商品价格
		        specifications:'',//商品规格
		        material:'',//颜色材质
		        package:'',//商品包
		        packageList:[],//包列表
		        picChange:0,
		        uploadData:{'token':''},//上传图片附带的token
		        picNum:0,//标记
		        disabled:false
	        }
		return data;
	}
	//获取商品列表
	function goodsList(obj){
		//console.log(obj.currentPage)
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryGoodsInfomation",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize,
			"goodsName":obj.goodsName,
			"packageName":obj.packageName
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.tableData=response.data.goodsInfomations;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取品牌列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取品牌列表失败！');
		})
	}
	//删除商品
	function delGoods(obj,data){
		const loading =openLoad(obj,"Loading...");
		obj.$ajax.post(obj.$store.state.localIP+"deleteGoodsInfomation",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.$message({
				  message: '删除成功!',
				  type: 'success'
				});
				var list=data.id.toString();
				if(list.indexOf(',')>-1){
					var listArr=list.split(',');
					obj.pageTotal-=listArr.length;
				}else{
					obj.pageTotal-=1;
				}
				if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
					obj.currentPage-=1;
				}
				goodsList(obj);
			}else{
				obj.$message.error('删除失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('删除失败！');
		})
	}
	//获取品牌列表
	function brandList(obj,callback){
		obj.ruleForm.disabled=true;
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+'selectBrand')
		.then(res=>{
			loading.close();
			//console.log(res)
			if(res.data.retCode==0){
				obj.ruleForm.brandList=res.data.brandList;
				packageList(obj,function(){
					obj.ruleForm.disabled=false;
					callback();
				})
			}else{
				obj.$message.error("获取品牌列表失败！");
			}
		})
		.catch(error=>{
			loading.close();
			console.log(error);
			obj.$message.error("获取品牌列表失败！");
		})
	}
	//获取包列表
	function packageList(obj,callback){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+'queryGoodsPackageList')
		.then(res=>{
			loading.close();
			//console.log(res)
			if(res.data.retCode==0){
				obj.ruleForm.packageList=res.data.goodsPackages;
				callback();
			}else{
				obj.$message.error("获取商品包失败！");
			}
		})
		.catch(error=>{
			loading.close();
			console.log(error);
			obj.$message.error("获取商品包失败！");
		})
	}
	//新增商品
	function addGoods(obj,data){
		obj.ruleForm.picChange=0;
		//console.log(data)
		if(obj.dialogFlag!=0){
			data.id=obj.dialogFlag;
		}
		obj.$ajax.post(obj.$store.state.localIP+"saveGoodsInfomation",data)
		.then(response=>{
			//console.log(response)
			obj.ruleForm.disabled=false;
			if(response.data.retMsg==0){
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
				obj.dialogVisible = false;//关闭弹窗
				obj.dialogFlag=0;
				goodsList(obj);
			}else{
				obj.$message.error('新增商品失败！');
			}
		})
		.catch((error)=>{
			obj.ruleForm.disabled=false;
	        console.log(error)
			obj.$message.error('新增商品失败！');
		})
	}
</script>

<style scoped="scoped">
	.editBtn{
		width: 100%;
		text-align: right;
		margin-top: 20px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}
	.filter .left{
		float: left;
	}

	.filter{
		margin-top: 20px;
		width: 100%;
		box-sizing: border-box;
	}
</style>
