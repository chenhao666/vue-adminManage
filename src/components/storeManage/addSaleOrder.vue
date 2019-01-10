<template>
	<div class="addSaleOrder">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/storeManage/saleManage' }">卖出管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">订单</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>

		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单详情</span>
			</div>
			<div class="line"></div>

			<!--基础信息-->
			<div class="userInfo">
				<el-form label-width="85px" :rules="rules" ref="ruleForm" :model="ruleForm" style="margin-top: 20px;">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="卖出时间：" prop='saleTime'>
								<el-date-picker 
									v-model="ruleForm.saleTime" 
									type="datetime" 
									v-if="editFlag"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择日期">
								</el-date-picker>
								<div v-if="!editFlag">{{ ruleForm.saleTime }}</div>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="销售:"  prop="saleUser" >
								<el-select v-model="ruleForm.saleUser" placeholder="请选择" v-if="editFlag">
								    <el-option
								      v-for="item in ruleForm.saleManArr"
								      :key="item.id"
								      :label="item.personName"
								      :value="item.id+','+item.personName">
								    </el-option>
								</el-select>
								<div v-if="!editFlag">{{ ruleForm.saleMan }}</div>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<!--组合编辑-->
			<div class="edit_btn">
				<el-button  type="primary" @click="addGoodsFun" v-if="editFlag">新增</el-button>
			</div>
			<!--采购列表-->
			<div class="box">
				<el-table border :data="tableData" :stripe="true" tooltip-effect="dark" style="width: 1300px;max-width:1920px;">
					<el-table-column   prop="index" label="序号" width="60" >
						<template slot-scope="props">
							<div v-if="!props.row.goodsFlag">{{ props.$index +1 }}</div>
							<div v-if="props.row.goodsFlag">合计</div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsImages" label="图片" min-width="100">
						<template slot-scope="props">
							<div><img :src="props.row.goodsImages" alt="" style="width: 80%;"/></div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsCode" label="产品编号" min-width="80">
					</el-table-column>
					<el-table-column prop="brandName" label="品牌" min-width="60">
					</el-table-column>
					<el-table-column prop="goodsName" label="名称" min-width="80">
					</el-table-column>
					<el-table-column prop="goodsColor" label="颜色" min-width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="specifications" label="规格" min-width="100" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="retailPrice" label="零售单价" min-width="60">
						<template slot-scope="scope">
							<div><span v-if="!scope.row.goodsFlag">￥</span>{{ scope.row.retailPrice }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="sellUnitPrice" label="卖出单价" min-width="100">
						<template slot-scope="props">
							<el-input v-if="!props.row.goodsFlag && editFlag" v-model="props.row.sellUnitPrice"  style="width: 90%;"  @change="inputChange(props.$index, props.row)"></el-input>
							<div v-if="!editFlag"><span v-if="!props.row.goodsFlag">￥</span>{{ props.row.sellUnitPrice }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsNum" label="数量" min-width="60">
						<template slot-scope="props">
							<el-input v-if="!props.row.goodsFlag && editFlag" v-model="props.row.goodsNum"  style="width: 90%;"  @change="inputChange(props.$index, props.row)"></el-input>
							<div v-if="props.row.goodsFlag || !editFlag">{{ props.row.goodsNum }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="totalPrice" label="卖出小计" min-width="80">
						<template slot-scope="scope">
							<div>￥{{ scope.row.totalPrice }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" v-if="editFlag">
				      <template slot-scope="scope">
				        <el-button
				          size="mini"
				          type="danger"
				          v-if="!scope.row.goodsFlag"
				          style="margin: 5px 5px;"
				          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				      </template>
				    </el-table-column>
				</el-table>
			</div>
			<div class="btn_group">
				<el-button type="primary" v-if="editFlag" @click="saveOrder('ruleForm')">保存</el-button>
				<el-button  @click="goBack" v-if="editFlag">取消</el-button>
			</div>
		</el-card>

		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  title="商品列表"
			  :visible.sync="goodsListVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  >
			  <!--表单开始-->
			  	<div class="dialogFilter">
			  		<el-input v-model="goodsSearch" placeholder="请输入商品名称或编码"></el-input>
			  		<el-button type="primary" @click="searchGoods">搜索</el-button>
			  	</div>


				<el-table border
					:data="goodsData"
					:stripe="true"
					tooltip-effect="dark"
					style="width: 100%;">
					<el-table-column prop="goodsSrc" label="图片" min-width="75" show-overflow-tooltip>
						<template slot-scope="props">
							<img :src="props.row.goodsSrc" alt="" width="80%"/>
						</template>
					</el-table-column>
					<el-table-column prop="goodsCode" label="编号" min-width="75" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="goodsName" label="名称" min-width="75" show-overflow-tooltip>
						<template slot-scope="props">
							<div class="hrefA" @click="selectGoodsFun(props.row)">{{ props.row.goodsName }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="goodsColor" label="颜色" width="80">
					</el-table-column>
					<el-table-column prop="specifications" label="规格" width="80">
					</el-table-column>
					<el-table-column prop="unitPrice" label="价格" width="80">
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
				      layout="total,prev, pager, next, jumper"
				      :total="pageTotal">
				    </el-pagination>
				</div>
				<div class="clear"></div>
			</el-dialog>

		</div>
	</div>
</template>

<script>
	export default {
		name:'addSaleOrder',
		data () {
			return {
				orderNum:'',
				tableData:[],
				goodsListVisible:false,
				editFlag:true,
				goodsList:[],//商品列表
				goodsData:[],//库存列表
				selectBrandIndex:0,//选中品牌下标
				goodsSearch:'',
				currentPage: 1,//分页当前页数
		   	 	pageSize:10,//分页默认每页条数
		    	pageTotal:0,//页数总数
				ruleForm:{
					saleTime:'',//卖出时间
					saleMan:this.$store.state.userName,//销售
					saleManArr:[],//销售数组
		    		saleUser:''//销售
				},
				rules:{
					saleTime:[
						{ required: true, message: '请选择卖出时间', trigger: 'blur' }
					],
					saleUser:[
						{ required: true, message: '请选择销售', trigger: 'blur' }
					]
				}
			}
		},
		mounted(){
			//当前时间
	        var date = new Date();
	        var year = date.getFullYear();
	        var month = date.getMonth() + 1;
	        var strDate = date.getDate();
	        var h = date.getHours();
	        var m = date.getMinutes();
	        var s = date.getSeconds();
	        if (month >= 1 && month <= 9) {
	            month = "0" + month;
	        }
	        if (strDate >= 0 && strDate <= 9) {
	            strDate = "0" + strDate;
	        }
	        if (h >= 0 && h <= 9) {
	            h = "0" + h;
	        }
	        if (m >= 0 && m <= 9) {
	            m = "0" + m;
	        }
	        if (s >= 0 && s <= 9) {
	            s = "0" + s;
	        }
			this.ruleForm.saleTime=year+'-'+month+'-'+strDate+' '+h+':'+m+':'+s;
			//console.log(this.$route.query.num)
			if(this.$route.query.num){	
				this.orderNum=Base64.decode(this.$route.query.num);
				orderList(this);
			}else{		
				var that=this;
				getSalesMan(this,function(){
					that.ruleForm.saleUser=that.$store.state.userCode+','+that.$store.state.userName;
				})
			}
		},
		methods:{
			//监听输入框变化
		    inputChange(index,row){
		    	var num=0;
		    	if(row.remainNum){
		    		num=row.remainNum;
		    	}
		    	if(row.totalNum){
		    		num=row.totalNum
		    	}
		    	if(row.goodsNum>num){
		    		this.$message({
				        message: '当前卖出数量大于库存总数！请重新编辑',
				        type: 'warning'
				    });
				    return;
		    	}
		    	if(parseInt(row.goodsNum)!=row.goodsNum || row.goodsNum<1){
		    		this.$message({
				        message: '请输入正确的数量',
				        type: 'warning'
				    });
				    return;
		    	}
		    	if(parseFloat(row.sellUnitPrice)!=row.sellUnitPrice || row.sellUnitPrice<0){
		    		this.$message({
				        message: '请输入正确的价格',
				        type: 'warning'
				    });
				    return;
		    	}
		    	var list=this.tableData;
		    	this.tableData=totalPrice(list);
		    },
		   
		    //时间格式化
		    timeFomit(timeDate){
		      	//console.log(timeDate)
		      	 return (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
		    },
		    ////新增商品
			addGoodsFun(){
				this.goodsListVisible=true;
			},
			//分页方法
			handleSizeChange(val) {
			  //console.log(`每页 ${val} 条`);
			  this.pageSize=val;
			  goodsListAll(this);
			},
			handleCurrentChange(val) {
			  //console.log(`当前页: ${val}`);
			  this.currentPage=val;
			  goodsListAll(this);
			},
			//搜索商品
			searchGoods(){
				this.currentPage=1;
				goodsListAll(this)
			},
			//删除商品
			handleDelete(index,row){
				this.$confirm('确定删除当前商品吗?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			    }).then(() => {
			    	var list=this.tableData.concat([]);
					list.splice(index,1);
					if(list.length==1){
						list=[];
						this.tableData=list;
					}else{
						this.tableData=totalPrice(list);
					}
			    }).catch(() => {
			      this.$message({
			        type: 'info',
			        message: '已取消删除'
			      });          
			    });
			},
			//新增商品
			selectGoodsFun(row){
				var list=this.tableData.concat([]);
				for(var i=0;i<list.length;i++){
					if(row.goodsCode==list[i].goodsCode){
						this.$message({
				          message: '当前商品已存在,请勿重复添加',
				          type: 'warning'
				       	});
				       	return;
					}
				}
				if(this.tableData.length==0){
					var tableTotal={
						goodsFlag:1,
						goodsNum:0,//数量
						totalPrice:0//总计
					}
					this.tableData.push(tableTotal);
				}
				row.sellUnitPrice=row.unitPrice;
				row.totalNum=row.goodsNum;
				row.goodsNum=1;
				row.totalPrice=row.unitPrice;
				//数据字段修改
				row.retailPrice=row.unitPrice;
				
				this.tableData.unshift(row);
				this.tableData=totalPrice(this.tableData);
				this.goodsListVisible=false;
			},
			//返回
	      	goBack(){
	      		window.history.go(-1);
	      	},
	      	//保存信息
	      	saveOrder(formName){
      		 	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		var list=this.tableData.concat([]);
		          		var len=list.length;
		          		var totalObj=list[len-1];
		          		list.pop();
		          		for(var i=0;i<list.length;i++){
		          			var num=0;
					    	if(list[i].remainNum){
					    		num=list[i].remainNum;
					    	}
					    	if(list[i].totalNum){
					    		num=list[i].totalNum
					    	}
		          			if(list[i].goodsNum>num){
		          				this.$message({
						          	message: list[i].goodsName+'商品数量大于库存数量，请重新编辑',
						          	type: 'warning'
						       	});
						       	return;
		          			}
					    	if(parseInt(list[i].goodsNum)!=list[i].goodsNum || list[i].goodsNum<1){
					    		this.$message({
							        message: '请输入正确的数量',
							        type: 'warning'
							    });
							    return;
					    	}
					    	if(!parseFloat(list[i].sellUnitPrice) || list[i].sellUnitPrice<0){
					    		this.$message({
							        message: '请输入正确的价格',
							        type: 'warning'
							    });
							    return;
					    	}
		          		}
		          		var saleArr=this.ruleForm.saleUser.split(',');
		          		var data={
		          			salesId:this.$store.state.userCode,
		          			salesMan:this.$store.state.userName,
		          			entryId:saleArr[0],
		          			entryMan:saleArr[1],
		          			salesTime:this.ruleForm.saleTime,//卖出时间
		          			goodsNum:totalObj.goodsNum,//总数量
		          			totalAmount:totalObj.totalPrice,//总金额
		          			sellsOrderGoods:list//列表
		          		}
		          		if(this.orderNum){
							data.orderNo=this.orderNum;
						}
		          		//新增
		          		addSaleOrder(this,data);
		          	} else {
		          		this.$message.error("表单提交失败！");
		            	//console.log('error submit!!');
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
	function orderList(obj,orderNum){
		const loading =openLoad(obj,"获取列表中...");
		var data={
			"orderNo":obj.orderNum
		}
		obj.$ajax.post(obj.$store.state.localIP+"querySellsOrderGoods",data)
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				if(response.data.data.dataBean){
					var dataObj=response.data.data.dataBean;
					var createTime=dataObj.createTime;
					var time = new Date(createTime).getTime();
					var nowTime=new Date().getTime();
					if(nowTime-time>60*60*1000 || dataObj.salesId!=obj.$store.state.userCode){
						obj.editFlag=false;
					}
					var tableTotal={
						goodsFlag:1,
						goodsNum:dataObj.goodsNum,//数量
						totalPrice:dataObj.totalAmount//总计
					}
					obj.ruleForm.saleTime=dataObj.salesTime.split('.')[0];
					obj.ruleForm.saleMan=dataObj.entryMan;
					if(response.data.data.dataList){
						if(response.data.data.dataList.length>0){							
							obj.tableData.push(tableTotal);
						}
					}
					getSalesMan(obj,function(){
						obj.ruleForm.saleUser=dataObj.entryId+','+dataObj.entryMan;
					})
				}
				if(response.data.data.dataList){
					var list=response.data.data.dataList.concat(obj.tableData);
					for(var i=0;i<list.length;i++){
						list[i].remainNum=list[i].remainNum+list[i].goodsNum;
					}
					obj.tableData=list;
				}
			}else{
				obj.$message.error(response.data.retMsg);
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
		var num=0;
		var price=0;
		//console.log(list)
		for(var i=0;i<list.length-1;i++){
			num+=parseInt(list[i].goodsNum);
			price+=(parseFloat(list[i].sellUnitPrice)*100*parseInt(list[i].goodsNum))/100;
			list[i].totalPrice=(parseFloat(list[i].sellUnitPrice)*100*parseInt(list[i].goodsNum))/100;
		}
		list[len-1].goodsNum=num;
		list[len-1].totalPrice=price;
		return list;
	}
	//获取商品列表
	function goodsListAll(obj){
		//console.log(obj.currentPage)
		const loading =openLoad(obj);
		obj.$ajax.post(obj.$store.state.localIP+"queryInventoryGoods",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize,
			"empId":obj.$store.state.userCode,
			"search":obj.goodsSearch
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				var list=response.data.data.dataList;
				//console.log(list)
				obj.pageTotal=response.data.data.countNum;
				for(var i=0;i<list.length;i++){
					if(list[i].goodsImages.indexOf(',')>-1){
						var arr=list[i].goodsImages.split(',');
						list[i].goodsSrc=arr[0];
					}else{
						list[i].goodsSrc=list[i].goodsImages;
					}
				}
				obj.goodsData=list;
			}else{
				obj.$message.error(response.data.retMsg);
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取商品列表失败！');
		})
	}
	//新增卖出订单
	function addSaleOrder(obj,data){
		const loading =openLoad(obj);
		obj.$ajax.post(obj.$store.state.localIP+'saveSellsOrderGoods',data)
		.then(response=>{
			loading.close();
			if(response.data.retCode==0){
	            obj.$message({
					message: '操作成功!',
					type: 'success'
				});
				obj.$router.push({path:'/storeManage/saleManage'})
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
	//获取所有销售saleManArr
	function getSalesMan(obj,callback){
		const loading =openLoad(obj);
		obj.$ajax.post(obj.$store.state.localIP+'queryStoreEmp',{empId:obj.$store.state.userCode})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
	            obj.ruleForm.saleManArr=response.data.data || [];
	            callback();
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
		margin-top: 20px;
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
	.packageList{
		margin-top: 20px;
	}
	.edit_btn{
		text-align: right;
	}
	.el-select,.el-input{
		max-width: 200px;
	}
	.widthLager .el-input{
		width: 300px;
		max-width: 300px;
	}
	.picList{
		width: 100%;
	}
	.el-textarea{
		max-width: 400px;
	}
	.picList ul li{
		width: 25%;
		height: auto;
		/*height: 160px;*/
		float: left;
		/*overflow: hidden;*/
		margin-top: 20px;
	}
	.picList ul li img:hover{
		/*border: 1px solid rgb(255, 208, 75);*/
	}
	.picList ul li img{
		width: 90%;
		height: auto;
		display: block;
		margin: 0 auto;
		cursor: pointer;
		box-sizing: border-box;
	}
	.addPackageForm .el-button{
		width: 200px;
		margin-top: 30px;
	}
	.item_container{
		position: relative;
	}
	.addInfo{
		display: block;
		float: left;
		width: 300px;
		height: 360px;
		line-height: 360px;
		text-align: center;
		font-size: 60px;
		cursor: pointer;
		margin-top: 5px;
		border: 1px solid rgba(64,158,255,.2);
		border-radius:4px;
		color: #409eff;
		background-color: rgba(64,158,255,.1);
	}
	.dialogFilter{
		margin-bottom: 20px;
	}
	.dialogFilter .el-button{
		width: 100px;
	}
	.hrefA{
		color: #01AEF0;
		text-decoration: underline;
		cursor: pointer;
	}
	.el-dialog .el-form{
		padding: 0px;
	}
	.goodsList{
		max-height: 400px;
		overflow-y: auto;
	}
</style>
