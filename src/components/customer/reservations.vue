<template>
	<div class="reservations">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>电话销售</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">预约&意向</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>预约&意向</span>
			</div>
			<el-tabs @tab-click="handleClick"  v-model="connectType">
			    <el-tab-pane label="新用户" name="1"></el-tab-pane>
			    <el-tab-pane name="3">
			    	<span slot="label">需回访<el-badge class="mark" :value="callBackNum" /></span>
			    </el-tab-pane>
			    <el-tab-pane label="已完成" name="10" ></el-tab-pane>
			</el-tabs>
			
			<div class="reservations_search_form">
				<el-form ref="form" :model="form" label-width="85px" class="formBox">
							<el-input v-model="form.name" placeholder="姓名"></el-input>
							<el-input v-model="form.mobile" placeholder="手机号"></el-input>
							<el-select v-model="form.type" placeholder="预约方式">
								<el-option label="全部" value="-1"></el-option>
								<el-option label="Web" value="0"></el-option>
								<el-option label="App" value="1"></el-option>
								<el-option label="获取资料" value="2"></el-option>
								<el-option label="客户致电" value="3"></el-option>
								<el-option label="预约" value="5"></el-option>
								<el-option label="其他" value="4"></el-option>
							</el-select>
							<el-date-picker 
								v-if="!timeFlag"
								v-model="form.dateRegion" 
								type="datetimerange" 
								:picker-options="pickerOptions2" 
								value-format="yyyy-MM-dd HH:mm:ss"
								range-separator="至" 
								start-placeholder="预约时间" 
								end-placeholder="预约时间" 
								align="right">
							</el-date-picker>
							<el-date-picker 
								v-if="timeFlag"
								v-model="form.callbackTime" 
								type="datetimerange" 
								:picker-options="pickerOptions2" 
								value-format="yyyy-MM-dd HH:mm:ss"
								range-separator="至" 
								start-placeholder="回访时间" 
								end-placeholder="回访时间" 
								align="right">
							</el-date-picker>
							<el-button  type="success" @click="searchList" style="padding:12px 26.5px;float:right"><span class="iconfont icon-search"></span>搜索</el-button>
							<div class="clear"></div>
						<div style="text-align: right;margin-top: 15px;">
							<el-date-picker 
				    			v-if="searchOffset"
				    			v-model="form.dateConnect" 
				    			type="datetimerange" 
				    			:picker-options="pickerOptions2" 
				    			value-format="yyyy-MM-dd HH:mm:ss"
				    			range-separator="至" 
				    			start-placeholder="回访时间" 
				    			end-placeholder="回访时间" 
				    			align="right"
				    			style="float:left">
				    		</el-date-picker>
				    		<el-button type="primary" @click="addCustomer" v-if="addBtnShow" style="padding:12px 12.5px"><span class="iconfont icon-crm11"></span>新增登记</el-button>
							<div class="clear"></div>
						</div>
				</el-form>
			</div>
			
			<div class="curstomerList">
				<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
					<!--<el-table-column type="selection" width="55">
					</el-table-column>-->
					<!--<el-table-column label="ID" width="60" prop="id">
						<template slot-scope="scope">{{ scope.row.orderID }}</template>
					</el-table-column>-->
					<el-table-column prop="custName" label="姓名" min-width="120" >
					</el-table-column>
					<el-table-column prop="sex" label="性别" width="75">
					</el-table-column>
					<el-table-column prop="mobileNum" label="手机号" min-width="120">
					</el-table-column>
					<el-table-column prop="inletWay" label="预约方式" min-width="120">
					</el-table-column>
					<el-table-column prop="appTime" label="预约时间" v-if="!timeFlag" min-width="120">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.appTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.appTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="callTime" label="回访时间" v-if="searchOffset"  min-width="120">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.callTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.callTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="callBackTime" label="回访时间" v-if="timeFlag" min-width="120">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.callBackTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.callBackTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作"  v-if="!connectTypeShow && !editBtnShow">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleLook(scope.$index, scope.row)" v-if="connectTypeShow">详情</el-button>
							<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" v-if="!connectTypeShow && editBtnShow">回访</el-button>
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
			</div>
		</el-card>		
	</div>
</template>

