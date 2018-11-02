<template>
	<div class="userPrder">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userOrder/userOrder' }">订单管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">采购</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>采购详情</span>
			</div>
			<div class="line"></div>
			
			<!--基础信息-->
			<div class="userInfo">
				<el-form>
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="订单编号：">
								{{ orderNum }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="姓名：">
								{{ userName }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="电话：">
								{{ mobile }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="付款时间：">
								{{ payTime }}
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="6">
							<el-form-item label="订单金额：">
								{{ orderPrice }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="城市：">
								{{ city }}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="备注：">
								{{ remark }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-form label-width="130px" :rules="rules" ref="ruleForm" :model="ruleForm" style="margin-top: 20px;">	
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="房号：" prop='roomNum'>
								<el-input v-model="ruleForm.roomNum" placeholder="请输入内容"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="收货人：" prop='reciveName'>
								<el-input v-model="ruleForm.reciveName" placeholder="请输入内容"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="收货人联系电话：" prop='telphone'>
								<el-input v-model="ruleForm.telphone" placeholder="请输入内容"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="收货地址：" prop='address'>
								<el-input v-model="ruleForm.address" placeholder="请输入内容"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			
			<!--品牌-->
			<el-tabs v-model="brandSelect" type="card" @tab-click="handleClick">
			    <el-tab-pane v-for="(item,key) in goodsList" :key='key' :label="item.brandName" :name="item.brandId.toString()"></el-tab-pane>
			</el-tabs>
			<!--采购列表-->
			<div class="box">
				<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" style="width: 1300px;max-width:1920px;margin-top: 20px;">
					<el-table-column   prop="index" label="序号" width="60" >
						<template slot-scope="props">
							<div v-if="!props.row.goodsFlag">{{ props.$index +1 }}</div>
							<div v-if="props.row.goodsFlag">合计</div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsType" label="类型" min-width="60">
					</el-table-column>
					<el-table-column prop="typeName" label="区域" min-width="60">
					</el-table-column>
					<el-table-column prop="goodsCode" label="产品编号" min-width="80">
					</el-table-column>
					<el-table-column prop="goodsName" label="名称" min-width="80">
					</el-table-column>
					<el-table-column prop="articleNum" label="厂家货号" min-width="80">
					</el-table-column>
					<el-table-column prop="model" label="厂家编号" min-width="80" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="specifications" label="规格" min-width="100" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="goodsImages" label="图片" min-width="100">
						<template slot-scope="props">
							<div><img :src="props.row.goodsImages" alt="" style="width: 80%;"/></div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsColor" label="颜色" min-width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="units" label="单位" min-width="60">
					</el-table-column>
					<el-table-column prop="goodsNum" label="数量" min-width="60">
					</el-table-column>
					<el-table-column prop="guideUnitPrice" label="指导单价" min-width="80">
					</el-table-column>
					<el-table-column prop="purchasePrice" label="采购单价" min-width="120">
						<template slot-scope="props">
							<el-input v-if="!props.row.goodsFlag" v-model="props.row.purchasePrice"  style="width: 90%;"  @change="inputChange(props.$index, props.row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="purchaseTotal" label="采购小计" min-width="80">
					</el-table-column>
					<el-table-column prop="orderStatus" label="备注"  show-overflow-tooltip>
						<template slot-scope="props">
							<div><a href="javascript:void(0)" class="lookInfo" @click="descInfo(props.$index,props.row)">{{ props.row.descreption ? props.row.descreption : '备注' }}</a></div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			
			<div class="right_footer">
				<el-form>
					<el-form-item label="税费：">
						<el-input v-model="taxation" >
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			
			<div class="right_footer">
				<el-form>
					<el-form-item label="期望出货时间：" style="width:320px;">
						<el-date-picker
					      v-model="sendTime"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</el-form-item>
				</el-form>
			</div>
			
			<div class="btn_group">
				<el-button type="success" @click="exportExcel">导出采购清单</el-button>
				<el-button type="primary" @click="saveOrder">保存</el-button>
			</div>
			
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
			  <el-form ref="ruleForm" label-width="85px">
				
			  	<el-form-item label="备注信息">
			  		<el-input v-model="desc"  @change="inputFlag=1" :maxlength="255"></el-input>
			  	</el-form-item>
			  	
			  	
			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name:'userPrder',
		data () {
			//手机号码验证
			let checkMobile=(rule, value, callback)=>{
				let Ptest=/^1[34578]{1}\d{9}$/;
				if(!Ptest.test(value)){
					callback(new Error('请输入正确的手机格式'))
				}else{
					callback();
				}
			};
			return {
				orderNum:'',//订单编号
				tableData:[],
				dialogVisible:false,
				goodsList:[],//商品列表
				brandSelect:'',//选择品牌
				selectBrandIndex:0,//选中品牌下标
				ruleForm:{
					roomNum:'',//房号
					reciveName:'',//收货人
					telphone:'',//联系电话
					address:'',//地址	
				},
				userName:'',//姓名
				mobile:'',//电话
				payTime:'',//付款时间
				orderPrice:'',//订单金额
				city:'',//城市
				remark:'',//备注
				desc:'',//输入备注
				taxation:'',//税费
				sendTime:'',//出货时间
				rules:{
					roomNum:[
						{ required: true, message: '请输入房号', trigger: 'blur' }
					],
					reciveName:[
						{ required: true, message: '请输入收货人', trigger: 'blur' }
					],
					telphone:[
						{ required: true, validator: checkMobile, trigger: 'blur' }
					],
					address:[
						{ required: true, message: '请输入地址', trigger: 'blur' }
					]
				}
			}
		},
		mounted(){
			this.orderNum=Base64.decode(this.$route.params.code);
			orderList(this);
		},
		methods:{
		    //备注
		    descInfo(index,row){
		    	this.dialogVisible=true;
		    	this.selectGoodsIndex=index;
		    	this.desc=row.descreption || '';
		    },
		    //选择品牌
		    handleClick(tab, event) {
		        //console.log(tab.index);
		        var index=tab.index;
		        this.brandSelect=this.goodsList[index].brandId.toString();
		        this.tableData=totalPrice(this.goodsList[index].goodsInfoList || []);
		    },
		    //监听输入框变化
		    inputChange(index,row){
		    	var list=this.tableData;
		    	var val=list[index].purchasePrice;
		    	var price=0;
		    	if(val == parseFloat(val)){
		    		price=Math.abs(parseFloat(val));
		    	}
		    	
		    	list[index].purchasePrice=price.toFixed(2);
		    	list[index].purchaseTotal=(price* list[index].goodsNum).toFixed(2);
		    	this.tableData=[];
		    	this.tableData=totalPrice(list);
		    	this.goodsList[this.selectBrandIndex].goodsInfoList=this.tableData;
		    },
		    //提交表单
		    submitForm(formName) {
		    	var list=this.tableData;
		      	this.tableData=[];
		      	list[this.selectGoodsIndex].descreption=this.desc;
		      	this.tableData=list;
		      	this.goodsList[this.selectBrandIndex].goodsInfoList=this.tableData;
		      	//console.log(list)
		      	this.dialogVisible=false;
		    },
		    //时间格式化
		    timeFomit(timeDate){
		      	//console.log(timeDate)
		      	 return (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
		    },
		    //保存采购订单
		    saveOrder(){
		    	const loading =openLoad(this,"loading...");
				var list=this.tableData;
				var len=list.length;
				var listAll=[];
				for(var i=0;i<len-1;i++){
					listAll.push(list[i]);
				}
				
				var data={
					"purchaseAddress":{
						"houseNo":this.ruleForm.roomNum,
						"consignee":this.ruleForm.reciveName,
						"consMobileNum":this.ruleForm.telphone,
						"consAddress":this.ruleForm.address,
						
					},
					"purchasecost":{
						"brandId":this.brandSelect,
						"brandName":this.goodsList[this.selectBrandIndex].brandName,
						"taxation":parseFloat(this.taxation || 0).toFixed(2),
						"purchaseNum":list[len-1].goodsNum,
						"purchaseTotal":list[len-1].purchaseTotal
					},
					"purchaseinfoList":listAll,
					"orderNo":this.orderNum
				}
				if(this.sendTime){
					var time = this.timeFomit(this.sendTime);
					data.purchasecost.shipmentTime=time;
				}
				this.$ajax.post(this.$store.state.localIP+"savePurchaseInfo",data)
				.then(response=>{
					loading.close();
					//console.log(response)
					if(response.data.retCode==0){	
						this.$message({
				          	message: '操作成功!',
				          	type: 'success'
				       	});
					}else{
						this.$message.error(response.data.retMsg);
					}
				})
				.catch((error)=>{
					loading.close();
			        console.log(error)
					this.$message.error('网络连接错误~~');
				})
		    },
		    //导出清单
		    exportExcel(){
		    	const loading =openLoad(this,"loading...");
				var list=this.tableData;
				var len=list.length;
				var data={
					"orderNo":this.orderNum,
					"brandId":this.brandSelect
				}
				this.$ajax.post(this.$store.state.localIP+"downLoadPurchase",data)
				.then(response=>{
					loading.close();
					//console.log(response)
					if(response.data.retCode==0){	
						window.location.href=this.$store.state.localIP+response.data.excelUrl;
					}else{
						this.$message.error(response.data.retMsg);
					}
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
	//获取订单列表
	function orderList(obj){
		const loading =openLoad(obj,"获取列表中...");
		var data={
			"orderNo":obj.orderNum
		}
		obj.$ajax.post(obj.$store.state.localIP+"queryPurchaseList",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){	
				obj.ruleForm.roomNum=response.data.goodsOrder.address || '';
				obj.ruleForm.reciveName=response.data.goodsOrder.consignee || '';
				obj.ruleForm.telphone=response.data.goodsOrder.consMobileNum || '';
				obj.ruleForm.address=response.data.goodsOrder.consAddress || '';
	
				obj.userName=response.data.goodsOrder.linkman || '';
				obj.mobile=response.data.goodsOrder.linkMobileNum || '';
				obj.payTime=response.data.goodsOrder.updateTime.split('.')[0];
				obj.orderPrice=response.data.goodsOrder.actualAmount ? '￥'+response.data.goodsOrder.actualAmount : '';
				obj.city=response.data.goodsOrder.city || '';
				obj.remark=response.data.goodsOrder.remark || '';
				
				obj.taxation=response.data.goodsOrder.taxation || '';
				obj.sendTime=response.data.goodsOrder.shipmentTime || '';
				
				var list=response.data.purchaseList;
				if(list.length>0){
					obj.goodsList=list;//商品列表
					obj.brandSelect=list[0].brandId.toString();
				}
				var childList=list[0].goodsInfoList || [];
				if(childList.length>0){
					obj.tableData=totalPrice(childList);
				}
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
	//计算合计
	function totalPrice(list){
		var len=list.length;
		if(list[len-1].goodsFlag){
			list.pop();
		}
		var info={
			goodsFlag:1,
			purchaseTotal:0,
			goodsNum:0,
			descreption:''
		}
		for(var i=0;i<list.length;i++){
			//格式统一
			list[i].descreption=list[i].descreption || '';
			if(list[i].purchaseTotal || parseFloat(list[i].purchaseTotal)==0){
				list[i].purchaseTotal=parseFloat(list[i].purchaseTotal).toFixed(2)
			}
			if(list[i].guideUnitPrice || parseFloat(list[i].guideUnitPrice)==0){
				list[i].guideUnitPrice=parseFloat(list[i].guideUnitPrice).toFixed(2)
			}
			if(list[i].purchasePrice || parseFloat(list[i].purchasePrice)==0){
				list[i].purchasePrice=parseFloat(list[i].purchasePrice).toFixed(2)
			}
			
			info.purchaseTotal +=parseFloat(list[i].purchaseTotal || 0);
			info.goodsNum +=list[i].goodsNum;
		}
		info.purchaseTotal=info.purchaseTotal.toFixed(2);
		list.push(info)
		return list;
	}
</script>

<style scoped="scoped">
	.lookInfo,.purchase{
		padding: 0px 10px;
		color: #01AEF0;
		text-decoration: underline;
		cursor: pointer;
	}
	.el-input{
		width: 300px;
	}
	.box{
		width: 100%;
		overflow: auto;
	}
	.right_footer{
		text-align: right;
	}
	.right_footer .el-form{
		margin-top: 20px;
	}
	.right_footer .el-form-item{
		display: inline-block;
		width: 280px;
		margin: 0px;
	}
	.right_footer .el-input{
		width: 200px;
	}
	.btn_group{
		text-align: center;
		margin-top: 20px;
	}
	.btn_group .el-button{
		margin: 0px 30px;
	}
</style>