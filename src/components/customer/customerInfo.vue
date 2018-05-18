<template>
	<div class="customerInfo">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/customer/customer' }">客户管理</el-breadcrumb-item>
			<el-breadcrumb-item class="fontWeight">客户资料</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<div class="customerInfoEdit">
			<!--基本信息--> 
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="infoEdit" @click="infoEditFun">保存</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="infoEdit" @click="infoEdit=!infoEdit">取消</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="!infoEdit" @click="infoEdit=!infoEdit">编辑</el-button>
				</div>
				<div class="line"></div>
				
				<el-form label-width="85px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="姓名：">
								<span v-if="!infoEdit">{{ dataResults.name }}</span>
								<el-input v-model="form.name" placeholder="姓名" v-if="infoEdit"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="性别：">
								<span v-if="!infoEdit">{{ dataResults.sex }}</span>
								<el-select v-model="form.sex" placeholder="性别" v-if="infoEdit">
									<el-option label="男" value="0"></el-option>
									<el-option label="女" value="1"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="手机号：">
								<span>{{ dataResults.mobile }}</span>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="16">
							<el-form-item label="房屋地址：">
								<span v-if="!infoEdit">{{ dataResults.address }}</span>
								<el-dropdown v-if="infoEdit" trigger="hover">
									<span class="el-dropdown-link">
								    	{{ form.city }}<i class="el-icon-arrow-down el-icon--right"></i>
								  </span>
									<el-dropdown-menu slot="dropdown">
										<!--<el-dropdown-item v-for="item in cityList" :command="item.cityID+','+item.cityName" :key="item.cityID">{{ item.cityName }}</el-dropdown-item>-->
										<el-dropdown-item>
											<div class="dropdown_title">城市选择</div>
											<div class="dropdown_list" v-for="item in cityList">
												<div class="dropdown_Group">{{ item.pinFirst }}</div>
												<ul>
													<li v-for="city in item.sonList" @click="handleCommand(city.cityID+','+city.cityName)">{{ city.cityName }}</li>
												</ul>
												<div class="clear"></div>
											</div>
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
								<el-autocomplete
							      	class="inline-input"
							      	v-model="form.house"
							      	:fetch-suggestions="querySearchAsync"
							      	placeholder="楼盘名"
							      	v-if="infoEdit"
							      	@select="handleSelect"
							    >
								    <template slot-scope="props">
								    	<div class="name">{{ props.item.name }}</div>
								    </template>
							    </el-autocomplete>
								<el-input v-model="form.home" placeholder="楼、幢、单元号" v-if="infoEdit"></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span="8">
							<el-form-item label="获知途径：" class="double">
								<span v-if="!infoEdit">{{ dataResults.inletWay }}</span>
								<el-select v-model="form.inletWay" placeholder="获知途径" v-if="infoEdit">
									<el-option label="搜索引擎" value="0"></el-option>
									<el-option label="报纸等线下新闻媒体" value="1"></el-option>
									<el-option label="订阅号等线上新闻媒体" value="2"></el-option>
									<el-option label="朋友介绍" value="3"></el-option>
									<el-option label="其他" value="4"></el-option>
								</el-select>
								<el-input v-model="form.inletMode" placeholder="具体途径" v-if="infoEdit && inletWayStatus"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="房屋面积：">
								<span v-if="!infoEdit">{{ dataResults.size=="无"?"无":dataResults.size+"㎡"  }}</span>
								<el-input v-model="form.size" placeholder="㎡" v-if="infoEdit" :maxlength="8"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="交房情况：">
								<span v-if="!infoEdit">{{ dataResults.others }}</span>
								<el-select v-model="form.others" placeholder="交房情况" v-if="infoEdit">
									<el-option label="已交房" value="0"></el-option>
									<el-option label="一个月内" value="1"></el-option>
									<el-option label="三个月内" value="2"></el-option>
									<el-option label="半年内" value="3"></el-option>
									<el-option label="半年以上" value="4"></el-option>
									<el-option label="未知" value="5"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			
			<!--到店-->
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>到店</span>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="storeEdit" @click="storeEditFun">保存</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="storeEdit" @click="storeEdit=!storeEdit">取消</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="!storeEdit && isShowStore" @click="storeEdit=!storeEdit">编辑</el-button>
				</div>
				<div class="line"></div>
				
				<el-form label-width="85px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="计划时间：">
								<span v-if="!storeEdit">{{ dataResults.planeTime }}</span>
								<el-date-picker
									v-if="storeEdit"
							      	v-model="form.planeTime"
							      	type="datetime"
							      	value-format="yyyy-MM-dd HH:mm"
							      	placeholder="选择日期时间">
							    </el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="实际时间：">
								<span v-if="!storeEdit">{{ dataResults.realTime }}</span>
								<el-date-picker
									v-if="storeEdit"
							      	v-model="form.realTime"
							      	type="datetime"
							      	value-format="yyyy-MM-dd HH:mm"
							      	placeholder="选择日期时间">
							    </el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="说明：">
								<span v-if="!storeEdit">{{ dataResults.desc }}</span>
								<el-input v-if="storeEdit" type="textarea" v-model="form.desc" :rows="6"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			
			<!--量房-->
			<el-card class="box-card" v-if="!isShowMeasureButton || roomEdit">
				<div slot="header" class="clearfix">
					<span>量房</span>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="roomEdit" @click="submitForm('ruleForm')">保存</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="roomEdit" @click="roomEdit=!roomEdit">取消</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="!roomEdit && isShowMeasureButton" @click="roomEdit=!roomEdit">量房</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="!roomEdit && !isShowMeasureButton" @click="roomEdit=!roomEdit">编辑</el-button>
				</div>
				
				<div>
					<div class="line"></div>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="计划时间：" prop="planeTime">
									<span v-if="!roomEdit">{{ dataResults.planeTimeRoom }}</span>
									<el-date-picker
								      	v-model="ruleForm.planeTime"
								      	type="datetime"
								      	v-if="roomEdit"
								      	value-format="yyyy-MM-dd HH:mm"
								      	placeholder="选择日期时间">
								    </el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="联系人：" prop="connectName">
									<span v-if="!roomEdit">{{ dataResults.connectNameRoom }}</span>
									<el-input v-if="roomEdit" v-model="ruleForm.connectName" placeholder="联系人姓名"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系电话：" prop="connectMobile">
									<span v-if="!roomEdit">{{ dataResults.connectMobileRoom }}</span>
									<el-input v-if="roomEdit" v-model="ruleForm.connectMobile" placeholder="联系电话"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20" v-if="isShowMeasureButton">
							<el-col :span="24">
								<el-form-item label="房屋地址：" v-if="!roomStatus && roomEdit" prop="house">
									<el-dropdown  trigger="hover">
										<span class="el-dropdown-link">
											{{ ruleForm.city }}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<!--<el-dropdown-item v-for="item in cityList" :command="item.cityID+','+item.cityName" :key="item.cityID">{{ item.cityName }}</el-dropdown-item>-->
											<el-dropdown-item>
												<div class="dropdown_title">城市选择</div>
												<div class="dropdown_list" v-for="item in cityList">
													<div class="dropdown_Group">{{ item.pinFirst }}</div>
													<ul>
														<li v-for="city in item.sonList" @click="handleCommand2(city.cityID+','+city.cityName)">{{ city.cityName }}</li>
													</ul>
													<div class="clear"></div>
												</div>
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<el-autocomplete
								      	class="inline-input"
								      	v-model="ruleForm.house"
								      	:fetch-suggestions="querySearchAsync2"
								      	placeholder="楼盘名"
								      	@select="handleSelect2"
								    >
									    <template slot-scope="props">
									    	<div class="name">{{ props.item.name }}</div>
									    </template>
								    </el-autocomplete>
									<el-input v-model="ruleForm.home" placeholder="楼、幢、单元号"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="说明：">
									<span v-if="!roomEdit">{{ dataResults.descRoom }}</span>
									<el-input type="textarea" v-if="roomEdit" v-model="ruleForm.desc" :rows="6"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</el-card>			
		</div>	
	</div>
