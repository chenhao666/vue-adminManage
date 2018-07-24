<template>
	<div class="commodityManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">商品管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">商品套餐包</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品套餐包</span>
			</div>
			<div class="line"></div>
			
			<!--批量操作-->
			<div class="editBtn">
				<el-button @click="addClass" type="primary"><span class="iconfont icon-crm11"></span>添加分类</el-button>
				<div class="clear"></div>
			</div>
			
			<!--商品套餐包-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark">
				<el-table-column prop="packgeName" label="分类">
				</el-table-column>
				<el-table-column prop="packgeName" label="默认选择">
					<template slot-scope="props">
						<div>{{ props.row.isCheck ? '是' : '否' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
			      <template slot-scope="scope">
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
				
			  	<el-form-item label="分类名称" prop="name">
			  		<el-input v-model="ruleForm.name"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="默认全选" @change="inputFlag=1">
			  		<el-radio v-model="ruleForm.radio" label="1">是</el-radio>
  					<el-radio v-model="ruleForm.radio" label="0">否</el-radio>
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
		        		{ required: true, message: '请输入分类名称', trigger: 'blur' }
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
		    //添加分类
		    addClass(){
		    	this.ruleForm=formInit();
		      	this.dialogTitle="添加分类";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		    },
		    //编辑
      		handleEdit(index, row) {
				this.ruleForm=formInit();
		      	this.dialogTitle="编辑分类";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.packageId;
		      	this.ruleForm.name=row.packgeName;
		      	this.ruleForm.radio=row.isCheck.toString();
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前分类吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"packageId":row.packageId};
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
			        		packgeName:this.ruleForm.name,
			        		isCheck:this.ruleForm.radio
			        	}
			        	if(this.dialogFlag!=0){
			        		data.packageId=this.dialogFlag;
			        	}
			        	this.$ajax.post(this.$store.state.localIP+'saveGoodspackage',data)
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
		        name: '',//品牌名称
		        radio:'0'
	        }
		return data;
	}
	//获取包列表
	function pachageList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryGoodsPackage",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.tableData=response.data.goodsPackages;
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
	//删除包
	function delPackage(obj,data){
		const loading =openLoad(obj,"Loading...");
		obj.$ajax.post(obj.$store.state.localIP+"deleteGoodspackage",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.$message({
				  message: '删除成功!',
				  type: 'success'
				});
				var list=data.packageId.toString();
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
</style>