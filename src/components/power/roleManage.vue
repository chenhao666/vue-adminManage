<template>
	<div class="role">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>管理员</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">角色管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>角色管理</span>
			</div>
			<div class="line"></div>
			<div class="role_list">
				<!--批量操作-->
				<div class="editBtn">
					<!--<el-button @click="toggleSelection" style="float: left;">全选</el-button>-->
					<el-button type="danger" v-if="delBtnShow" @click="delQuery" style="float: left;">批量删除</el-button>
					<el-button @click="addRole" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加角色</el-button>
					<div class="clear"></div>
				</div>
				
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"   @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<!--<el-table-column label="角色ID" width="80" prop="id">
							<template slot-scope="scope">{{ scope.row.id }}</template>
						</el-table-column>-->
						<el-table-column prop="roleName" label="角色名" min-width="150">
						</el-table-column>
						<el-table-column prop="roleRemark" label="描述" min-width="300"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="操作" v-if="editBtnShow || delBtnShow">
					      <template slot-scope="scope">	
					        <el-button
					          size="mini"
					          v-if="editBtnShow"
					          style="margin: 5px 5px;"
					          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					        <el-button
					          size="mini"
					          type="danger"
					          style="margin: 5px 5px;"
					          v-if="delBtnShow"
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
			  <el-form  v-loading="formLoading" ref="ruleForm" :model="form" :rules="rules" label-width="80px">
			  	<el-form-item label="角色名称" prop="name">
			  		<el-input v-model="form.name" @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<el-form-item label="备注">
			  		<el-input v-model="form.desc" @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	<!--权限选择-->
			  	<el-form-item label="网站权限">
			  		<el-tree
					  :data="form.powers"
					  show-checkbox
					  node-key="id"
					  :check-strictly="checkStrictly"
					  v-model="form.checkedPower"
					  @check-change="powerChange"
					  ref="tree"
					  :default-checked-keys="form.checkedPower"
					  :props="defaultProps">
					</el-tree>
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
		return{
			addBtnShow:false,
			delBtnShow:false,
			editBtnShow:false,
			roleAuthList:this.$store.state.roleAuthList,
			tableData: [],
	        multipleSelection: [],
	        multipleFlag:false,//全选状态
	        dialogVisible: false,//弹窗状态
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        formLoading:false,//弹窗数据加载
	        dialogTitle:'提示',
	        dialogMark:0,//弹窗标记
	        inputFlag:0,//输入框是否有修改
	        checkStrictly:false,//是否遵循父子不关联
	        form:formInit(),
	        defaultProps: {
		        children: 'children',
		        label: 'label'
		    },
	        //表单验证
		    rules:{
		    	name: [
			        { required: true, message: '请输入角色名称', trigger: 'blur' }
			    ]
		    }
		}
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	mounted(){
		//console.log(this.roleAuthList)
		if(this.roleAuthList.indexOf('1')>-1){
			this.addBtnShow=true;
		}
		if(this.roleAuthList.indexOf('2')>-1){
			this.delBtnShow=true;
		}
		if(this.roleAuthList.indexOf('3')>-1){
			this.editBtnShow=true;
		}
		//获取列表数据
		axiosRoleList(this)
		//提示信息
		const h = this.$createElement;
		this.$notify({
          title: '提示',
           message: h('i', { style: 'color: teal'}, '当前角色权限修改将在下次登录时生效')
        });
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
      //添加角色
      addRole(){
      	this.form=formInit();
      	this.dialogTitle="添加角色";
      	this.dialogVisible = true;
      	this.dialogMark=0;
      	//获取权限
      	roleList(this,function(obj){})
      },
      //编辑
      handleEdit(index, row) {
      	this.checkStrictly=true;
        //console.log(index, row);
        this.dialogTitle="编辑角色";
        this.dialogVisible = true;//打开弹窗
        this.dialogMark=1;
        //获取id
        this.form.roleID=row.id;
        //角色名称
        this.form.name=row.roleName;
        //备注
        this.form.desc=row.roleRemark;
        roleList(this,function(obj){
        	//console.log(row)
        	let list=row.operations;
        	//console.log(list)
        	let checkP=[];
        	for(let i=0;i<list.length;i++){
        		checkP.push(list[i].functionAuthorityID);
        		if(list[i].roleOperation){
        			let arr=list[i].roleOperation.split(',');
        			for(let j=0;j<arr.length;j++){
        				checkP.push(list[i].functionAuthorityID+'_'+arr[j]);
        			}
        		}
        	}
        	//console.log(checkP)
        	obj.form.checkedPower=checkP;
        	obj.checkStrictly=false;
        })
      },
      //删除
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('确定删除当前角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         	let data={"id":row.id};
          	delRole(this,data);
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
	      	this.$confirm('确定删除当前角色吗?', '提示', {
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
	        	delRole(this,data);
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
        axiosRoleList(this);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.currentPage=val;
        axiosRoleList(this);
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
      //权限选择
	  powerChange(){
      		let treeArr=this.$refs.tree.getCheckedNodes();
      		if(this.form.checkedPower.length != treeArr.length){
      			this.inputFlag=1;
      		}
	  },
      //表单提交
      submitForm(formName) {
      	//console.log(this.$refs.tree.getCheckedNodes());
      	//获取选中权限id
      	let powerArr=[];
      	var childArr=[];
      	let treeArr=this.$refs.tree.getCheckedNodes();
      	//console.log(treeArr)
      	for(let i=0;i<treeArr.length;i++){
      		if(!treeArr[i].type){
      			powerArr.push(treeArr[i].id);
	      		if(treeArr[i].parentID){      			
	      			if(powerArr.indexOf(treeArr[i].parentID)==-1){
	      				powerArr.push(treeArr[i].parentID);
	      			}
	      		}
      		}else{
      			childArr.push(treeArr[i]);
      			if(powerArr.indexOf(treeArr[i].parentID)==-1){
	      			powerArr.push(treeArr[i].parentID);
	      		}
	      		if(powerArr.indexOf(treeArr[i].firstID)==-1){
	      			powerArr.push(treeArr[i].firstID);
	      		}
      		}
      	}
      	//console.log(powerArr)
      	var newPowerArr=[];
      	for(let i=0;i<powerArr.length;i++){
      		let list={
      			funcIDs:powerArr[i],
      			roleOperation:[]
      		}
      		for(let j=0;j<childArr.length;j++){
      			if(powerArr[i]==childArr[j].parentID){
      				let childID=parseInt(childArr[j].id.split('_')[1])
      				list.roleOperation.push(childID);
      			}
      		}
      		list.roleOperation=list.roleOperation.join(',');
      		newPowerArr.push(list);
      	}
      	//console.log(newPowerArr)
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	//按钮禁用
          	this.form.addDisabled=true;
          	//提交角色信息
          	let data={
          		"roleName":this.form.name,
          		"roleRemark":this.form.desc,
          		"roleStatus":0,
          		"empId":this.$store.state.userCode,
          		"operation":newPowerArr
          	}
          	if(this.dialogMark){
          		data.id=this.form.roleID;
          		updateList("updRoleInfo",this,data);
          	}else{
          		updateList("addRoleInfo",this,data);
          	}
          } else {
            this.$message.error('表单提交失败！');
            return false;
          }
        });
      }  
    }
}
//判断数组包含
function compireArr(arr,arr2){
	//console.log(arr2)
	for(let i=0;i<arr2.length;i++){
		let index=arr.indexOf(arr2[i]);
		if(index==-1){
			return false;
		}
	}
	return arr;
}
//移除数组
function removeArr(arr,arr2){
	let newArr=[];
	for(let i=0;i<arr.length;i++){
		let index=arr2.indexOf(arr[i]);
		if(index==-1){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

//请求数据列表
function axiosRoleList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"empId":obj.$store.state.userCode,
		"length":obj.pageSize
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryRoleInfo",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					//用户列表
					obj.tableData=response.data.roleInfoList;
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
	    desc:'',
	    roleID:'',
	    //权限
		powers: [],
		checkedPower: [],
		addDisabled:false
	}
	return data;
}
//获取权限列表
function roleList(obj,callback){
	obj.formLoading=true;
	obj.form.addDisabled=true;
	obj.$ajax.post(obj.$store.state.localIP+"queryFunctionByEmpId",{empId:obj.$store.state.userCode})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				//console.log(response)
				if(response.data.retCode==0){
					let objStr=response.data.funcList;
					//console.log(objStr)
					let str =JSON.stringify(objStr);
					let newStr=str.replace(/(sonList|roleOperations)/g,"children");
					let newStr2=newStr.replace(/\"functionName\"/g,'"label"');
					let newStr3=newStr2.replace(/\,\"children\"\:\[\]/g,'');
					let newObj=JSON.parse(newStr3);
					/*obj.form.powers=newObj;*/
					let powerArr=['查看','添加','删除','编辑','采购','详情','提交','审核','一审(门店经理)','二审(采购)','三审(采购经理)'];//权限列表
					for(let i=0;i<newObj.length;i++){
						if(newObj[i].children){
							for(let j=0;j<newObj[i].children.length;j++){
								if(newObj[i].children[j].children){
									for(let x=0;x<newObj[i].children[j].children.length;x++){
										newObj[i].children[j].children[x].id=newObj[i].children[j].id+'_'+newObj[i].children[j].children[x].roleOperation;
										newObj[i].children[j].children[x].type=1;
										newObj[i].children[j].children[x].parentID=newObj[i].children[j].id;
										newObj[i].children[j].children[x].firstID=newObj[i].id;
										newObj[i].children[j].children[x].label=powerArr[newObj[i].children[j].children[x].roleOperation];
									}
								}
							}	
						}
					}
					//console.log(newObj)
					obj.form.powers=newObj;
					callback(obj);
					obj.form.addDisabled=false;
				}else{
					obj.$message.error(response.data.retMsg);
				}
			}
			obj.formLoading=false;
		})
		.catch((error)=>{
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
}
//添加与修改角色
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
		       	axiosRoleList(obj);
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
//删除角色
function delRole(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"delRoleInfo",data)
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
		       	axiosRoleList(obj);
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
	.iconfont{
		font-size: 14px;
		margin: 0 auto;
	}
</style>