</template>

<script>
export default{
	name:'customerInfo',
	data () {
		//手机号码验证
		let checkMobile=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
		//量房房屋地址
		let checkHouse=(rule, value, callback)=>{
			if(this.ruleForm.house=="" || this.ruleForm.home==""){
				callback(new Error('请完善房屋信息！'))
			}else{
				callback();
			}
		};
		return{
			id:'',
			orderID:'',
			nowStage:'',//阶段
			infoEdit:0,//基本信息编辑
			storeEdit:0,//到店编辑
			roomEdit:0,//量房编辑
			roomStatus:0,//是否量房
			isShowStore:1,//是否展示到店编辑按钮
			isShowMeasureButton:1,//是否展示量房按钮
			dialogVisible: false,//弹窗状态
			Designer:'待定',//设计师
			DesignStatus:'待设计',//设计阶段
			DesignMapFlag:0,//设计图状态
			cityList:[],
			dataResults:initDefault(),
			//基本信息表单
			form:{
				name:'',
				sex:'',
				size:'',
				others:'',
				inletWay:'',
				inletMode:'',
				province:'',
				city:this.$store.state.cityName || '请选择',
				cityID:this.$store.state.cityID || '',
				district:'',
				house:'',
				home:'',
				planeTime:'',
				realTime:'',
				desc:''
			},
			//量房
			ruleForm:{
				planeTime:'',
				connectName:'',
				connectMobile:'',
				province:'',
				city:this.$store.state.cityName || '请选择',
				cityID:this.$store.state.cityID || '',
				district:'',
				house:'',
				home:'',
				desc:''
			},
			//验证规则
			rules:{
				planeTime:[
					{ required: true, message: '请选择计划时间', trigger: 'blur' }
				],
				connectName:[
					{ required: true, message: '请填写联系人', trigger: 'blur' }
				],
				connectMobile:[
					{  required: true, validator: checkMobile, trigger: 'blur' }
				],
				house:[
					{ required: true, validator: checkHouse, trigger: 'blur' }
				]
			}
		}
	},
	computed:{
		inletWayStatus(){
			if(this.form.inletWay=="4"){
				return true;
			}else{
				return false;
			}
		}
	},
	mounted(){
		//解析id
		let base64=new Base64();
		if(this.$route.query.query){
			this.orderID=base64.decode(this.$route.query.query)
		}else{
			window.history.go(-1);
		}
		let customerId=this.$route.params.code;
		this.id=base64.decode(customerId);
		//获取用户信息
		customerInfo(this);
		//获取城市列表
		cityList(this);
	},
	methods:{
		//下拉菜单
		handleCommand(command) {
	        //this.$message('click on item ' + command);
	        let commandArr=command.split(',');
	        this.form.city=commandArr[1];
	        this.form.cityID=commandArr[0];
	   },
	   handleCommand2(command) {
	        //this.$message('click on item ' + command);
	        let commandArr=command.split(',');
	        this.ruleForm.city=commandArr[1];
	        this.ruleForm.cityID=commandArr[0];
	   },
	   	//获取小区数据
	    querySearchAsync(queryString, cb) {
	    	if(this.form.city=='' || this.form.city=='请选择'){
	    		this.$message.error("请先选择城市！");
	    	}else{
	    		//console.log(this.form.city)
	    		/*获取楼房信息*/
				this.$ajax.get("http://restapi.amap.com/v3/place/text?key=81acd825627cc19dea2abd5ef43fc7a0&city="+this.form.city+"&citylimit=true&types=120000&keywords="+queryString)
				.then((response)=>{
					//console.log(response.data.pois)
					cb(response.data.pois)
				})
				.catch((error)=>{
					console.log(error)
				})
	    	}
	    },
	    //获取小区数据
	    querySearchAsync2(queryString, cb) {
	    	if(this.ruleForm.city=='' || this.ruleForm.city=='请选择'){
	    		this.$message.error("请先选择城市！");
	    	}else{
	    		/*获取楼房信息*/
				this.$ajax.get("http://restapi.amap.com/v3/place/text?key=81acd825627cc19dea2abd5ef43fc7a0&city="+this.ruleForm.city+"&citylimit=true&types=120000&keywords="+queryString)
				.then((response)=>{
					//console.log(response.data.pois)
					cb(response.data.pois)
				})
				.catch((error)=>{
					console.log(error)
				})
	    	}
	    },
	    //选择小区
	    handleSelect(item){
	    	//console.log(item);
	    	this.form.house=item.name;
	    	this.form.province=item.pname;
	    	this.form.district=item.adname;
	    },
	    handleSelect2(item){
	    	this.ruleForm.house=item.name;
	    	this.ruleForm.province=item.pname;
	    	this.ruleForm.district=item.adname;
	    },
	    //基本信息保存
	    infoEditFun(){
	    	let data={
	    		custName:this.form.name,
	    		sex:this.form.sex,
	    		province:this.form.province,
	    		district:this.form.district,
	    		city:this.form.city,
	    		cityID:this.form.cityID,
	    		buildingName:this.form.house,
	    		doorPlate:this.form.home,
	    		buildingArea:this.form.size,
	    		roomCase:this.form.others,
	    		learnWay:this.form.inletWay,
	    		learnWayMode:this.form.inletMode
	    	};
	    	if(this.form.size==''){
            	data.buildingArea=null;
            }
	    	let obj=this;
	    	editSave('updateCustomerInfo',this,data,function(){
	    		obj.infoEdit=0;
	    	});
	    },
	    //到店编辑保存
	    storeEditFun(){
	    	let data={
	    		arrivedTimeP:this.form.planeTime==""?null:this.form.planeTime,
	    		arrivedTimeR:this.form.realTime==""?null:this.form.realTime,
	    		talkResult:this.form.desc
	    	};
	    	let obj=this;
	    	editSave('updateArrivedStoreInfo',this,data,function(){
	    		obj.storeEdit=0;
	    	});
	    },
	    //量房提交
	    submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
		           	let data={
		           		csId:this.$store.state.userCode,
		           		csName:this.$store.state.userName,
		           		measureTimeP:this.ruleForm.planeTime,
		           		linkman:this.ruleForm.connectName,
			    		linkmanPhone:this.ruleForm.connectMobile,
			    		talkResult:this.ruleForm.desc
		           	}
		    		let obj=this;
		    		if(this.isShowMeasureButton){	
		    			data.province=this.ruleForm.province,
			    		data.city=this.ruleForm.city;
			    		data.cityID=this.ruleForm.cityID;
			    		data.district=this.ruleForm.district,
			    		data.buildingName=this.ruleForm.house;
			    		data.doorPlate=this.ruleForm.home;
		    			editSave('addMeasureInfo',this,data,function(){
		    				obj.roomEdit=0;
		    			});
		    		}else{
		    			editSave('updateMeasureInfo',this,data,function(){
		    				obj.roomEdit=0;
		    			});
		    		}
		    		
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	    }
	}
}

