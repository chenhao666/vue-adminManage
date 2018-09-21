<template>
	<div class="deliveryPackage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">套餐列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>套餐列表</span>
			</div>
			<div class="line"></div>
			
			<div class="edit_btn">
				<el-button @click="addPackage" type="primary">新增</el-button>
				<el-button @click="releasePackage" type="primary" :disabled="changeValue==0?true:false">发布</el-button>
				<el-button @click="withdrawPackage" type="danger" :disabled="changeValue==2?true:false">撤回</el-button>
				<el-button @click="delPackage" type="danger" :disabled="changeValue==0?true:false">删除</el-button>
			</div>
			
			<div class="deliveryPackageList">
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
					<el-table-column prop="comboName" label="套餐名" width="150">
					</el-table-column>
					<el-table-column prop="houseName" label="楼盘" width="150">
					</el-table-column>
					<el-table-column prop="styleName" label="风格" width="75">
					</el-table-column>
					<el-table-column prop="brandName" label="品牌名" width="150" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="statusName" label="状态" width="75">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
					          size="mini"
					          @click="handleEdit(scope.$index, scope.row)">方案设计</el-button>
					        <el-button
					          size="mini"
					          @click="handlePackageEdit(scope.$index, scope.row)">套餐编辑</el-button>
					        <!--<el-button
					          size="mini"
					          type="danger"
					          @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
	</div>
</template>

<script>
export default {
	name:'deliveryPackage',
	data(){
		return{
			tableData:[],
			multipleSelection: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        changeValue:-1,//按钮操作状态
		}
	},
	//挂载
	mounted(){		
		packageList(this);
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
     	handleEdit(index, row) {
	        //console.log(index, row);
	        //console.log(row)
	        //let Base64=new Base64();
      		let num=Base64.encode(row.id.toString());
	        this.$router.push({path:'/delivery/editHomeDesign/'+num})
      	},
      	handlePackageEdit(index, row){
      		//let Base64=new Base64();
      		let num=Base64.encode(row.id.toString());
      		this.$router.push({path:'/delivery/editPackage/'+num})
      	},
		//添加
      	addPackage(){
	      	this.$router.push({path:'/delivery/homeDesign'})
	    },
	    //发布
	    releasePackage(){
	    	console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		this.$message({
		          	showClose: true,
		          	message: '请选择要发布的套餐！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定发布所选套餐吗?', '提示', {
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
		      			delIds:delArr.join(','),
		      			isUsed:0
		      		}
		        	updateInfo(this,data);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消操作'
		          	});          
		        });
	      	}
	    },
	    //撤回
	    withdrawPackage(){
	    	//console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		 this.$message({
		          	showClose: true,
		          	message: '请选择要撤回的套餐！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定撤回所选套餐吗?', '提示', {
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
		      			delIds:delArr.join(','),
		      			isUsed:2
		      		}
		        	updateInfo(this,data);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消操作'
		          	});          
		        });
	      	}
	    },
	    //删除
	    delPackage(){
	    	//console.log(this.multipleSelection);
	      	if(this.multipleSelection.length==0){
	      		 this.$message({
		          	showClose: true,
		          	message: '请选择要删除的选项！',
		          	type: 'warning'
		        });
	      	}else{
	      		this.$confirm('确定删除所选套餐吗?', '提示', {
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
		      			delIds:delArr.join(','),
		      			status:1
		      		}
		        	updateInfo(this,data);
		        }).catch(() => {
		          	this.$message({
		            	type: 'info',
		            	message: '已取消操作'
		          	});          
		        });
	      	}
	    },
	    //分页方法
	    handleSizeChange(val) {
	     // console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	    	packageList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        packageList(this);
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
//获取套餐列表
function packageList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryDsignInfo',data)
	.then(response=>{
		//console.log(response)
		loading.close();
		if(response.data.retCode==0){
			let list=response.data.designInfoList;
			for(let i=0;i<list.length;i++){
				if(list[i].isUsed==0){					
					list[i].statusName="已发布";
				}else if(list[i].isUsed==1){
					list[i].statusName="草稿";
				}else if(list[i].isUsed==2){
					list[i].statusName="已撤回";
				}else{
					list[i].statusName="";
				}
			}
			obj.tableData=response.data.designInfoList;
			obj.pageTotal=response.data.countNum;
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
	obj.$ajax.post(obj.$store.state.localIP+'deleteDesigInfo',data)
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
		    packageList(obj);
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
	.deliveryPackageList{
		margin-top: 30px;
	}
</style>