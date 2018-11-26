<template>
	<div class="editGoods">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设计师</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">商品编辑</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品编辑</span>
			</div>
			<div class="line"></div>
			
			<div class="text item addPackageForm">
				<el-form label-width="85px" class="demo-ruleForm">
					
					<!--组合编辑-->
					<div class="edit_btn">
						<el-button  type="primary" @click="importGoods">导入套餐商品</el-button>
						<el-button  type="primary" @click="addGoodsFun">新增</el-button>
						<el-button  type="primary" @click="goGroup">组合</el-button>
						<el-button  type="primary" @click="removeGroup">拆分</el-button>
						<el-button  type="primary" @click="changeGoods">替换</el-button>
						<el-button  type="danger" @click="deleteGoods">删除</el-button>
					</div>
					
					<div class="packageList">
						<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="handleTabsRemove" :before-leave="handleTabsEdit">
							<el-tab-pane
							    :key="item.name"
							    v-for="(item, index) in editableTabs"
							    :label="item.packageName"
							    :name="item.packageId.toString()"
							  >
						  	</el-tab-pane>
						</el-tabs>
					</div>
					
					<div class="goodsList">
						<el-table border 
							ref="multipleTable" 
							:data="tableData" 
							:stripe="true" 
							tooltip-effect="dark" 
							style="width: 100%;" 
							@selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55" :resizable="resizable" >
							</el-table-column>
							<!--<el-table-column prop="id" :resizable="resizable"   label="ID" width="100" show-overflow-tooltip>
							</el-table-column>-->
							<el-table-column prop="packageName" :resizable="resizable"    label="套餐包" min-width="100" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="typeName" :resizable="resizable"   label="位置" width="75">
							</el-table-column>
							<el-table-column prop="species" :resizable="resizable"   label="类型" width="75">
							</el-table-column>
							<el-table-column prop="title" :resizable="resizable"   label="图片" width="150">
								<template slot-scope="props">
									<div><img :src="props.row.goodsSrc" alt="" style="width: 150px;height: auto;"/></div>
								</template>
							</el-table-column>
							<el-table-column prop="goodsCode" :resizable="resizable"   label="编号" min-width="60">
							</el-table-column>
							<el-table-column prop="goodsName" :resizable="resizable"   label="商品名称" min-width="80" show-overflow-tooltip>
								<template slot-scope="props">
									<div><span @click="editGoods(props.row)" class="hrefA">{{ props.row.goodsName }}</span></div>
								</template>
							</el-table-column>
							<el-table-column prop="material" :resizable="resizable"   label="颜色材质" width="100" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="unitPrice" :resizable="resizable"   label="单价" width="75">
							</el-table-column>
							<el-table-column prop="goodsNum" :resizable="resizable"   label="数量" width="60">
							</el-table-column>
						</el-table>
					</div>
					
					<div style="text-align: center;padding: 30px 0px;">
						<el-button  @click="goBack">返回</el-button>
						<el-button type="primary" @click="submitForm">保存</el-button>
					</div>
				</el-form>
			</div>
		</el-card>
		
		
		<!--新增商品-->
		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  title="商品"
			  :visible.sync="addGoodsVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  :before-close="handleCloseGoods"
			  >
			  	<el-form  label-width="85px" ref="addGoods" :model="addGoods" :rules="addGoodsRules" class="demo-ruleForm">
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="套餐包：" prop="selectPackage">
								<el-select v-model="addGoods.selectPackage" placeholder="请选择套餐包" v-show="this.selectGoodsType==0?'true':false" :disabled="(selectGoods.species=='商品' || selectGoods.species=='替换') ? true :false ">
									<el-option v-for="(item,key) in addGoods.packageList" :key="key" :label="item.packgeName" :value="item.packageId+','+item.packgeName+','+item.packageOrder"></el-option>
								</el-select>  
								<span v-show="selectGoodsType==1?'true':false">{{ multipleSelection.length>0 ? multipleSelection[0].packageName :'' }}</span>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="位置：" prop="selectLocation">
								<el-select v-model="addGoods.selectLocation" placeholder="请选择位置" v-show="this.selectGoodsType==0?'true':false" :disabled="(selectGoods.species=='商品' || selectGoods.species=='替换') ? true :false ">
									<el-option v-for="(item,key) in addGoods.locationList" :key="key" :label="item.typeName" :value="item.typeName+','+item.typeOrder"></el-option>
								</el-select>
								<span v-show="selectGoodsType==1?'true':false">{{ multipleSelection.length>0 ? multipleSelection[0].typeName : '' }}</span>
							</el-form-item>
						</el-col>
			  		</el-row>
			  		
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="类型：">
								单品
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="编号：">
								{{ selectGoods.goodsCode }}
							</el-form-item>
						</el-col>
			  		</el-row>
			  		
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="名称：">
								{{ selectGoods.goodsName }}
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="颜色材质：">
								{{ selectGoods.material }}
							</el-form-item>
						</el-col>
			  		</el-row>
			  		
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="规格：">
								{{ selectGoods.specifications }}
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="型号：">
								{{ selectGoods.model }}
							</el-form-item>
						</el-col>
			  		</el-row>
			  		
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="单价：">
								{{ selectGoods.unitPrice }}
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="数量：" prop="num">
								<el-input v-model="addGoods.num" :disabled="selectGoodsType==0 ? false : true"></el-input>
							</el-form-item>
						</el-col>
			  		</el-row>
				</el-form>
				<!--表单结束-->
				<span slot="footer" class="dialog-footer">
			   		 <el-button type="primary" @click="addGoodsSave('addGoods')">确定</el-button>
			   		 <el-button @click="goGoodsList" v-show="editGoodsFloag==0 ? true : false">返回</el-button>
				</span>
			</el-dialog>
			
		</div>
		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  title="商品列表"
			  :visible.sync="goodsListVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  :before-close="handleCloseGoods"
			  >
			  <!--表单开始-->
			  	<div class="dialogFilter">
			  		<el-input v-model="goodsSearch" placeholder="请输入商品名称"></el-input>
			  		<el-button type="primary" @click="searchGoods">搜索</el-button>
			  	</div>
			  	
			  	
				<el-table border 
					:data="goodsData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;">
					<el-table-column prop="goodsSrc" label="图片" min-width="75" show-overflow-tooltip>
						<template slot-scope="props">
							<img :src="props.row.goodsSrc" alt="" width="80%"/>
						</template>
					</el-table-column>
					<el-table-column prop="goodsCode" label="编号" min-width="75" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="goodsName" label="名称" min-width="75" show-overflow-tooltip>
						<template slot-scope="props">
							<div class="hrefA" @click="selectGoodsFun(props.row)">{{ props.row.goodsName }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="material" label="材质" width="80">
					</el-table-column>
					<el-table-column prop="specifications" label="规格" width="80">
					</el-table-column>
					<el-table-column prop="unitPrice" label="价格" width="80">
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
				      layout="total,prev, pager, next, jumper"
				      :total="pageTotal">
				    </el-pagination>
				</div>
				<div class="clear"></div>
			</el-dialog>
			
		</div>
		<!--组合-->
		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  title="组合"
			  :visible.sync="groupVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  >
			  <!--表单开始-->
			  	<el-form :model="goods" ref="goods" :rules="goodsRules"  label-width="85px" style="padding: 0px 60px;">
			  		<el-form-item label="图片上传" prop='pic'>
						<el-upload
						  action="https://up.qbox.me/"
						  list-type="picture-card"
						  :file-list="goods.fileList"
						  :on-remove="removePic"
						  :on-success="uploadSuccess"
						  ref="upload"
						  :on-error="uploadError"
						  :on-change="changePic"
						  :data="goods.uploadData"
						  :limit="1"
						  :on-exceed="goodsExceed"
						  :auto-upload="false">
						  <i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
			  		<el-form-item label="名称" prop='name'>
			  			<el-input v-model="goods.name"></el-input>
			  		</el-form-item>
			  		<el-form-item label="单价" prop='price'>
			  			<el-input v-model="goods.price"></el-input>
			  		</el-form-item>
			  		<el-form-item label="数量" prop='num'>
			  			<el-input v-model="goods.num"></el-input>
			  		</el-form-item>
				</el-form>
			  <!--表单结束-->
				<span slot="footer" class="dialog-footer">
			   		 <el-button type="primary" @click="goodsSubmitForm('goods')">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<!--商品套餐列表-->
		<div class="edit_dialog">
			<el-dialog
			  title="套餐方案列表"
			  :visible.sync="packageListVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  >
			  <!--表单开始-->
			  	<div class="dialogFilter">
			  		<el-row :gutter="20">
			  			<el-col :span="12">
			  				<el-select v-model="searchData.floorName" placeholder="楼盘">
							    <el-option
							      v-for="(item,key) in searchData.floorList"
							      :key="key"
							      :label="item"
							      :value="item">
							    </el-option>
							</el-select>
			  			</el-col>
			  			<el-col :span="12">
			  				<el-select v-model="searchData.houseName" placeholder="户型">
							    <el-option
							      v-for="(item,key) in searchData.houseList"
							      :key="key"
							      :label="item"
							      :value="item">
							    </el-option>
							</el-select>
			  			</el-col>
			  		</el-row>
			  		<el-row :gutter="20" style="margin-top: 20px;">
			  			<el-col :span="12">
			  				<el-select v-model="searchData.styleName" placeholder="风格">
							    <el-option
							      v-for="(item,key) in searchData.styleList"
							      :key="key"
							      :label="item"
							      :value="item">
							    </el-option>
							</el-select>
			  			</el-col>
			  			<el-col :span="12">
			  				<el-button type="primary" @click="searchPackage">搜索</el-button>
			  			</el-col>
			  		</el-row>			  		
			  	</div>
			  	
			  	
				<el-table border 
					:data="packageListData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;">
					<el-table-column prop="designName" label="方案名称" min-width="100" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="houseName" label="楼盘">
					</el-table-column>
					<el-table-column prop="houseModel" label="户型">
					</el-table-column>
					<el-table-column prop="styleName" label="风格">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
					        <el-button
					          size="mini"
					          style="margin: 5px;"
					          @click="handlePackageEdit(scope.$index, scope.row)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
				
				<!--分页-->
				<!--<div class="curPageCss">
				    <el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="currentPage"
				      :page-sizes="[5, 10, 15, 20]"
				      :page-size="pageSize"
				      layout="total,prev, pager, next, jumper"
				      :total="pageTotal">
				    </el-pagination>
				</div>-->
				<div class="clear"></div>
			</el-dialog>	
		</div>
	</div>
</template>

<script>
export default {
	name:'addDeliveryPackage',
	data(){
		//图片验证
		let checkPic=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			if(this.goods.fileList.length==0){
				callback(new Error('请上传商品图！'))
			}else{
				callback();
			}
		};
		//价格验证
		let checkPrice=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			var price=this.goods.price;
			//console.log(unitPrice)
			if(price!=parseFloat(price) || price.toString().indexOf('-')>-1){
				callback(new Error('请输入正确的价格！'))
			}else{
				callback();
			}
		};
		//数量验证
		let checkNumber=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			var num=this.goods.num;
			//console.log(unitPrice)
			if(num!=parseFloat(num) || num.toString().indexOf('-')>-1 || num==0){
				callback(new Error('请输入正确的数量！'))
			}else{
				callback();
			}
		};
		//数量验证
		let checkNum=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			var num=this.addGoods.num;
			//console.log(unitPrice)
			if(num!=parseFloat(num) || num.toString().indexOf('-')>-1 || num==0){
				callback(new Error('请输入正确的数量！'))
			}else{
				callback();
			}
		};
		//套餐包
		let checkPackage=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			var selectPackage=this.addGoods.selectPackage;
			//console.log(unitPrice)
			if(selectPackage=="" && this.selectGoodsType==0){
				callback(new Error('请选择套餐包！'))
			}else{
				callback();
			}
		};
		//位置
		let checkLocation=(rule, value, callback)=>{
			//console.log(this.ruleForm.fileList)
			var selectLocation=this.addGoods.selectLocation;
			//console.log(unitPrice)
			if(selectLocation=="" && this.selectGoodsType==0){
				callback(new Error('请选择位置信息！'))
			}else{
				callback();
			}
		};
		return{
			programmeID:'',
			editGoodsFloag:0,
			resizable:false,
			selectGroupNum:0,
			goodsSearch:'',//商品搜索
			selectGoods:{},//选中商品
			selectGoodsType:0,
			currentPage: 1,//分页当前页数
		    pageSize:10,//分页默认每页条数
		    pageTotal:0,//页数总数
			tableData:[],
			goodsData:[],//商品列表
			addGoods:initAddGoods(),
			fileList:[],//上传图片列表
			dialogTitle:'新增描述',//弹窗标题
			groupVisible:false,//组合弹窗
			addGoodsVisible:false,//新增商品
			goodsListVisible:false,//商品列表弹窗
			multipleSelection: [],//多选
			inputFlag:0,//表单修改标记
			uploadData:{'token':''},
			uploadPic:"https://up.qbox.me/",//图片上传
			goods:initGoods(),
			editableTabsValue: '',//tab值
			editableTabs: [],//tab数组
			packageListVisible:false,//套餐方案弹窗
			packageListData:[],//套餐方案数据
			searchData:{
				floorName:'',//楼盘名
				floorList:[],//楼盘列表
				houseName:'',//户型名
				houseList:[],//户型列表
				styleName:'',//风格名
				styleList:[]
			},
			form:{
				areaType:'',//区域类型
				desc:'',//区域描述
				picurl:''
			},
			rules:{},
			goodsRules:{
				name:[
		        		{ required: true, message: '请输入商品名称', trigger: 'blur' }
		        ],
		        price:[
		        	{ required: true, validator: checkPrice, trigger: 'blur' }
		        ],
		        num:[
		        	{ required: true, validator: checkNumber, trigger: 'blur' }
		        ],
		        pic:[
		        	{  required: true, validator: checkPic, trigger: 'blur' }
		        ]
			},
			addGoodsRules:{
				selectPackage:[
		        		{ required: true, validator: checkPackage, trigger: 'blur' }
		        ],
		        selectLocation:[
		        	{ required: true, validator: checkLocation, trigger: 'blur' }
		        ],
		        num:[
		        	{ required: true, validator: checkNum, trigger: 'blur' }
		        ]
			}
		}
	},
	//挂载
	mounted(){
		let obj=this;
		//let Base64=new Base64();
		if(this.$route.params.code){			
			this.programmeID=this.$route.params.code;
		}else{
			window.history.go(-1);
		}
		
		goodsList(obj);//获取商品列表
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
		//导入套餐商品
		importGoods(){
			this.packageListVisible=true;
			const loading =openLoad(this);
			this.$ajax.post(this.$store.state.localIP+'designInfoConditionList',{})
			.then(res=>{
				//console.log(res)
				this.searchData.houseList=res.data.houseModelList || [];
				this.searchData.floorList=res.data.houseNameList || [];
				this.searchData.styleList=res.data.styleNameList || [];
				loading.close();
			})
			.catch((error)=>{
				loading.close();
				console.log(error);
				this.$message.error("网络连接错误~~");
			})
		},
		//搜索套餐包
		searchPackage(){
			let data={
				"styleName":this.searchData.styleName,
				"houseModel":this.searchData.houseName,
				"houseName":this.searchData.floorName
			}	
			const loading =openLoad(this);
			this.$ajax.post(this.$store.state.localIP+'queryDesignInfoList',data)
			.then(res=>{
				//console.log(res)
				this.packageListData=res.data.list || [];
				loading.close();
			})
			.catch((error)=>{
				loading.close();
				console.log(error);
				this.$message.error("网络连接错误~~");
			})
		},
		//选择套餐包
		handlePackageEdit(index, row){
			//console.log(row.designId)
			const loading =openLoad(this);
			this.$ajax.post(this.$store.state.localIP+'queryGoodsDesignList',{designId:row.designId,type:'1'})
			.then(response=>{
				//console.log(response);
				this.editableTabs=response.data.goodsList;
				var list=response.data.goodsList;
				loading.close();
				for(var i=0;i<list.length;i++){
					for(var j=0;j<list[i].goodsInfos.length;j++){
						list[i].goodsInfos[j].indexId=i;
						if(list[i].goodsInfos[j].goodsImages){
							if(list[i].goodsInfos[j].goodsImages.indexOf(',')>-1){
								var arr=list[i].goodsInfos[j].goodsImages.split(',');
								list[i].goodsInfos[j].goodsSrc=arr[0];
							}else{
								list[i].goodsInfos[j].goodsSrc=list[i].goodsInfos[j].goodsImages;
							}
						}
					}
				}
				if(list.length>0){
					this.tableData=list[0].goodsInfos;
					this.editableTabsValue=list[0].packageId.toString();
				}
				this.packageListVisible=false;
			})
			.catch((error)=>{
				loading.close();
				console.log(error);
				this.$message.error("网络连接错误~~");
			})
			
		},
		//tabs
		handleTabsEdit(activeName, oldActiveName) {
		 	//console.log(activeName);
		 	let list=this.editableTabs;
		 	for(let i=0;i<list.length;i++){
		 		if(list[i].packageId==activeName){
		 			this.tableData=sortData(list[i].goodsInfos);
		 		}
		 	}
		},
		//删除tabs
		handleTabsRemove(name){
			let list=this.editableTabs;
			this.editableTabs=[];
			//console.log(name)
			this.$confirm('确定删除当前套餐包吗?', '提示', {
		      	confirmButtonText: '确定',
		      	cancelButtonText: '取消',
	        	type: 'warning'
	        })
	      	.then(_ => {
		        let newList=[];
			 	for(let i=0;i<list.length;i++){
			 		if(list[i].packageId!=name){
			 			newList.push(list[i]);
			 		}
			 	}
			 	
			 	this.editableTabs=newList;
			 	if(newList.length>0){
			 		this.editableTabsValue=this.editableTabs[0].packageId.toString();
			 	}else{
			 		this.editableTabs=[];
			 		this.tableData=[];
			 	}
		    })
		    .catch((e) => {
		    	console.log(e)
		    	this.editableTabs=list;
		    });
		},
		//分页方法
		handleSizeChange(val) {
		  //console.log(`每页 ${val} 条`);
		  this.pageSize=val;
		  goodsListAll(this);
		},
		handleCurrentChange(val) {
		  //console.log(`当前页: ${val}`);
		  this.currentPage=val;
		  goodsListAll(this);
		},
		uploadError(err, file, fileList){
	    	this.$message.error("图片上传失败");
	    	console.log(err);
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
	    	//console.log(val)	
	        this.multipleSelection = val;
	    },
		//返回
      	goBack(){
      		window.history.go(-1);
      	},
      	
      	//提交
      	submitForm() {
      		let listAll=[];
		    let list=this.editableTabs;
		    for(let i=0;i<list.length;i++){
		    	listAll=listAll.concat(list[i].goodsInfos);
		    }
		    let data={
		    	"designGoodsArray":listAll,
		        'designId':this.programmeID
		    }
		    addPackage(this,data);
      	},
      	
      	//拆分组合
      	removeGroup(){
      		if(this.multipleSelection.length!=1){
				this.$message({
				   	showClose: true,
				   	message: '请选择一个需要拆分的商品！',
				   	type: 'warning'
				});
				return;
			}
      		if(this.multipleSelection.length>0){
      			if(this.multipleSelection[0].species!='组合'){
      				this.$message({
					   	showClose: true,
					   	message: '请选择组合的商品！',
					   	type: 'warning'
					});
					return;	
      			}
			}
			
			this.$confirm('确定拆分所选组合吗?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		    	var list=this.multipleSelection;
				var listAll=this.tableData;
		    	for(var i=0;i<listAll.length;i++){
					if(listAll[i].indexId==list[0].indexId){
						this.tableData.splice(i,1);
					}
					if(listAll[i].groupId==list[0].indexId){
						this.tableData[i].groupId=null;
						this.tableData[i].species='单品';
					}
				}
		    	console.log(this.tableData)
		    	this.tableData=sortData(this.tableData);
		    	console.log(this.tableData)
		    	this.$refs.multipleTable.clearSelection();
		    }).catch((e) => {
		    	console.log(e)
		      	this.$message({
		        	type: 'info',
		        	message: '已取消操作'
		      	});          
		    });
			
      	},
      	//拆分组合
      	removeGroup(){
      		if(this.multipleSelection.length!=1){
				this.$message({
				   	showClose: true,
				   	message: '请选择一个需要拆分的商品！',
				   	type: 'warning'
				});
				return;
			}
      		if(this.multipleSelection.length>0){
      			if(this.multipleSelection[0].species!='组合'){
      				this.$message({
					   	showClose: true,
					   	message: '请选择组合的商品！',
					   	type: 'warning'
					});
					return;	
      			}
			}
			
			this.$confirm('确定拆分所选组合吗?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		    	var list=this.multipleSelection;
				var listAll=this.tableData;
		    	for(var i=0;i<listAll.length;i++){
					if(listAll[i].indexId==list[0].indexId){
						this.tableData.splice(i,1);
					}
					if(listAll[i].groupId==list[0].indexId){
						this.tableData[i].groupId=null;
						this.tableData[i].species='单品';
					}
				}
		    	//console.log(this.tableData)
		    	this.tableData=sortData(this.tableData);
		    	var tabs=this.editableTabs
				for(let i=0;i<tabs.length;i++){
					if(tabs[i].packageId==this.editableTabsValue){
						tabs[i].goodsInfos=this.tableData;
					}
				}
		    	//console.log(this.tableData)
		    	this.$refs.multipleTable.clearSelection();
		    }).catch((e) => {
		    	console.log(e)
		      	this.$message({
		        	type: 'info',
		        	message: '已取消操作'
		      	});          
		    });
			
      	},
      	//去组合
      	goGroup(){
      		var list=this.multipleSelection;
      		
      		if(list.length<=1){
      			this.$message({
				    showClose: true,
				    message: '请选择至少2个要组合的商品！',
				    type: 'warning'
				});
				return;
      		}
      		for(var i=0;i<list.length;i++){
      			if(list[i].species=="商品"){
      				this.$message({
					    showClose: true,
					    message: '请选择单品进行组合！',
					    type: 'warning'
					});
					return;
      			}
      		}
      		var packageId=list[0].packageId;
      		for(var i=0;i<list.length;i++){
      			if(list[i].packageId!=packageId){
      				this.$message({
					    showClose: true,
					    message: '请选择相同套餐包下的商品进行组合！',
					    type: 'warning'
					});
					return;
      			}
      		}
      		var listAll=this.tableData;
      		var typeName=list[0].typeName;
      		var flag=0;//标记
      		var num=0;
      		var packageIdArr=[];
      		for(var i=0;i<list.length;i++){
      			if(packageIdArr.indexOf(parseInt(list[i].packageId))==-1){
      				for(var j=0;j<listAll.length;j++){
	      				if(listAll[j].species!="组合" && listAll[j].packageId==list[i].packageId){
	      					//console.log(list[i].packageId)
	      					num++;
	      				}
	      			}
      				packageIdArr.push(parseInt(list[i].packageId));
      				//console.log(packageIdArr)
      			}
      			if(list[i].typeName!=typeName){
      				flag=1;
      			}
      		}
      		//console.log(num)
      		if(flag){
      			if(list.length!=num){
	      			this.$message({
					    showClose: true,
					    message: '跨空间商品需要全选当前套餐包所有商品！',
					    type: 'warning'
					});
					return;
	      		}
      		}
      		
      		var speciesNum=0;
      		var speciesGroupId=0;
      		for(var i=0;i<list.length;i++){
      			if(list[i].species=="组合"){
      				speciesNum+=1;
      				speciesGroupId=list[i].indexId;
      			}
      		}
      		if(speciesNum>1){
      			this.$message({
				    showClose: true,
				    message: '请选择一个组合进行组合操作！',
				    type: 'warning'
				});
				return;
      		}
      		if(speciesNum==1){
      			for(var i=0;i<list.length;i++){
	      			if(list[i].species=="单品"){
	      				for(var j=0;j<listAll.length;j++){
	      					if(list[i].indexId==listAll[j].indexId){
	      						listAll[j].species="商品";
	      						listAll[j].groupId=speciesGroupId;
	      					}
	      				}
	      			}
	      		}
      			this.tableData=sortData(listAll);
      			var tabs=this.editableTabs
				for(let i=0;i<tabs.length;i++){
					if(tabs[i].packageId==this.editableTabsValue){
						tabs[i].goodsInfos=this.tableData;
					}
				}
      		}else{
      			this.goods=initGoods();
      			this.groupVisible=true;
      		}
      	},
      	//商品图片上传
      	goodsExceed(){
      		this.$message({
				message: '前先删除图片在进行上传操作',
				type: 'warning'
			});
      	},
      	//改变图片
		changePic(file, fileList){
			this.goods.fileList=[];
			this.goods.fileList=fileList;
			this.goods.picChange=1;
		},
		//移除图片
		removePic(file, fileList){
			this.goods.fileList=[];
			this.goods.fileList=fileList;
			this.goods.picChange=1;
			this.goods.picNum=0;
		},
		//图片上传
		uploadSuccess(response, file, fileList){		
			var list=this.goods.fileList;
			var num=this.goods.picNum;
			list[num].url=this.$store.state.qiniuUrl+response.key;
			num++;
			this.goods.picNum=num;
			var len=fileList.length;
	    	if(len==num){
	    		var coverPic='';
	    		var coverPicArr=[];
	    		for(var i=0;i<list.length;i++){
	    			coverPicArr.push(list[i].url);
	    		}
	    		coverPic=coverPicArr.join(',');
				if(this.selectGroupNum==-1){
		    		var chirld={
		    			indexId:this.tableData.length,
		    			goodsImages:coverPic,
		    			goodsSrc:coverPicArr[0],
		    			goodsName:this.goods.name,
		    			unitPrice:this.goods.price,
		    			goodsNum:this.goods.num,
		    			packageId:this.multipleSelection[0].packageId,
		    			packageName:this.multipleSelection[0].packageName,
		    			typeName:this.multipleSelection[0].typeName,
		    			species:'组合',
		    			designId:this.multipleSelection[0].designId,
		    			roomId:this.multipleSelection[0].roomId,
		    			packageOrder:this.multipleSelection[0].packageOrder,
		    			typeOrder:this.multipleSelection[0].typeOrder
		    		}
		    		var list=this.multipleSelection;
					var listAll=this.tableData;
					for(var i=0;i<list.length;i++){
						for(var j=0;j<listAll.length;j++){
							if(listAll[j].indexId==list[i].indexId){
								this.tableData[j].groupId=chirld.indexId;
								this.tableData[j].species='商品';
							}
						}
					}
		    		this.tableData.push(chirld);
		    		//console.log(this.tableData)
		    		this.tableData=sortData(this.tableData);
		    		//console.log(this.tableData)
		    	}else{
					var index=this.selectGroupNum;	
					this.tableData[index].unitPrice=this.goods.price;
					this.tableData[index].goodsName=this.goods.name;
					this.tableData[index].goodsNum=this.goods.num;
					this.tableData[index].goodsImages=coverPic;
					this.tableData[index].goodsSrc=coverPicArr[0];
					//console.log(coverPic)
					this.selectGroupNum=-1;
		    	}
	    		this.groupVisible=false;
	    		this.$refs.multipleTable.clearSelection();
	    		this.goods.picChange=0;
	    	}
		},
		//图片上传
		goodsSubmitForm(formName) {
		  	this.$refs[formName].validate((valid) => {
		        if (valid) {
		        	if(this.goods.fileList.length==0){
						this.$message({
							message: '请上传商品图',
							type: 'warning'
						});
						return;
					}
		        	const loading =openLoad(this,"Loading...");
		        	if(this.goods.picChange){
			        	this.$ajax.post(this.$store.state.localIP+'qiNiuToken',{})
					    .then((response)=>{
					    	//console.log(response);
					    	loading.close();
					    	if(response.data.retCode==0){
					    		var qiniutoken=response.data.token;
					    		this.goods.uploadData.token=response.data.token;
					    		//console.log(this.uploadData)
					    		//上传图片信息
					    		this.$refs.upload.submit();
					    	}else{
					    		loading.close();
					    		this.$message.error('获取token失败！');
					    	}
					    	
					    })
					    .catch((error)=>{
					    	console.log(error)
					    	loading.close();
							this.$message.error('获取token失败！');
						})
					}else{
						loading.close();
						var index=this.selectGroupNum;	
						this.tableData[index].unitPrice=this.goods.price;
						this.tableData[index].goodsName=this.goods.name;
						this.tableData[index].goodsNum=this.goods.num;
						this.tableData[index].goodsImages=this.goods.fileList[0].url;
						this.selectGroupNum=-1
						this.groupVisible=false;
						this.goods.picChange=0;
					}
		        } else {
		          	this.$message.error('表单提交失败！');
		          	return false;
		        }
		  	});
		},
		//搜索商品
		searchGoods(){
			this.currentPage=1;
			goodsListAll(this)
		},
		//选择商品
		selectGoodsFun(val){
			//console.log(val)
			queryGoodsPackageList(this);
			querySpaceInfo(this,function(){});
			this.addGoods=initAddGoods();
			this.goodsListVisible=false;
			this.addGoodsVisible=true;
			//console.log(val)	
			this.selectGoods=val;
			//console.log(this.selectGoods)
			if(this.selectGoodsType==1){
				var list=this.multipleSelection;
				this.addGoods.num=list[0].goodsNum || '1';
			}
			if(val.packageId){				
				this.addGoods.selectPackage=val.packageId+','+val.packageName+','+val.packageOrder
			}
		},
		//新增商品
		addGoodsFun(){
			this.selectGoodsType=0;
			this.editGoodsFloag=0;
			this.goodsSearch='';
			this.goodsData=[];
			this.pageTotal=0;
			//goodsListAll(this);
			this.goodsListVisible=true;
		},
		//替换商品
		changeGoods(){
			var list=this.multipleSelection;
			if(this.multipleSelection.length!=1){
				this.$message({
				   	showClose: true,
				   	message: '请选择一个需要替换的商品！',
				   	type: 'warning'
				});
				return;
			}
			for(var i=0;i<list.length;i++){
      			if(list[i].species=="组合" || list[i].species=="替换"){
      				this.$message({
					    showClose: true,
					    message: '请选择单品或者子商品进行替换！',
					    type: 'warning'
					});
					return;
      			}
      		}
			this.goodsSearch='';
			this.goodsData=[];
			this.pageTotal=0;
			this.selectGoodsType=1;
			//goodsListAll(this);
			this.goodsListVisible=true;
		},
		handleCloseGoods(done){
      		this.selectGoodsType=0;
      		this.editGoodsFloag=0;
      		done();
      	},
      	handleClosePackage(done){
      		this	
      	},
		//返回
		goGoodsList(){
			this.addGoodsVisible =false;
			this.goodsListVisible=true;
		},
		//删除商品
		deleteGoods(){
			if(this.multipleSelection.length==0){
				this.$message({
				   	showClose: true,
				   	message: '请选择要删除的商品！',
				   	type: 'warning'
				});
				return;
			}
			this.$confirm('确定删除所选商品吗?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		    	var list=this.multipleSelection;
				var listAll=this.tableData;
				for(var i=0;i<list.length;i++){
					for(var j=0;j<listAll.length;j++){
						if(list[i].indexId==listAll[j].groupId){
							list.push(listAll[j]);
						}
					}
				}
				
				for(var i=0;i<list.length;i++){
					for(var j=0;j<listAll.length;j++){
						if(list[i].indexId==listAll[j].indexId){
							this.tableData.splice(j,1);
						}
					}
				}
				
				this.tableData=sortData(this.tableData);
				var tabs=this.editableTabs
				for(let i=0;i<tabs.length;i++){
					if(tabs[i].packageId==this.editableTabsValue){
						tabs[i].goodsInfos=this.tableData;
					}
				}
		    }).catch((e) => {
		    	console.log(e)
		      	this.$message({
		        	type: 'info',
		        	message: '已取消删除'
		      	});          
		    });
		},
		//添加商品
		addGoodsSave(formName){
			this.$refs[formName].validate((valid) => {
			    if (valid) {
			    	var tabs=this.editableTabs;
					var listAll=this.tableData;
					var child=this.selectGoods;
					var selectList=this.multipleSelection;
					if(this.editGoodsFloag==0){
						if(this.selectGoodsType==0){
							if(this.addGoods.selectPackage){
								var selectPackageArr=this.addGoods.selectPackage.split(',');
								child.packageName=selectPackageArr[1];
								child.packageId=selectPackageArr[0];
								child.packageOrder=selectPackageArr[2];
							}
							if(this.addGoods.selectLocation){
								var selectLocationArr=this.addGoods.selectLocation.split(',');
								child.typeName=selectLocationArr[0];
								child.typeOrder=selectLocationArr[1]
							}
						}else{
							child.packageName=selectList[0].packageName || '';
							child.packageId=selectList[0].packageId || '';
							child.typeName=selectList[0].typeName || '';
							child.designId=selectList[0].designId || '';
				    		child.roomId=selectList[0].roomId || '';
				    		if(selectList[0].groupId || selectList[0].groupId==0){
				    			child.groupId=selectList[0].groupId
				    		}
				    		child.replaceId=selectList[0].indexId;
				    		child.packageOrder=selectList[0].packageOrder;
				    		child.typeOrder=selectList[0].typeOrder;
						}
						if(this.addGoods.num){
							child.goodsNum=this.addGoods.num;
						}
						child.species='单品';
						if(child.goodsImages.indexOf(',')>-1){
							var arr=child.goodsImages.split(',');
							child.goodsSrc=arr[0];
						}else{
							child.goodsSrc=child.goodsImages;
						}
						if(this.selectGoodsType==0){
							var typeFlag=[];
							var groupId='';
							for(var i=0;i<listAll.length;i++){
								if(listAll[i].packageId==child.packageId){
									if(listAll[i].groupId || listAll[i].groupId==0 || listAll[i].species=="组合"){
										typeFlag.push(1);
										groupId=listAll[i].groupId;
									}else{
										typeFlag.push(0);
									}
								}
							}
							//console.log(listAll)
							//console.log(typeFlag)
							if(typeFlag.length>0){
								if(typeFlag.indexOf(0)==-1){
									for(var i=0;i<listAll.length;i++){
										if(listAll[i].groupId==groupId){
											if(listAll[i].typeName!=child.typeName && listAll[i].packageId==child.packageId){
												child.groupId=groupId;
												child.species='商品';
											}
										}
									}
								}	
							}
							var locationFlag=[];
							var locationGroup='';
							for(var i=0;i<listAll.length;i++){
								if(listAll[i].typeName==child.typeName){
									if(listAll[i].groupId || listAll[i].groupId==0 || listAll[i].species=="组合"){
										locationGroup=listAll[i].groupId;
										locationFlag.push(1);
									}else{
										locationFlag.push(0);
									}
								}
							}
							if(locationFlag.indexOf(0)==-1 && locationFlag.length>0){
								child.groupId=locationGroup;
								child.species='商品';
							}
							//console.log(child)
							//this.tableData.push(child);
							child.indexId=this.tableData.length;
							var emptyFlag=0;
							for(let i=0;i<tabs.length;i++){
						 		if(tabs[i].packageId==child.packageId){
						 			emptyFlag=1;
						 			tabs[i].goodsInfos.push(child);
						 		}
						 	}
							if(emptyFlag==0){
								var info={
									packageName:child.packageName,
									packageId:child.packageId,
									goodsInfos:[child]
								}
								tabs.push(info);
							}
							this.editableTabsValue=child.packageId.toString();
							this.editableTabs=tabs;
							for(let i=0;i<tabs.length;i++){
						 		if(tabs[i].packageId==this.editableTabsValue){
						 			this.tableData=sortData(tabs[i].goodsInfos);
						 		}
						 }
							this.selectGoods={};
						}else{
							child.species="替换";
							/*for(var i=0;i<listAll.length;i++){
								if(listAll[i].indexId==selectList[0].indexId){
									//console.log(i,listAll[i].indexId)
									this.tableData.splice(i+1,0,child);
									break;
								}
							}*/
							child.indexId=this.tableData.length;
							var emptyFlag=0;
							for(let i=0;i<tabs.length;i++){
						 		if(tabs[i].packageId==child.packageId){
						 			emptyFlag=1;
						 			tabs[i].goodsInfos.push(child);
						 		}
						 	}
							if(emptyFlag==0){
								var info={
									packageName:child.packageName,
									packageId:child.packageId,
									goodsInfos:child
								}
								tabs.push(info);
							}
							for(let i=0;i<tabs.length;i++){
						 		if(tabs[i].packageId==this.editableTabsValue){
						 			this.tableData=sortData(tabs[i].goodsInfos);
						 		}
						 	}
						}
						this.editableTabs=tabs;
						//console.log(child)
				   	}else{
				   		for(var i=0;i<listAll.length;i++){
							if(listAll[i].indexId==selectList[0].indexId){
								var arr=this.addGoods.selectPackage.split(',');
								this.tableData[i].packageId=arr[0];
								this.tableData[i].packageName=arr[1];
								this.tableData[i].packageOrder=arr[2];
								if(this.addGoods.selectLocation){
									var selectLocationArr=this.addGoods.selectLocation.split(',');
									this.tableData[i].typeName=selectLocationArr[0];
									this.tableData[i].typeOrder=selectLocationArr[1]
								}
								this.tableData[i].goodsNum=this.addGoods.num;
								this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true);
								break;
							}
						}
				   		//console.log(this.tableData)
				   		
				   		this.editGoodsFloag=0;
				   	}
				   	this.tableData=sortData(this.tableData);
				   	
				   	
				   	for(let i=0;i<tabs.length;i++){
				 		if(tabs[i].packageId==this.editableTabsValue){
				 			tabs[i].goodsInfos=this.tableData;
				 		}
				 	}
				   	this.editableTabs=tabs;
				   	//console.log(this.tableData)
				   	this.$refs.multipleTable.clearSelection();
					this.addGoodsVisible=false;
				}else{
			        this.$message.error('表单提交失败！');
			        return false;
			    }
			})
		},
		//编辑商品
		editGoods(val){
			this.editGoodsFloag=1;
			//console.log(val)
			queryGoodsPackageList(this);
			querySpaceInfo(this,function(){});
			this.multipleSelection=[val];
			this.selectGoods=val;
			if(val.species=='单品' || val.species=='商品'){
				this.addGoodsVisible=true;
				this.addGoods.selectPackage=val.packageId+','+val.packageName+','+val.packageOrder;
				this.addGoods.selectLocation=val.typeName+','+val.typeOrder;
				this.addGoods.num=val.goodsNum;
			}
			if(val.species=='替换'){
				this.selectGoodsType=0;
				this.addGoodsVisible=true;
				this.addGoods.selectPackage=val.packageId+','+val.packageName+','+val.packageOrder;
				this.addGoods.selectLocation=val.typeName+','+val.typeOrder;
				this.addGoods.num=val.goodsNum;
			}
			if(val.species=='组合'){
				//console.log(val)
				this.goods.picChange=0;
				this.selectGroupNum=val.indexId;
				this.groupVisible=true;
				this.goods.fileList=[{name:'pic',url:val.goodsSrc}];
				this.goods.name=val.goodsName;
				this.goods.price=val.unitPrice;
				this.goods.num=val.goodsNum;
			}
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

//新增套餐
function addPackage(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'saveDesigngoodsInfo',data)
	.then(response=>{
		loading.close();
		if(response.data.retCode==0){
            obj.$message({
				message: '套餐新增成功!',
				type: 'success'
			});
			obj.$router.push({path:'/designer/programme'})
        }else{
           	obj.$message.error(response.data.retMsg);
        }
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}


//获取商品列表
function goodsList(obj){
	
	let loading=obj.$loading({
       	lock: true,
      	text: '获取商品列表',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	obj.$ajax.post(obj.$store.state.localIP+'queryGoodsDesignList',{designId:obj.programmeID})
	.then(response=>{
		//console.log(response);
		obj.editableTabs=response.data.goodsList;
		var list=response.data.goodsList;
		loading.close();
		for(var i=0;i<list.length;i++){
			for(var j=0;j<list[i].goodsInfos.length;j++){
				list[i].goodsInfos[j].indexId=i;
				if(list[i].goodsInfos[j].goodsImages){
					if(list[i].goodsInfos[j].goodsImages.indexOf(',')>-1){
						var arr=list[i].goodsInfos[j].goodsImages.split(',');
						list[i].goodsInfos[j].goodsSrc=arr[0];
					}else{
						list[i].goodsInfos[j].goodsSrc=list[i].goodsInfos[j].goodsImages;
					}
				}
			}
		}
		if(list.length>0){
			obj.tableData=list[0].goodsInfos;
			obj.editableTabsValue=list[0].packageId.toString();
		}
		
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
function initGoods(){
	var data={
		fileList:[],//图片列表
		uploadData:{'token':''},//上传图片附带的token
		picChange:0,
		name:'',//名称
		price:'',//单价
		picNum:0,//标记
		num:1//数量
	}
	return data;
}
//获取商品列表
function goodsListAll(obj){
	//console.log(obj.currentPage)
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"queryGoodsInfomation",{
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"goodsName":obj.goodsSearch
	})
	.then(response=>{
		loading.close();
		//console.log(response)
		if(response.data.retCode==0){
			var list=response.data.goodsInfomations;
			//console.log(list)
			obj.pageTotal=response.data.countNum;
			for(var i=0;i<list.length;i++){
				if(list[i].goodsImages.indexOf(',')>-1){
					var arr=list[i].goodsImages.split(',');
					list[i].goodsSrc=arr[0];
				}else{
					list[i].goodsSrc=list[i].goodsImages;
				}	
			}
			obj.goodsData=list;
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
function initAddGoods(){
	var data={
				packageList:[],//套餐包列表
				selectPackage:'',//选中套餐包
				selectLocation:'',//选中位置
				locationList:[],//位置列表
				num:1//数量
			}
	return data;
}
//获取套餐包列表
function queryGoodsPackageList(obj){
	//console.log(obj.currentPage)
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"queryGoodsPackageList")
	.then(response=>{
		loading.close();
		//console.log(response)
		if(response.data.retCode==0){
			obj.addGoods.packageList=response.data.goodsPackages;
		}else{
			obj.$message.error('获取套餐包列表失败！');
		}
	})
	.catch((error)=>{
		loading.close();
        console.log(error)
		obj.$message.error('获取套餐包列表失败！');
	})
}
//获取位置列表
function querySpaceInfo(obj,callback){
	//console.log(obj.currentPage)
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"querySpaceInfo")
	.then(response=>{
		loading.close();
		//console.log(response)
		if(response.data.retCode==0){
			obj.addGoods.locationList=response.data.spaces;
			callback();
		}else{
			obj.$message.error('获取位置列表失败！');
		}
	})
	.catch((error)=>{
		loading.close();
        console.log(error)
		obj.$message.error('获取位置列表失败！');
	})
}
//排序
function sortData(list){
	//console.log(list)
	var arr=[];
	var arrRe=[];
	for(var i=0;i<list.length;i++){
		if(list[i].replaceId || list[i].replaceId ==0){
			arrRe.push(list[i]);
		}else{
			arr.push(list[i]);
		}
	}
	
	for(var i=0;i<arrRe.length;i++){
		for(var j=0;j<arr.length;j++){
			if(arrRe[i].replaceId==arr[j].indexId){
				//console.log(arrRe[i].replaceId)
				arr.splice(j+1,0,arrRe[i]);
				break;
			}
		}
	}
	arr=packageSort(arr);
	arr=locationSort(arr);
	var newArr=[];
	for(var x=0;x<arr.length;x++){
		arr[x].lastIndex=arr[x].indexId;
		newArr.push(arr[x].indexId)
		arr[x].indexId=x;
	}
	
	for(var i=0;i<arr.length;i++){
		if(arr[i].groupId || arr[i].groupId==0){
			var index=newArr.indexOf(arr[i].groupId);
			arr[i].groupId = index;
		}
	}
	
	arr=groupSort(arr);
	var newArr=[];
	for(var x=0;x<arr.length;x++){
		arr[x].lastIndex=arr[x].indexId;
		newArr.push(arr[x].indexId)
		arr[x].indexId=x;
	}
	
	for(var i=0;i<arr.length;i++){
		if(arr[i].groupId || arr[i].groupId==0){
			var index=newArr.indexOf(arr[i].groupId);
			arr[i].groupId = index;
		}
	}
	for(var i=1;i<arr.length;i++){
		if(arr[i].replaceId){
			if(arr[i-1].replaceId){
				arr[i].replaceId=arr[i-1].replaceId;
			}else{
				arr[i].replaceId=i-1;
			}
		}
	}
	return arr;
}
//套餐包  排序
function packageSort(arr){
	
	var newArr=[];
	var sortArr=[];
	for(var i=0;i<arr.length;i++){
		newArr.push(arr[i].packageOrder);
	}
	newArr=duplicate(newArr);
	newArr.sort();
	//console.log(newArr)
	for(var i=0;i<newArr.length;i++){
		for(var j=0;j<arr.length;j++){
			if(arr[j].packageOrder==newArr[i]){
				sortArr.push(arr[j])
			}
		}
	}
	//console.log(sortArr)
	return sortArr;
}
//位置排序
function locationSort(arr){
	var newArr=[];
	var sortArr=[];
	var num=0;
	for(var i=0;i<arr.length;i++){
		newArr.push(arr[i].packageOrder);
	}
	newArr=duplicate(newArr);
	for(var i=0;i<newArr.length;i++){
		var typeArr=[];
		var typeOrderArr=[];
		for(var j=0;j<arr.length;j++){
			if(arr[j].packageOrder==newArr[i]){
				typeOrderArr.push(arr[j].typeOrder);
				typeArr.push(arr[j]);
			}
		}
		typeOrderArr=duplicate(typeOrderArr);
		typeOrderArr.sort();
		for(var x=0;x<typeOrderArr.length;x++){
			for(var y=0;y<typeArr.length;y++){
				if(typeArr[y].typeOrder==typeOrderArr[x]){
					sortArr.push(typeArr[y])
				}
			}
		}
	}
	return sortArr;
}
//组合排序
function groupSort(arr){
	var saaa=arr;
	//console.log(saaa)
	var newArr=[];
	var sortArr=[];
	var flagArr=[];
	for(var i=0;i<arr.length;i++){
		if(arr[i].groupId || arr[i].groupId==0){			
			newArr.push(arr[i].groupId);
		}
	}
	newArr=duplicate(newArr);
	for(var i=0;i<arr.length;i++){
		if(newArr.indexOf(arr[i].indexId)>-1){
			if(flagArr.indexOf(arr[i].indexId)==-1){
				sortArr.push(arr[i]);
				for(var y=0;y<arr.length;y++){
					if(arr[y].groupId==arr[i].indexId){
						sortArr.push(arr[y]);
					}
				}
				flagArr.push(arr[i].indexId);
			}
		}else{
			if(flagArr.indexOf(arr[i].groupId)==-1){
				//console.log(1)
				if(arr[i].groupId || arr[i].groupId==0){
					for(var j=0;j<arr.length;j++){
						if(arr[j].indexId==arr[i].groupId){
							sortArr.push(arr[j]);
						}
					}
					for(var x=0;x<arr.length;x++){
						if(arr[x].groupId==arr[i].groupId){
							sortArr.push(arr[x]);
						}
					}
					flagArr.push(arr[i].groupId);	
				}else{
					sortArr.push(arr[i]);
				} 
			}
		}
	}
	//console.log(sortArr)
	return sortArr;
}
//去重
function duplicate(arr){
	var newArr=[];
	for(var i=0;i<arr.length;i++){
		arr[i]=parseInt(arr[i]);
		if(newArr.indexOf(arr[i])==-1){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

</script>

<style scoped>
	.packageList{
		margin-top: 20px;
	}
	.edit_btn{
		margin-top: 30px;
		text-align: right;
	}
	.el-select,.el-input{
		max-width: 200px;
	}
	.widthLager .el-input{
		width: 300px;
		max-width: 300px;
	}
	.picList{
		width: 100%;
	}
	.el-textarea{
		max-width: 400px;
	}
	.picList ul li{
		width: 25%;
		height: auto;
		/*height: 160px;*/
		float: left;
		/*overflow: hidden;*/
		margin-top: 20px;
	}
	.picList ul li img:hover{
		/*border: 1px solid rgb(255, 208, 75);*/
	}
	.picList ul li img{
		width: 90%;
		height: auto;
		display: block;
		margin: 0 auto;
		cursor: pointer;
		box-sizing: border-box;
	}
	.addPackageForm .el-button{
		width: 200px;
		margin-top: 30px;
	}
	.item_container{
		position: relative;
	}
	.addInfo{
		display: block;
		float: left;
		width: 300px;
		height: 360px;
		line-height: 360px;
		text-align: center;
		font-size: 60px;
		cursor: pointer;
		margin-top: 5px;
		border: 1px solid rgba(64,158,255,.2);
		border-radius:4px;
		color: #409eff;
		background-color: rgba(64,158,255,.1);
	}
	/*拖拽*/
	#list{ width:100%; list-style-type:none; margin-top:30px;color: #606266; font-size: 14px;}
	#list li{ float:left; padding:5px; width:300px; height:360px; }
	#list li div{ width:300px; height:360px; border:solid 1px #ccc; padding: 20px; box-sizing: border-box;}
	#list .box-card{
		margin-top: 0px !important;
	}
	#list .area_type{
		width: 100%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		/*white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;*/
		font-weight: bold;
		font-size: 16px;
		letter-spacing: 3px;
	}
	#list li span{
		display: block;
	}
	#list .cardPic{
		width: 100%;
		height: auto;
		max-height: 300px;
		overflow: hidden;
		margin-top: 20px;
	}
	#list .cardPic img{
		width: 100%;
		height: auto;
	}
	#list li{
		position: relative;
	}
	#list li .editCard{
		display: block;
		position: absolute;
		top: 10px;
		right: 40px;
		width: 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
	}
	#list li .delCard{
		display: block;
		position: absolute;
		top: 10px;
		right: 10px;
		width: 30px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
	}
	
	.addPackageForm .edit_btn .el-button{
		width: 100px;
	}

	.dialogFilter{
		margin-bottom: 20px;
	}
	.dialogFilter .el-button{
		width: 100px;
	}
	.hrefA{
		color: #01AEF0;
		text-decoration: underline;
		cursor: pointer;
	}
	.el-dialog .el-form{
		padding: 0px;
	}
</style>