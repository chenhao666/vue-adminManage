<template>
  	<div class="inventory">
	    <el-breadcrumb separator-class="el-icon-arrow-right">
	      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
	      <el-breadcrumb-item>门店</el-breadcrumb-item>
	      <el-breadcrumb-item class="fontWeight">库存管理</el-breadcrumb-item>
	    </el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span class="active">库存</span>
				<span @click="changeTab">卖出</span>
			</div>
			<!--<div class="line"></div>-->
			<!--筛选-->
			<div class="filter">
				<div class="inlineBlock">
					<div class="left" style="width: 200px;">
						<el-input v-model="search" placeholder="请输入商品编码或名称"></el-input>
					</div>
					<!--<div class="left" style="width: 200px;margin-left: 20px;">
						<el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
					</div>-->
					<div class="left" style="margin-left: 10px;">
						<el-button type="success" @click="searchGoods"><span class="iconfont icon-search"></span>搜索</el-button>
					</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="role_list">
				<div style="width: 100%;">
					<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark">
						<el-table-column prop="goodsImages" label="商品图" min-width="200">
							<template slot-scope="scope">
								<img :src="scope.row.goodsImages" alt="" class="img"/>
							</template>
						</el-table-column>
						<el-table-column prop="goodsCode" label="编号" min-width="100" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="brandName" label="品牌" min-width="100" >
						</el-table-column>
						<el-table-column prop="goodsName" label="商品名称" min-width="100"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="goodsColor" label="颜色" min-width="100">
						</el-table-column>
						<el-table-column prop="specifications" label="规格" min-width="100">
						</el-table-column>
						<el-table-column prop="unitPrice" label="单价" min-width="80">
							<template slot-scope="scope">
								<div>￥{{ scope.row.unitPrice }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="goodsNum" label="数量" min-width="80">
							<template slot-scope="scope">
								<div><span :style="scope.row.goodsNum==0 ? 'color:red;font-weight:bold;' :'color:#000'">{{ scope.row.goodsNum }}</span></div>
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
	name:'inventory',
	data(){
		//手机号码验证
		let checkMobile=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
		//手机号码验证
		let checkTel=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
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
	        search:''//搜索
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
		axiosinventory(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
      	//分页方法
      	handleSizeChange(val) {
        	//console.log(`每页 ${val} 条`);
        	this.pageSize=val;
       		axiosinventory(this);
      	},
      	handleCurrentChange(val) {
        	//console.log(`当前页: ${val}`);
        	this.currentPage=val;
        	axiosinventory(this);
      	},
      	//页面跳转
      	changeTab(){
      		if(this.storeId){
      			this.$router.push({path:'/storeManage/saleManage',query:{num:Base64.encode(this.storeId)}})
      		}else{      			
      			this.$router.push({path:'/storeManage/saleManage'})
      		}
      	},
      	//搜索
      	searchGoods(){
      		this.currentPage=1;
      		axiosinventory(this);
      	}
    }
}

//请求数据列表
function axiosinventory(obj){
	const loading =openLoad(obj);
	let data={
		"empId":obj.$store.state.userCode,
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize,
		"search":obj.search
	}
	if(obj.storeId){
		data.storeId=obj.storeId;
	}
	obj.$ajax.post(obj.$store.state.localIP+"queryInventoryGoods",data)
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					if(response.data.data){
						//总条数
						obj.pageTotal=response.data.data.countNum;
						//用户列表
						var list= response.data.data.dataList;
						for(var i=0;i<list.length;i++){
							if(list[i].goodsImages.indexOf(',')>-1){
								var arr=list[i].goodsImages.split(',');
								list[i].goodsImages=arr[0];
							}
						}
						obj. tableData=list;
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


</script>

<style scoped>
	.el-table__row{
		cursor: pointer;
	}
	.el-table__header th,.el-table__header td{
		text-align: center !important;
	}
	.editBtn{
		width: 100%;
		text-align: right;
		margin-bottom: 20px;
		margin-top:20px;
		box-sizing: border-box;
	}
	
	.iconfont{
		font-size: 14px;
		margin: 0 auto;
	}
	.filter .left{
		float: left;
	}
	.el-cascader{
		width: 100%;
	}
	.el-date-editor--daterange.el-input__inner{
		width: 280px;
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
</style>