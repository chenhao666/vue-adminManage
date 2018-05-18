<template>
	<div class="role">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>管理员</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">权限管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>权限管理</span>
			</div>
			<div class="line"></div>
			<div class="role_list">
				<!--批量操作-->
				<div class="editBtn">
					<!--<el-button @click="toggleSelection" style="float: left;">全选</el-button>-->
					<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>
					<el-button @click="addRole" type="primary"><span class="iconfont icon-crm11"></span>添加权限</el-button>
				</div>
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"   @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<!--<el-table-column label="ID" width="80" prop="id">
							<template slot-scope="scope">{{ scope.row.id }}</template>
						</el-table-column>-->
						<el-table-column prop="functionName" label="节点名称" width="150">
						</el-table-column>
						<el-table-column prop="fitField" label="字段名" width="300" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="操作">
					      <template slot-scope="scope">
	
					        <el-button
					          size="mini"
					          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					        <el-button
					          size="mini"
					          type="danger"
					          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
			  <el-form v-loading="formLoading" ref="ruleForm" :model="form" :rules="rules" label-width="80px">
			  	<el-form-item label="父级节点" prop="parentNode">
			  		<el-cascader :options="form.options" v-model="form.parentNode" change-on-select @change="getParentNode"></el-cascader>
			  	</el-form-item>
			  	<el-form-item label="节点名称" prop="name">
			  		<el-input v-model="form.name"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="匹配字段" prop="nodeName">
			  		<el-input v-model="form.nodeName"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="form.addDisabled">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name:'role',
	data(){
		//表单验证
		//验证是否选择父节点
		let checkParent = (rule ,value,callback) => {
			if(this.form.parentNode.length>0){
				callback();
			}else{
				callback(new Error('请选择父节点'));
			}
		}
		return{
			tableData: this.$store.state.userPower,
	        multipleSelection: [],
	        multipleFlag:false,//全选状态
	        dialogVisible: false,//弹窗状态
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        formLoading:false,//弹窗数据加载
	        dialogTitle:'提示',
	        dialogMark:0,//弹窗标记
	        inputFlag:0,//表单修改标记
	        form:formInit(),
	        //表单验证
		    rules:{
		    	name: [
			        { required: true, message: '请输入节点名称', trigger: 'blur' }
			    ],
			    parentNode: [
			        { validator: checkParent, trigger: 'blur' }
			    ],
			    nodeName: [
			         { required: true, message: '请输入字段名称', trigger: 'blur' }
			    ]
		    }
		}
	},
	//挂载
	mounted(){		
		//获取列表
		axiosPowerList(this);
		//提示信息
		const h = this.$createElement;
		this.$notify({
          title: '提示',
           message: h('i', { style: 'color: teal'}, '权限节点修改后将在下次登录时生效')
        });
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
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
      addRole(){
      	//表单重置
      	this.form=formInit();
      	this.dialogTitle="添加权限节点";
      	this.dialogVisible = true;
      	powerAll(this,function(obj){});
      	this.dialogMark=0;
      },
      //编辑
      handleEdit(index, row) {
        //console.log(index, row);
        this.dialogTitle="编辑权限节点";
        this.dialogVisible = true;//打开弹窗
        this.dialogMark=1;
        //获取id
        this.form.powerID=row.id;
        //console.log(row)
        powerAll(this,function(obj){
        	//输入框赋值
	      	let editData=obj.tableData;
	      	//console.log(editData)
	      	let parentIdArr=[];
	      	if(editData[index].parentID){
	      		let parentId=editData[index].parentID;
	      		/*遍历*/
	      		for(let i=0;i<editData.length;i++){
	      			if(editData[i].id==parentId){
	      				if(editData[i].parentID){
	      					parentIdArr.push(editData[i].parentID);
	      					parentIdArr.push(parentId)
			      			obj.form.parentNode=parentIdArr;
	      				}else{
			      			parentIdArr.push(parentId);
			      			obj.form.parentNode=parentIdArr;
			      		}		
	      			}
	      		}
	      	}else{
	      		obj.form.parentNode=[""]
	      	}
	      	//console.log(obj.form.parentNode)
	      	obj.form.name=editData[index].functionName;
	      	obj.form.nodeName=editData[index].fitField;
        });
      },
      //删除
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('确定删除当前节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         	let data={"id":row.id};
          	delPower(this,data);
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
      		this.$confirm('确定删除当前节点吗?', '提示', {
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
	        	delPower(this,data);
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
       // console.log(`每页 ${val} 条`);
        this.pageSize=val;
        axiosPowerList(this);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.currentPage=val;
        axiosPowerList(this);
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
      //选择父节点
      getParentNode(value){
      	this.form.parentNode=value;
      	this.inputFlag=1;
      	//console.log(value)
      },
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	//按钮禁用
          	this.form.addDisabled=true;
          	//提交角色信息
          	let parentNode=this.form.parentNode;
          	let parentID="";
          	let data={};
          	if(parentNode.length>0){
          		parentID=parentNode[parentNode.length-1];
          	}else{
          		parentID=parentNode.join('');
          	}
          	data={
          		"functionType":0,
          		"functionName":this.form.name,
          		"fitField":this.form.nodeName,
          		"parentID":parentID
          	}
          	if(!this.dialogMark){
          		updateList("addFunctionInfo",this,data)
          	}else{
          		data.id= this.form.powerID;
          		updateList("updFunctionInfo",this,data)
          	}
          } else {
            this.$message.error('表单提交失败！');
            return false;
          }
        });
      }
    }
}
//请求数据列表
function axiosPowerList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryFunctionInfo",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					//用户列表
					obj.tableData=response.data.funcInfoList;
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
/*表单初始化*/
function formInit(){
	let data={
	        	name:'',
	        	nodeName:'',
	        	addDisabled:false,
	        	powerID:'',
	        	//父节点
	        	parentNode:[],
	        	options: []
	        }
	return data;
}
//所有权限节点获取
function powerAll(obj,callback){
	obj.formLoading=true;
	obj.form.addDisabled=true;
	obj.$ajax.post(obj.$store.state.localIP+"queryAllFunction")
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				if(response.data.retCode==0){
					let objStr=response.data.funcList;
					let str =JSON.stringify(objStr);
					let newStr=str.replace(/sonList/g,"children");
					let newStr2=newStr.replace(/\"id\"/g,'"value"');
					let newStr3=newStr2.replace(/\"functionName\"/g,'"label"');
					//console.log(newStr3)
					let newStr4=newStr3.replace(/\,\"children\"\:\[\]/g,'');
					let newObj=JSON.parse(newStr4);
					newObj.unshift({
						"value":"",
						"label":"添加一级节点"
					})
					obj.form.options=newObj;
					obj.formLoading=false;
					obj.form.addDisabled=false;
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
			callback(obj);
		})
		.catch((error)=>{
			console.log(error);
			obj.$message.error("网络连接错误~~");
			callback(obj);
		})
}
//新增/修改节点信息
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
		       	axiosPowerList(obj);
		    }else{
		    	obj.$message.error(response.data.retMsg);
		    }
		}
		obj.form.addDisabled=false;
	})
	.catch((error)=>{
		loading.close();
		obj.form.addDisabled=false;
		console.log(error)
		obj.$message.error('网络连接出错~~');
	})
}
//删除权限
function delPower(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"delFunctionInfo",data)
	.then((response)=>{
    	//console.log(response)
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
	  			obj.$message({
		          message: '删除成功!',
		          type: 'success'
		       });
		       	//重新请求数据列表
		       	axiosPowerList(obj);
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
	.editBtn{
		margin-top: 20px;
		margin-bottom: 20px;
		text-align: right;
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
	.choosePower{
		max-height: 200px;
		overflow: auto;
	}
	.el-select{
		width: 100%;
	}
	.iconfont{
		font-size: 14px;
		margin: 0 auto;
	}
	.el-cascader{
		width: 100%;
	}
</style>