<template>
	<div class="raiders">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">装修攻略</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>装修攻略</span>
			</div>
			<div class="line"></div>
			
			<div class="search_form">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-input v-model="form.title" placeholder="标题"></el-input>
						<el-select v-model="form.type" placeholder="攻略类别">
							<el-option label="全部" value="-1"></el-option>
							<el-option label="验房" value="1,验房"></el-option>
								<el-option label="设计" value="2,设计"></el-option>
								<el-option label="合同" value="3,合同"></el-option>
								<el-option label="拆改" value="4,拆改"></el-option>
								<el-option label="水电" value="5,水电"></el-option>
								<el-option label="泥瓦" value="6,泥瓦"></el-option>
								<el-option label="木工" value="7,木工"></el-option>
								<el-option label="油漆" value="8,油漆"></el-option>
								<el-option label="竣工" value="9,竣工"></el-option>
								<el-option label="软装" value="10,软装"></el-option>
								<el-option label="入住" value="11,入住"></el-option>
						</el-select>
						<el-select v-model="form.isUsed" placeholder="状态">
							<el-option label="全部" value="-1"></el-option>
							<el-option label="草稿" value="1"></el-option>
							<el-option label="已发布" value="0"></el-option>
							<el-option label="已撤回" value="2"></el-option>
						</el-select>
						
						<el-date-picker 
							v-model="form.releaseTime" 
							type="datetimerange" align="right" 
							unlink-panels 
							range-separator="至" 
							start-placeholder="发布时间" 
							end-placeholder="结束时间" 
							value-format="yyyy-MM-dd HH:mm:ss" 
							:picker-options="pickerOptions">
						</el-date-picker>
					</el-col>
				</el-row>
				
				<el-row :gutter="20" style="margin-top: 30px;">
					<el-col :span="24">
						<el-date-picker 
							v-model="form.editTime" 
							type="datetimerange" 
							align="right" 
							unlink-panels 
							range-separator="至" 
							start-placeholder="编辑时间" 
							end-placeholder="结束时间" 
							value-format="yyyy-MM-dd HH:mm:ss"
							:picker-options="pickerOptions">
						</el-date-picker>
						<el-button class="searchBtn" type="success" @click="searchRaiders"><span class="iconfont icon-search"></span>搜索</el-button>
			   			<div class="clear"></div>
					</el-col>
				</el-row>
			</div>
			
			<div class="edit_btn">
				<el-button @click="addRaiders" type="primary">新增</el-button>
				<el-button @click="releaseRaiders" type="primary" :disabled="changeValue==0?true:false">发布</el-button>
				<el-button @click="withdrawRaiders" type="danger" :disabled="changeValue==2?true:false">撤回</el-button>
				<el-button @click="delRaiders" type="danger" :disabled="changeValue==0?true:false">删除</el-button>
			</div>
			
			<div class="raidersList">
				<el-table 
					border 
					ref="multipleTable"
					:data="tableData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;"
					@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="title" label="标题" width="300" show-overflow-tooltip>
						<template slot-scope="props">
							 <div @click="handleEdit(props.row)" class="hrefA">{{ props.row.title }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="updTime" label="编辑时间" width="150">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.updTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.updTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="releaseTime" label="发布时间" width="150">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.releaseTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.releaseTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="stageName" label="攻略类别" width="150">
						
					</el-table-column>
					<el-table-column prop="statusName" label="状态">
					</el-table-column>
					
					<!--<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
					          size="mini"
					          type="primary"
					          v-if="scope.row.status==0?false:true"
					          @click="handleRelease(scope.$index, scope.row)">发布</el-button>
					        <el-button
					          size="mini"
					          type="danger"
					          v-if="scope.row.status==0?true:false"
					          @click="handleWithdraw(scope.$index, scope.row)">撤回</el-button>  
							<el-button
					          size="mini"
					          v-if="scope.row.status==0?false:true"
					          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					        <el-button
					          size="mini"
					          type="danger"
					          v-if="scope.row.status==0?false:true"
					          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>-->
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
export default {
	name:'raiders',
	data(){
		return{
			tableData:[],
			multipleSelection: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        changeValue:-1,//改变值
	        form:{
	        	title:'',//标题
	        	type:'',//攻略类别
	        	isUsed:'',//攻略状态
	        	releaseTime:'',//发布时间
	        	editTime:''//编辑时间
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
	        }
		}
	},
	//挂载
	mounted(){		
		raidersList(this);
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
	    	//console.log(val)
	    	let isUsed="";
	    	if(val.length>0){
	    		isUsed=val[0].isUsed;
	    		this.changeValue=isUsed;
	    		for(let i=0;i<val.length;i++){
	    			if(val[i].isUsed!=isUsed){
	    				this.$message({
				          	showClose: true,
				          	message: '批量操作请选择状态相同的文件！',
				          	type: 'warning'
				       });
	    				val.pop();
	    			}
	    		}
	    	}else{
	    		this.changeValue=-1;
	    	}
	    	if(isUsed==0){
	    		this.editDisabled=true;
	    	}
	        this.multipleSelection = val;
	    },
		 //编辑
     	handleEdit(row) {
	        //console.log(index, row);
	        //console.log(row)
	        if(row.isUsed==0){
	        	this.$message({
				    showClose: true,
				    message: '发布状态下不可编辑,请先撤回再编辑！',
				    type: 'warning'
				});
	        }else{
	        	let base64=new Base64();
      			let num=base64.encode(row.id.toString());
	        	this.$router.push({path:'/delivery/editRaiders/'+num})
	        } 
      	},
	    //删除
	    handleDelete(index, row) {
	      //console.log(index, row);
	      //console.log(row);
	      	this.$confirm('确定删除当前攻略吗?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	      	}).then(() => {
	      		let data={
	      			id:row.id,
	      			isUsed:1
	      		}
				updateInfo(this,data);
	      	}).catch(() => {
		       	this.$message({
		          	type: 'info',
		          	message: '已取消删除'
		        });          
	      	});
	    },
		//添加
      	addRaiders(){
	      	this.$router.push({path:'/delivery/addRaiders'})
	    },
	    //发布
	    releaseRaiders(){
	    	//console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		this.$message({
		          	showClose: true,
		          	message: '请选择要发布的攻略！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定发布所选攻略吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let delArr=[];
		        	let multi=this.multipleSelection;
		        	for(let i=0;i<multi.length;i++){
		        		delArr.push(multi[i].id);
		        	}
		        	let data={
		      			id:delArr.join(','),
		      			isUsed:0
		      		}
		        	updateInfo(this,data);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消删除'
		          	});          
		        });
	      	}
	    },
	    handleRelease(index, row){
	    	this.$confirm('确定发布当前攻略吗?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	      	}).then(() => {
	      		let data={
	      			id:row.id,
	      			isUsed:0
	      		}
				updateInfo(this,data);
	      	}).catch(() => {});
	    },
	    //撤回
	    withdrawRaiders(){
	    	//console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		 this.$message({
		          	showClose: true,
		          	message: '请选择要撤回的攻略！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定撤回所选攻略吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let delArr=[];
		        	let multi=this.multipleSelection;
		        	for(let i=0;i<multi.length;i++){
		        		delArr.push(multi[i].id);
		        	}
		        	let data={
		      			id:delArr.join(','),
		      			isUsed:2
		      		}
		        	updateInfo(this,data);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消删除'
		          	});          
		        });
	      	}
	    },
	    handleWithdraw(index, row){
	    	this.$confirm('确定撤回当前攻略吗?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	      	}).then(() => {
	      		let data={
	      			id:row.id,
	      			isUsed:2
	      		}
				updateInfo(this,data);
	      	}).catch(() => {});
	    },
	    //删除
	    delRaiders(){
	    	//console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		 this.$message({
		          	showClose: true,
		          	message: '请选择要删除的选项！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定删除所选攻略吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let delArr=[];
		        	let multi=this.multipleSelection;
		        	for(let i=0;i<multi.length;i++){
		        		delArr.push(multi[i].id);
		        	}
		        	let data={
		      			id:delArr.join(','),
		      			status:1
		      		}
		        	updateInfo(this,data);
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
	    	raidersList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        raidersList(this);
	    },
	    //筛选
	    searchRaiders(){
	    	this.currentPage=1;
	    	raidersList(this);
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
//获取攻略列表
function raidersList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"title":obj.form.title,
		"isUsed":obj.form.isUsed,
		"releaseBeginTime":obj.form.releaseTime[0],
		"releaseEndTime":obj.form.releaseTime[1],
		"updBeginTime":obj.form.editTime[0],
		"updEndTime":obj.form.editTime[1]
	}
	if(obj.form.isUsed==-1){
		data.isUsed="";
	}
	if(obj.form.type){
		let typeArr=obj.form.type.split(',');
		if(typeArr[0]==-1){
			data.stageId="";
			data.stageName="";
		}else{
			data.stageId=typeArr[0];
			data.stageName=typeArr[1];	
		}
	}
	obj.$ajax.post(obj.$store.state.localIP+'searchDecorateInfo',data)
	.then(response=>{
		//console.log(response)
		loading.close();
		if(response.data.retCode==0){
			obj.pageTotal=response.data.countNum;
			let list=response.data.decorateinfos;
			for(let i=0;i<list.length;i++){
				if(list[i].isUsed==0){
					list[i].statusName="已发布"
				}else if(list[i].isUsed==1){
					list[i].statusName="草稿"
				}else if(list[i].isUsed==2){
					list[i].statusName="撤回"
				}else{
					list[i].statusName=""
				}
			}
			obj.tableData=list;
		}else{
			obj.$message.error(response.data.retMsg);
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//编辑攻略
function updateInfo(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'updateDecorateInfo',data)
	.then(response=>{
		//console.log(response)
		loading.close();
		if(response.data.retCode==0){
	  		obj.$message({
		        message: '操作成功!',
		        type: 'success'
		    });
		    obj.changeValue=-1;
		    //重新请求数据列表
		    raidersList(obj);
		}else{
		   	obj.$message.error(response.data.retMsg);
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
	.edit_btn{
		margin-top: 30px;
		text-align: right;
	}
	.raidersList{
		margin-top: 30px;
	}
	.search_form{
		margin-top: 30px;
	}
	.el-input,.el-select{
		max-width: 150px;
	}
	.searchBtn{
		float: right;
	}
	.raidersList .el-button{
		margin: 5px 0px;
	}
	.hrefA{
		color: #01AEF0;
		text-decoration: underline;
		cursor: pointer;
	}
</style>