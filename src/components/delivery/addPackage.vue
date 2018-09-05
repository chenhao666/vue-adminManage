<template>
	<div class="addDeliveryPackage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">生成套餐模板</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>生成套餐模板</span>
			</div>
			<div class="line"></div>
			
			<div class="text item addPackageForm">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="方案名：" class="widthLager">
								<el-input v-model="ruleForm.programmeName" :maxlength="50" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<!--<el-col :span="12">
							<el-form-item label="样板类型：" class="widthLager">
								<el-select v-model="ruleForm.modelType" placeholder="请选择类型">
									<el-option label="软装定制" value="1,软装定制"></el-option>
									<el-option label="全屋定制" value="2,全屋定制"></el-option>
								</el-select>
							</el-form-item>
						</el-col>-->
						<el-col :span="12">
							<el-form-item label="楼盘名：">
								<el-select v-model="ruleForm.home" placeholder="请选择楼盘">
									<el-option v-for="(item,key) in ruleForm.homeNameArr" :key="key"  :label="item.houseName" :value="item.id+','+item.houseName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="户型：">
								<el-input v-model="ruleForm.apartmentLayout" :maxlength="50" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="面积：">
								<el-input v-model="ruleForm.homeArea" :maxlength="50" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="户型名称：">
								<el-input v-model="ruleForm.houseModel" :maxlength="50"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="套餐名称：">
								<el-input v-model="ruleForm.name" :maxlength="20"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="品牌选择：">
								<el-select v-model="ruleForm.selectBrand" placeholder="请选择品牌">
									<el-option v-for="(item,key) in brandList" :key="key" :label="item.brandName" :value="item.brandId+','+item.brandName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="风格选择：">
								<el-select v-model="ruleForm.selectStyle" placeholder="请选择风格">
									<el-option v-for="(item,key) in styleList" :key="key" :label="item.styleName" :value="item.styleId+','+item.styleName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>

					</el-row>
					
					<!--<el-row :gutter="20">	
						<el-col :span="12">
							<el-form-item label="套餐简介：">
								<el-input v-model="ruleForm.introduction" :maxlength="100"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="套餐价格：">
								<el-input v-model="ruleForm.price" :maxlength="10"></el-input>
							</el-form-item>
						</el-col>
						
					</el-row>-->
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="封面选择：" class="picList">
								<ul v-model="ruleForm.picShow">
									<li v-for="(item,key) in ruleForm.picArr" :key="key" v-show="(ruleForm.picShow===key || ruleForm.picShow==='')?true:false" @click="selectPaic(key,item.img)">
										<img :src="item.img" alt="" />
									</li>
									<li v-if="ruleForm.picArr.length==0" style="margin-top: 0px;">无</li>
									<div class="clear"></div>
								</ul>
								<el-button style="margin-top: 20px;" @click="reSelect" type="primary" v-if="ruleForm.selectBtn">重新选择</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					
					<!--<el-row :gutter="20">
						
					</el-row>-->
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="套餐描述" prop="desc">
								<el-input type="textarea" v-model="ruleForm.desc" :rows="6"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="描述介绍：">
							</el-form-item>
						</el-col>
					</el-row>
					
					<div class="line"></div>
					
					<div class="item_container">
						<ul id="list" v-model="cardInfo">
							<li v-for='(item,key) in cardInfo' :key="key" v-dragging="{ item: item, list: cardInfo, group: 'cardInfo' }">
								<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
									<span class="editCard" alt="编辑" @click="editCard(key)"><i class="iconfont icon-bianji"></i></span>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
									<span class="delCard" alt="删除" @click="delCard(key)"><i class="iconfont icon-shanchu"></i></span>
								</el-tooltip>
								
								<el-card class="box-card">
									<span class="area_type">{{ item.areaTypeName }}</span>
									
									<span class="cardPic">
										<img :src="item.coverPic" alt="" />
									</span>
								</el-card>
							</li>
							
							<span class="addInfo" @click="showDilog">+</span>
							<div class="clear"></div>
						</ul>
					</div>
					
					<input name="listSortOrder" type="hidden" />
					
					<!--组合编辑-->
					<div class="edit_btn">
						<el-button  type="primary" @click="addGoodsFun">新增</el-button>
						<el-button  type="primary" @click="goGroup">组合</el-button>
						<el-button  type="primary" @click="removeGroup">拆分</el-button>
						<el-button  type="primary" @click="changeGoods">替换</el-button>
						<el-button  type="danger" @click="deleteGoods">删除</el-button>
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
							<!--<el-table-column prop="id" :resizable="resizable"   label="ID" width="50" show-overflow-tooltip>
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
						<el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
						<el-button type="primary" @click="saveForm('ruleForm')">存草稿</el-button>
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
			  >
			  	<el-form  label-width="85px" :model="addGoods" :rules="addGoodsRules" class="demo-ruleForm">
			  		<el-row :gutter="20">
				  		<el-col :span="12">
							<el-form-item label="套餐包：" prop="selectPackage">
								<el-select v-model="addGoods.selectPackage" placeholder="请选择套餐包" v-show="this.selectGoodsType==0?'true':false">
									<el-option v-for="(item,key) in addGoods.packageList" :key="key" :label="item.packgeName" :value="item.packageId+','+item.packgeName"></el-option>
								</el-select>  
								<span v-show="selectGoodsType==1?'true':false">{{ multipleSelection.length>0 ? multipleSelection[0].packageName :'' }}</span>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="位置：" prop="selectLocation">
								<el-select v-model="addGoods.selectLocation" placeholder="请选择位置" v-show="this.selectGoodsType==0?'true':false">
									<el-option v-for="(item,key) in addGoods.locationList" :key="key" :label="item.typeName" :value="item.typeName"></el-option>
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
								<el-input v-model="addGoods.num"></el-input>
							</el-form-item>
						</el-col>
			  		</el-row>
				</el-form>
				<!--表单结束-->
				<span slot="footer" class="dialog-footer">
			   		 <el-button type="primary" @click="addGoodsSave">确定</el-button>
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
			  	<el-form :model="goods" :rules="goodsRules"  label-width="85px" style="padding: 0px 60px;">
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
			   		 <el-button type="primary" @click="goodsSubmitForm('ruleForm')">确 定</el-button>
				</span>
			</el-dialog>
			
		</div>
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
			  	<el-form :model="form" label-width="85px" v-if='dialogVisible'>
			  		<el-form-item label="区域类型：">
						<el-select v-model="form.areaType" placeholder="请选择位置"  @change="inputFlag=1">
							<el-option v-for="(item,key) in addGoods.locationList" :key="key" :label="item.typeName" :value="item.id+','+item.typeName"></el-option>
						</el-select>
			  		</el-form-item>
			  		<el-form-item label="图片上传：">
			  			<el-upload
						  :action="uploadPic"
						  list-type="picture-card"
						  :data="uploadData"
						  :limit="1"
						  :file-list="fileList"
						  :on-error="uploadError"
						  :on-exceed="onExceed"
						  :on-change="beforeUpload"
						  :on-success="handlePictureCardPreview"
						  ref="upload"
						  :auto-upload="false"
						  :on-remove="handleRemove">
						  <i class="el-icon-plus"></i>
						</el-upload>
			  		</el-form-item>
			  		<el-form-item label="区域描述">
			  			<el-input type="textarea" v-model="form.desc" @change="inputFlag=1" :rows="6"></el-input>
			  		</el-form-item>
				</el-form>
			  <!--表单结束-->
				<span slot="footer" class="dialog-footer">
			   		<el-button type="primary" @click="addCard" :disabled="form.addDisabled">确 定</el-button>
				</span>
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
		return{
			id:0,
			editGoodsFloag:0,
			resizable:false,
			selectGroupNum:0,
			goodsSearch:'',//商品搜索
			selectGoods:{},//选中商品
			selectGoodsType:0,
			currentPage: 1,//分页当前页数
		    pageSize:5,//分页默认每页条数
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
			dialogVisible:false,//弹窗显示
			inputFlag:0,//表单修改标记
			lookPic:false,//图片查看
			cardInfo:[],//描述卡片信息
			cardKey:'',//卡片id
			dialogFlag:0,//弹窗状态
			styleList:[],//风格列表
			brandList:[],//品牌列表
			uploadData:{'token':''},
			uploadPic:"https://up.qbox.me/",//图片上传
			goods:initGoods(),
			ruleForm:{
				//listingId:'',//清单ID
				//programmeArr:[],//方案列表
				programmeID:'',//选中方案
				programmeName:'',//方案名
				modelType:'',//样板类型
				homeNameArr:[],
				home:'',//楼盘信息
				apartmentLayout:'',//户型信息
				homeArea:'',//面积
				roamPic:'',//漫游图
				name:'',//套餐名称
				//price:'',//套餐价格
				houseModel:'',//标题
				introduction:'',//简介
				picArr:[],//渲染图数组
				selectPic:"",//选中渲染图
				selectBtn:false,//重新选择
				picShow:'',//渲染图展示
				selectStyle:'',//风格
				selectBrand:'',//选择品牌
				desc:'',//套餐描述
				planPic:'',//户型图Url
				//content:''//内容
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
		        	{ required: true, message: '请输入商品数量', trigger: 'blur' }
		        ],
		        pic:[
		        	{  required: true, validator: checkPic, trigger: 'blur' }
		        ]
			},
			addGoodsRules:{
				selectPackage:[
		        		{ required: true, message: '请选择套餐包', trigger: 'blur' }
		        ],
		        selectLocation:[
		        	{ required: true, message: '请选择位置', trigger: 'blur' }
		        ],
		        num:[
		        	{ required: true, message: '请输入商品数量', trigger: 'blur' }
		        ]
			}
		}
	},
	//挂载
	mounted(){
		let obj=this;
		//获取方案ID
		this.ruleForm.programmeID=this.$route.params.code;
		//获取方案信息
		programeInfo(this,function(res){
			//console.log(res)
			if(res.data.c==0){				
				obj.ruleForm.programmeName=res.data.d.name;
				//方案列表
				goodsList(obj);//获取商品列表
				renderpic(obj);//渲染图列表
				roamPicInfo(obj);
				styleList(obj);//风格
				brandList(obj);//品牌
			}else{
				obj.$message.error(res.data.m);
			}
		})
		//拖动
		this.$dragging.$on('dragged', ({ value }) => {
	      	//console.log(value.item)
	      	//console.log(value.list);
	      	this.cardInfo=value.list;
	   })

	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
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
		//选择方案
		/*programmeChange(){
			this.ruleForm.selectBtn=false;
			this.ruleForm.picShow='';
			this.ruleForm.selectPic='';
			this.ruleForm.picArr=[];
			//获取渲染图
			renderpic(this);
		},*/
	
		//重新选择
		reSelect(){
			this.ruleForm.selectBtn=false;
			this.ruleForm.picShow='';
			this.ruleForm.selectPic='';
		},
		//选择封面图
		selectPaic(picKey,picUrl){
			this.ruleForm.picShow=picKey;
			this.ruleForm.selectPic=picUrl;
			this.ruleForm.selectBtn=true;
			//console.log(this.ruleForm.picShow)
		},
		//返回
      	goBack(){
      		window.history.go(-1);
      	},
      	//dialog弹窗
      	showDilog(){
      		querySpaceInfo(this,function(){});
      		this.inputFlag=0;
      		this.dialogFlag=0;
	    	this.dialogTitle="新增描述";
      		this.dialogVisible=true;
      		this.form={
      			areaType:'',//区域类型
				desc:'',//区域描述
				picurl:''
      		}
      		this.fileList=[];
      	},
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
	    //图片上传与删除
	    handleRemove(file, fileList) {
        	//console.log(file, fileList);
      	},
      	beforeUpload(file,fileList){
      		//console.log(fileList)
      		const loading =openLoad(this);
      		this.$ajax.post(this.$store.state.localIP+'qiNiuToken',{})
	       .then((response)=>{
		       	//console.log(response);
		       	loading.close();
		       	if(response.data.retCode==0){
		       		var qiniutoken=response.data.token;
		       		this.uploadData.token=response.data.token;
		       		this.$refs.upload.submit();
		       		//console.log(this.uploadData)
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
      	},
	    handlePictureCardPreview(response, file, fileList) {
	    	this.$message({
				message: '图片上传成功!',
				type: 'success'
			});
			this.form.picurl = this.$store.state.qiniuUrl+response.key;
	    	//console.log(response)
	    },
	    uploadError(err, file, fileList){
	    	this.$message.error("图片上传失败");
	    	console.log(err);
	    },
	    onExceed(){
	    	this.$message({
				message: '前先删除图片在进行上传操作',
				type: 'warning'
			});
	    },
	    //添加卡片
	    addCard(){
	    	let cardKey=this.cardKey;
	    	let areaTypeArr=this.form.areaType.split(',');
	    	if(this.dialogFlag){
	    		this.cardInfo[cardKey].areaTypeId=areaTypeArr[0];
	    		this.cardInfo[cardKey].areaTypeName=areaTypeArr[1];
	    		if(this.form.picurl){	    			
	    			this.cardInfo[cardKey].coverPic=this.form.picurl;
	    		}
	    		this.cardInfo[cardKey].details=this.form.desc;
	    	}else{
	    		let info={
	    			'areaTypeId':areaTypeArr[0],
	    			'areaTypeName':areaTypeArr[1],
	    			'coverPic':this.form.picurl,
	    			'details':this.form.desc
	    		}
	    		this.cardInfo.push(info);
	    	}
	    	this.dialogVisible=false;	
	    	this.cardKey='';
	    },
	    //删除卡片
	    delCard(cardKey){
	    	//cardInfo
	    	this.$confirm('确定删除当前信息吗?', '提示', {
	          	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	         	this.cardInfo.splice(cardKey,1);
	        }).catch(() => {
	          	this.$message({
	            	type: 'info',
	            	message: '已取消删除'
	          	});          
	        });
	    },
	    //编辑卡片
	    editCard(cardKey){
	    	this.cardKey=cardKey;
	    	this.dialogFlag=1;
	    	this.dialogTitle="编辑描述";
	    	this.dialogVisible=true;
	    	/*form:{
				areaType:'',//区域类型
				desc:'',//区域描述
				picurl:''
			},*/
			var that=this;
			querySpaceInfo(this,function(){
				that.form.areaType=that.cardInfo[cardKey].areaTypeId+','+that.cardInfo[cardKey].areaTypeName;
	    		that.form.desc=that.cardInfo[cardKey].details;
	    		that.fileList=[{name:that.cardInfo[cardKey].areaTypeName,url:that.cardInfo[cardKey].coverPic}];
			});
	    	
	    },
      	//提交
      	submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          	if (valid) {
					//样板
					let modelTypeArr=this.ruleForm.modelType.split(',');
					//楼盘
					let homeArr=this.ruleForm.home.split(',');
					//户型
					let apartmentLayout=this.ruleForm.apartmentLayout;
			        //面积
			        let homeArea=this.ruleForm.homeArea;
			        //风格
			        let styleArr=this.ruleForm.selectStyle.split(',');
			        //品牌
			        let brandArr=this.ruleForm.selectBrand.split(',');
		            let data={
		            	'designId':this.ruleForm.programmeID,
		            	'designName':this.ruleForm.programmeName,
		            	'templateTypeId':modelTypeArr[0],
		            	'templateTypeName':modelTypeArr[1],
		            	'houseId':homeArr[0],
		            	'houseName':homeArr[1],
		            	'houseTypeName':apartmentLayout,
		            	'houseArea':homeArea,
		            	'threeDurl':this.ruleForm.roamPic,
		            	'comboName':this.ruleForm.name,
		            	//'comboPrice':this.ruleForm.price,
		            	'styleId':styleArr[0],
		            	'styleName':styleArr[1],
		            	"brandId":brandArr[0],
		            	"brandName":brandArr[1],
		            	'houseModel':this.ruleForm.houseModel,
		            	'intro':this.ruleForm.introduction,
		            	'details':this.ruleForm.desc,
		            	'coverPic':this.ruleForm.selectPic,
		            	'tempInfo':this.cardInfo,
		            	"houseModelUrl":this.ruleForm.planPic,
		            	"designGoodsArray":this.tableData,
		            	//'listingId':this.ruleForm.listingId,
		            	'isUsed':0
		            }
		            addPackage(this,data);
	          	} else {
		          	this.$message.error("表单提交失败！");
		            //console.log('error submit!!');
		            return false;
		        }
	        });
      	},
      	saveForm(formName){
      		 this.$refs[formName].validate((valid) => {
	          if (valid) {
				//样板
				let modelTypeArr=this.ruleForm.modelType.split(',');
				//楼盘
				let homeArr=this.ruleForm.home.split(',');
				//户型
				let apartmentLayout=this.ruleForm.apartmentLayout;
			    //面积
			    let homeArea=this.ruleForm.homeArea;
			    //风格
			    let styleArr=this.ruleForm.selectStyle.split(',');
			    //品牌
			    let brandArr=this.ruleForm.selectBrand.split(',');
	            let data={
	            	'designId':this.ruleForm.programmeID,
	            	'designName':this.ruleForm.programmeName,
	            	'templateTypeId':modelTypeArr[0],
	            	'templateTypeName':modelTypeArr[1],
	            	'houseId':homeArr[0],
	            	'houseName':homeArr[1],
	            	'houseTypeName':apartmentLayout,
	            	'houseArea':homeArea,
	            	'threeDurl':this.ruleForm.roamPic,
	            	'comboName':this.ruleForm.name,
	            	//'comboPrice':this.ruleForm.price,
	            	'styleId':styleArr[0],
	            	'styleName':styleArr[1],
	            	"brandId":brandArr[0],
		            "brandName":brandArr[1],
	            	'houseModel':this.ruleForm.houseModel,
	            	'intro':this.ruleForm.introduction,
	            	'details':this.ruleForm.desc,
	            	'coverPic':this.ruleForm.selectPic,
	            	'tempInfo':this.cardInfo,
	            	"houseModelUrl":this.ruleForm.planPic,
	            	"designGoodsArray":this.tableData,
	            	//'listingId':this.ruleForm.listingId,
	            	'isUsed':1
	            }
	            addPackage(this,data);
	          } else {
	          	this.$message.error("表单提交失败！");
	            //console.log('error submit!!');
	            return false;
	          }
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
						this.tableData[i].groupId='';
						this.tableData[i].species='单品';
					}
				}
		    	this.tableData=sortData(this.tableData);
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
      		for(var i=0;i<list.length;i++){
      			for(var j=0;j<listAll.length;j++){
      				if(list[i].typeName==listAll[j].typeName && listAll[j].species!="组合" && listAll[j].packageId==packageId){
      					num++;
      				}
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
					    message: '跨空间商品需要全选当前空间所有商品！',
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
			var list=this.multipleSelection;
			//console.log(list)
			var listAll=this.tableData;
			var index=-1;
			for(var i=0;i<list.length;i++){
				for(var j=0;j<listAll.length;j++){
					if(list[i].indexId==listAll[j].indexId){
						//console.log(j)
						if(index!=-1){
							if(parseInt(j)<parseInt(index)){
								index=j;
							}
						}else{							
							index=j;
						}
					}
				}
			}
			//console.log(index)
			
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
	
	    		var chirld={
	    			indexId:index,
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
	    		}
	    		var list=this.multipleSelection;
				var listAll=this.tableData;
	    		for(var i=0;i<list.length;i++){
	    			list[i].groupId=index;
					for(var j=0;j<listAll.length;j++){
						if(list[i].indexId==listAll[j].indexId){
							this.tableData.splice(j,1);
						}
					}
				}
	    		this.tableData.splice(index,0,chirld);
	    		for(var i=0;i<list.length;i++){
	    			list[i].species='商品';
	    			this.tableData.splice(index+i+1,0,list[i]);
	    		}
	    		//console.log(this.tableData)
	    		this.tableData=sortData(this.tableData);
	    		//console.log(this.tableData)
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
			        	//console.log(2)
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
						this.groupVisible=false;
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
			queryGoodsPackageList(this);
			querySpaceInfo(this,function(){});
			this.addGoods=initAddGoods();
			this.goodsListVisible=false;
			this.addGoodsVisible=true;
			//console.log(val)	
			this.selectGoods=val;
			//console.log(this.selectGoods)
		},
		//新增商品
		addGoodsFun(){
			this.selectGoodsType=0;
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
      			if(list[i].species=="组合"){
      				this.$message({
					    showClose: true,
					    message: '请选择单品或者子商品进行替换！',
					    type: 'warning'
					});
					return;
      			}
      		}
			this.selectGoodsType=1;
			goodsListAll(this);
			this.goodsListVisible=true;
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
		    }).catch(() => {
		      	this.$message({
		        	type: 'info',
		        	message: '已取消删除'
		      	});          
		    });
		},
		//添加商品
		addGoodsSave(){
			var listAll=this.tableData;
			var child=this.selectGoods;
			var selectList=this.multipleSelection;
			if(this.editGoodsFloag==0){
				if(this.selectGoodsType==0){
					if(this.addGoods.selectPackage){
						var selectPackageArr=this.addGoods.selectPackage.split(',');
						child.packageName=selectPackageArr[1];
						child.packageId=selectPackageArr[0];
					}
					if(this.addGoods.selectLocation){
						child.typeName=this.addGoods.selectLocation;
					}
				}else{
					child.packageName=selectList[0].packageName || '';
					child.packageId=selectList[0].packageId || '';
					child.typeName=selectList[0].typeName || '';
					child.designId=selectList[0].designId || '';
		    		child.roomId=selectList[0].roomId || '';
		    		child.groupId=selectList[0].groupId || '';
		    		child.replaceId=selectList[0].indexId;
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
					var typeFlag=0;
					var groupId='';
					for(var i=0;i<listAll.length;i++){
						if(listAll[i].typeName==child.typeName){
							if(listAll[i].groupId){
								typeFlag=1;
								groupId=listAll[i].groupId;
							}else{
								typeFlag=0;
							}
						}
					}
					if(typeFlag){
						for(var i=0;i<listAll.length;i++){
							if(listAll[i].groupId==groupId){
								if(listAll[i].typeName!=child.typeName && listAll[i].packageId==child.packageId){
									child.groupId=groupId;
									child.species='商品';
								}
							}
						}
					}
					//this.tableData.push(child);
					var goodsLocation=this.tableData.length-1;
					for(var i=0;i<listAll.length;i++){
						if(child.typeName==listAll[i].typeName && listAll[i].packageId==child.packageId){
							goodsLocation=i;
						}
					}
					//console.log(goodsLocation)
					listAll.splice(goodsLocation,0,child);
					this.tableData=listAll;
				}else{
					child.species="替换";
					for(var i=0;i<listAll.length;i++){
						if(listAll[i].indexId==selectList[0].indexId){
							this.tableData.splice(i+1,0,child);
							break;
						}
					}
				}
				//console.log(child)
				this.tableData=sortData(this.tableData);
		   	}else{
		   		for(var i=0;i<listAll.length;i++){
					if(listAll[i].indexId==selectList[0].indexId){
						var arr=this.addGoods.selectPackage.split(',');
						this.tableData[i].packageId=arr[0];
						this.tableData[i].packageName=arr[1];
						this.tableData[i].typeName=this.addGoods.selectLocation;
						this.tableData[i].goodsNum=this.addGoods.num;
						this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true);
						break;
					}
				}
		   		//console.log(this.tableData)
		   		
		   		this.editGoodsFloag=0;
		   	}
		   	this.$refs.multipleTable.clearSelection();
			this.addGoodsVisible=false;
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
				this.addGoods.selectPackage=val.packageId+','+val.packageName;
				this.addGoods.selectLocation=val.typeName;
				this.addGoods.num=val.goodsNum;
			}
			if(val.species=='替换'){
				this.selectGoodsType=1;
				this.addGoodsVisible=true;
				this.addGoods.selectPackage=val.packageId+','+val.packageName;
				this.addGoods.selectLocation=val.typeName;
				this.addGoods.num=val.goodsNum;
			}
			if(val.species=='组合'){
				//console.log(val)
				this.selectGroupNum=val.indexId;
				this.groupVisible=true;
				this.goods.fileList.push({name:'pic',url:val.goodsSrc})
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
//获取方案信息
function programeInfo(obj,callback){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/design/'+obj.ruleForm.programmeID+'/basic',
		'KujiaLe':{},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		//console.log(res)
		obj.ruleForm.apartmentLayout=res.data.d.specName;
		obj.ruleForm.homeArea=res.data.d.srcArea;
		obj.ruleForm.planPic=res.data.d.planPic;
		loading.close();
		callback(res);
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取风格列表
function styleList(obj){
	obj.$ajax.post(obj.$store.state.localIP+'selectStyleInfo')
	.then(res=>{
		//console.log(res)
		if(res.data.retCode==0){
			obj.styleList=res.data.styleInfoList;
		}else{
			obj.$message.error("获取风格列表失败！");
		}
	})
	.catch(error=>{
		console.log(error);
		obj.$message.error("获取风格列表失败！");
	})
}
//获取品牌列表
function brandList(obj){
	obj.$ajax.post(obj.$store.state.localIP+'selectBrand')
	.then(res=>{
		//console.log(res)
		if(res.data.retCode==0){
			obj.brandList=res.data.brandList;
		}else{
			obj.$message.error("获取品牌列表失败！");
		}
	})
	.catch(error=>{
		console.log(error);
		obj.$message.error("获取品牌列表失败！");
	})
}
//获取方案渲染图列表
function renderpic(obj){
	const loading=obj.$loading({
       	lock: true,
      	text: '渲染图获取中',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	let data={
		'url':'https://openapi.kujiale.com/v2/renderpic/list',
		'KujiaLe':{
			'design_id':obj.ruleForm.programmeID,
			'start':0,
			'num':50
		},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		if(res.data.c==0){
			obj.$message({
				message: '渲染图获取成功!',
				type: 'success'
			});
			obj.ruleForm.picArr=res.data.d.result;
			//roamPic(obj,res.data.d.result);
			//console.log(obj.ruleForm.picArr)
		}else{
			obj.$message.error("获取渲染图列表出错~~");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取方案信息列表
function roamPicInfo(obj){
	const loading=obj.$loading({
       	lock: true,
      	text: '信息获取中',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	let data={
		'url':'https://openapi.kujiale.com/v2/design/'+obj.ruleForm.programmeID+'/basic',
		'KujiaLe':{
			'designId':obj.ruleForm.programmeID
		},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		//console.log(res)
		loading.close();
		if(res.data.c==0){
			obj.$message({
				message: '获取方案详情成功!',
				type: 'success'
			});
			var fpid=res.data.d.planId;
			//console.log(obj.ruleForm.picArr)
			roamPic(obj,fpid);
		}else{
			obj.$message.error("获取方案详情失败~~");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//生成全屋漫游图
function roamPic(obj,fpid){
	let loading=obj.$loading({
       	lock: true,
      	text: '漫游图获取中',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
    let data={
		'url':'https://openapi.kujiale.com/v2/renderpic/pano',
		'KujiaLe':{
			'start':0,
			'num':50,
			'appuid':hex_md5(obj.$store.state.userCode)
		},
		'params':'',
		'method':'get',
		'appuid':obj.$store.state.userCode
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.c==0){
			obj.$message({
				message: '获取全屋漫游图成功!',
				type: 'success'
			});
			if(res.data.d){
				if(res.data.d.result.length>0){
					var index=res.data.d.result.indexOf('https://yun.kujiale.com/design/'+fpid+'/show');
					if(index>-1){
						obj.ruleForm.roamPic=res.data.d.result[index];
						//console.log(obj.ruleForm.roamPic)
					}else{
						obj.$message.error("暂未生成全景图！");	
					}
				}
			}
		}else{
			obj.$message.error("获取全屋漫游图失败~~");
		}
		homeInfo(obj);
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//新增套餐
function addPackage(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'saveDesigInfo',data)
	.then(response=>{
		loading.close();
		if(response.data.retCode==0){
            obj.$message({
				message: '套餐新增成功!',
				type: 'success'
			});
			obj.$router.push({path:'/delivery/package'})
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
//获取楼盘信息
function homeInfo(obj){
	let loading=obj.$loading({
       	lock: true,
      	text: '获取楼盘信息',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	obj.$ajax.post(obj.$store.state.localIP+'selectHouses')
	.then(response=>{
		//console.log(response);
		loading.close();
		if(response.data.retCode==0){
          	obj.ruleForm.homeNameArr=response.data.housesList;
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
	obj.$ajax.post(obj.$store.state.localIP+'queryGoodsDesignList',{designId:obj.ruleForm.programmeID,type:'0'})
	.then(response=>{
		//console.log(response);
		var list=response.data.goodsList;
		loading.close();
		for(var i=0;i<list.length;i++){			
			list[i].indexId=i;
			if(list[i].goodsImages.indexOf(',')>-1){
				var arr=list[i].goodsImages.split(',');
				list[i].goodsSrc=arr[0];
			}else{
				list[i].goodsSrc=list[i].goodsImages;
			}
		}
		obj.tableData=list;
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
		num:''//数量
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
				num:''//数量
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
	var arrList=[];
	for(var i=0;i<list.length;i++){
		if(list[i].groupId || list[i].groupId==0){
			arrList.push(list[i])
		}else{
			arr.push(list[i]);
		}
	}

	for(var i=0;i<arrList.length;i++){
		for(var j=0;j<arr.length;j++){
			if(arrList[i].groupId==arr[j].indexId){
				arr.splice(j+1,0,arrList[i]);
				break;
			}
		}
	}
	for(var x=0;x<arr.length;x++){
		if(arr[x].indexId!=x && arr[x].indexId){
			for(var y=0;y<arr.length;y++){
				if(arr[x].indexId==arr[y].groupId){
					arr[x].indexId=x;
					arr[y].groupId=x;
				}else{
					arr[x].indexId=x;
				}
			}
		}else{
			arr[x].indexId=x;
		}
	}
	//console.log(arr)
	return arr;
}
</script>

<style scoped>
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
	.goodsList{
		margin-top: 20px;
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