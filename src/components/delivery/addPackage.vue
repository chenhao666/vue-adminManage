<template>
	<div class="addDeliveryPackage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设计师</el-breadcrumb-item>
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
						<el-col :span="12">
							<el-form-item label="样板类型：" class="widthLager">
								<el-select v-model="ruleForm.modelType" placeholder="请选择类型">
									<el-option label="软装定制" value="1,软装定制"></el-option>
									<el-option label="全屋定制" value="2,全屋定制"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="楼盘名：">
								<el-select v-model="ruleForm.home" placeholder="请选择楼盘">
									<el-option v-for="(item,key) in ruleForm.homeNameArr" :key="key"  :label="item.houseName" :value="item.id+','+item.houseName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="户型：">
								<el-input v-model="ruleForm.apartmentLayout" :maxlength="50" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="面积：">
								<el-input v-model="ruleForm.homeArea" :maxlength="50" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="标题：">
								<el-input v-model="ruleForm.title" :maxlength="50"></el-input>
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
							<el-form-item label="套餐名称：">
								<el-input v-model="ruleForm.name" :maxlength="20"></el-input>
							</el-form-item>
						</el-col>

					</el-row>
					
					<el-row :gutter="20">	
						<el-col :span="12">
							<el-form-item label="套餐简介：">
								<el-input v-model="ruleForm.introduction" :maxlength="100"></el-input>
							</el-form-item>
						</el-col>
						
						<!--<el-col :span="12">
							<el-form-item label="套餐价格：">
								<el-input v-model="ruleForm.price" :maxlength="10"></el-input>
							</el-form-item>
						</el-col>-->
						
					</el-row>
					
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
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="风格选择：">
								<el-select v-model="ruleForm.selectStyle" placeholder="请选择风格">
									<el-option v-for="(item,key) in styleList" :key="key" :label="item.styleName" :value="item.styleId+','+item.styleName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					
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
					<div style="text-align: center;padding: 30px 0px;">
						<el-button  @click="goBack">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
						<el-button type="primary" @click="saveForm('ruleForm')">存草稿</el-button>
					</div>
				</el-form>
			</div>
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
			  	<el-form :model="form" label-width="85px" v-if='dialogVisible'>
			  		<el-form-item label="区域类型：">
			  			<el-select v-model="form.areaType" placeholder="请选择类型" @change="inputFlag=1">
							<el-option label="客厅" value="1,客厅"></el-option>
							<el-option label="厨房" value="2,厨房"></el-option>
							<el-option label="主卧" value="3,主卧"></el-option>
							<el-option label="次卧" value="4,次卧"></el-option>
							<el-option label="餐厅" value="5,餐厅"></el-option>
							<el-option label="儿童房" value="6,儿童房"></el-option>
							<el-option label="老人房" value="7,老人房"></el-option>
							<el-option label="书房" value="8,书房"></el-option>
							<el-option label="主卫" value="9,主卫"></el-option>
							<el-option label="次卫" value="10,次卫"></el-option>
							<el-option label="阳台" value="11,阳台"></el-option>
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
		return{
			fileList:[],//上传图片列表
			dialogTitle:'新增描述',//弹窗标题
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
				title:'',//标题
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
			rules:{}
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
				renderpic(obj);
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
	    	this.form.areaType=this.cardInfo[cardKey].areaTypeId+','+this.cardInfo[cardKey].areaTypeName;
	    	this.form.desc=this.cardInfo[cardKey].details;
	    	this.fileList=[{name:this.cardInfo[cardKey].areaTypeName,url:this.cardInfo[cardKey].coverPic}];
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
		            	'title':this.ruleForm.title,
		            	'intro':this.ruleForm.introduction,
		            	'details':this.ruleForm.desc,
		            	'coverPic':this.ruleForm.selectPic,
		            	'tempInfo':this.cardInfo,
		            	"houseModelUrl":this.ruleForm.planPic,
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
	            	'title':this.ruleForm.title,
	            	'intro':this.ruleForm.introduction,
	            	'details':this.ruleForm.desc,
	            	'coverPic':this.ruleForm.selectPic,
	            	'tempInfo':this.cardInfo,
	            	"houseModelUrl":this.ruleForm.planPic,
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
		console.log(res)
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
      	text: '渲染图生成中',
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
			roamPic(obj,res.data.d.result);
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
//生成全屋漫游图
function roamPic(obj,picArr){
	let loading=obj.$loading({
       	lock: true,
      	text: '漫游图生成中',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
    });
    let picIdArr=[];
    for(let i=0;i<picArr.length;i++){
    	if(picArr[i].picType==1){    		
    		picIdArr.push(picArr[i].picId);
    	}
    }
    //console.log(picIdArr)
    if(picIdArr.length==0){
    	setTimeout(function(){
    		loading.close();
    		obj.$message.error("自动生成3d漫游图失败,请先渲染全景图再生成3D漫游图");
    		homeInfo(obj);
    	},500)
    	return;
    }
    let data={
		'url':'https://openapi.kujiale.com/v2/renderpic/pano',
		'KujiaLe':{
			'picIds':picIdArr,
			'override':true
		},
		'params':'',
		'method':'post'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.c==0){
			obj.$message({
				message: '全屋漫游图生成成功!',
				type: 'success'
			});
			obj.ruleForm.roamPic=res.data.d || "";
		}else{
			obj.$message.error("全屋漫游图生成失败~~");
			roamPic(obj,picArr);
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
/*//筛选户型信息
function apartmentInfo(obj,data){
	let loading=obj.$loading({
       	lock: true,
      	text: '获取房屋信息',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	obj.$ajax.post(obj.$store.state.localIP+'queryHouseInfo',data)
	.then(response=>{
		//console.log(response);
		loading.close();
		if(response.data.retCode==0){
			if(data.houseTypeName){
				obj.ruleForm.homeAreaArr=response.data.houseModels;
			}else{				
				obj.ruleForm.apartmentLayoutArr=response.data.houseModels;
			}
        }else{
           obj.$message.error(response.data.retMsg);
        }
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}*/
//清单操作
//初始化清单
/*function initOrder(obj,callback){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/listing/init',
		'KujiaLe':{
			'design_id':obj.ruleForm.programmeID
		},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		if(res.data.d){			
			let orderId=res.data.d;
			obj.$message({
		        message: '清单初始化成功!',
		        type: 'success'
		    });
			callback(orderId)
		}else{
			obj.$message.error("清单初始化失败!");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取清单
function orderList(obj){
	initOrder(obj,function(orderId){
		const loading=obj.$loading({
	      	lock: true,
	      	text: '清单生成中',
	      	fullscreen:false,
	      	spinner: 'el-icon-loading',
	      	background: 'rgba(0, 0, 0, 0.6)'
	    });
	    let timer=setInterval(function(){
	    	let data={
				'url':'https://openapi.kujiale.com/v2/listing/'+orderId+'/state',
				'KujiaLe':{},
				'params':'',
				'method':'get'
			}
			obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
			.then(res=>{
				loading.close();
				//console.log(res,2)
				if(res.data.d==3){
					obj.$message({
				        message: '清单生成成功!',
				        type: 'success'
				    });
					clearInterval(timer);
					let data={
						'url':'https://openapi.kujiale.com/v2/listing/'+orderId+'/sync',
						'KujiaLe':{
							'appuid':obj.$store.state.userCode
						},
						'params':'',
						'method':'post'
					}
					obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
					.then(res=>{
						//console.log(res,1);
						if(res.data.c==0){
							obj.$message({
						        message: '清单同步成功!',
						        type: 'success'
						    });
							obj.ruleForm.listingId=orderId;	
						}
					})
				}
			})
	    },1000)
	});
}*/
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
</style>