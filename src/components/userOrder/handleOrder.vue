<template>
  <div class="handleOrder" v-if="showBtnShow">
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
        <el-button type="primary" @click="handleAdd(true,'新增订单')" v-if="addBtnShow">新增</el-button>
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
            <div v-if="props.row.orderStatus == 1">已付款</div>
            <div v-if="props.row.orderStatus == 2">已发货</div>
            <div v-if="props.row.orderStatus == 3">已签收</div>
            <div v-if="props.row.orderStatus == 4">退货申请</div>
            <div v-if="props.row.orderStatus == 5">退货中</div>
            <div v-if="props.row.orderStatus == 6">已退货</div>
            <div v-if="props.row.orderStatus == 7">取消订单</div>
            <div v-if="props.row.orderStatus == 8">订单完成</div>
            <div v-if="props.row.orderStatus == 9">关闭订单</div>
            <div v-if="props.row.orderStatus == 10">待审核</div>
            <div v-if="props.row.orderStatus == 11" style="color: red">
              <el-popover trigger="hover" placement="top">
                <p>不通过原因：{{props.row.financialRemark}}</p>
                <div slot="reference" class="name-wrapper">
                  未通过
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="empName" label="销售" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button class="buttonStyle" size="mini"
                       @click="showDetail(scope.row.orderNo)"
                       v-if="(scope.row.orderStatus !== 0 && scope.row.orderStatus !== 11)&&detailBtnShow">详情</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleAdd(scope.row,'编辑订单')"
                        v-if="(scope.row.orderStatus==0||scope.row.orderStatus == 11)&&editBtnShow">编辑</el-button>
            <el-button class="buttonStyle" size="mini" @click="jumpProjectList(scope.row)">商品</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleSubmit(scope.row)"
                       v-if="(scope.row.orderStatus == 0||scope.row.orderStatus == 11)&&submitBtnShow">提交</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleCheck(scope.row.orderNo)"
                       v-if="(scope.row.orderStatus == 10||scope.row.orderStatus == 11)&&checkBtnShow">审核</el-button>
            <el-button class="buttonStyle" size="mini" @click="handleBack(scope.row)"
                       v-if="(scope.row.orderStatus == 10)&&submitShowData">撤回</el-button>
            <el-button class="buttonStyle" size="mini" @click="handlePurchase(scope.row)"
                      v-if="(scope.row.orderStatus !== 0&&scope.row.orderStatus !== 10&&scope.row.orderStatus !== 11)&&purchaseBtnShow">采购</el-button>
            <el-button class="buttonStyle" size="mini" type="danger" @click="handleCancel(scope.row)"
                       v-if="(scope.row.orderStatus == 0||scope.row.orderStatus == 11)&&delBtnShow" >删除</el-button>
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
                {{ checkListData.createTime }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="状态：">
                <span v-if="checkListData.orderStatus==0">草稿</span>
                <span v-if="checkListData.orderStatus==10">待审核</span>
                <span v-if="checkListData.orderStatus==11">未通过</span>
                <span v-if="checkListData.orderStatus==1">已付款</span>
                <span v-if="checkListData.orderStatus==7">取消订单</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="姓名：">
                {{ checkListData.linkman }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="楼盘：">
                {{ checkListData.houseName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="地址：">
                {{ checkListData.address }}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="订单金额：">
                ￥{{ checkListData.totalAmout }}
              </el-form-item>
            </el-col>
          </el-row>
          <div class="line"></div>
          <div class="order_title">
            <span>订单信息</span>
          </div>
          <el-table
            :data="checkWayList"
            style="width: 100%">
            <el-table-column
              prop="payTime"
              label="付款日期"
              width="180">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.payTime"
                  type="date"
                  :maxlength="255"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="alreadyAmount"
              label="付款金额"
              width="180">
            </el-table-column>
            <el-table-column
              prop="payType"
              label="付款方式">
              <template slot-scope="scope">
                <span v-if="scope.row.payType ==0">支付宝</span>
                <span v-if="scope.row.payType ==1">微信</span>
                <span v-if="scope.row.payType ==2">银行卡</span>
                <span v-if="scope.row.payType ==3">现金</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="line"></div>
          <div class="desc order_title">
            <span>销售备注：</span>
            <span>{{checkListData.salesRemark}}</span>
          </div>
        </el-form>
        <!--表单结束-->
        <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="refuseForm('审核通过')">确 定</el-button>
			    <el-button @click="refuseForm('审核失败')">拒 绝</el-button>
			    <el-button @click="dialogVisible = false">取 消</el-button>
			  </span>
      </el-dialog>
      <!--拒绝提示弹窗-->
      <el-dialog
        :title=checkTitle
        :visible.sync="refuseVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="30%">
        <el-input
          type="textarea"
          :rows="4"
          :placeholder="checkReason"
          v-model="financialRemark">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleResult">确 定</el-button>
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
            <el-select v-model="addParams.styleName" placeholder="请选择" :maxlength="255" @change="showVal()">
              <el-option
                v-for="item in houseStyleList"
                :key="item.styleName"
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
              <span>{{submitShowData.totalAmout}}</span>
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
            showBtnShow:false,
            addBtnShow:false,
            delBtnShow:false,
            editBtnShow:false,
            purchaseBtnShow:false,
            detailBtnShow:false,
            submitBtnShow:false,
            checkBtnShow:false,
            roleAuthList:sessionStorage.getItem('roleAuthList'),
            value1:'',
            payType:[
              {
                id:0,
                val:"支付宝"
              },{
                id:1,
                val:"微信"
              },{
                id:2,
                val:'银行卡'
              },{
                id:3,
                val:'现金'
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
            pageSize:10,//分页默认每页条数
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
            checkListData:{},
            checkWayList:[],//审核信息的列表数组
            checkTitle:'',//审核标题
            checkReason:'',//审核placeholder提示
            financialRemark:'',//审核原因
            checkid:'',//审核orderNo
            orderStatusType:'',//订单（不）通过状态，1通过，11不通过
          }
        },
        mounted(){
          if(this.roleAuthList.indexOf('0')>-1){
            this.showBtnShow=true;
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
          if(this.roleAuthList.indexOf('4')>-1){
            this.purchaseBtnShow=true;
          }
          if(this.roleAuthList.indexOf('5')>-1){
            this.detailBtnShow=true;
          }
          if(this.roleAuthList.indexOf('6')>-1){
            this.submitBtnShow=true;
          }
          if(this.roleAuthList.indexOf('7')>-1){
            this.checkBtnShow=true;
          }
          this.getProvince();
          this.getHouseStyle();
          this.getData();
        },
        methods:{
          //分页方法
          handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize=val;
            this.getData()
          },
          handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage=val;
            this.getData()
          },
          showVal(){
            console.log(this.addParams)
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
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if(this.addParams.linkMobileNum==''){
              this.$message({
                message:'手机号不能为空',
                type:'warning'
              })
            }else if(!(myreg.test(this.addParams.linkMobileNum))){
              this.$message({
                message:'手机号格式不正确',
                type:'warning'
              })
            }else{
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
            }
          },
          //审批拒绝事件
          refuseForm(val,data){
            // console.log(this.checkWayList);
            this.refuseVisible = true;
            this.checkTitle = val;
            if(val=="审核通过"){
              this.checkReason = "通过原因";
              this.orderStatusType=1;
            }else if(val=="审核失败"){
              this.checkReason = "不通过原因"
              this.orderStatusType=11;
            }

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
          jumpProjectList(row){
            if(row.orderStatus ==0 || row.orderStatus==11|| row.orderStatus==10){
              var num=Base64.encode(row.orderNo);
              /* console.log("跳转到商品列表事件");*/
              this.$router.push({path:'/userOrder/goodsList/'+num})
            }else{
              var num = Base64.encode(row.orderNo);
              var state=Base64.encode(row.orderStatus);
              this.$router.push({path:'/userOrder/orderInfo/'+num,query:{state:state}})
            }

          },
          //审核，提交审核原因
          handleResult(){
            var arr = [];
            for(let i=0;i<this.checkWayList.length;i++){
              arr.push({
                orderNo:this.checkWayList[i].orderNo,
                payTime:this.checkWayList[i].payTime
              })
            }
            let data={
              financialRemark:this.financialRemark,
              orderNo:this.checkid,
              orderStatus:this.orderStatusType,
              paymentList:arr
            }
            const loading =openLoad(this,"Loading...");
            this.refuseVisible = false;
            this.dialogVisible = false;
            this.$ajax.post(this.$store.state.localIP+'updateManualOrders',data)
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '审核成功'
                  });
                  //初始化数据
                  this.financialRemark='';
                  this.orderStatus='';
                  this.checkid='';
                  this.getData();
                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                this.$message.error('网络连接错误~~');
              })
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
            console.log(this.submitShowData)
            this.payVisible = true;
          },
          handlePurchase(row){
            var num = Base64.encode(row.orderNo);
            this.$router.push({path:'/userOrder/purchase/'+num})
          },
          handleCheck(id){
            const loading =openLoad(this,"Loading...");
            this.dialogVisible = true;
            this.checkid = id;
            this.$ajax.post(this.$store.state.localIP+'manualOrderDetail',{orderNo:id})
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.checkListData = response.data.manualOrderDetail;
                  this.checkListData.createTime = this.checkListData.createTime.split('.')[0];
                  if(response.data.manualOrderDetail.auditDetail.payMentList){
                    this.checkWayList = response.data.manualOrderDetail.auditDetail.payMentList
                    for(let i=0;i<this.checkWayList.length;i++){
                      this.checkWayList[i].payTime = this.checkWayList[i].payTime.split('.')[0];
                    }
                  }

                }
                loading.close();
              })
              .catch((error)=>{
                loading.close();
                this.$message.error('网络连接错误~~');
              })
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
              orderStatus: 7
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
            this.searchParams.userCode = this.$store.state.userCode;
            this.searchParams.userName = this.$store.state.userName;
            this.searchParams.start = (this.currentPage-1)*this.pageSize;
            this.searchParams.length = this.pageSize;
            if(this.searchParams.empId){
              this.searchParams.empId = this.$store.state.roleID;
            }
            this.searchParams.empName = this.$store.state.roleName;
            this.$ajax.post(this.$store.state.localIP+'queryManualOrders',this.searchParams)
              .then(response=>{
                loading.close();
                if(response.data.retCode==0){
                  this.tableData = response.data.goodsOrders;
                  this.pageTotal = response.data.countNum;
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
