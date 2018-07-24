<template>
	<div class="role">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>管理员</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">员工管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>员工管理</span>
			</div>
			<div class="line"></div>
			<div class="role_list">
				<!--筛选条件-->
				<div class="filter">
					<div class="inlineBlock">
						<!--<div class="block left">
							<span class="demonstration">日期范围：</span>
							<el-date-picker 
								v-model="fiterTime" 
								type="daterange" 
								align="right" 
								unlink-panels 
								range-separator="至" 
								start-placeholder="开始日期" 
								end-placeholder="结束日期" 
								value-format="yyyy-MM-dd HH:mm:ss"
								:picker-options="pickerOptions">
							</el-date-picker>
						</div>-->
						<div class="left" style="width: 200px;">
							<el-input v-model="search" placeholder="请输入员工名字"></el-input>
						</div>
						<div class="left" style="margin-left: 10px;">
							<el-button type="success" @click="searchUser"><span class="iconfont icon-search"></span>搜索</el-button>
						</div>
						<div class="clear"></div>
					</div>
				</div>
				<!--批量操作-->
				<div class="editBtn">
					<!--<el-button @click="toggleSelection" style="float: left;">全选</el-button>-->
					<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>
					<el-button @click="addUser" type="primary"><span class="iconfont icon-crm11"></span>添加员工</el-button>
				</div>
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<!--<el-table-column label="ID" width="80"  prop="id">
							<template slot-scope="scope">{{ scope.row.id }}</template>
						</el-table-column>-->
						<el-table-column prop="personName" label="登录名" width="150">
						</el-table-column>
						<el-table-column prop="department" label="部门" width="150" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="roleName" label="角色" width="150" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="mobileNum" label="手机" width="150">
						</el-table-column>
						<el-table-column prop="createTime" label="加入时间" width="150">
							<template slot-scope="props">
							 	<div>{{ timeFomit(props.row.createTime)[0] }}</div>
							 	<div>{{ timeFomit(props.row.createTime)[1] }}</div>
							</template>
						</el-table-column>
						<el-table-column label="操作">
					      <template slot-scope="scope">
					      	
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          @click="handleEdit(scope.$index, scope.row)" :disabled="checkPower(scope.row.id)">编辑</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          type="danger"
					          @click="handleDelete(scope.$index, scope.row)" :disabled="checkPower(scope.row.id)">删除</el-button>
					      </template>
					    </el-table-column>
					</el-table>
				</div>
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
			  <el-form v-loading="formLoading" ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">
			  	<el-form-item label="员工名" prop="name">
			  		<el-input v-model="ruleForm.name" :disabled="ruleForm.nameDis"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="初始密码" prop="pass" v-if="ruleForm.dialogShow">
			  		<el-input v-model="ruleForm.pass" type="password"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="确认密码" prop="checkPass" v-if="ruleForm.dialogShow">
			  		<el-input v-model="ruleForm.checkPass" type="password"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="手机" prop="mobile">
			  		<el-input v-model="ruleForm.mobile"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="所在城市：" prop='selectedOptions'>
						<el-cascader :options="ruleForm.options"  v-model="ruleForm.selectedOptions" @change="handleChange">
						</el-cascader>
				</el-form-item>
			  	<!--部门选择-->
			  	<el-form-item label="选择部门">
				  	<template v-model="ruleForm.departments">
						<el-select v-model="ruleForm.department" placeholder="请选择"  @change="inputFlag=1">
							<el-option v-for="item in ruleForm.departments" :key="item.id" :label="item.deptName" :value="item.id+','+item.deptName">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			  	<!--权限选择-->
			  	<el-form-item label="选择角色" prop="checkedRole">
				  	<template v-model="ruleForm.roles">
						<el-select v-model="ruleForm.checkedRole" placeholder="请选择"  @change="inputFlag=1">
							<el-option v-for="item in ruleForm.roles" :key="item.id" :label="item.roleName" :value="item.id+','+item.roleName">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.addDisabled">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
