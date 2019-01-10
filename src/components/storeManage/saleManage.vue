<template>
  	<div class="saleManage">
	    <el-breadcrumb separator-class="el-icon-arrow-right">
	      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
	      <el-breadcrumb-item :to="{ path: '/storeManage/saleManage' }">卖出管理</el-breadcrumb-item>
	      <el-breadcrumb-item class="fontWeight">卖出管理</el-breadcrumb-item>
	    </el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span @click="changeTab">库存</span>
				<span class="active">卖出</span>
			</div>
			<!--<div class="line"></div>-->
			<!--筛选-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left" style="width: 200px;">
						<el-input v-model="orderCode" placeholder="订单编号"></el-input>
					</div>
					<div class="left" style="margin-left: 20px;">
						<el-date-picker 
							v-model="filterTime" 
							type="daterange" 
							align="right" 
							unlink-panels 
							range-separator="至" 
							start-placeholder="开始日期" 
							end-placeholder="结束日期" 
							value-format="yyyy-MM-dd HH:mm:ss"
							:picker-options="pickerOptions">
						</el-date-picker>
					</div>
					<div class="left" style="width: 200px;margin-left: 20px;">
						<el-input v-model="saleMan" placeholder="销售"></el-input>
					</div>
					<div class="left" style="margin-left: 10px;">
						<el-button type="success" @click="searchOrder"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!--操作-->
			<div class="editBtn">
				<el-button @click="addOrder" v-if="addBtnShow && !storeId" type="primary"><span class="iconfont icon-crm11"></span>新建</el-button>
				<div class="clear"></div>
			</div>
			<div class="role_list">
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark">
						<el-table-column prop="orderNo" label="订单编号" min-width="150" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="salesTime" label="卖出时间" min-width="120" >
							<template slot-scope="props">
								 <div>{{ timeFomit(props.row.salesTime)[0] }}</div>
								 <div>{{ timeFomit(props.row.salesTime)[1] }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间" min-width="120"  show-overflow-tooltip>
							<template slot-scope="props">
								 <div>{{ timeFomit(props.row.createTime)[0] }}</div>
								 <div>{{ timeFomit(props.row.createTime)[1] }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="totalAmount" label="订单金额" min-width="100">
							<template slot-scope="scope">
								<div>￥{{ scope.row.totalAmount }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="goodsNum" label="件数" min-width="80">
						</el-table-column>
						<el-table-column prop="entryMan" label="销售" min-width="100">
						</el-table-column>
						<el-table-column label="操作">
					      <template slot-scope="scope">
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          @click="editOrder(scope.$index, scope.row)">商品</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 5px;"
					          v-if="delBtnShow && scope.row.deleteBtn"
					          type="danger"
					          @click="delOrder(scope.$index, scope.row)">删除</el-button>
					      </template>
				    </el-table-column>
					</el-table>
				</div>
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
	name:'saleManage',
	data(){
		return{
			storeId:'',
			addBtnShow:false,
			delBtnShow:false,
			editBtnShow:false,
			roleAuthList:this.$store.state.roleAuthList,
			tableData: [],
	        currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        orderCode:'',//订单编码
	        filterTime:'',//时间
	        saleMan:'',//销售
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
	        },
		}
	},
	//挂载
	mounted(){
		if(this.$route.query.num){	
			this.storeId=Base64.decode(this.$route.query.num);
		}
		if(this.roleAuthList.indexOf('1')>-1){
			this.addBtnShow=true;
		}
		if(this.roleAuthList.indexOf('2')>-1){
			this.delBtnShow=true;
		}
		if(this.roleAuthList.indexOf('3')>-1){
			this.editBtnShow=true;
		}
		axiosOrder(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
      	//分页方法
      	handleSizeChange(val) {
        	//console.log(`每页 ${val} 条`);
        	this.pageSize=val;
       		axiosOrder(this);
      	},
      	handleCurrentChange(val) {
        	//console.log(`当前页: ${val}`);
        	this.currentPage=val;
        	axiosOrder(this);
      	},
      	//页面跳转
      	changeTab(){
      		if(this.storeId){
      			this.$router.push({path:'/storeManage/inventory',query:{num:Base64.encode(this.storeId)}})
      		}else{      			
      			this.$router.push({path:'/storeManage/inventory'})
      		}
      	},
      	searchOrder(){
      		this.currentPage=1;
      		axiosOrder(this);
      	},
      	//添加订单
      	addOrder(){
      		this.$router.push({path:'/storeManage/addSaleOrder'})
      	},
      	//编辑
      	editOrder(index,row){
      		this.$router.push({path:'/storeManage/addSaleOrder',query:{num:Base64.encode(row.orderNo)}})
      	},
      	//时间格式化
	    timeFomit(timeDate){
	      	//console.log(timeDate)
	      	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
	      	let timeArr=time.split(' ');
	      	return timeArr;
	    },
	    //删除订单
	    delOrder(index,row){
	    	this.$confirm('确定删除当前用户吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          let data={"orderNo":row.orderNo};
	          delOrderData(this,data);
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	        });
	    }
    }
}

//请求数据列表
function axiosOrder(obj){
	const loading =openLoad(obj);
	let data={
		"salesId":obj.$store.state.userCode,
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"orderNo":obj.orderCode,//订单编码
	    "salesMan":obj.saleMan//销售
	}
	if(obj.storeId){
		data.storeId=obj.storeId;
	}
	if(obj.filterTime){
		data.beginTime=obj.filterTime[0];
		data.endTime=obj.filterTime[1];
	}
	obj.$ajax.post(obj.$store.state.localIP+"querySellsOrder",data)
	.then((response)=>{
		//console.log(response);
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
				if(response.data.data){
					//总条数
					obj.pageTotal=response.data.data.countNum;
					
					//obj.tableData=response.data.data.dataList;
					var list=response.data.data.dataList;
					var nowTime=new Date().getTime();
					for(var i=0;i<list.length;i++){
						var time = new Date(list[i].createTime).getTime();
						if(nowTime-time>60*60*1000 || list[i].salesId!=obj.$store.state.userCode){
							list[i].deleteBtn=false;
						}else{
							list[i].deleteBtn=true;
						}
					}
					obj.tableData=list;
				}
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
//删除用户
function delOrderData(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+"deleteSellsOrder",data)
	.then((response)=>{
    	//console.log(response)
		if(response.status==200){
			loading.close();
			if(response.data.retCode==0){
	  			obj.$message({
		          message: '删除成功!',
		          type: 'success'
		       });
		        var list=data.orderNo.toString();
				if(list.indexOf(',')>-1){
					var listArr=list.split(',');
					obj.pageTotal-=listArr.length;
				}else{
					obj.pageTotal-=1;
				}
				if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
					obj.currentPage-=1;
				}
		       	//重新请求数据列表
		       	axiosOrder(obj);
		    }else{
		    	obj.$message.error(response.data.retMsg);
		    }
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error)
		obj.$message.error('网络连接出错~~');
	})
}
</script>

<style scoped>
	.el-table__row{
		cursor: pointer;
	}
	.el-table__header th,.el-table__header td{
		text-align: center !important;
	}
	
	
	.el-table--border th, .el-table__fixed-right-patch{
		box-sizing: border-box !important;
	}
	.iconfont{
		font-size: 14px;
		margin: 0 auto;
	}
	.filter .left{
		float: left;
	}
	
	.filter{
		width: 100%;
		box-sizing: border-box;
	}
	.inlineBlock{
		margin:20px 0px;
	}
	.el-select{
		width:100%;
	}
	.img{
		width: 90%;
		height: auto;
	}
	.role_list{
		margin-top: 20px;
	}
	.clearfix span:nth-child(2){
		margin-left: 30px;	
	}
	.clearfix span{
		padding: 10px 0px;
		cursor: pointer;
	}
	.clearfix span.active{
		border-bottom:2px solid #009FC4;
	}
	.filter .left{
		float: left;
	}
	.el-cascader{
		width: 100%;
	}
	.editBtn{
		width: 100%;
		text-align: right;
		margin-bottom: 20px;
		box-sizing: border-box;
	}
</style>