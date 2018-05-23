<template>
	<div class="checkIn">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/customer/reservations' }">线上预留</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">登记</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		<div class="checkInInfo">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<div class="line"></div>
				<div class="text item userInfo">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="姓名：" prop="name">
									<el-input v-model="ruleForm.name"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="性别：">
									<el-select v-model="ruleForm.sex" placeholder="请选择">
										<el-option label="男" value="0"></el-option>
										<el-option label="女" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="手机号：">
									{{ ruleForm.mobile }}
								</el-form-item>
							</el-col>
						</el-row>

						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="预约方式：">
									{{ ruleForm.type }}
								</el-form-item>
							</el-col>
							<el-col :span="16">
								<el-form-item label="预留时间：">
									{{ timeFomit(ruleForm.dateTime) }}
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="所在城市：">
									<el-cascader :options="ruleForm.options" change-on-select v-model="ruleForm.selectedOptions" @change="handleChange">
									</el-cascader>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="房屋面积：">
									<el-input v-model="ruleForm.size" placeholder="㎡" :maxlength="8"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="交房情况：" prop="others">
									<el-select v-model="ruleForm.others">
										<el-option label="已交房" value="1"></el-option>
										<el-option label="一个月内" value="2"></el-option>
										<el-option label="三个月内" value="3"></el-option>
										<el-option label="半年内" value="4"></el-option>
										<el-option label="半年以上" value="5"></el-option>
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
					<!--<el-button style="float: right; padding: 3px 0" type="text">保存</el-button>-->
				</div>
				<div class="line"></div>
				<div class="text item">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
						
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="回访结果：" prop="results">
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
							<el-col :span="16" v-if="resultStatus">
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
									<el-date-picker 
										v-model="ruleForm.planeTime" 
										type="datetime" 
										value-format="yyyy-MM-dd HH:mm:ss"
										placeholder="选择日期">
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
			<div class="saveBtn">
				<el-button  @click="goBack">返回</el-button>
				<el-button  type="primary" @click="submitForm('ruleForm')">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
//获取城市三级联动信息
import cityData from  "../../commJs/city.data-3.js"
export default {
  name: 'checkIn',
  data (){
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
	//let Base64=new Base64();
	let orderID;
	if(this.$route.query.query){
		orderID=Base64.decode(this.$route.query.query)
	}else{
		window.history.go(-1);
	}
  	return{
  		id:'',
  		orderID:orderID,
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
  	}
  },
  mounted(){
  	//获取客户信息
  	customerList(this);	
  	//获取ID	
  	//let Base64=new Base64();
	this.id=Base64.decode(this.$route.params.code);
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
    	}
  },
  methods:{
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
      //时间格式化
      timeFomit(timeDate){
      	//console.log(timeDate)
      	 return (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
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
            	'buildingArea':this.ruleForm.size,
            	'roomCase':this.ruleForm.others,
            	'status':this.ruleForm.results,
            	'provinceID':locationIdArr[0] || '',
            	'province':cityArr[0] || '',
            	'cityID':locationIdArr[1] || '',
            	'city':cityArr[1] || '',
            	'districtID':locationIdArr[2] || '',
            	'district':cityArr[2] || '',
            	'csId':this.$store.state.userCode,
            	'csName':this.$store.state.userName,
            	'talkResult':this.ruleForm.desc,
            	'orderID':this.orderID,
            	'id':this.id,
            	'mobileNum':this.ruleForm.mobile
            }        
            if(this.ruleForm.size==''){
            	data.buildingArea=null;
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
			          	message: '登记成功!',
			          	type: 'success'
			       	});
			       	let param=this.$route.params.code;
			       	this.$router.push({path:'/customer/reservations'});
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
	//let Base64=new Base64();
	let param=obj.$route.params.code;
	let num=Base64.decode(param);
	//console.log(num)
	obj.$ajax.post(obj.$store.state.localIP+"queryAppointInfo",{"id":num})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					let wayArr=['Web','App','获取资料','客户致电','其他','预约'];
					let list=response.data.csList[0];
					//console.log(list)
					obj.ruleForm.name=list.custName || '';//姓名
					if(list.sex || list.sex==0){						
						obj.ruleForm.sex=list.sex.toString() || '';//性别
					}
					obj.ruleForm.mobile=list.mobileNum || '';//手机号
					//预留方式
					if(list.inletMode){
						obj.ruleForm.type=wayArr[list.inletWay]+'-'+list.inletMode;
					}else{							
						obj.ruleForm.type=wayArr[list.inletWay];
					}
					obj.ruleForm.dateTime=list.appTime || '';//预留时间
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
					if(obj.ruleForm.others){						
						obj.ruleForm.others=list.roomCase.toString();
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

</script>

<style scoped>
	.checkInInfo{
		width: 96%;
		margin: 0 auto;
		margin-bottom: 20px;
	}
	.checkInInfo .el-input,.checkInInfo .el-select{
		width: 100%;
		max-width: 200px;
	}
	.checkInInfo .el-select,.checkInInfo .el-cascader{
		width: 100%;
		max-width: 200px;
	}
	.checkInInfo .double .el-input,.checkInInfo .double .el-select{
		width: 49%;
		max-width: 200px;
	}
	.checkInInfo .double .el-cascader{
		width: 49%;
		max-width: 200px;
	}
	.checkInInfo .el-cascader{
		width: 100%;
		max-width: 200px;
	}
	.saveBtn{
		text-align: center;margin-top: 20px;
	}
	.saveBtn .el-button{
		padding: 12px 35px;
	}
	.checkInInfo .el-date-editor,.checkInInfo .double .el-date-editor{
		width: 100%;
		max-width: 200px;
	}
	.checkInInfo  .el-textarea{
		max-width: 730px;
	}
</style>