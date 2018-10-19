<template>
	<div class="styleManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">风格管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>风格管理</span>
			</div>
			<div class="line"></div>
			
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" v-if="delBtnShow" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addStyle" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加风格</el-button>
				<div class="clear"></div>
			</div>
			
			<!--风格列表-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="styleName" label="风格">
				</el-table-column>
				<el-table-column label="操作" v-if="editBtnShow || delBtnShow">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          v-if="editBtnShow"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
			          v-if="delBtnShow"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
				
			  	<el-form-item label="风格" prop="name">
			  		<el-input v-model="ruleForm.name" maxlength='20'  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.disabled">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default{
		name:'styleManage',
		data () {
			return {
				addBtnShow:false,
				delBtnShow:false,
				editBtnShow:false,
				roleAuthList:sessionStorage.getItem('roleAuthList'),
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogFlag:0,//标记
		        inputFlag:0,//表单修改标记
		        dialogTitle:'提示',
		        ruleForm:formInit(),
		        rules:{
		        	name:[
		        		{ required: true, message: '请输入品牌名称', trigger: 'blur' }
		        	]
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
			//获取品牌列表
			styleList(this);
		},
		beforeDestroy(){
			this.dialogVisible=false;
		},
		methods:{
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
			    	this.$confirm('确定删除当前风格吗?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			      }).then(() => {
			      	let delArr=[];
			      	let multi=this.multipleSelection;
			      	for(let i=0;i<multi.length;i++){
			      		delArr.push(multi[i].styleId);
			      	}
			      	let data={"styleId":delArr.join(',')};
			      	delStyle(this,data);
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
		      styleList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      styleList(this);
		    },
		    //添加品牌
		    addStyle(){
		    	this.ruleForm=formInit();
		      	this.dialogTitle="添加风格";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		    },
		    //编辑
      		handleEdit(index, row) {
				this.ruleForm=formInit();
		      	this.dialogTitle="编辑风格";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.styleId;
		      	this.ruleForm.name=row.styleName;
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前风格吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"styleId":row.styleId};
		          delStyle(this,data);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
	      	},
	      	//提交表单
		    submitForm(formName) {
		      	this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	const loading =openLoad(this,"Loading...");
			        	var data={
			        		styleName:this.ruleForm.name
			        	}
			        	if(this.dialogFlag!=0){
			        		data.styleId=this.dialogFlag;
			        	}
			        	this.$ajax.post(this.$store.state.localIP+'addStyleInfo',data)
			        	.then((response)=>{
			        		loading.close();
			        		if(response.data.retCode==0){
			        			this.$message({
								  message: '操作成功!',
								  type: 'success'
								});
								this.dialogVisible=false;
								styleList(this);
			        		}else{
			        			this.$message.error('操作失败！');	
			        		}
			        	})
			        	.catch((error) =>{
			        		console.log(error);
			        		loading.close();
			        		this.$message.error('操作失败！');
			        	})
			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
		      	});
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
		    }
		}
	}
	
	//打开loading
	function openLoad(obj,txt){
		const loading=obj.$loading({
	      lock: true,
	      text: txt,
	      fullscreen:false,
	      spinner: 'el-icon-loading',
	      background: 'rgba(0, 0, 0, 0.6)'
	    });
	    return loading;
	}
	//表单初始化
	function formInit(){
		let data={
		        name: ''//品牌名称
	        }
		return data;
	}
	//获取风格列表
	function styleList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryStyleInfo",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.styleInfoList;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取品牌列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取品牌列表失败！');
		})
	}
	//删除风格
	function delStyle(obj,data){
		const loading =openLoad(obj,"Loading...");
		obj.$ajax.post(obj.$store.state.localIP+"deleteStyleInfo",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.$message({
				  message: '删除成功!',
				  type: 'success'
				});
				var list=data.styleId.toString();
				if(list.indexOf(',')>-1){
					var listArr=list.split(',');
					obj.pageTotal-=listArr.length;
				}else{
					obj.pageTotal-=1;
				}
				if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
					obj.currentPage-=1;
				}
				styleList(obj);
			}else{
				obj.$message.error('删除失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('删除失败！');
		})
	}
</script>

<style scoped="scoped">
	.editBtn{
		width: 100%;
		text-align: right;
		margin-top: 20px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}
</style>