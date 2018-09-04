<template>
	<div class="orderInfo">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">订单详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单详情</span>
			</div>
			<div class="line"></div>
			
			<!--筛选条件-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left" style="width: 200px;margin-left: 10px;">
						<el-select v-model="state" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in stateList"
						      :key="index"
						      :label="item"
						      :value="index">
						    </el-option>
						</el-select>
					</div>
					<div class="left" style="margin-left: 10px;">
						<el-button type="primary" @click="updateState"><span class="iconfont icon-search"></span>修改</el-button>
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
				<el-table-column prop="name" label="商品" width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="imageUrl" label="商品图">
					<template slot-scope="props">
						<div><img :src="props.row.imageUrl" alt="" width="90%"/></div>
					</template>
				</el-table-column>
				<el-table-column prop="typeName" label="空间名">
				</el-table-column>
				<el-table-column prop="packageName" label="套餐包">
				</el-table-column>
				<el-table-column prop="species" label="类型">
				</el-table-column>
				<el-table-column prop="goodsCode" label="编号">
				</el-table-column>
				<el-table-column prop="model" label="型号">
				</el-table-column>
				<el-table-column prop="material" label="颜色材质">
				</el-table-column>
				<el-table-column prop="number" label="数量" >
				</el-table-column>
				<el-table-column prop="unitPrice" label="单价">
					<template slot-scope="props">
						<div>￥{{ props.row.unitPrice/100 }}</div>
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
	export default{
		name:'orderInfo',
		data(){
			return{
				tableData:[],
				orderNum:'',//订单编号
				currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        stateList:['待付款','已付款','已发货','已签收','退货申请','退货中','已退货','取消交易','订单完成'],
		        state:0,//状态
			}
		}, 
		mounted(){
			//console.log(this.$route)
			this.orderNum=Base64.decode(this.$route.params.code);
			this.state=parseInt(Base64.decode(this.$route.query.state));
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
		    //修改状态
		    updateState(){
		    	const loading =openLoad(this,"Loading...");
		    	this.$ajax.post(this.$store.state.localIP+'updateGoodsOrder',{
		    		orderNo:this.orderNum,
		    		orderStatus:this.state
		    	})
		    	.then(response=>{
					loading.close();
					//console.log(response)
					if(response.data.retCode==0){
						this.$message({
				          	message: '操作成功!',
				          	type: 'success'
				       	});
				       	this.$router.push({path:'/userManage/userOrder'})
					}else{
						this.$message.error('操作失败！');
					}
					loading.close();
				})
				.catch((error)=>{
					loading.close();
			        console.log(error)
					this.$message.error('网络连接错误~~');
				})
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
	//获取订单详情
	function orderList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryOrderDetailByNoForWeb",{
			"orderNo":obj.orderNum,
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.goodsOrderDetailList;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取订单详情失败！');
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