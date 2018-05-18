<template>
	<div class="lookInfo">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/customer/reservations' }">线上预留</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">查看</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		<div class="lookInfo_customer">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="editBtn" @click="saveInfo('ruleForm')">保存</el-button>
					<el-button style="float: right;width:auto;padding: 3px 10px;" type="text" v-if="editBtn" @click="editBtn=!editBtn">取消</el-button>
					<el-button style="float: right; width:auto;padding: 3px 10px;" type="text" v-if="!editBtn" @click="editBtn=!editBtn">编辑</el-button>
				</div>
				<div class="line"></div>
				<div  class="text item">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="姓名：" prop="name">
								   	<span v-if="!editBtn">{{ dataResults.name }}</span>
									<el-input v-model="ruleForm.name" v-if="editBtn"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="性别：">
								   	<span v-if="!editBtn">{{ dataResults.sex }}</span>
								   	<el-select v-model="ruleForm.sex" placeholder="请选择性别" v-if="editBtn">
										<el-option label="男" value="0"></el-option>
										<el-option label="女" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="手机号：">
								   	{{ dataResults.mobile }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="预约方式：">
								   	{{ dataResults.type }}
								</el-form-item>
							</el-col>
							<el-col :span="16">
								<el-form-item label="预留时间：">
								   	{{ timeFomit(dataResults.dateTime) }}
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="所在城市：">
								   	<span v-if="!editBtn">{{ dataResults.houseLocation }}</span>
								   	<el-cascader v-if="editBtn" :options="ruleForm.options" change-on-select v-model="ruleForm.selectedOptions" @change="handleChange">
									</el-cascader>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="房屋面积：">
								   	<span v-if="!editBtn">{{ dataResults.houseSize }} &nbsp;&nbsp;㎡</span>
								   	<el-input v-if="editBtn" v-model="ruleForm.size" placeholder="㎡" :maxlength="8"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="交房情况：">
								   	<span v-if="!editBtn">{{ dataResults.others }}</span>
								   	<el-select v-model="ruleForm.others" v-if="editBtn">
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
				</div>
			</el-card>
			
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>回访记录</span>
					<el-button style="float: right; width:auto;padding: 3px 10px;" type="text"  v-if="addCallBackBtn"  @click="saveCallBack('ruleForm2')">保存</el-button>
					<el-button style="float: right; width:auto;padding: 3px 10px;" type="text" @click="addCallBackBtn=!addCallBackBtn"  v-if="addCallBackBtn">取消</el-button>
					<el-button style="float: right; width:auto;padding: 3px 10px;" type="text" @click="newAdd" v-if="!addCallBackBtn && showAdd">新增记录</el-button>
				</div>
				<!--<div class="line"></div>-->
				
				<div  class="text item">	
					<div class="card_tag">
						<!--<el-tag 
							:key="tag.id" 
							v-for="tag in dynamicTags" 
							:disable-transitions="false" >
							<div @click="tagClick(tag.id)" style="cursor: pointer;">
								<p>{{ timeFomit(tag.callTime) }}</p>
								<p>{{ callStatus(tag.status) }}</p>
								<p>{{tag.csName}}</p>
							</div>
						</el-tag>-->
						<div class="new_tabs">
							<ul>
								<li v-for="(tag,key) in dynamicTags" @click="tagClick(tag.id,key)" :class="tabsActive==key?'active':''">
									<p>{{ callStatus(tag.status) }}</p>
									<p>{{ (new Date(tag.callTime)).Format("yyyy-MM-dd") }}</p>
								</li>
								<div class="clear"></div>
								<div class="new_tabs_line" :style="tabsLineLeft"></div>
							</ul>
						</div>
					</div>
					<el-form v-if="!addCallBackBtn"  label-width="85px" class="demo-ruleForm">	
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="回访结果：">
								   	{{ dataResults.connectResult }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item :label="timeLabel">
									{{ timeFomit(dataResults.planeTime) }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20" v-if="status==2?true:false">
							<el-col :span="24">
								<el-form-item label="所到门店：">
									{{ dataResults.toStore }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20" v-if="status==4?true:false">
							<el-col :span="24">
								<el-form-item label="房屋地址：">
									{{ dataResults.roomLocation }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20" v-if="status==4?true:false">
							<el-col :span="24">
								<el-form-item label="联系人：">
									{{ dataResults.connectName }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20" v-if="status==4?true:false">
							<el-col :span="24">
								<el-form-item label="联系电话：">
									{{ dataResults.connectMobile }}
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="详细情况：">
									{{ dataResults.descInfo }}
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<!--新增沟通记录-->
					<el-form v-if="addCallBackBtn" :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="85px" class="demo-ruleForm">
					
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="回访结果">
									<el-select v-model="ruleForm.results">
										<el-option label="到店" value="2"></el-option>
										<el-option label="需回访" value="3"></el-option>
										<el-option label="量房" value="4"></el-option>
										<el-option label="关闭" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="20" v-if="emptyStatus">
							<el-col :span="12" v-if="resultStatus">
								<el-form-item label="所到门店：" class="double" prop="store">
									<el-cascader :options="ruleForm.options" change-on-select v-model="ruleForm.selectedOptions2" @change="">
									</el-cascader>
									<el-select v-model="ruleForm.store" placeholder="门店">
										<el-option label="Uhome_1号店" value="1,Uhome_1号店"></el-option>
										<el-option label="Uhome_2号店" value="2,Uhome_2号店"></el-option>
										<el-option label="Uhome_3号店" value="3,Uhome_3号店"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="planeSpan" v-if="resultStatus3">
								<el-form-item label="计划时间：" prop="planeTime">
									<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.planeTime" type="datetime" placeholder="选择日期">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12" v-if="resultStatus2">
								<el-form-item label="房屋地址：" class="double" prop="address">
									<el-input v-model="ruleForm.houseName" placeholder="楼盘名"></el-input>
									<el-input v-model="ruleForm.address" placeholder="楼、幢、单元号"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="20" v-if="resultStatus2">
							<el-col :span="12">
								<el-form-item label="联系人：" prop="connectName">
									<el-input v-model="ruleForm.connectName"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系电话：" prop="connectMobile">
									<el-input v-model="ruleForm.connectMobile"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="20" v-if="emptyStatus">
							<el-col :span="24">
								<el-form-item label="详细情况" prop="desc">
									<el-input type="textarea" v-model="ruleForm.desc" :rows="6"></el-input>
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
import cityData from  "../../commJs/city.data-3.js"
export default{
	name:'lookInfo',
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
		//验证房屋大小
		let checkSize=(rule, value, callback)=>{
			if(parseInt(value)>10000 || parseInt(value)<0){
				callback(new Error('请输入正确的房屋面积'))
			}else{
				callback();
			}
		};
		//沟通
		let checkResult=(rule, value, callback)=>{
			if(value==""){
				alert(1)
				callback(new Error('请选择回访结果'))
			}else{
				callback();
			}
		};
		let base64=new Base64();
		let orderID;
		if(this.$route.query.query){
			orderID=base64.decode(this.$route.query.query)
		}else{
			window.history.go(-1);
		}
		return{
			id:'',
			orderID:orderID,
			status:0,//状态
			addCallBackBtn:false,//新增沟通记录
			editBtn:false,//编辑按钮
			showAdd:false,//控制按钮展示
			crList:[],//沟通记录
			tabsActive:0,
			timeLabel:'计划时间：',
			dataResults:{
				name:'',
				sex:'',
				mobile:'',
				type:'',
				dateTime:'',
				houseLocation:'',
				houseSize:'',
				others:'',
				connectResult:'',
				planeTime:'',
				descInfo:'',
				toStore:'',
				roomLocation:'',
				connectName:'',
				connectMobile:''
			},
			ruleForm: {
	          	name: '',
	          	sex:'',
	          	mobile:'',
	          	type:'',
	          	dateTime:'',
	          	options:cityData.cityData3,//城市数据
	          	size:'',
	          	others:'',
	          	results:'',
	          	selectedOptions:[],
	          	selectedOptions2:[],//所到门店所在城市
	          	planeTime:'',//计划时间
	          	store:'',//门店
	          	houseName:'',//楼盘名
	         	address:'',//地址
	          	connectName:'',//联系人姓名
	          	connectMobile:'',//联系电话
	          	desc:''//详细情况
	        },
        	rules: {
	          	name: [
	            	{ required: true, message: '请输入姓名', trigger: 'blur' }
	          	],

	          	results:[
	          		{ required: true, validator: checkResult, trigger: 'blur' }
	          	],
	          	store:[
	          		{ required: true, message: '请选择所在城市及门店', trigger: 'blur' }
	          	],
	          	planeTime:[
	          		{ required: true, message: '请选择计划时间', trigger: 'blur' }
	          	],
	          	address:[
	          		{ required: true, message: '请填写房屋地址', trigger: 'blur' }
	          	],
	          	connectName:[
	          		{ required: true, message: '请填写联系人', trigger: 'blur' }
	          	],
	          	connectMobile:[
		        	{  required: true, validator: checkMobile, trigger: 'blur' }
		      	],
		      	desc:[
		      		{ required: true, message: '请填写详细情况', trigger: 'blur' }
		      	],
		      	size:[
		      		{  required: true, validator: checkSize, trigger: 'blur' }
		      	]
	        },
			//标签
			dynamicTags: [],
		}
	},
	mounted(){
		customerList(this);
		let base64=new Base64();
		this.id=base64.decode(this.$route.params.code);
	},
	computed:{
    	//沟通方式
    	emptyStatus(){
    		if(this.ruleForm.results){
    			return true;
    		}else{
    			return false;
    		}
    	},
    	//到店
    	resultStatus(){
    		if(this.ruleForm.results=="2"){
    			this.planeSpan=8;
    			return true;
    		}else{
    			this.planeSpan=12;
    			return false;
    		}
    	},
    	//量房
    	resultStatus2(){
    		if(this.ruleForm.results=="4"){
    			return true;
    		}else{
    			return false;
    		}
    	},
    	//关闭
    	resultStatus3(){
    		if(this.ruleForm.results=="0"){
    			return false;
    		}else{
    			return true;
    		}
    	},
		//tabsline移动
		tabsLineLeft(){
			let left=this.tabsActive*150;
			return {
				'left':left+'px'
			}
		}
    },
	methods: {
		//状态
    	callStatus(id){
    		//console.log(id)
    		let idArr=['关闭','待沟通','到店','需回访','量房','设计','合同'];
    		return idArr[id];
    	},
		newAdd(){
			this.addCallBackBtn=!this.addCallBackBtn;
			//let num=this.$route.params.code;
			//this.$router.push({path:'/customer/reservations/newAdd/'+num})
		},
		//城市三级联动
	    handleChange(value) {
	      //console.log(value);
	    },
	    //所到门店所在城市
	    handleChange2(value) {
	      //console.log(value);
	    },
	    //标签点击
	    tagClick(id,key){
	    	this.tabsActive=key;
	    	//console.log(id)
	    	let statusArr=['关闭','待沟通','到店','需回访','量房','设计','合同'];
	    	let crList=this.crList;
	    	for(let i=0;i<crList.length;i++){
	    		if(parseInt(crList[i].id)==parseInt(id)){
	    			this.status=crList[i].status;
	    			if(this.status==0){
						this.timeLabel="关闭时间：";
					}else{
						this.timeLabel="计划时间：";
					}
	    			this.dataResults.connectResult=statusArr[crList[i].status];
	    			this.dataResults.descInfo=crList[i]?(crList[i].talkResult || ""): '无';
					this.dataResults.planeTime=crList[i].callTime || '无';
	    		}
	    	}
	    },
	    //时间格式化
	    timeFomit(timeDate){
	      	//console.log(timeDate)
	      	 return (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	    },
	    //保存基本信息
	    saveInfo(formName){
	    	this.$refs[formName].validate((valid) => {
	          if (valid) {
	            let loading=openLoad(this);
	             //获取城市ID信息
	            let locationIdArr=this.ruleForm.selectedOptions;
	            //获取城市名称
	            let cityTxt=$('.el-cascader').eq(0).text();
	      		let resultStr = cityTxt.replace(/\ +|\r+|\n+|\t+/g, ""); //去掉空格
	            let cityArr=resultStr.split('/');
	            //数据
	            let data={
	            	'custName':this.ruleForm.name,
	            	'sex':this.ruleForm.sex,
	            	'buildingArea':this.ruleForm.size,
	            	'roomCase':this.ruleForm.others,
	            	'provinceID':locationIdArr[0] || '',
	            	'province':cityArr[0] || '',
	            	'cityID':locationIdArr[1] || '',
	            	'city':cityArr[1] || '',
	            	'districtID':locationIdArr[2] || '',
	            	'district':cityArr[2] || '',
	            	'csId':this.$store.state.userCode,
	            	'csName':this.$store.state.userName,
	            	'orderID':this.orderID,
	            	'id':this.id
	            }        
	            if(this.ruleForm.size==''){
            		data.buildingArea=null;
            	}
	            this.$ajax.post(this.$store.state.localIP+'updateCallServiceInfo',data)
	            .then((response)=>{
	            	//console.log(response)
	            	if(response.data.retCode==0){
	            		this.$message({
				          	message: '编辑成功!',
				          	type: 'success'
				       	});
				       	customerList(this);
	            	}else{
	            		this.$message.error(response.data.retMsg);
	            	}
	            	loading.close();
	            })
	            .catch((error)=>{
	            	loading.close();
	            	console.log(error);
	            	this.$message.error("网络连接错误~~");
	            })
	          } else {
	          	this.$message.error("表单提交失败！");
	            //console.log('error submit!!');
	            return false;
	          }
	        });
	    },
	    //保存回访信息
	    saveCallBack(formName){
	    	this.$refs[formName].validate((valid) => {
	          if (valid) {
	            let loading=openLoad(this);
	            //数据
	            let data={
	            	'csId':this.$store.state.userCode,
	            	'csName':this.$store.state.userName,
	            	'orderID':this.orderID,
	            	'status':this.ruleForm.results,
	            	'talkResult':this.ruleForm.desc,
	            	"id":this.id
	            }        
	            //到店
		        if(this.ruleForm.results=="2"){
		        	data.statusName="到店";
		        	let store=this.ruleForm.store;
		        	let storeArr=store.split(',');
		        	//门店
		        	data.storeID=storeArr[0];
		        	data.storeName=storeArr[1];
		        	//计划时间
		        	data.arrivedTime=this.ruleForm.planeTime;
		        }
		        //需回访
		        if(this.ruleForm.results=="3"){
		        	//计划时间
		        	data.callBackTime=this.ruleForm.planeTime;
		        }
		        //量房
		        if(this.ruleForm.results=="4"){
		        	data.statusName="量房";
		        	//计划时间
		        	data.measureTime=this.ruleForm.planeTime;
		        	//房屋地址
		        	data.buildingName=this.ruleForm.houseName;
		        	data.doorPlate=this.ruleForm.address;
		        	//联系人信息
		        	data.contact=this.ruleForm.connectName;
		        	data.contactPhone=this.ruleForm.connectMobile;
		        }
	            this.$ajax.post(this.$store.state.localIP+'updateCallServiceInfo',data)
	            .then((response)=>{
	            	//console.log(response)
	            	if(response.data.retCode==0){
	            		this.$message({
				          	message: '新增成功！',
				          	type: 'success'
				       	});
				       	customerList(this);
	            	}else{
	            		this.$message.error(response.data.retMsg);
	            	}
	            	loading.close();
	            })
	            .catch((error)=>{
	            	loading.close();
	            	console.log(error);
	            	this.$message.error("网络连接错误~~");
	            })
	          } else {
	          	this.$message.error("表单提交失败！");
	            //console.log('error submit!!');
	            return false;
	          }
	        });
	    }
    }
}
//获取客户列表
function customerList(obj){
	const loading =openLoad(obj);	
	//解密 获取ID
	let base64=new Base64();
	let param=obj.$route.params.code;
	let num=base64.decode(param);
	//console.log(num)
	obj.$ajax.post(obj.$store.state.localIP+"queryAppointInfo",{"id":num})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				obj.addCallBackBtn=false;//新增沟通记录
				obj.editBtn=false;//编辑按钮
				loading.close();
				if(response.data.retCode==0){
					//表单展示
					let wayArr=['Web','App','获取资料','客户致电','其他','预约'];
					let list=response.data.csList[0];
					obj.status=list.status;
					if(obj.status==0){
						obj.timeLabel="关闭时间：";
					}else{
						obj.timeLabel="计划时间：";
					}
					//console.log(list)
					obj.ruleForm.name=list.custName || '';//姓名
					if(list.sex || list.sex==0){						
						obj.ruleForm.sex=list.sex.toString() || '';//性别
					}
					//所在城市
					//省
					if(list.provinceID){
						obj.ruleForm.selectedOptions.push(list.provinceID.toString());
					}
					//市
					if(list.cityID){
						obj.ruleForm.selectedOptions.push(list.cityID.toString());
					}
					//区
					if(list.districtID){
						obj.ruleForm.selectedOptions.push(list.districtID.toString());
					}
					//房屋面积
					obj.ruleForm.size=list.buildingArea;
					//交房情况
					if(list.roomCase){						
						obj.ruleForm.others=list.roomCase.toString();
					}
					//数据展示
					//console.log(list)
					obj.dataResults.name=list.custName || '';//姓名
					if(list.sex==0){
						obj.dataResults.sex="男";
					}else if(list.sex==1){						
						obj.dataResults.sex="女";//性别
					}else{
						obj.dataResults.sex="未知";//性别
					}
					obj.dataResults.mobile=list.mobileNum || '';//手机号
					//预留方式
					if(list.inletMode){
						obj.dataResults.type=wayArr[list.inletWay]+'-'+list.inletMode;
					}else{							
						obj.dataResults.type=wayArr[list.inletWay];
					}
					obj.dataResults.dateTime=list.appTime || '';//预留时间
					//所在城市
					obj.dataResults.houseLocation=(list.province || "")+(list.city || "")+(list.district || "");
					if(obj.dataResults.houseLocation==""){
						obj.dataResults.houseLocation='无';
					}
					obj.dataResults.houseSize=list.buildingArea || '无';
					//交房情况
					let roomCaseArr=['已交房','一个月内','三个月内','半年内','半年以上'];
					obj.dataResults.others=roomCaseArr[list.roomCase] || "无";
					let statusArr=['关闭','待沟通','到店','需回访','量房','设计','合同'];
					obj.dataResults.connectResult=statusArr[list.status];
					if(list.status=="3"){
						obj.showAdd=true;
						obj.dataResults.planeTime=list.callBackTime || '无';
					}else if(list.status=="4"){
						obj.showAdd=false;
						obj.dataResults.planeTime=list.measureTime || '无';
					}
					else if(list.status=="0"){
						obj.showAdd=false;
						obj.dataResults.planeTime=list.callTime || '无';
					}else{
						obj.showAdd=false;
						obj.dataResults.planeTime=list.arrivedTime || '无';
					}
					
					let len=response.data.crList.length;
					obj.crList=response.data.crList;
					obj.dataResults.descInfo=response.data.crList[0]?(response.data.crList[0].talkResult || ""): '无';
					//回访记录
					obj.dynamicTags=response.data.crList;
					
					//到店信息
					obj.dataResults.toStore=list.storeName || "无";
					//楼盘
					obj.dataResults.roomLocation=(list.buildingName || "无楼盘名")+"-"+(list.doorPlate || "无门牌号")
					//联系人
					obj.dataResults.connectName=list.contact || "无";
					//联系电话
					obj.dataResults.connectMobile=list.contactPhone || "无";
					
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
</script>

<style scoped>
	.lookInfo_customer{
		width: 100%;
		margin: 0 auto;
		margin-bottom: 20px;
	}
	.lookInfo_customer .el-card{
		width: 96%;
		margin: 0 auto;
		margin-top: 20px;
	}
	.lookInfo_customer .el-tag{
		height: auto;
		line-height: 150%;
		text-align: center;
	}
	.lookInfo_customer .el-tag{
	    margin-left: 5px;
	    margin-top: 10px;
	}
	.lookInfo_customer .button-new-tag {
	    margin-left: 10px;
	    height: 32px;
	    line-height: 30px;
	    padding-top: 0;
	    padding-bottom: 0;
	}
	/*.lookInfo_customer .card_tag{
		padding-bottom: 10px;
	}*/
	.el-card__header .clearfix{
		height: 100%;
	}
	.lookInfo_customer .el-input,.lookInfo_customer .el-select,.lookInfo_customer .el-date-editort,.lookInfo_customer .el-cascader{
		width: 100%;
		max-width: 200px;
	}
	.double .el-input,.double .el-select,.double .el-cascader{
		width: 49%;
		max-width: 200px;
	}
	.lookInfo_customer .el-textarea{
		max-width: 700px;
	}
	.new_tabs{
		width: 100%;
		padding: 12px 0px;
		border-bottom:1px solid #E4E4E4;
		position: relative;
		box-sizing: border-box;
	}
	.new_tabs_line{
		position: absolute;
		bottom: 0px;
		height: 2px;
		background: #409EFF;
		width: 150px;
		left: 0px;
	}
	.new_tabs ul li{
		float: left;
		width: 150px;
		text-align: center;
		line-height: 150%;
		cursor: pointer;
		font-size: 14px;
	}
	.new_tabs ul li.active{
		color: #409EFF;
	}
</style>