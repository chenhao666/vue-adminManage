<template>
	<div class="homeDesign">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设计师</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">方案列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>方案列表</span>
			</div>
			<div class="line"></div>
			<!--批量操作-->
			<div class="editBtn">
				<!--<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>-->
				<el-button @click="addProgramme" type="primary"><span class="iconfont icon-crm11"></span>添加方案</el-button>
			</div>
			<div class="programmeList">
				<el-table 
					border 
					ref="multipleTable"
					:data="tableData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;">
					<!--<el-table-column type="selection" width="55">
					</el-table-column>-->
					<el-table-column prop="name" label="方案" width="300">
					</el-table-column>
					<el-table-column prop="specName" label="户型" width="150">
					</el-table-column>
					<el-table-column prop="srcArea" label="面积(㎡)" width="75">
					</el-table-column>
					<el-table-column prop="modifiedTime" label="修改时间" width="150">
						<template slot-scope="props">
							 <div>{{ formatDate(props.row.modifiedTime).day }}</div>
							 <div>{{ formatDate(props.row.modifiedTime).time }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<!--<el-button
					          size="mini"
					          @click="handleSend(scope.$index, scope.row)">发送方案</el-button>-->
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
		
		<!--发送方案-->
		<el-dialog 
			title="发送方案" 
			:visible.sync="dialogVisible" 
			width="600px" 
			:append-to-body="true" 
			:close-on-click-modal="false" 
			:before-close="handleClose">
			<!--表单开始-->:disabled
			<el-form  ref="ruleForm" :model="ruleForm" :rules="rules" label-width="85px">
				<el-form-item label="方案名称" prop="name">
					<el-input v-model="ruleForm.name" @change="inputFlag=1"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="ruleForm.mobile" @change="inputFlag=1"></el-input>
				</el-form-item>
			</el-form>
			<!--表单结束-->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name:'homeDesign',
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
		return{
			dialogVisible:false,//弹窗
			inputFlag:0,//弹窗状态
			tableData: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        ruleForm:{	 
	        	name:'',//方案名称
	        	mobile:'',//用户手机号
	        	pic:'',//户型图
	        	threeDpic:'',//3D全景图
	        },
	        //表单验证
	        rules:{
	        	mobile:[
	        		{  required: true, validator: checkMobile, trigger: 'blur' }
	        	]
	        },
		}
	},
	//挂载
	mounted(){		
		//方案列表
		programeList(this);
		//获取渲染图
		//renderpic(this);
		//获取清单
		//orderList(this)
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
		//发送方案
		handleSend(index, row){
			//console.log(row)
			renderpic(this,row.designId);
			//this.dialogVisible=true;
		},
		 //表单提交
   		submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	          	
	          } else {
	            this.$message.error('表单提交失败！');
	            return false;
	          }
	        });
      	},
		 //编辑
     	handleEdit(index, row) {
	        //console.log(index, row);
	        //console.log(row)
	        this.$router.push({path:'/designer/editHomeDesign/'+row.designId})
      	},
	    //删除
	    handleDelete(index, row) {
	      	//console.log(index, row);
	      	//console.log(row);
	      	this.$confirm('确定删除当前方案吗?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	      	}).then(() => {
				dropProgramme(this,row.planId);
	      	}).catch(() => {
	        this.$message({
	          	type: 'info',
	          	message: '已取消删除'
	        });          
	      });
	    },
	    addProgramme(){
	    	this.$router.push({path:'/designer/homeDesign'})
	    },
	    //分页方法
	    handleSizeChange(val) {
	     	// console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	    	programeList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        programeList(this);
	    },
	    //关闭弹窗
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
	    /*时间戳格式*/
	   	formatDate(d){
	   		var now=new Date(d)
	   		var year = now.getFullYear(),
		　　	month = now.getMonth() + 1,
		　　	date = now.getDate(),
		　　	hour = now.getHours(),
		　　	minute = now.getMinutes(),
		　　	second = now.getSeconds();
			return {
				day:year + "-" + month + "-" + date,
				time:hour + ":" + minute + ":" + second
			}
	   	}
    }
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
//获取方案列表
function programeList(obj){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/design/list',
		'KujiaLe':{
			'start':(obj.currentPage-1)*obj.pageSize,
			'num':obj.pageSize,
			'appuid': hex_md5(obj.$store.state.userCode)
		},
		'appuid':obj.$store.state.userCode,
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		//console.log(res)
		loading.close();
		let list=res.data;
		if(list.c==0){
			if(list.d.result){
				obj.tableData=list.d.result;
				obj.pageTotal=list.d.totalCount;
			}	
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取方案渲染图列表
function renderpic(obj,designId){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/renderpic/list',
		'KujiaLe':{
			'design_id':designId,
			'start':0,
			'num':10
		},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		//console.log(res)
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//初始化清单
function initOrder(obj,callback){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/listing/init',
		'KujiaLe':{
			'design_id':'3FO4IKQYE1VI'
		},
		'params':'',
		'method':'get'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		if(res.data.d){			
			let orderId=res.data.d;
			obj.$message({
		        message: '清单初始化成功!',
		        type: 'success'
		    });
			callback(orderId)
		}else{
			obj.$message.error("清单初始化失败!");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取清单
function orderList(obj){
	initOrder(obj,function(orderId){
		const loading=obj.$loading({
	      	lock: true,
	      	text: '清单生成中',
	      	fullscreen:false,
	      	spinner: 'el-icon-loading',
	      	background: 'rgba(0, 0, 0, 0.6)'
	    });
	    let timer=setInterval(function(){
	    	let data={
				'url':'https://openapi.kujiale.com/v2/listing/'+orderId+'/state',
				'KujiaLe':{},
				'params':'',
				'method':'get'
			}
			obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
			.then(res=>{
				loading.close();
				//console.log(res,2)
				if(res.data.d==3){
					clearInterval(timer);
					let data={
						'url':'https://openapi.kujiale.com/v2/listing/'+orderId+'/sync',
						'KujiaLe':{
							'appuid':obj.$store.state.userCode
						},
						'params':'',
						'method':'post'
					}
					obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
					.then(res=>{
						//console.log(res,1);
						if(res.data.c==0){
							setTimeout(function(){
								let data={
									'url':'https://openapi.kujiale.com/v2/listing/'+orderId+'/soft/outfit/detail',
									'KujiaLe':{},
									'params':'',
									'method':'get'
								}
								obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
								.then(res=>{
									//console.log(res)
								})
							},5000)
							
						}
					})
				}
			})
	    },1000)
	});
}
//删除方案
function dropProgramme(obj,programmeId){
	const loading =openLoad(obj);
	let data={
		'url':'https://openapi.kujiale.com/v2/design/deletion',
		'KujiaLe':{
			'plan_id':programmeId
		},
		'params':'&plan_id='+programmeId,
		'method':'post'
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.c==0){
			obj.$message({
		        message: '方案删除成功!',
		        type: 'success'
		    });			
			programeList(obj);
		}else{
			obj.$message.error("方案删除失败！");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
</script>

<style scoped>
.editBtn{
	margin-top: 30px;
	width: 100%;
	text-align: right;
}
.programmeList{
	margin-top: 30px;
}
</style>