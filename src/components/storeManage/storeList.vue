<template>
  	<div class="storeList">
	    <el-breadcrumb separator-class="el-icon-arrow-right">
	      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
	      <el-breadcrumb-item :to="{ path: '/storeManage/storeList' }">门店管理</el-breadcrumb-item>
	      <el-breadcrumb-item class="fontWeight">门店列表</el-breadcrumb-item>
	    </el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>门店列表</span>
			</div>
			<div class="line"></div>
			<div class="role_list">
				<!--批量操作-->
				<div class="editBtn">
					<el-button @click="addUser" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加门店</el-button>
					<div class="clear"></div>
				</div>
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark">
						<el-table-column prop="storeName" label="门店名称" min-width="100" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="header" label="负责人" min-width="150" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="headerMobile" label="负责人电话" min-width="100" >
						</el-table-column>
						<el-table-column prop="shipAddress" label="收货地址" min-width="150"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="shipper" label="收货人" min-width="100">
						</el-table-column>
						<el-table-column prop="shipMobile" label="收货人电话" min-width="100">
						</el-table-column>
						<el-table-column label="操作" v-if="editBtnShow || delBtnShow">
					      <template slot-scope="scope">
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          v-if="editBtnShow"
					          @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          @click="goInventory(scope.$index, scope.row)" >库存</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          @click="goSaleManage(scope.$index, scope.row)" >卖出</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          type="danger"
					          v-if="delBtnShow"
					          @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
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
			  	<el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">
				  	<el-form-item label="门店名称" prop="storeName">
				  		<el-input v-model="ruleForm.storeName"  @change="inputFlag=1"></el-input>
				  	</el-form-item>
				  	<el-form-item label="负责人" prop="storeUsername">
				  		<el-input v-model="ruleForm.storeUsername"  @change="inputFlag=1"></el-input>
				  	</el-form-item>
				  	<el-form-item label="负责人电话" prop="storeUserTel">
				  		<el-input v-model="ruleForm.storeUserTel"  @change="inputFlag=1"></el-input>
				  	</el-form-item>
				  	<el-form-item label="收货地址" prop="address">
				  		<el-input v-model="ruleForm.address"  @change="inputFlag=1"></el-input>
				  	</el-form-item>
				  	<el-form-item label="收货人：" prop='receiveName'>
						<el-input v-model="ruleForm.receiveName"  @change="inputFlag=1"></el-input>
					</el-form-item>
				  	<el-form-item label="收货电话：" prop='receiveTel'>
						<el-input v-model="ruleForm.receiveTel"  @change="inputFlag=1"></el-input>
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
	name:'storeList',
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
		//手机号码验证
		let checkTel=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
		return{
			addBtnShow:false,
			delBtnShow:false,
			editBtnShow:false,
			roleAuthList:this.$store.state.roleAuthList,
			tableData: [],
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        dialogVisible: false,//弹窗状态
	        dialogTitle:'提示',
	        editId:'',
	        inputFlag:0,//表单修改标记
	        ruleForm:formInit(),
	        //表单验证
	        rules:{
	        	storeName:[
	        		{ required: true, message: '请输入门店名称', trigger: 'blur' }
	        	],
	        	storeUsername:[
	        		{ required: true, message: '请输入门店负责人', trigger: 'blur' }
	        	],
	        	storeUserTel:[
	        		{  required: true, validator: checkMobile, trigger: 'blur' }
	        	],
	        	address:[
	        		{ required: true, message: '请输入收货地址', trigger: 'blur' }
	        	],
	        	receiveName:[
	        		{ required: true, message: '请输入收货人', trigger: 'blur' }
	        	],
	        	receiveTel:[
	        		{  required: true, validator: checkTel, trigger: 'blur' }
	        	]
	        }
		}
	},
	//挂载
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
		axiosStoreList(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
      //添加
      	addUser(){
	      	this.editId="";
	      	this.ruleForm=formInit();
	      	
	      	this.dialogTitle="添加门店";
	      	this.dialogVisible = true;//打开弹窗
		
      	},
      //编辑
      	handleEdit(index, row) {
	      	//console.log(row)
	        //console.log(index, row);
	        this.ruleForm=formInit();
	        this.dialogTitle="编辑员工";
	        this.dialogVisible = true;//打开弹窗
       		
       		this.editId=row.storeId;
       		
       		this.ruleForm.storeUsername=row.header;
	        this.ruleForm.storeUserTel=row.headerMobile;
	        this.ruleForm.address=row.shipAddress;
	        this.ruleForm.receiveTel=row.shipMobile;
	        this.ruleForm.receiveName=row.shipper;
	        this.ruleForm.storeName=row.storeName;
      	},
      //删除
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('确定删除当前用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data={"storeId":row.storeId};
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
	        		delArr.push(multi[i].storeId);
	        	}
	        	let data={"storeId":delArr.join(',')};
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
        axiosStoreList(this);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.currentPage=val;
        axiosStoreList(this);
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
      	axiosStoreList(this);
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
          	//提交表单
          	let data={};
          	data={
          		"header":this.ruleForm.storeUsername,
	            "headerMobile":this.ruleForm.storeUserTel,
	            "shipAddress":this.ruleForm.address,
	            "shipMobile":this.ruleForm.receiveTel,
	            "shipper":this.ruleForm.receiveName,
	            "storeName":this.ruleForm.storeName
          	}
          	if(this.editId){
          		data.storeId=this.editId;
          	}
          	saveList(this,data)
          	
          } else {
            this.$message.error('表单提交失败！');
            return false;
          }
        });
      },
      //库存
      goInventory(index,row){
      	//console.log(row)
      	this.$router.push({path:'/storeManage/inventory',query:{num:Base64.encode(row.storeId)}})
      },
      //卖出
      goSaleManage(index,row){
      	//console.log(row)
      	this.$router.push({path:'/storeManage/saleManage',query:{num:Base64.encode(row.storeId)}})
      }
    }
}
//表单初始化
function formInit(){
	let data={
		        storeName: '',
		        storeUsername:'',
		        storeUserTel:'',
		        address:'',
		        receiveName:'',
		        receiveTel:''
	        }
	return data;
}
//请求数据列表
function axiosStoreList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryStoreList",data)
		.then((response)=>{
			//console.log(obj.tableData)
			//console.log(response.data);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.data.countNum;
					//用户列表
					obj. tableData=response.data.data.dataList;
				}else{
					obj.$message.error(response.data.data.retMsg);
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
function saveList(obj,data){
	let loading=openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"saveStore",data)
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
		       	axiosStoreList(obj);
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
	obj.$ajax.post(obj.$store.state.localIP+"deleteStore",data)
	.then((response)=>{
    	//console.log(response)
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
	  			obj.$message({
		          message: '删除成功!',
		          type: 'success'
		       });
		        var list=data.storeId.toString();
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
		       	axiosStoreList(obj);
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
		margin-top:20px;
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