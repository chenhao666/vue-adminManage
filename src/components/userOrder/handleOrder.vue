<template>
  <div class="handleOrder">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/userOrder/handleOrder' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item class="fontWeight">手工订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="clear"></div>

    <el-card class="box-card">
      <el-tabs @tab-click="handleClick" v-model="tabsSearch">
        <el-tab-pane label="线上订单" name="0"></el-tab-pane>
        <el-tab-pane label="手工订单" name="1" ></el-tab-pane>
      </el-tabs>
      <div class="line"></div>

      <!--筛选条件-->
      <div class="filter">
        <div class="inlineBlock">
          <div class="left">
            <el-input v-model="searchParams.orderNo" placeholder="请输入订单编号"></el-input>
          </div>
          <div class="left">
            <el-input v-model="searchParams.linkman" placeholder="请输入姓名"></el-input>
          </div>
          <div class="left">
            <el-input v-model="searchParams.address" placeholder="请输入地址"></el-input>
          </div>
          <div class="left">
            <el-date-picker
              v-model="timeValue"
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
            <el-select v-model="searchParams.orderStatus" placeholder="全部状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="草稿" value="0"></el-option>
              <el-option label="已付" value="1"></el-option>
              <el-option label="取消订单" value="7"></el-option>
              <el-option label="待审核" value="10"></el-option>
              <el-option label="未通过" value="11"></el-option>
            </el-select>
          </div>
          <div class="left">
            <el-input v-model="searchParams.empName" placeholder="销售"></el-input>
          </div>
          <div class="left">
            <el-button type="success" @click="getData"><span class="iconfont icon-search"></span>搜索</el-button>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="addBtn">
        <el-button type="primary" @click="handleAdd(true,'新增订单')">新增</el-button>
        <div class="clear"></div>
      </div>
      <!--订单列表-->
      <el-table border :data="tableData" :stripe="true" tooltip-effect="dark" >
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="houseName" label="楼盘" min-width="100">
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="linkman" label="姓名" min-width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="linkMobileNum" label="电话" min-width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="totalAmout" label="金额" min-width="80">
          <!--<template slot-scope="props">-->
            <!--<div>￥{{ props.row.totalAmout }}</div>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column prop="orderStatus" label="状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="props">
            <div v-if="props.row.orderStatus == 0">草稿</div>
            <div v-if="props.row.orderStatus == 10">待审核</div>
            <div v-if="props.row.orderStatus == 11">未通过</div>
            <div v-if="props.row.orderStatus == 1">已付款</div>
            <div v-if="props.row.orderStatus == 7">取消订单</div>
          </template>
        </el-table-column>
        <el-table-column prop="empName" label="销售" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button class="buttonStyle" size="mini"
                       @click="showDetail(scope.row.orderNo)"
                        v-if="scope.row.orderStatus == 10||scope.row.orderStatus == 11||scope.row.orderStatus == 1||scope.row.orderStatus == 7">详情</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleAdd(scope.row,'编辑订单')"
                        v-if="scope.row.orderStatus==0||scope.row.orderStatus == 11">编辑</el-button>
            <el-button class="buttonStyle" size="mini" @click="jumpProjectList(scope.row.orderNo)"
                       v-if="scope.row.orderStatus==0||scope.row.orderStatus == 10||scope.row.orderStatus == 11||scope.row.orderStatus == 1||scope.row.orderStatus == 7">商品</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleSubmit(scope.row)"
                       v-if="scope.row.orderStatus == 0||scope.row.orderStatus == 11">提交</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleCheck"
                       v-if="scope.row.orderStatus == 10||scope.row.orderStatus == 11">审核</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleBack(scope.row)"
                       v-if="scope.row.orderStatus == 10" >撤回</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleBack(scope.row)"
                      v-if="scope.row.orderStatus == 1||scope.row.orderStatus == 7">采购</el-button>
            <el-button class="buttonStyle" size="mini" type="danger" @click="handleCancel(scope.row)"
                       v-if="scope.row.orderStatus == 0||scope.row.orderStatus == 11" >删除</el-button>
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

    <!--dialog 审核弹窗-->
    <div class="check_dialog">
      <el-dialog
        title="付款审核"
        :visible.sync="dialogVisible"
        width="600px"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <!--表单开始-->
        <el-form>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="提交审核时间：">
                {{ ruleForm.time }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="状态：">
                {{ ruleForm.status }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="姓名：">
                {{ ruleForm.name }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="楼盘：">
                {{ ruleForm.house }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="地址：">
                {{ ruleForm.address }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="订单金额：">
                ￥{{ ruleForm.price }}
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <div class="order_title">
            <span>订单信息</span>
          </div>
          <el-table
            :data="orderDetailData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="付款日期"
              width="180">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.date"
                  type="date"
                  placeholder="选择日期"
                  style="width: auto">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="付款金额"
              width="180">
            </el-table-column>
            <el-table-column
              prop="ways"
              label="付款方式">
            </el-table-column>
          </el-table>
          <div class="line"></div>
          <div class="desc order_title">
            <span>销售备注：</span>
            <span>{{ruleForm.resc}}</span>
          </div>
        </el-form>
        <!--表单结束-->
        <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			    <el-button @click="refuseForm">拒 绝</el-button>
			    <el-button @click="dialogVisible = false">取 消</el-button>
			  </span>
      </el-dialog>
      <!--拒绝提示弹窗-->
      <el-dialog
        title="审核不通过"
        :visible.sync="refuseVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="不通过原因"
          v-model="textarea">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="refuseVisible = false">确 定</el-button>
          <el-button @click="refuseVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <!--新增，编辑弹窗-->
      <el-dialog
        :title=title
        :visible.sync="editVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="40%">
        <!--表单开始-->
        <el-form label-width="110px">

          <el-form-item label="订单编号" v-if="!orderNoShow">
            <el-input v-model="addParams.orderNo" :maxlength="255" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="省">
            <el-select v-model="addParams.province" placeholder="请选择" @change="getCity($event)" :maxlength="255">
              <el-option
                v-for="item in provinceList"
                :key="item.province"
                :label="item.province"
                :value="item.province">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-select v-model="addParams.city" placeholder="请选择" @change="getHouse($event)" :maxlength="255">
              <el-option
                v-for="item in cityList"
                :key="item.city"
                :label="item.city"
                :value="item.city">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼盘">
            <el-select v-model="addParams.houseName" placeholder="请选择" @change="getHouseType($event)" :maxlength="255">
              <el-option
                v-for="item in houseList"
                :key="item.houseName"
                :label="item.houseName"
                :value="item.houseName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="addParams.address" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="户型">
            <el-select v-model="addParams.houseModel" placeholder="请选择" :maxlength="255">
              <el-option
                v-for="item in houseTypeList"
                :key="item.houseModel"
                :label="item.houseModel"
                :value="item.houseModel">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风格">
            <el-select v-model="addParams.styleName" placeholder="请选择" :maxlength="255">
              <el-option
                v-for="item in houseStyleList"
                :key="item.styleId"
                :label="item.styleName"
                :value="item.styleName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="addParams.linkman" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addParams.linkMobileNum" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="addParams.totalAmout" :maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="期望交付时间">
              <el-date-picker
                v-model="addParams.shipmenTime"
                type="date"
                placeholder="选择日期"
                :maxlength="255"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="销售">
            <el-input v-model="addParams.empName" :maxlength="255" :disabled="disabled"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <!--提交 弹窗-->
      <el-dialog
        title=提交付款审核
        :visible.sync="payVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="45%">
        <!--表单开始-->
        <el-form label-width="110px" style="padding:0 30px">
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>楼盘：</span>
              <span>{{submitShowData.houseName}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>地址：</span>
              <span>{{submitShowData.address}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>姓名：</span>
              <span>{{submitShowData.linkman}}</span>
            </div>
          </div>
          <div class="form_time_list form_item">
            <div class="time_item">
              <span>订单金额：</span>
              <span>{{submitShowData.linkMobileNum}}</span>
            </div>
          </div>
          <div class="pay_message">
            <el-form class="message_item" v-for="(item,index) in submitOrderData.orderPayInfo" :key="index">
              <div class="el-icon-circle-plus-outline message_icon" @click="addPayList" v-if="index == 0"></div>
              <div class="el-icon-remove-outline message_icon" @click="removePayList(item,index)" v-if="index !== 0"></div>
              <el-form-item label="支付时间">
                <el-date-picker
                  v-model="submitOrderData.orderPayInfo[index].payTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="支付金额">
                <el-input style="width: 280px" v-model="submitOrderData.orderPayInfo[index].alreadyAmount"></el-input>
              </el-form-item>
              <el-form-item label="支付方式">
                <el-select v-model="submitOrderData.orderPayInfo[index].payType" placeholder="请选择" style="width: 280px">
                  <el-option
                    v-for="item in payType"
                    :key="item.id"
                    :label="item.val"
                    :value="item.id"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form-item label="备注" style="margin-top: 30px">
              <el-input v-model="salesRemark" :maxlength="255"></el-input>
            </el-form-item>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmitBtn">提 交</el-button>
          <el-button @click="payVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    export default {
        name: "handleOrder",
        data(){
          return{
            value1:'',
            payType:[
              {
                id:0,
                val:"支付宝支付"
              },{
                id:1,
                val:"微信支付"
              },{
                id:2,
                val:'银行卡支付'
              },{
                id:3,
                val:'现金支付'
              }
            ],
            countArr:[],//提交审核列表的数据长度
            submitOrderData:{
              orderNo:'',//订单编号
              orderPayInfo:[
                {
                  payTime:'',//支付时间
                  payType:'',//支付类型，
                  alreadyAmount:'',//支付金额
                }
              ],
              salesRemark:'',//备注
            },
            currentPage: 1,//分页当前页数
            pageSize:8,//分页默认每页条数
            pageTotal:0,//页数总数
            title:"",
            tableData:[],//列表数据
            orderDetailData:[],//订单详情数据
            textarea:"",//审核不通过的原因
            searchNum:'',//搜索订单编号
            searchName:'',//搜索客户
            searchSale:'',//搜索销售
            searchTime:'',//搜索时间
            searchAddress:'',//搜索地址
            searchPay:'',//搜索状态
            tabsSearch:'1',//tabs的初始状态
            dialogVisible:false,//审核弹窗的初始状态,
            refuseVisible:false,//拒绝弹窗的初始状态
            editVisible:false,//编辑弹窗的初始状态
            payVisible:false,//提交审核弹窗的初始状态
            ruleForm:{
              time:'2018-10-10 18:20:23',
              status:'未审核',
              name:'李玉梅',
              house:'博鳌金湾',
              address:'1-1-101',
              price:'75890',
              resc:'用户在10号左右付的款，需查询下，姓名为张琪',
              money:50000,
              ways:'微信'
            },//表单数据
            value:'',
            addParams:{
              orderNo:'',//编辑时不为空
              province:'',//省份名称
              city:'',//市名称
              houseName:'',//楼盘名称
              address:'',//收货地址
              houseModel:'',//户型
              linkman:'',//姓名
              linkMobileNum:'',//电话
              totalAmout:'',//金额
              shipmenTime:'',//期望交付时间
              styleName:'',//风格
            },
            provinceList:[],//省份列表
            cityList:[],//市列表
            houseList:[],//楼盘列表
            houseTypeList:[],//户型列表
            houseStyleList:[],//风格列表
            searchParams:{
              start:0,
              length:10,
              orderNo:'',//订单编号
              linkman:'',//姓名
              beginTime:'',//开始日期
              endTime:'',//结束日期
              orderStatus:'',//订单状态
              address:'',//订单地址
              empName:'',//销售
            },
            disabled:false,//控制显示隐藏
            orderNoShow:false,//订单编号的显示隐藏
            // handleBackBtn:'',//撤回按钮显示
            messageTitle:'',//编辑、新增成功提示语
            searchParams:{
              orderNo:'',//订单编号
              linkman:'',//姓名
              beginTime:'',//开始日期
              endTime:'',//结束日期
              orderStatus:'',//订单状态
              address:'',//订单地址
              empName:'',//销售
            },
            timeValue:'',
            submitShowData:{},//提交订单页面数据，
            salesRemark:'',//备注
          }
        },
        mounted(){
          this.getProvince();
          this.getHouseStyle();
          this.getData();
        },
        methods:{
          //分页方法
          handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
            this.pageSize=val;
          },
          handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.currentPage=val;
          },
          //tab 切换
          handleClick(tab, event) {
            if(tab.index=="0"){
              this.$router.push({path:'/userOrder/packageOrder'})
            }else if(tab.index=="1"){
              this.$router.push({path:'/userOrder/handleOrder'})
            }
          },
          //添加列表的数据
          addPayList(){
            this.submitOrderData.orderPayInfo.push({
              payTime:'',//支付时间
              payType:'',//支付类型，
              alreadyAmount:'',//支付金额
            });
          },
          //移除列表里的数据
          removePayList(data,index){
            this.submitOrderData.orderPayInfo.splice(index,1)
          },
          //新增、编辑事件
          handleAdd(data,type){
            this.title = type;
            this.editVisible = true;
            this.disabled = true;
            if(type == "编辑订单"){
              this.messageTitle="编辑成功";
              this.addParams = data;
              this.addParams.orderNo = data.orderNo;
              this.orderNoShow = false;
            }else if(type == "新增订单"){
              this.messageTitle="新增成功";
              this.addParams = {};
              //获取登录用户的id以及name
              this.addParams.empName = this.$store.state.roleName;
              this.addParams.empId = this.$store.state.roleID;
              this.orderNoShow = true;
            }
          },
          //手工订单提交功能
          handleSubmitBtn(){
            this.payVisible = false;
            let submitData = {
              orderNo:this.submitShowData.orderNo,
              orderPayInfo:this.submitOrderData.orderPayInfo,
              salesRemark:this.salesRemark
            }
            // console.log(submitData)
            this.$ajax.post(this.$store.state.localIP+'submitManualOrders',submitData)
              .then(response=>{
                if(response.data.retCode==0){
                  // this.handleBackBtn = true;//显示撤回按钮
                  this.$message({
                    message: "提交成功",
                    type: 'success'
                  });
                  this.getData();
                }else{
                  this.$message.error('操作失败！');
                }
              })
              .catch((error)=>{
                this.$message.error('网络连接错误~~');
              })
          },
          //新增，编辑提交
          handleEditSubmit(){
            // if(sessionStorage.getItem('chat')){
            //   list=JSON.parse(sessionStorage.getItem('chat'));
            // }
            this.editVisible = false;
            this.$ajax.post(this.$store.state.localIP+'addManualOrders',this.addParams)
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    message: this.messageTitle,
                    type: 'success'
                  });
                  this.getData();
                }else{
                  this.$message.error('操作失败！');
                }
              })
              .catch((error)=>{
                this.$message.error('网络连接错误~~');
              })
          },
          //审批拒绝事件
          refuseForm(){
            this.refuseVisible = true;
          },
          showDetail(id){
            console.log(id)
            // this.$router.push({path:'/userOrder/orderDetail',query:{detailType:1}})
            this.$router.push({path:'/userOrder/orderDetail',query:{id:id}})
          },
          // handleEdit(index,row){
          //   console.log(index)
          //   // this.title= "编辑订单";
          //   // this.editVisible = true;
          // },
          jumpProjectList(orderNo){
          	var num=Base64.encode(orderNo);
           /* console.log("跳转到商品列表事件");*/
          	this.$router.push({path:'/userOrder/goodsList/'+num})
          },
          handleSubmit(data){
            //重置数据
            this.submitOrderData.orderPayInfo = [{
              payTime:'',//支付时间
              payType:'',//支付类型，
              alreadyAmount:'',//支付金额
            }];
            this.salesRemark = '';
            this.submitShowData = data;
            this.payVisible = true;
          },
          handleCheck(){
            this.dialogVisible = true;
          },
          handleBack(data){
            let orderData={
              orderNo: data.orderNo,
              orderStatus: 0
            }
            this.$confirm('确定撤回该条订单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$ajax.post(this.$store.state.localIP+'updateManualOrders',orderData)
                .then(response=>{
                  if(response.data.retCode==0){
                    this.$message({
                      type: 'success',
                      message: '已撤回'
                    });
                    this.getData();
                  }
                })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
          handleCancel(data){
            let orderData={
              orderNo: data.orderNo,
              orderStatus: 4
            }
            this.$confirm('确定删除该条订单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$ajax.post(this.$store.state.localIP+'updateManualOrders',orderData)
                .then(response=>{
                  if(response.data.retCode==0){
                    this.$message({
                      type: 'success',
                      message: '已删除'
                    });
                    this.getData();
                  }
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
          getData(){
            const loading =openLoad(this,"Loading...");
            this.searchParams.beginTime = this.timeValue[0];
            this.searchParams.endTime = this.timeValue[1];
            this.$ajax.post(this.$store.state.localIP+'queryManualOrders',this.searchParams)
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.tableData = response.data.goodsOrders;
                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                console.log(error)
                this.$message.error('网络连接错误~~');
              })
          },
          //获取省份
          getProvince(){
            const loading =openLoad(this,"Loading...");
            this.$ajax.post(this.$store.state.localIP+'selectProCityHouse')
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.provinceList = response.data.provinceList;
                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                console.log(error)
                this.$message.error('网络连接错误~~');
              })
          },
          //获取市
          getCity(e){
            const loading =openLoad(this,"Loading...");
            this.addParams.city='';
            this.addParams.houseName='';
            this.addParams.styleName='';
            this.$ajax.post(this.$store.state.localIP+'selectProCityHouse',{province:e})
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.cityList = response.data.provinceList;
                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                console.log(error)
                this.$message.error('网络连接错误~~');
              })
          },
          //获取楼盘
          getHouse(e){
            this.addParams.houseName = '';
            this.addParams.styleName='';
            const loading =openLoad(this,"Loading...");
                  this.$ajax.post(this.$store.state.localIP+'selectProCityHouse',{city:e})
                    .then(response=>{
                      loading.close();
                      if(response.data.retCode==0){
                        this.houseList = response.data.provinceList;
                      }
                      loading.close();
                    })
                    .catch((error)=>{
                      loading.close();
                console.log(error)
                this.$message.error('网络连接错误~~');
              })
          },
          //获取户型
          getHouseType(e){
            const loading =openLoad(this,"Loading...");
            this.$ajax.post(this.$store.state.localIP+'selectProCityHouse',{houseName:e})
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.houseTypeList = response.data.provinceList;
                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                console.log(error)
                this.$message.error('网络连接错误~~');
              })
          },
          //获取风格
          getHouseStyle(){
            const loading =openLoad(this,"Loading...");
            this.$ajax.post(this.$store.state.localIP+'selectStyleInfo')
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.houseStyleList = response.data.styleInfoList;
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
  .handleOrder .buttonStyle{
    margin: 5px 0;
  }
  .el-dialog .el-button{
    width: 100px;
  }
  .order_title{
    margin-top: 30px;
    margin-bottom: 30px;
  }
  /*.el-date-editor.el-input, .el-date-editor.el-input__inner{*/
    /*width: auto;*/
  /*}*/
  .el-select{
    width: 100%;
  }
  .addBtn{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
  .form_item{
    /*margin-left: 40px;*/
    margin-top: 40px;
    display: inline-block;
    width: 49%;
  }
  /*.form_item:nth-child(even){*/
    /*text-align: right;*/
    /*margin-right: 40px;*/
  /*}*/
  .form_item span:first-child{
    display: inline-block;
    width: 70px;
  }
  .message_item{
    border: 1px solid #DDDDDD;
    padding: 30px 30px;
    position: relative;
    margin-top: 30px;
  }
  .message_icon{
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    z-index: 9;
    cursor: pointer;
  }
  .pay_message{
    margin-top: 30px;
  }
  .pay_message .el-date-editor.el-input{
    width: 280px;
  }
  .el-form-item__content{
    display: inline-block;
  }
</style>
