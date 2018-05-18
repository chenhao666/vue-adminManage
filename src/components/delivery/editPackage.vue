<template>
	<div class="editDeliveryPackage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设计师</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">修改套餐模板</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>修改套餐模板</span>
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
									<el-option v-for="(item,key) in ruleForm.homeNameArr" :key="key"  :label="item.houseName" :value="item.houseId+','+item.houseName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="户型：">
								<el-select v-model="ruleForm.apartmentLayout" placeholder="请选择户型">
									<el-option v-for="(item,key) in ruleForm.apartmentLayoutArr" :key="key"  :label="item.houseTypeName" :value="item.houseTypeId+','+item.houseTypeName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="面积：">
								<el-select v-model="ruleForm.homeArea" placeholder="请选择面积">
									<el-option v-for="(item,key) in ruleForm.homeAreaArr" :key="key"  :label="item.houseArea+'㎡'" :value="item.houseAreaId+','+item.houseArea"></el-option>
								</el-select>
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
							<el-form-item label="套餐名称：">
								<el-input v-model="ruleForm.name" :maxlength="20"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="12">
							<el-form-item label="套餐简介：">
								<el-input v-model="ruleForm.introduction" :maxlength="100"></el-input>
							</el-form-item>
						</el-col>
						
					</el-row>
					
					<el-row :gutter="20">					
						<el-col :span="12">
							<el-form-item label="套餐价格：">
								<el-input v-model="ruleForm.price" :maxlength="10"></el-input>
							</el-form-item>
						</el-col>
						
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
									<el-option label="北欧" value="1,北欧"></el-option>
									<el-option label="港式" value="2,港式"></el-option>
									<el-option label="现代" value="3,现代"></el-option>
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
							<li v-for='(item,key) in cardInfo'  :key="key" v-dragging="{ item: item, list: cardInfo, group: 'cardInfo' }">
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
						</el-select>
			  		</el-form-item>
			  		<el-form-item label="图片上传：">
			  			<el-upload
						  :action="uploadPic"
						  list-type="picture-card"
						  :data="uploadData"
						  :limit="1"
						  :on-error="uploadError"
						  :on-exceed="onExceed"
						  :file-list="fileList"
						  :on-success="handlePictureCardPreview"
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
	name:'editDeliveryPackage',
	data(){
		return{
			id:'',
			fileList:[],//上传图片列表
			dialogTitle:'新增描述',//弹窗标题
			dialogVisible:false,//弹窗显示
			inputFlag:0,//表单修改标记
			lookPic:false,//图片查看
			cardInfo:[],//描述卡片信息
			cardKey:'',//卡片id
			dialogFlag:0,//弹窗状态
			uploadData:{
				'type':'houseImg'
			},
			uploadPic:this.$store.state.localIP+'imgUpload',//图片上传
			ruleForm:{
				listingId:'',//清单ID
				//programmeArr:[],//方案列表
				programmeID:'',//选中方案
				programmeName:'',//方案名
				modelType:'',//样板类型
				homeNameArr:[],
				home:'',//楼盘信息
				apartmentLayoutArr:[],//户型数组
				apartmentLayout:'',//户型信息
				homeAreaArr:[],//面积数组
				homeArea:'',//面积
				roamPic:'',//漫游图
				name:'',//套餐名称
				price:'',//套餐价格
				title:'',//标题
				introduction:'',//简介
				picArr:[],//渲染图数组
				selectPic:"",//选中渲染图
				selectBtn:false,//重新选择
				picShow:'',//渲染图展示
				selectStyle:'',//风格
				desc:'',//套餐描述
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
		let base64=new Base64();
		if(this.$route.params.code){			
			this.id=base64.decode(this.$route.params.code);
		}else{
			window.history.go(-1);
		}
		//拖动
		this.$dragging.$on('dragged', ({ value }) => {
	      	//console.log(value.item)
	      	//console.log(value.list);
	      	this.cardInfo=value.list;
	    })
		packageInfo(this,function(res){
			//console.log(res)
			if(res.data.retCode==0){
				let list=res.data.designInfoList;
				//方案ID
				obj.ruleForm.programmeID=list[0].designId || "";
				//方案名
				obj.ruleForm.programmeName=list[0].designName || "";
				//样板类型
				if(list[0].templateTypeId && list[0].templateTypeName){					
					obj.ruleForm.modelType=list[0].templateTypeId+','+list[0].templateTypeName;
				}
				//楼盘信息
				if(list[0].houseId && list[0].houseName){					
					obj.ruleForm.home=list[0].houseId+','+list[0].houseName;
				}
				//户型信息
				if(list[0].houseTypeId && list[0].houseTypeName){					
					obj.ruleForm.apartmentLayout=list[0].houseTypeId+','+list[0].houseTypeName;
				}
				//面积
				if(list[0].houseAreaId && list[0].houseArea){					
					obj.ruleForm.homeArea=list[0].houseAreaId+','+list[0].houseArea;
				}
				//漫游图
				obj.ruleForm.roamPic=list[0].threeDurl || "";
				//套餐名称
				obj.ruleForm.name=list[0].comboName || "";
				//套餐价格
				obj.ruleForm.price=list[0].comboPrice || "";
				//标题
				obj.ruleForm.title=list[0].title || "";
				//简介
				obj.ruleForm.introduction=list[0].intro || "";
				//选中渲染图
				if(list[0].coverPic){					
					obj.ruleForm.selectPic=list[0].coverPic || "";
					obj.ruleForm.selectBtn=true;
				}
				//风格
				if(list[0].styleId && list[0].styleName){					
					obj.ruleForm.selectStyle=list[0].styleId+','+list[0].styleName;
				}
				//描述
				obj.ruleForm.desc=list[0].details || "";
				
				//具体描述
				obj.cardInfo=list[0].templateList || [];
				
				renderpic(obj);
			}else{
				obj.$message.error(res.data.retMsg)
			}
			
		})
		//设置监听
		this.$watch('ruleForm.home',function(newValue,oldValue){
			//console.log(newValue+','+oldValue)
			if(oldValue){
				obj.ruleForm.apartmentLayout="";
				obj.ruleForm.homeArea="";
			}
    		let valArr=newValue.split(',');
			let data={
				'houseName':valArr[1]
			}
			apartmentInfo(obj,data);
		})
		this.$watch('ruleForm.apartmentLayout',function(newValue,oldValue){
			//console.log(newValue+','+oldValue)
			if(oldValue){
				obj.ruleForm.homeArea="";
			}
			if(obj.ruleForm.home){
				let valArr=newValue.split(',');
				let homeArr=obj.ruleForm.home.split(',');
				let data={
					'houseName':homeArr[1],
					'houseTypeName':valArr[1]
				}
				apartmentInfo(obj,data);
			}
    		
		})
		//初始化文本编辑器
		//var editor;
	    /*this.editor = KindEditor.create('textarea[name="content"]', {
	       	cssPath : '/ourHouse/static/edit/plugins/code/prettify.css',
			//uploadJson : '/ourHouse/static/edit/jsp/upload_json.jsp',
			uploadJson:this.$store.state.localIP+'uploadJson',
			//fileManagerJson : '/ourHouse/static/edit/jsp/file_manager_json.jsp',
			fileManagerJson: this.$store.state.localIP+'fileManagerJson',
	        allowFileManager : true
	    });*/

	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {		
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
	    handlePictureCardPreview(response, file, fileList) {
	    	if(response.retCode==0){
	    		this.$message({
					message: '图片上传成功!',
					type: 'success'
				});
		        this.form.picurl = response.url;
	    	}else{
	    		this.$message.error(response.retMsg);
	    	}
	        //console.log(response, file, fileList)
	        //this.lookPic = true;
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
				let apartmentLayoutArr=this.ruleForm.apartmentLayout.split(',');
	            //面积
	            let homeAreaArr=this.ruleForm.homeArea.split(',');
	            //风格
	            let styleArr=this.ruleForm.selectStyle.split(',');
	            let data={
	            	'id':this.id,
	            	'designId':this.ruleForm.programmeID,
	            	'designName':this.ruleForm.programmeName,
	            	'templateTypeId':modelTypeArr[0],
	            	'templateTypeName':modelTypeArr[1],
	            	'houseId':homeArr[0],
	            	'houseName':homeArr[1],
	            	'houseTypeId':apartmentLayoutArr[0],
	            	'houseTypeName':apartmentLayoutArr[1],
	            	'houseAreaId':homeAreaArr[0],
	            	'houseArea':homeAreaArr[1],
	            	'threeDurl':this.ruleForm.roamPic,
	            	'comboName':this.ruleForm.name,
	            	'comboPrice':this.ruleForm.price,
	            	'styleId':styleArr[0],
	            	'styleName':styleArr[1],
	            	'title':this.ruleForm.title,
	            	'intro':this.ruleForm.introduction,
	            	'details':this.ruleForm.desc,
	            	'coverPic':this.ruleForm.selectPic,
	            	'tempInfo':this.cardInfo,
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
					let apartmentLayoutArr=this.ruleForm.apartmentLayout.split(',');
		            //面积
		            let homeAreaArr=this.ruleForm.homeArea.split(',');
		            //风格
		            let styleArr=this.ruleForm.selectStyle.split(',');
		            let data={
		            	'designId':this.ruleForm.programmeID,
		            	'designName':this.ruleForm.programmeName,
		            	'templateTypeId':modelTypeArr[0],
		            	'templateTypeName':modelTypeArr[1],
		            	'houseId':homeArr[0],
		            	'houseName':homeArr[1],
		            	'houseTypeId':apartmentLayoutArr[0],
		            	'houseTypeName':apartmentLayoutArr[1],
		            	'houseAreaId':homeAreaArr[0],
		            	'houseArea':homeAreaArr[1],
		            	'threeDurl':this.ruleForm.roamPic,
		            	'comboName':this.ruleForm.name,
		            	'comboPrice':this.ruleForm.price,
		            	'styleId':styleArr[0],
		            	'styleName':styleArr[1],
		            	'title':this.ruleForm.title,
		            	'intro':this.ruleForm.introduction,
		            	'details':this.ruleForm.desc,
		            	'coverPic':this.ruleForm.selectPic,
		            	'tempInfo':this.cardInfo,
		            	'listingId':this.ruleForm.listingId,
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
		loading.close();
		callback(res);
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
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
			let list=obj.ruleForm.picArr;
			//console.log(obj.ruleForm.picArr)
			for(let i=0;i<list.length;i++){
				if(list[i].img==obj.ruleForm.selectPic){
					obj.ruleForm.picShow=i;
				}
			}
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
				message: '套餐修改成功!',
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
	let data={
		'houseName':obj.ruleForm.homeName,
		'houseTypeName':obj.ruleForm.apartmentLayout
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryHouseName',data)
	.then(response=>{
		//console.log(response);
		loading.close();
		if(response.data.retCode==0){
          	obj.ruleForm.homeNameArr=response.data.houseModels;
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
//筛选户型信息
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
}
//获取套餐信息
function packageInfo(obj,callback){
	let loading=obj.$loading({
       	lock: true,
      	text: '获取套餐信息',
      	fullscreen:false,
      	spinner: 'el-icon-loading',
      	background: 'rgba(0, 0, 0, 0.6)'
   });
	obj.$ajax.post(obj.$store.state.localIP+'queryDsignMsgById',{id:obj.id})
	.then(response=>{
		//console.log(response);
		loading.close();
		callback(response);
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
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
</style>