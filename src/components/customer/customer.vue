<template>
	<div class="customer">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item >电话销售</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">客户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>客户列表</span>
			</div>
			<div class="line"></div>
			<div class="search_form">
				<el-input v-model="form.name" placeholder="姓名"></el-input>
				<el-input v-model="form.mobile" placeholder="手机号"></el-input>
				<el-select v-model="form.status" placeholder="状态">
					<el-option label="全部" value="-1"></el-option>
			      	<el-option label="到店" value="1"></el-option>
			      	<el-option label="量房" value="3"></el-option>
			      	<el-option label="设计" value="4"></el-option>
			      	<el-option label="合同" value="5"></el-option>
			      	<!--<el-option label="关闭" value="2"></el-option>-->
			   </el-select>
			   <el-button type="success" @click="searchList"><span class="iconfont icon-search"></span>搜索</el-button>
			   <div class="clear"></div>
			</div>
			
			<div class="customerList">
				<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" style="width: 100%;">
					<!--<el-table-column label="ID" width="60" prop="id">
						<template slot-scope="scope">{{ scope.row.orderID }}</template>
					</el-table-column>-->
					<el-table-column prop="custName" label="姓名" :width="initWidth">
					</el-table-column>
					<el-table-column prop="mobileNum" label="手机号" :width="initWidth">
					</el-table-column>
					<el-table-column prop="statusID" label="状态"  width="75">
					</el-table-column>
					<el-table-column prop="changeDate" label="状态时间" :width="initWidth">
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.changeDate)[0] }}</div>
							 <div>{{ timeFomit(props.row.changeDate)[1] }}</div>
						</template>
					</el-table-column>
					<!--<el-table-column prop="content" label="记事内容" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="planTime" label="计划时间" show-overflow-tooltip>
						<template slot-scope="props">
							 <div>{{ timeFomit(props.row.planTime)[0] }}</div>
							 <div>{{ timeFomit(props.row.planTime)[1] }}</div>
						</template>
					</el-table-column>-->
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleInfo(scope.$index, scope.row)">详细</el-button>							
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
	name:'customer',
	data(){
		return{
			tableData: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        initWidth:150,//初始宽度
			form:{
				name:'',
				mobile:'',
				status:''
			}
		}
	},
	mounted(){
		customerInfoList(this)
	},
	methods:{
		handleInfo(index,row){
    		//console.log(row)
    		//let Base64=new Base64();
      		let num=Base64.encode(row.id.toString());
    		this.$router.push({path:'/customer/customerInfo/'+num,query:{query:Base64.encode(row.orderID.toString())}})
	  },
	  	//分页方法
	    handleSizeChange(val) {
	     // console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	      	customerInfoList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        customerInfoList(this);
	    },
	    //搜索
	    searchList(){
	    	this.currentPage=1;
	    	customerInfoList(this);
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
//获取客户列表
function customerInfoList(obj){
	const loading =openLoad(obj);	
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"statusID":obj.form.status,
		"custName":obj.form.name,
		"mobileNum":obj.form.mobile
	}
	if(obj.form.status==-1){
		data.statusID='';
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryServiceMangerList",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总条数
					obj.pageTotal=response.data.countNum;
					let list=response.data.smList;
					let nowStageArr=['到店','关闭','量房 ','设计','合同','订单'];
					//阶段
					for(let i=0;i<list.length;i++){
						if(list[i].statusID || list[i].statusID==0){							
							list[i].statusID=nowStageArr[list[i].statusID-1]
						}
						if(list[i].sex=="0"){
							list[i].sex="男";
						}else if(list[i].sex=="1"){
							list[i].sex="女";
						}else{
							list[i].sex=""
						}
					}
					obj.tableData=list;
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
</script>

<style scoped>
	.search_form{
		padding: 30px 0px;
	}
	.search_form .el-input,.search_form .el-select{
		width: 150px;
	}
	.search_form .el-button{
		float: right;
	}
</style>