//获取城市三级联动信息
import cityData from  "../../commJs/city.data-3.js"
export default {
	name:'role',
	data(){
		//定义表单校验方法
		//密码验证
		let checkPsw=(rule, value, callback)=>{
			if(this.ruleForm.dialogShow){
				let pswTest=/^.{6,20}$/;
				if(!pswTest.test(value)){
					callback(new Error('请输出长度在6~20之间的密码'))
				}else{
					callback();
				}
			}
		};
		//确认密码
		let checkRePsw=(rule, value, callback)=>{
			if(this.ruleForm.dialogShow){
				let pswTest=/^.{6,20}$/;
				if(!pswTest.test(value)){
					callback(new Error('请输出长度在6~20之间的密码'))
					return;
				}
				if(value!==this.ruleForm.pass){
					callback(new Error('两次密码输入不一致'));
					return;
				}
				callback();	
			}
		};
		//手机号码验证
		let checkMobile=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
		return{
			tableData: [],
	        //加载
	        multipleSelection: [],//多选
	        multipleFlag:false,//全选状态
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        dialogVisible: false,//弹窗状态
	        dialogTitle:'提示',
	        inputFlag:0,//表单修改标记
	        formLoading:true,//弹窗数据加载
	        ruleForm:formInit(),
	        //表单验证
	        rules:{
	        	name:[
	        		{ required: true, message: '请输入管理员名称', trigger: 'blur' }
	        	],
	        	pass:[
	        		{   validator: checkPsw, trigger: 'blur' }
	        	],
	        	checkPass:[
	        		{   validator: checkRePsw, trigger: 'blur' }
	        	],
	        	mobile:[
	        		{  required: true, validator: checkMobile, trigger: 'blur' }
	        	],
	        	checkedRole:[
	        		{ required: true, message: '请选择角色', trigger: 'blur' }
	        	],
	        	selectedOptions:[
	        		{ required: true, message: '请选择城市', trigger: 'blur' }
	        	]
	        },
	        //筛选条件
	        pickerOptions: {
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
	        fiterTime: '',
	        search:''
		}
	},
	//挂载
	mounted(){
		axiosUserList(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
		//检查权限
		checkPower:(id)=>{
			if(id==1){
				return true;
			}else{
				return false;
			}
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
      //添加
      addUser(){
      	this.ruleForm=formInit();
      	
      	this.dialogTitle="添加员工";
      	this.dialogVisible = true;//打开弹窗
		//初始化表单
		this.rules.pass[0].required=true;
		this.rules.checkPass[0].required=true;
		
		//获取角色信息
		 roleList(this);
      	/*let ele=this;
      	//获取部门信息
      	this.$ajax.post('http://192.168.2.164:8080/department', {
			  })
			  .then(function (response) {
			  	//所有部门信息
			  	if(response.status=="200"){
			  		ele.ruleForm.departments=response.data;
			   		ele.dialogVisible = true;
			  	}else{
			  		 ele.$message.error('部门信息获取失败！');
			  	}
			   	
			  })
			  .catch(function (error) {
			    console.log(error);
			    ele.$message.error('部门信息获取失败！');
			});*/
      },
      //编辑
      handleEdit(index, row) {
        //console.log(index, row);
        this.dialogTitle="编辑员工";
        this.dialogVisible = true;//打开弹窗
        //隐藏密码
        this.ruleForm.dialogShow=false;
        //禁用输入框
      	this.ruleForm.nameDis=true;
      	//输入框赋值
      	let editData=this.tableData;
      	this.ruleForm.name=editData[index].personName;
      	this.ruleForm.mobile=editData[index].mobileNum;
      	if(editData[index].departmentID){
      		this.ruleForm.department=editData[index].departmentID+','+editData[index].departmentName;
      	}
      	this.ruleForm.checkedRole=editData[index].roleID+','+editData[index].roleName;
      	//获取ID
      	this.ruleForm.userID=editData[index].id;
      	//城市信息selectedOptions
      	if(editData[index].provinceID){
      		this.ruleForm.selectedOptions.push(editData[index].provinceID.toString());
      		this.ruleForm.selectedOptions.push(editData[index].cityID.toString());
      		this.ruleForm.selectedOptions.push(editData[index].districtID.toString());
      	}
      	//获取角色信息
		 roleList(this);
      },
      //删除
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('确定删除当前用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data={"id":row.id};
          delUser(this,data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
	      	this.$confirm('确定删除当前用户吗?', '提示', {
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
	        	delUser(this,data);
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	        });
	    }
      },
      //分页方法
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.pageSize=val;
        axiosUserList(this);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.currentPage=val;
        axiosUserList(this);
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
      },
       //城市三级联动
      handleChange(value) {
      	this.inputFlag=1;
        //console.log(value);
      },
      //查找员工
      searchUser(){
      	this.currentPage=1;
      	axiosUserList(this);
      },
      //时间格式化
      timeFomit(timeDate){
      	//console.log(timeDate)
      	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
      	let timeArr=time.split(' ');
      	return timeArr;
      },
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	//按钮禁用
          	this.ruleForm.addDisabled=true;
          	//提交表单
          	let data={};
		    //部门
		    let departmentArr=this.ruleForm.department.split(',');
		    //角色
			let roleArr=this.ruleForm.checkedRole.split(',');
			 //获取城市ID信息
            let locationIdArr=this.ruleForm.selectedOptions;
            //获取城市名称
            let cityTxt=$('.el-cascader').eq(0).text();
      		let resultStr = cityTxt.replace(/\ +|\r+|\n+|\t+/g, ""); //去掉空格
            let cityArr=resultStr.split('/');
          	data={
          		"personName":this.ruleForm.name,
          		"departmentID":departmentArr[0],
          		"departmentName":departmentArr[1],
          		"roleID":roleArr[0],
          		"roleName":roleArr[1],
          		"status":0,
          		"mobileNum":this.ruleForm.mobile,
          		'provinceID':locationIdArr[0] || '',
            	'province':cityArr[0] || '',
            	'cityID':locationIdArr[1] || '',
            	'city':cityArr[1] || '',
            	'districtID':locationIdArr[2] || '',
            	'district':cityArr[2] || ''
          	}
          	if(this.ruleForm.dialogShow){
          		data.password=this.ruleForm.pass;
          		updateList("addEmployeeInfo",this,data)
          	}else{
          		data.id=this.ruleForm.userID;
          		updateList("updEmployeeInfo",this,data)
          	}
          } else {
            this.$message.error('表单提交失败！');
            return false;
          }
        });
      }
    }
}
//表单初始化
function formInit(){
	let data={
		        name: '',
		        nameDis:false,
		        pass:'',
		        mobile:'',
		        checkPass:'',
		        sex:1,
				departments: [],
			    department:'',
		        //角色选择
		        checkAll: false,
		        checkedRole: "",
		        roles: [],
		        isIndeterminate: false,
		        addDisabled:false,
	        	dialogShow:true,//输入框的显示与隐藏
	        	userID:"",//用户ID
	        	options:cityData.cityData3,//城市数据
         		selectedOptions: []//所在城市
	        }
	return data;
}
//请求数据列表
function axiosUserList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"personName":obj.search
	}
	if(obj.fiterTime){
		data.beginTime=obj.fiterTime[0],
		data.endTime=obj.fiterTime[1]
	}	
	obj.$ajax.post(obj.$store.state.localIP+"queryEmployeeInfo",data)
		.then((response)=>{
			//console.log(obj.tableData)
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					//用户列表
					obj. tableData=response.data.empInfoList;
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
//新增与修改用户
function updateList(url,obj,data){
	let loading=openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+url,data)
	.then((response)=>{
    	//console.log(response)
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
	  			obj.$message({
		          message: '操作成功!',
		          type: 'success'
		       	});
		       	obj.dialogVisible = false;
		       	//重新请求数据列表
		       	axiosUserList(obj);
		    }else{
		    	obj.$message.error(response.data.retMsg);
		    }
		}
		obj.ruleForm.addDisabled=false;
	})
	.catch((error)=>{
		loading.close();
		obj.ruleForm.addDisabled=false;
		console.log(error)
		obj.$message.error('网络连接出错~~');
	})
}
//删除用户
function delUser(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"delEmployeeInfo",data)
	.then((response)=>{
    	//console.log(response)
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
	  			obj.$message({
		          message: '删除成功!',
		          type: 'success'
		       });
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
		       	//重新请求数据列表
		       	axiosUserList(obj);
		    }else{
		    	obj.$message.error(response.data.retMsg);
		    }
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error)
		obj.$message.error('网络连接出错~~');
	})
}
//获取所有角色列表
function roleList(obj){
	obj.formLoading=true;
	obj.ruleForm.addDisabled=true;
	obj.$ajax.post(obj.$store.state.localIP+'queryAllRole')
	.then((response) => {
	  	if(response.status==200){
	  		//console.log(response)
	  		if(response.data.retCode==0){
	  			if(response.data.roleList.length==0){
	  				obj.$confirm('暂无角色信息,是否前往角色管理添加角色?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	obj.dialogVisible = false;//关闭弹窗
			        	obj.$router.push("/roleManage");
			        }).catch(() => { 
			        	obj.dialogVisible = false;//关闭弹窗
			        });
	  			}else{	  				
	  				obj.ruleForm.roles=response.data.roleList;
	  			}
	  			obj.formLoading=false;
	  			obj.ruleForm.addDisabled=false;
	  		}else{
	  			obj.$message.error(response.data.retMsg);
	  		}
	  	}	
	  })
	  .catch((error) => {
	    console.log(error);
	    obj.$message.error('网络连接错误~~');
	});
}
</script>

<style scoped>
	.el-table__row{
		cursor: pointer;
	}
	.el-table__header th,.el-table__header td{
		text-align: center !important;
	}
	.editBtn{
		width: 100%;
		text-align: right;
		margin-bottom: 20px;
		box-sizing: border-box;
	}
	.edit_dialog .el-checkbox+.el-checkbox{
		margin-left: 0px;
	}
	.el-dialog .el-form-item__content .el-checkbox{
		margin-left: 30px !important;
	}
	.el-dialog .el-form-item__content .checkBoxBg{
		margin-left: 20px !important;
		width: 90%;
		background: #EFEFEF;
		padding-left: 10px;
		box-sizing: border-box;
	}
	.el-table--border th, .el-table__fixed-right-patch{
		box-sizing: border-box !important;
	}
	.iconfont{
		font-size: 14px;
		margin: 0 auto;
	}
	.filter .left{
		float: left;
	}
	.el-cascader{
		width: 100%;
	}
	.el-date-editor--daterange.el-input__inner{
		width: 280px;
	}
	.filter{
		width: 100%;
		box-sizing: border-box;
	}
	.inlineBlock{
		margin:20px 0px;
	}
	.el-select{
		width:100%;
	}
</style>