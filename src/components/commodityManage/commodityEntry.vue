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
					<div class="left">
						<el-input v-model="goodsName" placeholder="请输入商品名"></el-input>
					</div>
					<!--<div class="left">
						<el-input v-model="packageName" placeholder="请输入分类名"></el-input>
					</div>-->
					<div class="left">
						<el-input v-model="goodsCode" placeholder="商品编码"></el-input>
					</div>
					<div class="left">
						<el-input v-model="goodsModel" placeholder="商品型号"></el-input>
					</div>
					<div class="left">
						<el-input v-model="goodsBrand" placeholder="品牌"></el-input>
					</div>
					<div class="left" >
						<el-button type="success" @click="searchUser"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" v-if="delBtnShow" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addClass" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加商品</el-button>
				<el-button v-if="addBtnShow" @click="importData" type="success">批量导入</el-button>
				<a href="http://m.wojiali.cn/file/fileSource/template.xlsx" v-if="addBtnShow" download="download"><el-button type="success">下载模板</el-button></a>
				<div class="clear"></div>
			</div>
			
			<!--商品列表-->
			<el-table ref="multipleTable" border  :data="tableData"  tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="expand" label="展开" width="80">
      				<template slot-scope="props">
      					<el-table ref="multipleTable" border  :data="props.row.goodsInfoList"  tooltip-effect="dark" :row-class-name="childTable" :header-row-class-name="childTable">
      						<el-table-column prop="goodsName" label="商品名称" min-width="150" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="goodsCode" label="商品编码">
							</el-table-column>
							<el-table-column prop="model" label="商品型号">
							</el-table-column>
							<el-table-column prop="brandName" label="商品品牌" min-width="80">
							</el-table-column>
							<!--<el-table-column prop="unitPrice" label="零售单价" min-width="100">
							</el-table-column>-->
							<el-table-column prop="specifications" label="商品规格" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="material" label="材质" show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="操作"  width="180" v-if="editBtnShow || delBtnShow">
						      	<template slot-scope="scope">
							        <el-button
							          size="mini"
							          style="margin: 5px 5px;"
							          v-if="editBtnShow"
							          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							        <el-button
							          size="mini"
							          style="margin: 5px 5px;"
							          type="danger"
							          v-if="delBtnShow"
							          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						      	</template>
						    </el-table-column>
      					</el-table>
      				</template>
      			</el-table-column>
				<el-table-column prop="goodsName" label="商品名称" width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="goodsCode" label="商品编码">
				</el-table-column>
				<el-table-column prop="model" label="商品型号">
				</el-table-column>
				<el-table-column prop="brandName" label="商品品牌" min-width="80">
				</el-table-column>
				<el-table-column prop="unitPrice" label="零售单价" min-width="100">
				</el-table-column>
				<el-table-column prop="specifications" label="商品规格" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="material" label="材质" show-overflow-tooltip>
				</el-table-column>
				<!--<el-table-column prop="packageName" label="套餐包" width="80">
				</el-table-column>-->

				<el-table-column label="操作"  width="180" v-if="editBtnShow || delBtnShow">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          v-if="editBtnShow"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
			          v-if="delBtnShow"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          v-if="editBtnShow"
			          @click="childListBtn(scope.$index, scope.row)">添加子商品</el-button>
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
				
				<el-form-item label="父商品" v-show="addGoodsFlag ? true : false">
			  		<el-input v-model="child.goodsName" :disabled='true'  @change="inputFlag=1"></el-input>
			  	</el-form-item>
				
				<el-form-item label="类型选择" prop="goodsType" v-show="addGoodsFlag ? false : true">
			  		<el-select v-model="ruleForm.goodsType" placeholder="请选择类型"  @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.goodsTypeList" :key="key" :label="item.goodsType" :value="item.goodsType"></el-option>
					</el-select>
			  	</el-form-item>
				
			  	<el-form-item label="商品名称" prop="goodsName">
			  		<el-input v-model="ruleForm.goodsName"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品品牌" prop="brand">
			  		<el-select v-model="ruleForm.brand" placeholder="请选择品牌"  @change="brandChange">
						<el-option v-for="(item,key) in ruleForm.brandList" :key="key" :label="item.brandName" :value="item.brandId+','+item.brandName"></el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品货号" v-show="ruleForm.showArticleNum" prop="articleNum">
			  		<el-input v-model="ruleForm.articleNum"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="指导单价" v-show="ruleForm.showGuideUnitPrice" prop="guideUnitPrice">
			  		<el-input v-model="ruleForm.guideUnitPrice"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="风格名称" prop="styleName">
			  		<el-select v-model="ruleForm.styleName" multiple placeholder="请选择">
					    <el-option
					      v-for="(item,key) in ruleForm.styleList"
					      :key="key"
					      :label="item.styleName"
					      :value="item.styleName">
					    </el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品编码"  v-show='ruleForm.inputDisabled'>
			  		<el-input v-model="ruleForm.goodsCode" disabled  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品型号" prop="model">
			  		<el-input v-model="ruleForm.model"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="零售单价" prop="unitPrice" v-show="addGoodsFlag ? false : true">
			  		<el-input v-model="ruleForm.unitPrice"  @change="inputFlag=1" ></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品规格" prop="specifications">
			  		<el-input v-model="ruleForm.specifications"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品材质" prop="material">
			  		<el-input v-model="ruleForm.material"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品颜色" prop="goodsColor">
			  		<el-input v-model="ruleForm.goodsColor"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="商品单位" prop="units">
			  		<el-input v-model="ruleForm.units"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<!--<el-form-item label="商品包" prop="package">
			  		<el-select v-model="ruleForm.package" placeholder="选择包"  @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.packageList" :key="key" :label="item.packgeName" :value="item.packageId+','+item.packgeName"></el-option>
					</el-select>
			  	</el-form-item>-->
			  	
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
					  :limit="9"
					  :on-exceed="onExceed"
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
		
		<div class="edit_dialog">
			<el-dialog
			  title="批量导入"
			  :visible.sync="importVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  >
			  <!--表单开始-->
			  	<el-form  label-width="85px">	  	
				  	<el-form-item label="压缩包">
						<el-upload
						  class="upload-demo"
						  ref="uploadZip"
						  name="zipFile"
						  :action="fileUpload"
						  :file-list="fileListExcel"
						  :on-exceed="onExceedImport"
						  :on-success="excelSuccess"
						  :on-change="onExceedChange"
						  :on-progress="zipProgress"
						  :on-error="zipError"
						  accept="application/zip,application/rar"
						  :limit="1"
						  :auto-upload="false">
						  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						</el-upload>
					</el-form-item>
			  	</el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitFileForm"  :disabled="zipDisabled">确 定</el-button>
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
			//价格验证
			let checkPrice=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				var unitPrice=this.ruleForm.unitPrice;
				//console.log(unitPrice)
				if(unitPrice!=parseFloat(unitPrice) || unitPrice.toString().indexOf('-')>-1){
					if(this.addGoodsFlag){
						callback();
					}else{						
						callback(new Error('请输入正确的价格！'))
					}
				}else{
					callback();
				}
			};
			//商品类型
			let checkGoodsType=(rule, value, callback)=>{
				if(this.ruleForm.goodsType==""){
					if(this.addGoodsFlag){
						callback();
					}else{						
						callback(new Error('请选择商品类型！'))
					}
				}else{
					callback();
				}
			};
			//货号
			let checkArticleNum=(rule, value, callback)=>{
				if(value==""){
					if(this.ruleForm.showArticleNum){						
						callback(new Error('请输入货号！'))
					}else{
						callback();
					}
				}else{
					callback();
				}
			};
			//指导单价
			let checkGuideUnitPrice=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				var unitPrice=value;
				if(unitPrice!=parseFloat(unitPrice) || unitPrice.toString().indexOf('-')>-1){
					if(this.ruleForm.showGuideUnitPrice){						
						callback(new Error('请输入正确的价格！'))
					}else{
						callback();
					}
				}else{
					callback();
				}
			};
			return {
				addBtnShow:false,
				delBtnShow:false,
				editBtnShow:false,
				roleAuthList:sessionStorage.getItem('roleAuthList'),
				fileUpload:this.$store.state.localIP+'goodsBatchImport',//文件上传地址
				fileListExcel:[],
				tableData:[],
				zipDisabled:false,
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogFlag:0,//标记
		        inputFlag:0,//表单修改标记
		        dialogTitle:'提示',
		        ruleForm:formInit(),
		        goodsName:'',//搜索商品
		        packageName:'',//搜索包
		        goodsCode:'',//搜索编码
		        goodsModel:'',//搜索型号
		        goodsBrand:'',//搜索品牌
		        addGoodsFlag:0,//新增商品标记
		        child:{
		        	goodsName:'',//父商品名称
		        },//子商品
		        rules:{
		        	goodsName:[
		        		{ required: true, message: '请输入商品名称', trigger: 'blur' }
		        	],
		        	model:[
		        		{ required: true, message: '请输入商品型号', trigger: 'blur' }
		        	],
		        	unitPrice:[
		        		{  required: true, validator: checkPrice, trigger: 'blur' }
		        	],
		        	//货号
		        	articleNum:[
		        		{  required: true, validator: checkArticleNum, trigger: 'blur' }
		        	],
		        	//指导单价
		        	guideUnitPrice:[
		        		{  required: true, validator: checkGuideUnitPrice, trigger: 'blur' }
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
		        	],
		        	goodsColor:[
		        		{ required: true, message: '请输入商品颜色', trigger: 'blur' }
		        	],
		        	units:[
		        		{ required: true, message: '请输入商品单位', trigger: 'blur' }
		        	],
		        	goodsType:[
		        		{ required: true, validator:checkGoodsType, trigger: 'blur' }
		        	],
		        	styleName:[
		        		{ required: true, message: '请输入商品风格', trigger: 'blur' }
		        	]
		        },
		        importVisible:false,
			}
		},
		mounted(){
			if(this.roleAuthList.indexOf('1')>-1){
				this.addBtnShow=true;
			}
			if(this.roleAuthList.indexOf('2')>-1){
				this.delBtnShow=true;
			}
			if(this.roleAuthList.indexOf('3')>-1){
				this.editBtnShow=true;
			}
			goodsList(this);
		},
		beforeDestroy(){
			this.dialogVisible=false;
		},
		methods:{
			//子商品
			childTable({row, rowIndex}) {
		        return 'childTableBg';
		    },
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
			    	this.$confirm('确定删除当前商品吗?', '提示', {
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
		    onExceed(){
		    	this.$message({
					message: '最多只允许上传9张',
					type: 'warning'
				});
		    },
		    onExceedImport(){
		    	this.$message({
					message: '请先删除列表文件再上传',
					type: 'warning'
				});
		    },
		    //文件上传中
		    zipProgress(event, file, fileList){
		    	//console.log(event)
		    	this.zipDisabled=true;
		    },
		    zipError(err, file, fileList){
		    	this.zipDisabled=false;
		    	//console.log(err)
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
		    //添加商品
		    addClass(){
		    	this.ruleForm=formInit();
		    	goodsTypeList(this);
		    	styleList(this);
		      	this.dialogTitle="添加商品";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		      	brandList(this,function(){});
		    },
		    //修改品牌
		    brandChange(){
		    	this.inputFlag=1;
		    	let arr=this.ruleForm.brand.split(',');
		    	let list=this.ruleForm.brandList;
		    	//console.log(list)
		    	for(let i=0;i<list.length;i++){
		    		if(list[i].brandId==parseInt(arr[0])){
		    			if(list[i].articleNum || list[i].articleNum==0){
		    				if(list[i].articleNum==0){
		    					this.ruleForm.showArticleNum=true;
		    				}else{
		    					this.ruleForm.showArticleNum=false;
		    				}
		    			}
		    			if(list[i].guideUnitPrice || list[i].guideUnitPrice==0){
		    				if(list[i].guideUnitPrice==0){
		    					this.ruleForm.showGuideUnitPrice=true;
		    				}else{
		    					this.ruleForm.showGuideUnitPrice=false;
		    				}
		    			}
		    		}
		    	}

		    },
		    //编辑
      		handleEdit(index, row) {
      			//console.log(row)
				this.ruleForm=formInit();
				goodsTypeList(this);
				styleList(this);
				this.ruleForm.inputDisabled=true;
		      	this.dialogTitle="编辑商品";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.id;
		      	var that=this;
		      	brandList(this,function(){
		      		that.ruleForm.goodsName=row.goodsName;//商品名称
				    that.ruleForm.goodsCode=row.goodsCode;//商品编码
				    that.ruleForm.model=row.model;//产品型号
				    that.ruleForm.brand=row.brandId+','+row.brandName;//商品品牌
				    that.ruleForm.unitPrice=row.unitPrice;//零售单价
				    that.ruleForm.specifications=row.specifications;//商品规格
				    that.ruleForm.material=row.material;//颜色材质
				    that.ruleForm.goodsColor=row.goodsColor;//颜色
				    that.ruleForm.units=row.units;//单位
				    that.ruleForm.package=row.packageId+','+row.packageName;//商品包
				    that.ruleForm.goodsType=row.goodsType;//商品类型
				    that.ruleForm.styleName=row.styleName.split(',');
				    that.ruleForm.articleNum=row.articleNum;//货号
				    that.ruleForm.guideUnitPrice=row.guideUnitPrice;//指导单价
				    
				    that.addGoodsFlag=0;
				    if(row.parentId){
				    	that.addGoodsFlag=row.parentId;
				    	that.child.goodsName=row.parentGoodsName;
				    }
				    let list=that.ruleForm.brandList;
			      	for(let i=0;i<list.length;i++){
				    	if(list[i].brandId==parseInt(row.brandId)){
				    		if(list[i].articleNum || list[i].articleNum==0){
				    			if(list[i].articleNum==0){
				    				that.ruleForm.showArticleNum=true;
				    			}else{
				    				that.ruleForm.showArticleNum=false;
				    			}
				    		}
				    		if(list[i].guideUnitPrice || list[i].guideUnitPrice==0){
				    			if(list[i].guideUnitPrice==0){
				    				that.ruleForm.showGuideUnitPrice=true;
				    			}else{
				    				that.ruleForm.showGuideUnitPrice=false;
				    			}
				    		}
				    	}
				    }
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
	      		this.$confirm('确定删除当前商品吗?', '提示', {
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
	      	//子商品列表
	      	childListBtn(index, row){
	      		//console.log(index,row)
	      		this.addGoodsFlag=row.goodsCode;
	      		this.ruleForm=formInit();
		    	goodsTypeList(this);
		    	styleList(this);
		      	this.dialogTitle="添加商品";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		      	var that=this;
		      	brandList(this,function(){
		      		that.child.goodsName=row.goodsName;
		      		that.ruleForm.brand=row.brandId+','+row.brandName;//商品品牌
		      		let list=that.ruleForm.brandList;
		      		for(let i=0;i<list.length;i++){
			    		if(list[i].brandId==parseInt(row.brandId)){
			    			if(list[i].articleNum || list[i].articleNum==0){
			    				if(list[i].articleNum==0){
			    					that.ruleForm.showArticleNum=true;
			    				}else{
			    					that.ruleForm.showArticleNum=false;
			    				}
			    			}
			    			if(list[i].guideUnitPrice || list[i].guideUnitPrice==0){
			    				if(list[i].guideUnitPrice==0){
			    					that.ruleForm.showGuideUnitPrice=true;
			    				}else{
			    					that.ruleForm.showGuideUnitPrice=false;
			    				}
			    			}
			    		}
			    	}
		      	});
	      	},
	      	//图片上传
		    uploadSuccess(response, file, fileList){
		    	//console.log(response)
		    	//console.log(this.ruleForm.fileList)
		    	var list=this.ruleForm.fileList;
		    	//console.log(list)
		    	var num=this.ruleForm.picNum;
		    	//console.log(num)
		    	//console.log(list[num])
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
		      		/*var packageArr=this.ruleForm.package.split(',');*/
					var data={
						goodsName:this.ruleForm.goodsName,//商品名称
				        goodsCode:this.ruleForm.goodsCode,//商品编码
				        model:this.ruleForm.model,//产品型号
				        brandId:brandArr[0],//商品品牌ID
				        brandName:brandArr[1],//商品品牌名称
				        unitPrice:this.ruleForm.unitPrice,//零售单价
				        specifications:this.ruleForm.specifications,//商品规格
				        material:this.ruleForm.material,//颜色材质
				        goodsColor:this.ruleForm.goodsColor,//颜色
				        styleName:this.ruleForm.styleName.join(','),
				        goodsType:this.ruleForm.goodsType,//颜色材质
				    	units:this.ruleForm.units,//单位
				    	/*articleNum:this.ruleForm.showArticleNum ? this.ruleForm.articleNum : '',//货号
				    	guideUnitPrice:this.ruleForm.showGuideUnitPrice ? this.ruleForm.guideUnitPrice : '',//指导单价*/
				        /*packageId:packageArr[0],//商品包ID
				        packageName:packageArr[1],//包名称*/
				        goodsImages:coverPic//图片列表
					}
					if(this.addGoodsFlag){
						data.parentId=this.addGoodsFlag;
					}
					if(this.ruleForm.showArticleNum){
						data.articleNum=this.ruleForm.articleNum;
					}
					if(this.ruleForm.showGuideUnitPrice){
						data.guideUnitPrice=this.ruleForm.guideUnitPrice;
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
		    	this.ruleForm.picNum=0;
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
			        		//console.log(2)
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
			        		//console.log(1)
			        		loading.close();
			        		var list=this.ruleForm.fileList;
			        		var coverPic='';
			      			var coverPicArr=[];
			      			for(var i=0;i<list.length;i++){
			      				coverPicArr.push(list[i].url);
			      			}
			      			coverPic=coverPicArr.join(',');
			      			var brandArr=this.ruleForm.brand.split(',');
				      		/*var packageArr=this.ruleForm.package.split(',');*/
							var data={
								goodsName:this.ruleForm.goodsName,//商品名称
						        goodsCode:this.ruleForm.goodsCode,//商品编码
						        model:this.ruleForm.model,//产品型号
						        brandId:brandArr[0],//商品品牌ID
						        brandName:brandArr[1],//商品品牌名称
						        styleName:this.ruleForm.styleName.join(','),
						        unitPrice:this.ruleForm.unitPrice,//零售单价
						        specifications:this.ruleForm.specifications,//商品规格
						        material:this.ruleForm.material,//颜色材质
						        goodsType:this.ruleForm.goodsType,//颜色材质
						      /*  packageId:packageArr[0],//商品包ID
						        packageName:packageArr[1],//包名称*/
						        goodsColor:this.ruleForm.goodsColor,//颜色
						       /*	articleNum:this.ruleForm.showArticleNum ? this.ruleForm.articleNum : '',//货号
				    			guideUnitPrice:this.ruleForm.showGuideUnitPrice ? this.ruleForm.guideUnitPrice : '',//指导单价*/
				    			units:this.ruleForm.units,//单位
						        goodsImages:coverPic//图片列表
							}

							if(this.addGoodsFlag){
								data.parentId=this.addGoodsFlag;
							}
							if(this.ruleForm.showArticleNum){
						data.articleNum=this.ruleForm.articleNum;
					}
					if(this.ruleForm.showGuideUnitPrice){
						data.guideUnitPrice=this.ruleForm.guideUnitPrice;
					}
							addGoods(this,data);	
			        	}
			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
		      	});
		    },
		    //批量导入
		    importData(){
		    	this.importVisible=true;
		    	this.fileListExcel=[];
		    },
		    onExceedChange(file, fileList){
		    	/*console.log(file)*/
		    	if(file.size>1024*1024*1024){
		    		this.$message.error('请选择1GB以内的文件上传！');
		    		this.fileListExcel=[];
		    	}
		    },
		    //上传成功
		    excelSuccess(response, file, fileList){
		    	this.zipDisabled=false;
		    	//console.log(response);
		    	if(response.retCode==0){
		    		if(response.successMsg){
		    			this.$message({
						  message:response.successMsg,
						  type: 'success'
						});
		    		}
					if(response.errorMsg){
						response.errorMsg=response.errorMsg.replace(/\<br\/\>/g,'\n');
						this.$alert(response.errorMsg, '错误信息', {
				          confirmButtonText: '确定',
				          callback: action => {
				            this.importVisible=false;
				            goodsList(this);
				            return;
				          }
				        });
					}else{
						this.importVisible=false;
					    goodsList(this);
					}					
		    	}else{
		    		this.$message.error('导入失败！');
		    	}
		    },
		    //上传
		    submitFileForm(){
		    	this.$refs.uploadZip.submit();
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
		    	this.addGoodsFlag=0;
		    },
		    //搜索
		    searchUser(){
		    	this.currentPage=1;
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
				styleList:[],
				styleName:[],
				goodsTypeList:[],//类型列表
				goodsType:'',//选择类型
				fileList:[],//图片列表
		       	goodsName:'',//商品名称
		        goodsCode:'',//商品编码
		        model:'',//产品型号
		        brand:'',//商品品牌
		        brandList:[],//品牌列表
		        unitPrice:'',//零售单价
		        specifications:'',//商品规格
		        material:'',//颜色材质
		        goodsColor:'',//商品颜色
		        units:'',//商品单位
		        package:'',//商品包
		        packageList:[],//包列表
		        picChange:0,
		        uploadData:{'token':''},//上传图片附带的token
		        picNum:0,//标记
		        inputDisabled:false,//表单禁用
		        disabled:false,
		        articleNum:'',//货号
		        guideUnitPrice:'',//指导单价
		        showArticleNum:false,//展示货号
		        showGuideUnitPrice:false//展示单价
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
			/*"packageName":obj.packageName,*/
			"goodsCode":obj.goodsCode,
			"model":obj.goodsModel,
			"brandName":obj.goodsBrand
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.goodsInfomations;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取商品列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取商品列表失败！');
		})
	}
	//删除商品
	function delGoods(obj,data){
		const loading =openLoad(obj,"Loading...");
		obj.$ajax.post(obj.$store.state.localIP+"deleteGoodsInfomation",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				if(response.data.errMsg){
					obj.$alert(response.data.errMsg, '错误信息', {
			          confirmButtonText: '确定',
			          callback: action => {
			            goodsList(this);
			          }
			        });
				}else{
					obj.$message({
					  message: '删除成功!',
					  type: 'success'
					});
				}
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
		obj.$ajax.post(obj.$store.state.localIP+'selectBrand',{brandType:2})
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
		//console.log(data)
		if(obj.dialogFlag!=0){
			data.id=obj.dialogFlag;
		}
		obj.$ajax.post(obj.$store.state.localIP+"saveGoodsInfomation",data)
		.then(response=>{
			//console.log(response)
			obj.ruleForm.disabled=false;
			if(response.data.retCode==0){
				obj.addGoodsFlag=0;
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
				obj.dialogVisible = false;//关闭弹窗
				obj.dialogFlag=0;
				goodsList(obj);
			}else{
				obj.ruleForm.picChange=0;
				obj.$message.error(response.data.retMsg);
			}
		})
		.catch((error)=>{
			obj.ruleForm.picChange=0;
			obj.ruleForm.disabled=false;
	        console.log(error)
			obj.$message.error('操作失败！');
		})
	}
	//获取类型列表
	function goodsTypeList(obj){
		obj.ruleForm.disabled=true;
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+'selectGoodsType')
		.then(res=>{
			loading.close();
			//console.log(res)
			if(res.data.retCode==0){
				obj.ruleForm.goodsTypeList=res.data.goodsTypes;
			}else{
				obj.$message.error("获取类型列表失败！");
			}
		})
		.catch(error=>{
			loading.close();
			console.log(error);
			obj.$message.error("获取类型列表失败！");
		})
	}
	//获取风格列表
	function styleList(obj){
		obj.$ajax.post(obj.$store.state.localIP+'selectStyleInfo')
		.then(res=>{
			//console.log(res)
			if(res.data.retCode==0){
				obj.ruleForm.styleList=res.data.styleInfoList;
			}else{
				obj.$message.error("获取风格列表失败！");
			}
		})
		.catch(error=>{
			console.log(error);
			obj.$message.error("获取风格列表失败！");
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
		margin-left: 20px;
		margin-top: 20px;
		width: 200px;
	}

	.filter{
		width: 100%;
		box-sizing: border-box;
	}
</style>
