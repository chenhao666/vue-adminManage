<template>
	<div class="noteBook">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/orderManage/orderCustomer' }">客户管理</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">记事本</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>记事本</span>
			</div>
			<div class="line"></div>
			<div class="noteBookList">	
				<div class="editBtn">					
					<el-button @click="addNote" type="primary"><span class="iconfont icon-crm11"></span>新增记事</el-button>
				</div>
				<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" style="width: 100%;">
					<!--<el-table-column label="ID" width="60" prop="id">
						<template slot-scope="scope">{{ scope.row.orderID }}</template>
					</el-table-column>-->
					<el-table-column prop="content" label="记事内容">
					</el-table-column>

					<el-table-column prop="planTime" label="计划时间" width="180">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.planTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.planTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="240">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
		
		<el-dialog 
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="600px"
			:append-to-body="true"
			:close-on-click-modal="false"
			:before-close="handleClose">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="计划时间：">
					<el-date-picker v-model="ruleForm.planeTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @change="inputFlag=1">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="记事内容：" prop="desc">
					<el-input type="textarea" v-model="ruleForm.desc" :rows="6" @change="inputFlag=1"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.addDisabled">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default{
	name:'noteBook',
	data () {
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
			tableData:[],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
			dialogTitle:'提示',
			dialogVisible:false,
			dialogMark:0,//弹窗标记
			inputFlag:0,//表单修改标记
			//记事表单
			ruleForm:formInit(),
			rules:{
				desc:[
					{ required: true, message: '请输入记事内容', trigger: 'blur' }
				]
			}
		}
	},
	mounted(){
		nodeList(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods:{
		handleEdit(index,row){
    		//console.log(row)
    		this.dialogTitle="编辑记事";
	    	this.dialogVisible=true;
	    	this.dialogMark=1;
	    	this.ruleForm.planeTime=row.planTime;
	    	this.ruleForm.desc=row.content;
	    	this.id=row.id;
	  	},
	  	handleDel(index,row){
    		//console.log(row)
    		this.$confirm('确定删除当前记事吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	//删除
	        	const loading =openLoad(this);	
	        	this.$ajax.post(this.$store.state.localIP+"delNotepad",{noteID:row.id,orderID:this.orderID})
				.then((response)=>{
					//console.log(response);
					if(response.status==200){
						loading.close();
						if(response.data.retCode==0){
							this.$message({
					            type: 'success',
					            message: '删除成功'
					       });
							obj.pageTotal-=1;
							if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
								obj.currentPage-=1;
							}
							nodeList(this);
						}else{
							this.$message.error(response.data.retMsg);
						}
					}
				})
				.catch((error)=>{
					loading.close();
					console.log(error);
					this.$message.error("网络连接错误~~");
				})
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	        });
	  	},
	  	//分页方法
	    handleSizeChange(val) {
	     // console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	      	nodeList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        nodeList(this);
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
	    //新增记事
	    addNote(){
	    	//表单重置
      		this.ruleForm=formInit();
	    	this.dialogTitle="新增记事";
	    	this.dialogVisible=true;
	    	this.dialogMark=0;
	    },
	    //保存记事
      	submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          	if (valid) {
	          		//按钮禁用
	          		this.ruleForm.addDisabled=true;
	          		let data={
	          			orderID:this.orderID,
	          			planTime:this.ruleForm.planeTime,
	          			content:this.ruleForm.desc
	          		}
	          		if(this.dialogMark){
	          			data.noteID=this.id;
	          			//编辑
	          			updateNote('addNotepad',this,data);
	          		}else{
	          			//新增
	          			updateNote('addNotepad',this,data);
	          		}
	          	} else {
	            	this.$message.error('表单提交失败！');
	            	return false;
	         	}
	        });
      	},
      	//时间格式化
	    timeFomit(timeDate){
	      	//console.log(timeDate)
	      	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	      	let timeArr=time.split(' ');
	      	return timeArr;
	    }
	}
}
//记事本列表
function nodeList(obj){
	const loading =openLoad(obj);	
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"orderID":obj.orderID
	}
	obj.$ajax.post(obj.$store.state.localIP+"notepadList",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					obj.tableData=response.data.notepadList;
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
//保存修改记事
function updateNote(url,obj,data){
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
		       	nodeList(obj);
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
	        	planeTime:'',
	        	desc:'',
	        	addDisabled:false,
	        }
	return data;
}
</script>

<style scoped>
	.noteBookList{
		margin-top: 30px;
	}
	.editBtn{
		width: 100%;
		text-align: right;
		padding-bottom: 30px;
	}
</style>