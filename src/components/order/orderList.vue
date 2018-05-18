<template>
	<div class="orderList">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单列表</span>
			</div>
			<el-tabs  @tab-click="handleClick">
				<el-tab-pane label="进行中" name="0"></el-tab-pane>
				<el-tab-pane label="已结束" name="1" ></el-tab-pane>
			</el-tabs>
			
			<div class="search_form">
				<el-input v-model="form.name" placeholder="联系人"></el-input>
				<el-input v-model="form.mobile" placeholder="联系电话"></el-input>
				<el-select v-model="form.status" placeholder="阶段">
					<el-option label="全部" value="-1"></el-option>
			      	<el-option label="开工" value="1" v-show="!connectType"></el-option>
			      	<el-option label="水电" value="2" v-show="!connectType"></el-option>
			      	<el-option label="泥木" value="3" v-show="!connectType"></el-option>
			      	<el-option label="油漆" value="4" v-show="!connectType"></el-option>
			      	<el-option label="安装" value="5" v-show="!connectType"></el-option>
			      	<el-option label="竣工" value="6" v-show="!connectType"></el-option>
			      	<el-option label="完工" value="7" v-show="connectType"></el-option>
			      	<el-option label="关闭" value="8" v-show="connectType"></el-option>
			   </el-select>
			   <el-button type="success" @click="searchOrder"><span class="iconfont icon-search"></span>搜索</el-button>
			   <div class="clear"></div>
			</div>
			
			<div class="orderListInfo">
				<el-table 
					border 
					:data="tableData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;">
					<!--<el-table-column label="ID" width="60" prop="id">
						<template slot-scope="scope">{{ scope.row.orderID }}</template>
					</el-table-column>-->
					<el-table-column prop="linkman" label="联系人" :width="initWidth">
					</el-table-column>
					<el-table-column prop="linkmanPhone" label="联系电话" :width="initWidth">
					</el-table-column>
					<el-table-column prop="linkmanSex" label="性别" width="75">
					</el-table-column>
					<el-table-column prop="projectStageName" label="阶段" :width="initWidth">
					</el-table-column>
					<el-table-column prop="address" label="地址" :width="widthTip" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" label="下单时间" :width="initWidth">
						<template slot-scope="props">
							<div>{{ timeFomit(props.row.createTime)[0] }}</div>
							<div>{{ timeFomit(props.row.createTime)[1] }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleConstruction(scope.$index, scope.row)">施工</el-button>
							<el-button size="mini" @click="handleProgramme(scope.$index, scope.row)" >方案</el-button>
							<el-button size="mini" @click="handleInfo(scope.$index, scope.row)" >详情</el-button>
							<el-button size="mini" @click="handleMateriel(scope.$index, scope.row)" >物料</el-button>
							<el-button size="mini" @click="handleContract(scope.$index, scope.row)">合同</el-button>
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
	name:'orderList',
	data () {
		return {
			tableData: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        activeName: '-1',
	        connectType:false,//tab切换
	        projectSchedule:1,//状态
	        widthTip:140,
	        initWidth:120,//初始宽度
			form:{
				name:'',
				mobile:'',
				status:''
			}
		}
	},
	created(){
		let width=$(window).width();
		//console.log(width)
		if(width>1300){
			this.initWidth=150;
		}
		if(width>1600){
			this.widthTip=300;
			//console.log(this.widthTip)
		}
	},
	mounted(){
		orderList(this);
	},
	methods:{
		 //tab切换
	    handleClick(tab, event) {
        	//console.log(tab.index);
        	if(tab.index=="0"){
        		this.connectType=false;
        		this.projectSchedule=1;
        	}else if(tab.index=="1"){
        		this.connectType=true;
        		this.projectSchedule=0;
        	}
        	orderList(this);
      	},
		//施工
		handleConstruction(index,row){
    		//console.log(row)
    		let base64=new Base64();
      		let num=base64.encode(row.orderID.toString());
    		this.$router.push({path:'/orderManage/construction/'+num})
	  	},
	  	//方案
	  	handleProgramme(index, row) {
	  		//console.log(row)
	  		let base64=new Base64();
      		let num=base64.encode(row.orderID.toString());
	  		this.$router.push({path:'/orderManage/programme/'+num})
	  	},
	  	//详情
	  	handleInfo(index, row) {
	  		//console.log(row)
	  		let base64=new Base64();
      		let num=base64.encode(row.orderID.toString());
	  		this.$router.push({path:'/orderManage/orderInfo/'+num})
	  	},
	  	//物料
	  	handleMateriel(index, row) {
	  		//console.log(row)
	  		let base64=new Base64();
      		let num=base64.encode(row.orderID.toString());
	  		//this.$router.push({path:'/customer/noteBook/'+num})
	  	},
	  	//合同
	  	handleContract(index, row) {
	  		//console.log(row)
	  		let base64=new Base64();
      		let num=base64.encode(row.orderID.toString());
	  		//this.$router.push({path:'/customer/noteBook/'+num})
	  	},
	  	//分页方法
	    handleSizeChange(val) {
	     // console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	      	orderList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        orderList(this);
	    },
	   //时间格式化
	  	timeFomit(timeDate){
	      	//console.log(timeDate)
	      	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	      	let timeArr=time.split(' ');
	      	return timeArr;
	   },
	    //查询订单
	    searchOrder(){
	    	this.currentPage=1;
	    	orderList(this);
	    }
	}
}
//获取订单列表
function orderList(obj){
	const loading =openLoad(obj);	
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"linkman":obj.form.name,
		"linkmanPhone":obj.form.mobile,
		"projectStage":obj.form.status,
		"projectSchedule":obj.projectSchedule
	}
	if(obj.form.status==-1){
		data.projectStage='';
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryOrderList",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					//总数
					obj.pageTotal=response.data.countNum;
					let list=response.data.orderList;
					for(let i=0;i<list.length;i++){
						if(list[i].linkmanSex==0){
							list[i].linkmanSex="男"
						}else if(list[i].linkmanSex==1){
							list[i].linkmanSex="女"
						}else{
							list[i].linkmanSex=""
						}

						list[i].address=(list[i].buildingName || "")+(list[i].doorPlate || "")
						//表格修改
						if($(window).width()>1600){		
							$("colgroup").eq(0).find("col").eq(4).prop("width","300");
							$("colgroup").eq(1).find("col").eq(4).prop("width","300");
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
	@media screen and (max-width: 1300px){
		.search_form .el-input,.search_form .el-select{
			width: 120px;
		}
	}
	@media screen and (min-width: 1301px){
		.search_form .el-input,.search_form .el-select{
			width: 150px;
		}
	}
	.search_form .el-button{
		float: right;
	}
	.orderListInfo .el-button{
		margin: 5px 0px;
	}
</style>