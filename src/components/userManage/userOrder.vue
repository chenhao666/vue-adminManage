<template>
	<div class="userPrder">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">订单管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单管理</span>
			</div>
			<div class="line"></div>
			
			<!--筛选条件-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left" style="width: 200px;">
						<el-input v-model="searchNum" placeholder="请输入订单编号"></el-input>
					</div>
					<div class="left" style="width: 200px;margin-left: 10px;">
						<el-input v-model="searchName" placeholder="请输入客户名称"></el-input>
					</div>
					<div class="left" style="margin-left: 10px;">
						<el-button type="success" @click="searchOrder"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!--品牌列表-->
			<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" >
				<!--<el-table-column type="selection" width="55">
				</el-table-column>-->
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="orderNo" label="订单编号" width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="city" label="城市" width="100">
				</el-table-column>
				<el-table-column prop="updateTime" label="创建时间" width="100">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.updateTime)[0] }}</div>
						<div>{{ timeFomit(props.row.updateTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="地址" width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="linkman" label="客户" width="100">
				</el-table-column>
				<el-table-column prop="totalAmout" label="金额" width="100">
				</el-table-column>
				<el-table-column prop="orderStatus" label="支付状态" width="100">
					<template slot-scope="props">
						<div>{{ stateList[props.row.orderStatus] }}</div>
					</template>
				</el-table-column>
				<el-table-column  label="操作">
					<template slot-scope="scope">
						<div class="lookInfo" @click="handleEdit(scope.$index, scope.row)">详情</div>
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
	</div>
</template>

<script>
	export default {
		name:'userPrder',
		data () {
			return {
				tableData:[],
				searchName:'',//搜索客户
				searchNum:'',//搜索订单编号
				currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        stateList:['待付款','已付款','已发货','已签收','退货申请','退货中','已退货','取消交易','订单完成']
			}
		},
		mounted(){
			//获取订单列表
			orderList(this);
		},
		methods:{
			//分页方法
		    handleSizeChange(val) {
		      	//console.log(`每页 ${val} 条`);
		      	this.pageSize=val;
		      	orderList(this)
		    },
		    handleCurrentChange(val) {
		      	//console.log(`当前页: ${val}`);
		      	this.currentPage=val;
		     	orderList(this)
		    },
		    //时间格式化
		    timeFomit(timeDate){
		    	//console.log(timeDate)
		    	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
		    	let timeArr=time.split(' ');
		    	return timeArr;
		    },
		    //查看详情
		    handleEdit(index, row){
		    	console.log(row)
		    	var num = Base64.encode(row.orderNo);
		    	var state=Base64.encode(row.orderStatus);
		    	this.$router.push({path:'/userManage/userOrder/'+num,query:{state:state}})
		    },
		    //搜索订单
		    searchOrder(){
		    	orderList(this);
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
	//获取订单列表
	function orderList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryGoodsOrderList",{
			"linkman":obj.searchName,
			"orderNo":obj.searchNum,
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.goodsOrderList;
				obj.pageTotal=response.data.coutNum;
			}else{
				obj.$message.error('获取订单列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('网络连接错误~~');
		})
	}
</script>

<style scoped="scoped">
	.lookInfo{
		color: #01AEF0;
		text-decoration: underline;
		cursor: pointer;
	}
	.filter{
		width: 100%;
		box-sizing: border-box;
	}
	.inlineBlock{
		margin:20px 0px;
	}
	.filter .left{
		float: left;
	}	
</style>