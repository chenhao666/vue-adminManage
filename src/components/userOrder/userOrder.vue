<template>
	<div class="userPrder">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userOrder/packageOrder' }">订单管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">线上订单</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>

		<el-card class="box-card">
			<!--<div slot="header" class="clearfix">-->
				<!--<span>套餐订单</span>-->
			<!--</div>-->
      <el-tabs  @tab-click="handleClick">
        <el-tab-pane label="线上订单" name="0"></el-tab-pane>
        <el-tab-pane label="手工订单" name="1" ></el-tab-pane>
      </el-tabs>
			<div class="line"></div>

			<!--筛选条件-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left">
						<el-input v-model="searchNum" placeholder="请输入订单编号"></el-input>
					</div>
					<div class="left">
						<el-input v-model="searchName" placeholder="请输入姓名"></el-input>
					</div>
					<div class="left">
						<el-input v-model="searchCity" placeholder="请输入城市"></el-input>
					</div>
					<div class="left">
						<el-date-picker
							v-model="searchTime"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>
					</div>
					<div class="left">
						<el-input v-model="searchAddress" placeholder="请输入地址"></el-input>
					</div>
					<div class="left">
						<el-input v-model="searchUsername" placeholder="请输入账号"></el-input>
					</div>
					<div class="left">
						<el-select v-model="searchPay" placeholder="支付状态">
							<el-option label="全部" value=""></el-option>
						    <el-option label="未付" value="0"></el-option>
						    <el-option label="已付" value="1"></el-option>
						</el-select>
					</div>
					<div class="left">
						<el-select v-model="searchStatus" placeholder="订单状态">
							<el-option  label="全部" value=""></el-option>
						    <el-option
						      v-for="(item,index) in stateList"
						      :key="index"
						      :label="item"
						      :value="index">
						    </el-option>
						</el-select>
					</div>
					<div class="left">
						<el-input v-model="searchDesc" placeholder="请输入备注"></el-input>
					</div>
					<div class="left">
						<el-button type="success" @click="searchOrder"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<!--订单列表-->
			<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" >
				<!--<el-table-column type="selection" width="55">
				</el-table-column>-->
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="city" label="城市" min-width="60" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="updateTime" label="创建时间" min-width="100">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.updateTime)[0] }}</div>
						<div>{{ timeFomit(props.row.updateTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="地址" min-width="80" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="linkman" label="姓名" min-width="60" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="linkMobileNum" label="电话" min-width="60" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="mobileNum" label="账号" min-width="60" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="actualAmount" label="金额" min-width="80">
					<template slot-scope="props">
						<div>￥{{ props.row.actualAmount }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="alreadyAmount" label="已付" min-width="80">
					<template slot-scope="props">
						<div>￥{{ props.row.alreadyAmount ? props.row.alreadyAmount : 0 }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatus" label="支付状态" min-width="80" show-overflow-tooltip>
					<template slot-scope="props">
						<div>{{ stateList[props.row.orderStatus] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatus" label="备注" min-width="80" show-overflow-tooltip v-if="editBtnShow">
					<template slot-scope="props">
						<div><a href="javascript:void(0)" class="lookInfo" @click="descInfo(props.row)">{{ props.row.remark ? props.row.remark : '备注' }}</a></div>
					</template>
				</el-table-column>
				<el-table-column  label="操作">
					<template slot-scope="scope">
						<!--<div class="lookInfo" @click="handleShow(scope.$index, scope.row)">详情</div>-->
						<div class="lookInfo" @click="handleEdit(scope.$index, scope.row)" v-if="editBtnShow">商品</div>
						<div class="purchase" @click="handlePurchase(scope.$index, scope.row)" v-if="purchaseBtnShow">采购</div>
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
			  title="备注"
			  :visible.sync="dialogVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  >
			  <!--表单开始-->
			  <el-form ref="ruleForm" :model="ruleForm" label-width="85px">

			  	<el-form-item label="备注信息">
			  		<el-input v-model="ruleForm.desc"  @change="inputFlag=1" :maxlength="255"></el-input>
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
		name:'userPrder',
		data () {
			return {
				addBtnShow:false,
				delBtnShow:false,
				editBtnShow:false,
        purchaseBtnShow:false,
				roleAuthList:sessionStorage.getItem('roleAuthList'),
				dialogVisible:false,
				selectOrderNum:'',
				tableData:[],
				searchName:'',//搜索客户
				searchNum:'',//搜索订单编号
				searchCity:'',//搜索城市
				searchTime:'',//搜索时间
				searchAddress:'',//搜索地址
				searchUsername:'',//搜索账号
				searchPay:'',//搜索已付
				searchStatus:'',//搜索状态
				searchDesc:'',//搜索备注
				currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        stateList:['待付款','已付款','已发货','已签收','退货申请','退货中','已退货','取消交易','订单完成','已关闭'],
		        ruleForm:{
		        	desc:''
		        },
        // showDetailType:0,//0是线上订单,1是手工订单
			}
		},
		mounted(){
			if(this.roleAuthList.indexOf('1')>-1){
				this.addBtnShow=true;
			}
			if(this.roleAuthList.indexOf('2')>-1){
				this.delBtnShow=true;
			}
			if(this.roleAuthList.indexOf('3')>-1){
				this.editBtnShow=true;
			}
      if(this.roleAuthList.indexOf('4')>-1){
        this.purchaseBtnShow=true;
      }
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
        //tab切换
        handleClick(tab, event) {
          if(tab.index=="0"){
            this.$router.push({path:'/userOrder/packageOrder'})
          }else if(tab.index=="1"){
            this.$router.push({path:'/userOrder/handleOrder'})
          }
          orderList(this);
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
		    	//console.log(row)
		    	var num = Base64.encode(row.orderNo);
		    	var state=Base64.encode(row.orderStatus);
		    	this.$router.push({path:'/userOrder/orderInfo/'+num,query:{state:state}})
		    },
		    //采购
		    handlePurchase(index,row){
		    	var num = Base64.encode(row.orderNo);
		    	/*var state=Base64.encode(row.orderStatus)*/
		    	this.$router.push({path:'/userOrder/purchase/'+num})
		    },
        //详情,需要传一个参数区分手工订单还是线上订单
        // handleShow(){
        //   this.$router.push({path:'/userOrder/orderDetail',query:{detailType:0}})
        // },
		    //搜索订单
		    searchOrder(){
		    	this.currentPage=1;
		    	orderList(this);
		    },
		    //备注
		    descInfo(row){
		    	this.selectOrderNum=row.orderNo;
		    	//console.log(row);
		    	this.ruleForm.desc=row.remark || '';
		    	this.dialogVisible=true;
		    },
		     //提交表单
		    submitForm(formName) {
		      	this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	this.dialogVisible=false;
			        	const loading =openLoad(this,"Loading...");
						this.$ajax.post(this.$store.state.localIP+"updateGoodsRemark",{
							"remark":this.ruleForm.desc,
							"orderNo":this.selectOrderNum
						})
						.then(response=>{
							loading.close();
							//console.log(response)
							if(response.data.retCode==0){
								this.$message({
								  message: '备注成功!',
								  type: 'success'
								});
								orderList(this);
							}else{
								this.$message.error('备注失败！');
							}
						})
						.catch((error)=>{
							loading.close();
					        console.log(error)
							this.$message.error('网络连接错误~~');
						})

			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
		      	});
		    },
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
		var data={
			"linkman":obj.searchName,
			"orderNo":obj.searchNum,
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		}
		if(obj.searchCity){
			data.city=obj.searchCity;
		}
		if(obj.searchAddress){
			data.address=obj.searchAddress;
		}
		if(obj.searchUsername){
			data.linkMobileNum=obj.searchUsername;
		}
		if(obj.searchPay || obj.searchPay===0){
			data.status=obj.searchPay;
		}
		if(obj.searchStatus || obj.searchStatus===0){
			data.orderStatus=obj.searchStatus;
		}
		if(obj.searchDesc){
			data.remark=obj.searchDesc;
		}
		if(obj.searchTime){
			data.beginTime=obj.searchTime[0];
			data.endTime=obj.searchTime[1];
		}
		obj.$ajax.post(obj.$store.state.localIP+"queryGoodsOrderList",data)
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
	.lookInfo,.purchase{
		padding: 0px 10px;
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
		margin-left: 20px;
		margin-top: 20px;
		width: 200px;
	}

	.filter{
		width: 100%;
		box-sizing: border-box;
	}
</style>