//获取客户资料
function customerInfo(obj){
	const loading =openLoad(obj);	
	
	let data={
		"orderID":obj.orderID
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryServiceMangerDetail",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				let dataList=response.data;
				let roomCaseArr=['已交房','一个月内','三个月内','半年内','半年以上']
				let learnWayArr=['搜索引擎','报纸等线下新闻媒体','订阅号等线上新闻媒体','朋友介绍','其他']
				if(dataList.retCode==0){
					//初始化默认值
					obj.dataResults=initDefault();
					//阶段
					if(dataList.serviceInfo.statusID || dataList.serviceInfo.statusID==0){						
						obj.nowStage=dataList.serviceInfo.statusID;
					}else{
						obj.nowStage="";
					}
					obj.isShowStore=dataList.isShowStore;//到店编辑
					obj.isShowMeasureButton=dataList.isShowMeasureButton;//是否量房
					obj.roomStatus=!dataList.isShowMeasureButton;
					//展示数据  基本信息
					//姓名
					obj.dataResults.name=dataList.serviceInfo.custName || '无';
					obj.form.name=dataList.serviceInfo.custName || '';
					obj.ruleForm.connectName=dataList.serviceInfo.custName || '';
					//性别
					if(dataList.serviceInfo.sex==0){
						obj.dataResults.sex="男";
						obj.form.sex='0';
					}else if(dataList.serviceInfo.sex==1){
						obj.dataResults.sex="女";
						obj.form.sex='1';
					}
					//电话
					obj.dataResults.mobile=dataList.serviceInfo.mobileNum || '无';
					obj.ruleForm.connectMobile=dataList.serviceInfo.mobileNum || '';
					//房屋面积
					obj.dataResults.size=dataList.serviceInfo.buildingArea || '无';
					obj.form.size=dataList.serviceInfo.buildingArea || '';
					//交房状态
					if(dataList.serviceInfo.roomCase || dataList.serviceInfo.roomCase==0){						
						obj.dataResults.others=roomCaseArr[dataList.serviceInfo.roomCase];
						obj.form.others=dataList.serviceInfo.roomCase.toString();
					}
					//获知途径
					if(dataList.serviceInfo.learnWay || dataList.serviceInfo.learnWay==0){
						if(dataList.serviceInfo.learnWayMode){
							obj.dataResults.inletWay=learnWayArr[dataList.serviceInfo.learnWay]+'-'+dataList.serviceInfo.learnWayMode;
							obj.form.inletMode=dataList.serviceInfo.learnWayMode;
						}else{							
							obj.dataResults.inletWay=learnWayArr[dataList.serviceInfo.learnWay]
						}
						obj.form.inletWay=dataList.serviceInfo.learnWay.toString();
					}
					//地址
					if(dataList.serviceInfo.buildingName){						
						obj.dataResults.address=(dataList.serviceInfo.city || '')+(dataList.serviceInfo.buildingName  || '')+(dataList.serviceInfo.doorPlate  || '')
					}
					//省
					if(dataList.serviceInfo.province){
						obj.form.province=dataList.serviceInfo.province;
						obj.ruleForm.province=dataList.serviceInfo.province;
					}
					//市
					if(dataList.serviceInfo.city){
						obj.form.city=dataList.serviceInfo.city;
						obj.form.cityID=dataList.serviceInfo.cityID;
						obj.ruleForm.city=dataList.serviceInfo.city;
						obj.ruleForm.cityID=dataList.serviceInfo.cityID;
					}
					//区
					if(dataList.serviceInfo.district){
						obj.form.district=dataList.serviceInfo.district;
						obj.ruleForm.district=dataList.serviceInfo.district;
					}
					obj.form.house=dataList.serviceInfo.buildingName  || '';
					obj.ruleForm.house=dataList.serviceInfo.buildingName || '';
					obj.form.home=dataList.serviceInfo.doorPlate  || '';
					obj.ruleForm.home=dataList.serviceInfo.doorPlate || '';
					
					//到店
					if(dataList.storeInfo){
						//计划时间
						if(dataList.storeInfo.arrivedTimeP){
							obj.dataResults.planeTime=(new Date(dataList.storeInfo.arrivedTimeP)).Format("yyyy-MM-dd hh:mm");
							obj.form.planeTime=(new Date(dataList.storeInfo.arrivedTimeP)).Format("yyyy-MM-dd hh:mm");
						}
						//实际时间
						if(dataList.storeInfo.arrivedTimeR){
							obj.dataResults.realTime=(new Date(dataList.storeInfo.arrivedTimeR)).Format("yyyy-MM-dd hh:mm");
							obj.form.realTime=(new Date(dataList.storeInfo.arrivedTimeR)).Format("yyyy-MM-dd hh:mm");
						}
						//说明
						obj.dataResults.desc=dataList.storeInfo.talkResult || '无';
						obj.form.desc=dataList.storeInfo.talkResult || '';
					}
					//量房
					if(dataList.measureInfo){
						//计划时间
						if(dataList.measureInfo.measureTimeP){
							obj.dataResults.planeTimeRoom=(new Date(dataList.measureInfo.measureTimeP)).Format("yyyy-MM-dd hh:mm");
							obj.ruleForm.planeTime=(new Date(dataList.measureInfo.measureTimeP)).Format("yyyy-MM-dd hh:mm");
						}
						//联系人
						obj.dataResults.connectNameRoom=dataList.measureInfo.linkman || '无';
						obj.ruleForm.connectName=dataList.measureInfo.linkman || '';
						//联系电话
						obj.dataResults.connectMobileRoom=dataList.measureInfo.linkmanPhone || '无';
						obj.ruleForm.connectMobile=dataList.measureInfo.linkmanPhone || '';
						//说明
						obj.dataResults.descRoom=dataList.measureInfo.talkResult || '无';
						obj.ruleForm.desc=dataList.measureInfo.talkResult || '';
					}
					
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
		})
		.catch((error)=>{
			loading.close();
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
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
//查询城市列表
function cityList(obj){
	obj.$ajax.post(obj.$store.state.localIP+"queryCityList")
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				if(response.data.retCode==0){
					let list=response.data.cityList;
					let listArr=[];
					if(list.length>0){
						//遍历
						for(let i=0;i<list.length;i++){
							let pin=list[i].cityPin;
							let first=pin.substr(0,1);
							listArr.push(first)
						}
						//排序
						listArr.sort();
						//去重
						let newArr=unique(listArr)
						let cityArr=[];//分类数组
						for(let i=0;i<newArr.length;i++){
							let info={
								pinFirst:newArr[i],
								sonList:[]
							}
							cityArr.push(info)
						}
						//二次遍历 分类
						for(let j=0;j<list.length;j++){
							let pin=list[j].cityPin;
							let first=pin.substr(0,1);
							let index=newArr.indexOf(first);
							let firstPin=newArr[index];
							cityArr[index].sonList.push(list[j])
						}
						obj.cityList=cityArr;
					}
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
		})
		.catch((error)=>{
			console.log(error);
			obj.$message.error("城市列表获取失败~~");
		})
}
//保存编辑信息
function editSave(url,obj,data,callback){
	const loading =openLoad(obj);	
	data.id=obj.id;
	data.orderID=obj.orderID;
	obj.$ajax.post(obj.$store.state.localIP+url,data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					obj.$message({
			          	message: '信息保存成功!',
			          	type: 'success'
			       	});
			       	//重新请求数据
			      customerInfo(obj);
			      callback();
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
		})
		.catch((error)=>{
			loading.close();
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
}
//数组去重
function unique(array){ 
	var n = []; 
	for(var i = 0; i < array.length; i++){ 
		if (n.indexOf(array[i]) == -1) n.push(array[i]);
	} 
	return n; 
}

//展示初始化
function initDefault(){
	let data={
		name:'无',
		sex:'无',
		mobile:'无',
		size:'无',
		others:'无',
		inletWay:'无',
		address:'无',
		planeTime:'无',
		realTime:'无',
		desc:'无',
		planeTimeRoom:'无',
		connectNameRoom:'无',
		connectMobileRoom:'无',
		descRoom:'无'
	}
	return data;
}
</script>

<style scoped>
.el-input,.el-select,.el-cascader,.el-date-editort{
	width: 100%;
	max-width: 200px;
}
.double .el-input,.double .el-select,.double .el-cascader{
	width: 49%;
	min-width: 120px;
	max-width: 200px;
}
.el-textarea{
	max-width: 700px;
}
.el-dropdown{
	cursor: pointer;
}
.el-textarea{
	max-width: 700px;
}
.submitOrder{
	width: 100%;
	text-align: center;
	padding:20px 0px;
}
.submitOrder .el-button{
	width: 200px;
}
.el-dropdown-menu{
	max-width: 600px;
	min-width: 300px;
	padding: 20px;
}
.dropdown_title{
	width: 100%;
	height: 30px;
	line-height: 30px;
}
.dropdown_Group{
	height: 30px;
	line-height: 30px;
	padding: 0px 15px;
	color: #3a8ee6;
	float: left;
	margin-top: 15px;
	font-size: 14px;
	font-weight: bold;
}
.dropdown_list ul{
	float: left;
	margin-top: 15px;
}
.dropdown_list ul li{
	float: left;
	padding: 0px 15px;
	height: 30px;
	line-height: 30px;
	cursor: pointer;
	font-size: 14px;
}
.dropdown_list ul li.active{
	color: #3a8ee6;
}
.dropdown_list ul li:hover{
	color: #3a8ee6;
}
#picShow{
	width: 100%;
	margin-top: 30px;
}
</style>