<script>
var timer; 
export default {
	name:'reservations',
	data () {
		return {
			addBtnShow:false,
			delBtnShow:false,
			editBtnShow:false,
			roleAuthList:sessionStorage.getItem('roleAuthList'),
			tableData: [],
			pickerOptions2: {
	          shortcuts: [{
	            text: '最近一周',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近三个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
	              picker.$emit('pick', [start, end]);
	            }
	          }]
	        },
	        callBackNum:0,//当天需回访的条数
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        connectType:(this.$store.state.status).toString(),//默认沟通类型
			form: initForm()
		}
	},
	computed:{
		//沟通类型展示不同结果
		connectTypeShow(){
			if(this.connectType=="1"){
				return false;
			}else{
				return true;
			}
		},
		searchOffset(){
			if(this.connectType=="10"){
				return true;
			}else{
				return false;
			}
		},
		//
		timeFlag(){
			if(this.connectType=="3"){
				return true;
			}else{
				return false;
			}
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
		//初始化请求列表
		customerList(this);
		//请求需回访
		callBackResult(this);
		let obj=this;
		timer=setInterval(function(){
			callBackResult(obj);
		},10000)
		//console.log(this.connectType)
	},
	destroyed:function(){
		clearInterval(timer);
	},
	methods:{
		//新增
		addCustomer(){
			this.$router.push({path:"/customer/reservations/addCustomer"})
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
      	handleLook(index,row){
      		//console.log(row)
      		//Base64加密
      		//let Base64=new Base64();
      		let num=Base64.encode(row.id.toString());
      		this.$store.commit("connectStatus",this.connectType);
      		this.$router.push({path:"/customer/reservations/find/"+num,query:{query:Base64.encode(row.orderID.toString())}})
      	},
      	handleEdit(index, row) {
      		//console.log(row)
      		//Base64加密
      		//let Base64=new Base64();
      		let num=Base64.encode(row.id.toString());
      		this.$store.commit("connectStatus",this.connectType);
      		this.$router.push({path:"/customer/reservations/"+num,query:{query:Base64.encode(row.orderID.toString())}})
      	},
      	//分页方法
	    handleSizeChange(val) {
	     // console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	      	customerList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        customerList(this);
	    },
	    //搜索
	    searchList(){
	    	this.currentPage=1;
	    	customerList(this);
	    },
	    //tab切换
	    handleClick(tab, event) {
        	//console.log(tab.index);
        	if(tab.index=="0"){
        		this.connectType="1";
        	}
        	if(tab.index=="1"){
        		this.connectType="3";
        	}
        	if(tab.index=="2"){
        		this.connectType="10";
        	}
      	},
      	//时间格式化
	  	timeFomit(timeDate){
	      	//console.log(timeDate)
	      	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	      	let timeArr=time.split(' ');
	      	return timeArr;
	    }
	},
	//监听
	watch:{
		connectType(){
			//清空时间
			this.form=initForm();
			//请求数据
			customerList(this);
		}
	}
}
//获取客户列表
function customerList(obj){
	const loading =openLoad(obj);	
	
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"status":obj.connectType,
		"custName":obj.form.name,
		"mobileNum":obj.form.mobile,
		"inletWay":obj.form.type
	}
	if(obj.form.type==-1){
		data.inletWay='';
	}
	//沟通时间
	if(obj.form.dateConnect){
		let appTimeArr=obj.form.dateConnect;
		data.callBeginTime=appTimeArr[0];
		data.callEndTime=appTimeArr[1];
	}
	//预留时间
	if(obj.form.dateRegion){
		let appTimeArr=obj.form.dateRegion;
		data.appBeginTime=appTimeArr[0];
		data.appEndTime=appTimeArr[1];
	}
	//回访时间
	if(obj.form.callbackTime){
		let appTimeArr=obj.form.callbackTime;
		data.callBackBeginTime=appTimeArr[0];
		data.callBackEndTime=appTimeArr[1];
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryAppointInfoList",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					let list=response.data.csList;
					let wayArr=['Web','App','获取资料','客户致电','其他','预约'];
					for(let i=0;i<list.length;i++){
						if(list[i].sex=="0"){
							list[i].sex="男";
						}else if(list[i].sex=="1"){
							list[i].sex="女";
						}else{
							list[i].sex=""
						}
						if(list[i].inletMode){
							list[i].inletWay=wayArr[list[i].inletWay]+'-'+list[i].inletMode;
						}else{							
							list[i].inletWay=wayArr[list[i].inletWay];
						}
					}
					//用户列表
					obj.tableData=list;
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
//当天需回访
function callBackResult(obj){
	obj.$ajax.post(obj.$store.state.localIP+"queryArrivedPointCount")
		.then((response)=>{
			if(response.data.retCode==0){
				obj.callBackNum=response.data.countNum || 0;
			}
		})
		.catch((error)=>{
			//loading.close();
			console.log(error);
			//obj.$message.error("网络连接错误~~");
		})
}
function initForm(){
	let data={
	          name: '',
	          mobile: '',
	          type: '',
	          dateRegion:'',
	          dateConnect:'',
	          callbackTime:''//回访时间
	        }
	return data;
}
</script>

<style scoped>
	@media screen and (max-width: 1300px){
		.reservations_search_form .el-input{
			width: 120px;
		}
		.reservations_search_form .el-select{
			width: 120px;
		}
	}
	@media screen and (min-width: 1301px){
		.reservations_search_form .el-input{
			width: 150px;
		}
		.reservations_search_form .el-select{
			width: 150px;
		}
	}
	.reservations_search_form .el-date-editor--datetimerange.el-input__inner{
		width: 240px;
	}
	.iconfont{
		font-size: 12px;
	}

	.reservations_search_form .el-button+.el-button{
		margin-left: 0px;
	}
	.formBox{
		padding-bottom:20px;
	}
	.curstomerList{
		padding-bottom:20px;
	}
	.reservations .el-tabs{
		box-sizing: border-box;
	}
	.reservations_search_form{
		margin-top: 30px;
	}
</style>