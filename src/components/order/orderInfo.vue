<template>
	<div class="orderInfo">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/orderManage/orderList' }">订单管理</el-breadcrumb-item>
			<el-breadcrumb-item class="fontWeight">详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<!--基本信息-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="line"></div>
			
			<el-form>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="账号：">
							{{ form.username }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人：">
							{{ form.name }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="性别：">
							{{ form.sex }}
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="联系电话：">
							{{ form.mobile }}
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="房屋地址：">
							{{ form.address }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		
		<!--订单信息-->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>订单信息</span>
			</div>
			<div class="line"></div>
			
			<div class="orderInfo_info">
				<p style="margin-top: 20px;">订单号：{{ order.num }}</p>
				<p>定金：￥{{ order.money }}</p>
				<p>首付：￥{{ order.downPayments }}</p>
				<p>尾款：￥{{ order.retainage }}</p>
			</div>
		</el-card>
	</div>
</template>

<script>
export default{
	name:'orderInfo',
	data () {
		return {
			orderID:'',
			form:{
				username:'无',
				name:'无',
				sex:'无',
				mobile:'无',
				address:'无'
			},
			order:{
				num:'82376487231',
				money:'1000',
				downPayments:'98000',
				retainage:'21600'
			}
		}
	},
	mounted(){
		let orderID=this.$route.params.code || '';
		if(orderID){
			let base64=new Base64();
			this.orderID=base64.decode(orderID);
			//console.log(orderID)
		}
		orderListInfo(this);
	},
	methods:{
		
	}
}
//获取订单详情
function orderListInfo(obj){
	const loading =openLoad(obj);	
	obj.$ajax.post(obj.$store.state.localIP+"queryOrderDetails",{orderID:obj.orderID})
		.then((response)=>{
			//console.log(response);
			if(response.status==200){
				loading.close();
				if(response.data.retCode==0){
					let list=response.data.orderDetail;
					obj.form.username=list.mobileNum || '无';
					obj.form.name=list.linkman || '无';
					if(list.linkmanSex==0){
						obj.form.sex="男";
					}else if(list.linkmanSex==1){
						obj.form.sex="女";
					}else{
						obj.form.sex="无";
					}
					obj.form.mobile=list.linkmanPhone || '无';
					obj.form.address=(list.province || '')+(list.city || '')+(list.district || '');
					if(!obj.form.address){
						obj.form.address="无";
					}
					/*form:{
				username:'无',
				name:'无',
				sex:'无',
				mobile:'无',
				address:'无'
			},*/
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
.orderInfo_info p{
	height: 40px;
	line-height: 40px;
	font-size: 14px;
}
</style>