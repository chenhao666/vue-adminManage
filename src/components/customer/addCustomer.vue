<template>
	<div class="addCustomer">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/customer/reservations' }">线上预留</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">新增登记</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		<div class="addCustomer_form">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>新增登记</span>
				</div>
				<div class="line"></div>
				<div class="text item">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="姓名：" prop="name">
									<el-input v-model="ruleForm.name"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="性别：" prop="sex">
									<el-select v-model="ruleForm.sex" placeholder="请选择性别">
										<el-option label="男" value="0"></el-option>
										<el-option label="女" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20"> 
							<el-col :span="12">
								<el-form-item label="手机号：" prop="mobile">
									<el-input v-model="ruleForm.mobile"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="预约方式：" prop="type" class="double">
									<el-select v-model="ruleForm.type" placeholder="请选择预约方式" :style="doubleW">
										<el-option label="客户致电" value="3"></el-option>
										<el-option label="其他" value="4"></el-option>
									</el-select>
									<el-input v-model="ruleForm.typeInfo" v-if="typeStatus" placeholder="具体方式"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="所在城市：">
									<el-cascader style="max-width: 400px;" :options="ruleForm.options" change-on-select v-model="ruleForm.selectedOptions" @change="handleChange">
									</el-cascader>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="交房情况：" prop="others">
									<el-select v-model="ruleForm.others">
										<el-option label="已交房" value="0"></el-option>
										<el-option label="一个月内" value="1"></el-option>
										<el-option label="三个月内" value="2"></el-option>
										<el-option label="半年内" value="3"></el-option>
										<el-option label="半年以上" value="4"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="房屋面积：">
									<el-input v-model="ruleForm.size" placeholder="㎡"  :maxlength="8"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="回访结果：" prop="talkStatus">
									<el-select v-model="ruleForm.talkStatus">
										<el-option label="到店" value="2"></el-option>
										<el-option label="需回访" value="3"></el-option>
										<el-option label="量房" value="4"></el-option>
										<el-option label="关闭" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						
						<div class="line" style="margin-bottom: 30px;" v-if="ruleForm.talkStatus?true:false"></div>
						
						<el-row :gutter="20" v-if="emptyStatus">
							<el-col :span="12" v-if="resultStatus">
								<el-form-item label="所到门店：" class="double" prop="store">
									<el-cascader :options="ruleForm.options" change-on-select v-model="ruleForm.selectedOptions2" @change="handleChange2">
									</el-cascader>
									<el-select v-model="ruleForm.store" placeholder="门店">
										<el-option label="Uhome_1号店" value="1,Uhome_1号店"></el-option>
										<el-option label="Uhome_2号店" value="2,Uhome_2号店"></el-option>
										<el-option label="Uhome_3号店" value="3,Uhome_3号店"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" v-if="resultStatus2">
								<el-form-item label="房屋地址：" class="double" prop="address">
									<el-input v-model="ruleForm.houseName" placeholder="楼盘名"></el-input>
									<el-input v-model="ruleForm.address" placeholder="楼、幢、单元号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="planeSpan" v-if="resultStatus3">
								<el-form-item label="计划时间：" prop="planeTime">
									<el-date-picker 
										v-model="ruleForm.planeTime" 
										type="datetime" 
										value-format="yyyy-MM-dd HH:mm:ss"
										placeholder="选择日期">
									</el-date-picker>
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

						<div style="text-align: center;padding: 30px 0px;">
							<el-button  @click="goBack">返回</el-button>
							<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
						</div>
					</el-form>
				</div>
			</el-card>

		</div>
	</div>
</template>

