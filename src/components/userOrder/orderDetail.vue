<template>
    <div class="orderDetail">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/userOrder/handleOrder' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item class="fontWeight">订单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="clear"></div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单信息</span>
        </div>
        <div class="line"></div>
        <div class="header_second">
          用户信息
        </div>
        <el-form>
          <div class="form_item">
            <span>姓名：</span>
            <span>{{listData.linkman}}</span>
          </div>
          <div class="form_item">
            <span>电话：</span>
            <span>{{listData.linkMobileNum}}</span>
          </div>
          <div class="form_item">
            <span>账号：</span>
            <span>{{listData.empName}}</span>
          </div>
          <div class="form_item">
            <span>省：</span>
            <span>{{listData.province}}</span>
          </div>
          <div class="form_item">
            <span>市：</span>
            <span>{{listData.city}}</span>
          </div>
          <div class="form_item">
            <span>楼盘：</span>
            <span>{{listData.houseName}}</span>
          </div>
          <div class="form_item">
            <span>详细地址：</span>
            <span>{{listData.address}}</span>
          </div>
          <div class="form_item">
            <span>户型：</span>
            <span>{{listData.houseModel}}</span>
          </div>
          <div class="form_item">
            <span>风格：</span>
            <span>{{listData.styleName}}</span>
          </div>
          <div class="form_item">
            <span>备注：</span>
            <span>{{listData.salesRemark}}</span>
          </div>
          <div class="form_item">
            <span>期望交付时间：</span>
            <span>{{listData.shipmenTime}}</span>
          </div>
          <div class="form_item">
            <span>销售：</span>
            <span>{{listData.empName}}</span>
          </div>
        </el-form>

        <div class="header_second">
          订单信息
        </div>
        <el-form>
          <div class="form_item">
            <span>订单编号：</span>
            <span>{{listData.orderNo}}</span>
          </div>
          <div class="form_item">
            <span>订单状态：</span>
            <span class="order_price" v-if="listData.orderStatus == 0">草稿</span>
            <span class="order_price" v-if="listData.orderStatus == 10">待审核</span>
            <span class="order_price" v-if="listData.orderStatus == 11">未通过</span>
            <span class="order_price" v-if="listData.orderStatus == 1">已付款</span>
            <span class="order_price" v-if="listData.orderStatus == 7">取消订单</span>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>订单金额：</span>
              <span class="order_price">{{listData.totalAmout }}</span>
              <span class="time_detail" @click="showPriceDetail">明细</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>创建时间：</span>
              <span>{{listData.createTime}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>提交审核时间：</span>
              <span>{{listData.submitAuditTime}}</span>
              <span class="time_detail" @click="handleSubmitCheck">明细</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>付款审核时间：</span>
              <span>{{listData.paymentTime}}</span>
              <span class="time_detail" @click="handleSubmitCheck">明细</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>下单时间：</span>
              <span>{{form.exp}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>发货时间：</span>
              <span>{{listData.deliveryTime}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>签收时间：</span>
              <span>{{listData.receivedTime}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>完成时间：</span>
              <span>{{listData.completeTime}}</span>
            </div>
          </div>
        </el-form>
      </el-card>

      <!--金额明细弹窗-->
      <el-dialog
        title="金额明细"
        :visible.sync="priceVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%"
        class="price_detail">
        <!--表单开始-->
        <el-form label-width="110px" class="price_form">
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>原价：</span>
              <span>￥{{priceDetailData.totalAmout }}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>销售改价：</span>
              <span>-￥{{priceDetailData.saleUpdAmout ? priceDetailData.saleUpdAmout : 0}}</span>
            </div>
          </div>
          <div class="line" style="margin-top: 40px"></div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>合计：</span>
              <span>￥{{priceDetailData.actualAmount}}</span>
            </div>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="priceVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--提交审核时间弹窗-->
      <el-dialog
        title="付款明细"
        :visible.sync="payVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%"
        class="price_detail">
        <!--表单开始-->
        <el-form label-width="110px" class="price_form">
          <div class="pay_detail" v-for="item in payListData.payMentList">
            <div class="pay_item">
              <el-date-picker
                v-model="item.payTime"
                type="date"
                :disabled="true"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="pay_item">
              ￥{{item.alreadyAmount}}
            </div>
            <div class="pay_item">
              <span v-if="item.payType == 0">支付宝</span>
              <span v-if="item.payType == 1">微信</span>
              <span v-if="item.payType == 2">银行卡</span>
              <span v-if="item.payType == 3">现金</span>
            </div>
          </div>
          <div class="line" style="margin-top: 20px"></div>
          <div class="detail_list">
            <div class="pay_detail_type">
              <span>应付:</span>
              <span class="item_detail">￥{{payListData.totalAmout}}</span>
            </div>
            <div class="pay_detail_type">
              <span>已付:</span>
              <span class="item_detail">￥{{payListData.alreadyAmount}}</span>
            </div>
            <div class="pay_detail_type">
              <span>待付:</span>
              <span class="item_detail">￥{{payListData.remainAmount}}</span>
            </div>
          </div>

          <div class="pay_mark">
            <span>销售备注:</span>
            <span>{{payListData.salesRemark}}</span>
          </div>
          <div class="pay_mark">
            <span>未通过原因:</span>
            <span style="color: red">{{payListData.salesRemark}}</span>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="payVisible = false">通 过</el-button>
          <el-button type="primary" @click="payVisible = false">拒 绝</el-button>
          <el-button type="primary" @click="payVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "orderDetail",
        data(){
          return{
            value1:'',
            form:{
              exp:'测试数据'
            },
            priceVisible:false,//订单金额明细
            payVisible:false,//付款明细
            payData:[],//价格明细数据
            listData:{},
            priceDetailData:{},
            payListData:{
              payMentList:[
                {
                  payTime:'2018-01-02',
                  payMoney:10000,
                  payType:"微信支付"
                },{
                  payTime:'2018-01-02',
                  payMoney:10000,
                  payType:"支付宝支付"
                }
              ],
              totalAmout:"测试金额",
              alreadyAmount:'已付金额',
              salesRemark:'测试备注'
            }

          }
        },
        mounted(){
          //接受线上订单页传过来的参数,0是线上订单详情,1是手工订单，目前手工订单详情不做
          // console.log(this.$route.query.detailType);
          this.getData();
        },
        methods:{
          showPriceDetail(){
            this.priceVisible = true;
          },
          handleSubmitCheck(){
            this.payVisible = true;
          },
          getData(){
            let orderNo = this.$route.query.id;
            this.$ajax.post(this.$store.state.localIP+'manualOrderDetail',{orderNo:orderNo})
              .then(response=>{
                if(response.data.retCode==0){
                  this.listData = response.data.manualOrderDetail;
                  this.priceDetailData = response.data.manualOrderDetail.amountDetail;
                  this.payListData = response.data.manualOrderDetail.auditDetail; //提交审核订单详情
                  //判断时间的格式重新赋值
                  if(this.listData.createTime){
                    this.listData.createTime = this.listData.createTime.split('.')[0];
                  }
                  if(this.listData.shipmenTime){
                    this.listData.shipmenTime = this.listData.shipmenTime.split('.')[0];
                  }
                  // if(listData.amountDetail.totalAmout){
                  //   listData.totalAmout = listData.amountDetail.totalAmout;
                  // }
                }else{
                  this.$message.error('操作失败！');
                }
              })
              .catch((error)=>{
                this.$message.error('网络连接错误~~');
              })
          }
        }
    }
</script>

<style scoped="scoped">
 .header_second{
   margin-left: 20px;
   margin-top: 20px;
 }
 .el-form{
   margin-bottom: 100px;
 }
  .form_item{
    margin-left: 40px;
    margin-top: 40px;
    display: inline-block;
    width: 45%;
  }
  .form_item span:first-child{
    display: inline-block;
    width: 120px;
  }
  .form_time_list{
    width: 100%;
  }
  .order_price{
    color: red;
  }
  .time_detail{
    margin-left: 10px;
    padding: 0px 10px;
    border-radius: 10px;
    border: 1px solid black;
    cursor: pointer;
  }
 form{
   font-size: 14px;
 }
  .price_form{
    padding: 0;
  }
  .price_form .form_item:first-child{
    margin-top: 10px;
  }
 .el-dialog .el-button{
   width: 25%;
 }
 .pay_detail .pay_item{
   display: inline-block;
  }
 .pay_detail .pay_item:first-child{
   width: 40%;
 }
 .pay_detail .pay_item:not(:first-child){
   margin-left: 30px;
 }
  .pay_item .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: auto;
  }
  .pay_detail:not(:first-child){
    margin-top: 20px;
  }
  .pay_detail_type{
    display: inline-block;
  }
  .detail_list,.pay_mark{
    margin-top: 20px;
  }
 .detail_list .pay_detail_type:not(:first-child){
   margin-left: 10px;
 }
</style>
