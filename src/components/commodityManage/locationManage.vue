<template>
	<div class="commodityManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">商品管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">位置管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>位置管理</span>
			</div>
			<div class="line"></div>
			
			<!--批量操作-->
			<div class="editBtn">
				<!--<el-button type="primary" class="iconBox"><span class="iconfont icon-uparrow-top"></span></el-button>
				<el-button type="primary" class="iconBox"><span class="iconfont icon-uparrow-bottom"></span></el-button>-->
				<el-button @click="addClass" type="primary"><span class="iconfont icon-crm11"></span>添加位置</el-button>
				<div class="clear"></div>
			</div>
			
			<!--商品套餐包-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark">
				<el-table-column prop="typeName" label="位置">
				</el-table-column>
				<!--<el-table-column prop="typeName" label="默认选择">
					<template slot-scope="props">
						<div>{{ props.row.isCheck ? '是' : '否' }}</div>
					</template>
				</el-table-column>-->
				<el-table-column label="操作">
			      <template slot-scope="scope">
			      	<el-button
			          size="mini"
			          type="primary"
			          style="margin: 5px 5px;"
			          @click="handleEditTop(scope.$index, scope.row)">上移</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
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
				
			  	<el-form-item label="位置名称" prop="name">
			  		<el-input v-model="ruleForm.name"  @change="inputFlag=1"></el-input>
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
	export default {
		name:'commodityManage',
		data () {
			return {
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:5,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogFlag:0,//标记
		        inputFlag:0,//表单修改标记
		        dialogTitle:'提示',
		        ruleForm:formInit(),
		        rules:{
		        	name:[
		        		{ required: true, message: '请输入位置名称', trigger: 'blur' }
		        	]
		        }
			}
		},
		mounted(){
			pachageList(this);
		},
		beforeDestroy(){
			this.dialogVisible=false;
		},
		methods:{
		    //分页方法
		    handleSizeChange(val) {
		      //console.log(`每页 ${val} 条`);
		      this.pageSize=val;
		      pachageList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      pachageList(this);
		    },
		    //上移
		    handleEditTop(index, row) {
		    	const loading =openLoad(this,"Loading...");
		    	this.$ajax.post(this.$store.state.localIP+'updateSpace',{id:row.id})
			   	.then((response)=>{
			   		loading.close();
			   		if(response.data.retCode==0){
			   			this.$message({
							message: '操作成功!',
							type: 'success'
						});
						pachageList(this);
			   		}else{
			   			this.$message.error(response.data.retMsg);	
			   		}
			   	})
			   	.catch((error) =>{
			   		console.log(error);
			   		loading.close();
			   		this.$message.error('网络错误~~！');
			   	})
		    },
		    //添加位置
		    addClass(){
		    	this.ruleForm=formInit();
		      	this.dialogTitle="添加位置";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		    },
		    //编辑
      		handleEdit(index, row) {
				this.ruleForm=formInit();
		      	this.dialogTitle="编辑位置";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.id;
		      	this.ruleForm.name=row.typeName;
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前位置吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"id":row.id};
		          delPackage(this,data);
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
			        		typeName:this.ruleForm.name
			        	}
			        	if(this.dialogFlag!=0){
			        		data.id=this.dialogFlag;
			        	}
			        	this.$ajax.post(this.$store.state.localIP+'saveSpace',data)
			        	.then((response)=>{
			        		loading.close();
			        		if(response.data.retCode==0){
			        			this.$message({
								  message: '操作成功!',
								  type: 'success'
								});
								this.dialogVisible=false;
								pachageList(this);
			        		}else{
			        			this.$message.error('操作失败！');	
			        		}
			        	})
			        	.catch((error) =>{
			        		console.log(error);
			        		loading.close();
			        		this.$message.error('网络错误~~！');
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
		        name: ''//位置名称
	        }
		return data;
	}
	//获取包列表
	function pachageList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"querySpaceList",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.spaceList;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取位置列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取位置列表失败！');
		})
	}
	//删除包
	function delPackage(obj,data){
		const loading =openLoad(obj,"Loading...");
		obj.$ajax.post(obj.$store.state.localIP+"deleteSpace",data)
		.then(response=>{
			loading.close();
			//console.log(response)
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
				pachageList(obj);
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
	.iconBox .iconfont{
		font-size: 12px;
	}
</style>