<script>
//获取城市三级联动信息
import cityData from  "../../commJs/city.data-3.js"
export default {
  name: 'addCustomer',
  data(){
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
  	return{
  		doubleW:'width:100%',//宽度控制
  		planeSpan:'8',//默认计划时间所占比
  		ruleForm: {
          name: '',//姓名
          sex:'',//性别
          mobile:'',//手机号
          type:'',//预约方式
          typeInfo:'',//其他信息
          size:'',//房屋面积
          others:'',//交房情况
          talkStatus:'',//回访结果
          options:cityData.cityData3,//城市数据
          selectedOptions: [],//所在城市
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
          	mobile:[
	        	{  required: true, validator: checkMobile, trigger: 'blur' }
	      	],
	      	sex:[
	      		{ required: true, message: '请选择性别', trigger: 'blur' }
	      	],
          	type: [
          		{ required: true, message: '请选择预留方式', trigger: 'blur' }
          	],
          	talkStatus:[
          		{ required: true, message: '请选择回访结果', trigger: 'blur' }
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
        }
      };
    },
    mounted(){
    	//获取城市三级联动信息
    },
    computed:{
    	//预约方式
    	typeStatus(){
    		if(this.ruleForm.type=="4"){
    			this.doubleW='width:49%';
    			return true;
    		}else{
    			this.doubleW='width:100%';
    			this.ruleForm.typeInfo='';
    			return false;
    		}
    	},
    	//沟通方式
    	emptyStatus(){
    		if(this.ruleForm.talkStatus){
    			return true;
    		}else{
    			return false;
    		}
    	},
    	//到店
    	resultStatus(){
    		if(this.ruleForm.talkStatus=="2"){
    			this.planeSpan=8;
    			return true;
    		}else{
    			this.planeSpan=12;
    			return false;
    		}
    	},
    	//量房
    	resultStatus2(){
    		if(this.ruleForm.talkStatus=="4"){
    			return true;
    		}else{
    			return false;
    		}
    	},
    	//关闭
    	resultStatus3(){
    		if(this.ruleForm.talkStatus=="0"){
    			return false;
    		}else{
    			return true;
    		}
    	}
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //城市三级联动
      handleChange(value) {
        //console.log(value);
      },
      //所到门店所在城市
      handleChange2(value) {
        //console.log(value);
      },
      //返回
      goBack(){
      	window.history.go(-1);
      },
      submitForm(formName) {
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
            	'mobileNum':this.ruleForm.mobile,
            	'inletWay':this.ruleForm.type,
            	'inletMode':this.ruleForm.typeInfo,
            	'buildingArea':this.ruleForm.size,
            	'roomCase':this.ruleForm.others,
            	'status':this.ruleForm.talkStatus,
            	'provinceID':locationIdArr[0] || '',
            	'province':cityArr[0] || '',
            	'cityID':locationIdArr[1] || '',
            	'city':cityArr[1] || '',
            	'districtID':locationIdArr[2] || '',
            	'district':cityArr[2] || '',
            	'csId':this.$store.state.userCode,
            	'csName':this.$store.state.userName,
            	'talkResult':this.ruleForm.desc
            }
            if(this.ruleForm.size==''){
            	data.buildingArea=null;
            }
            //到店
            if(this.ruleForm.talkStatus=="2"){
            	let store=this.ruleForm.store;
            	let storeArr=store.split(',');
            	//门店
            	data.storeID=storeArr[0];
            	data.storeName=storeArr[1];
            	data.statusName="到店";
            	//计划时间
            	data.arrivedTime=this.ruleForm.planeTime;
            }
            //需回访
            if(this.ruleForm.talkStatus=="3"){
            	//计划时间
            	data.callBackTime=this.ruleForm.planeTime;
            }
            //量房
            if(this.ruleForm.talkStatus=="4"){
            	//计划时间
            	data.measureTime=this.ruleForm.planeTime;
            	//房屋地址
            	data.buildingName=this.ruleForm.houseName;
            	data.doorPlate=this.ruleForm.address;
            	//联系人信息
            	data.contact=this.ruleForm.connectName;
            	data.contactPhone=this.ruleForm.connectMobile;
            	data.statusName="量房";
            }
            this.$ajax.post(this.$store.state.localIP+'addInformation',data)
            .then((response)=>{
            	//console.log(response)
            	if(response.data.retCode==0){
            		this.$message({
			          	message: '新增客户成功!',
			          	type: 'success'
			       	});
			       	this.$router.push({path:'/customer/reservations'})
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
	.addCustomer_form{
		width:100%;
		margin: 0 auto;
		margin-top: 20px;
		margin-bottom: 20px;
	}
	.addCustomer_form .el-select,.addCustomer_form .el-cascader,.addCustomer_form .el-date-editor{
		width: 100%;
		max-width: 200px;
	}
	.addCustomer_form .double .el-input,.addCustomer_form .double .el-select{
		width: 49%;
		max-width: 200px;
	}
	.addCustomer_form .double .el-cascader{
		width: 49%;
		max-width: 200px;
	}
	.addCustomer_form .el-input{
		width: 100%;
		max-width: 200px;
	}
	.addCustomer_form .el-textarea{
		max-width: 730px;
	}
	.el-button{
		width: 200px;
		margin-top: 30px;
	}
	.el-button+.el-button{
		margin-left: 60px;
	}
</style>