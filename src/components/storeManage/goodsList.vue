<template>
  <div class="goodsList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/storeManage/inGoods' }">门店管理</el-breadcrumb-item>
      <el-breadcrumb-item class="fontWeight">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="clear"></div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品列表</span>
      </div>
      <div class="line"></div>
      <div class="btnList">
          <el-button type="primary" @click="handleAdd()"
          v-if="(btnStatus==1||orderStatus==0||orderStatus==5)&&addBtnShow">新增</el-button>
          <a :href="downUrl" download>
            <el-button :disabled="btnShow" type="primary" v-if="(orderStatus==6||orderStatus==7||orderStatus==8)&&addBtnShow">
              打印审批单
            </el-button>
          </a>
          <el-button type="primary" @click="handleDelivery()" v-if="orderStatus==7&&addBtnShow" style="margin-left: 10px">收货</el-button>
          <el-button type="info" :disabled="true" v-if="orderStatus==8">已到货</el-button>
      </div>

      <!--采购列表-->
      <div class="box">
        <el-table border :data="tableData" :stripe="true" tooltip-effect="dark" :summary-method="getSummaries"
                  show-summary >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="goodsImages" label="图片" min-width="120">
            <template slot-scope="scope">
              <div><img :src="scope.row.goodsImages" alt="" style="width: 150px;height: auto;"/></div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsCode" label="编号" min-width="60">
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" min-width="60" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" min-width="60" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="goodsColor" label="颜色" min-width="60" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specifications" label="规格" min-width="60" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.unitPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="goodsNum" label="数量" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="!((orderStatus==0||orderStatus==5||btnStatus==1)&&addBtnShow)">{{ scope.row.goodsNum }}</div>
              <el-input  v-if="(orderStatus==0||orderStatus==5||btnStatus==1)&&addBtnShow" type="text" v-model="scope.row.goodsNum" @change="getPrices(scope.$index,scope.row)"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="subtotalPrice" label="小计" min-width="80">
            <template slot-scope="scope">
              {{parseInt(scope.row.goodsNum * scope.row.unitPrice*100)/100 ? '￥'+parseInt(scope.row.goodsNum * scope.row.unitPrice*100)/100 : ''}}
            </template>
          </el-table-column>
          <el-table-column  label="操作" v-if="(orderStatus==0 || orderStatus==5||btnStatus==1)&&addBtnShow">
            <template slot-scope="scope">
              <el-button class="buttonStyle" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footerBtn">
        <el-button type="primary" @click="handleSave()" v-if="(orderStatus==0||orderStatus==5||btnStatus==1)&&addBtnShow">保存</el-button>
        <el-button type="info" @click="handleBack()" v-if="type!=1">返回</el-button>
        <el-button type="primary" @click="handlePass()" v-if="type==1">通过</el-button>
        <el-button type="danger" @click="handleRefuse()" v-if="type==1">拒绝</el-button>
      </div>
      <div class="clear"></div>
    </el-card>
    <!--商品列表-->
    <div class="edit_dialog">
      <el-dialog
        title="商品列表"
        :visible.sync="addDialogVisible"
        width="600px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :before-close="handleCloseGoods"
      >
        <!--表单开始-->
        <div class="dialogFilter">
          <el-input v-model="goodsSearch" placeholder="请输入商品名称或编码"></el-input>
          <el-button type="primary" @click="searchGoods">搜索</el-button>
        </div>
        <el-table border
                  :data="goodsData"
                  stripe
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
          <el-table-column prop="material" label="材质" width="80">
          </el-table-column>
          <el-table-column prop="specifications" label="规格" width="80">
          </el-table-column>
          <el-table-column prop="unitPrice" label="价格" width="80">
            <template slot-scope="scope">
              {{scope.row.unitPrice}}
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
            layout="total,prev, pager, next, jumper"
            :total="pageTotal">
          </el-pagination>
        </div>
        <div class="clear"></div>
      </el-dialog>
    </div>

    <el-dialog
      title='审核不通过'
      :visible.sync="refuseVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="390px">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="未通过原因"
        v-model="financialRemark">
      </el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleResult">确 定</el-button>
          <el-button @click="refuseCancel">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "goodsList",
    data() {
      //图片验证
      let checkPic=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        if(this.goods.fileList.length==0){
          callback(new Error('请上传商品图！'))
        }else{
          callback();
        }
      };
      //价格验证
      let checkPrice=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        var price=this.goods.price;
        //console.log(unitPrice)
        if(price!=parseFloat(price) || price.toString().indexOf('-')>-1){
          callback(new Error('请输入正确的价格！'))
        }else{
          callback();
        }
      };
      //数量验证
      let checkNumber=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        var num=this.goods.num;
        //console.log(unitPrice)
        if(num!=parseFloat(num) || num.toString().indexOf('-')>-1 || num==0){
          callback(new Error('请输入正确的数量！'))
        }else{
          callback();
        }
      };
      //数量验证
      let checkNum=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        var num=this.addGoods.num;
        //console.log(unitPrice)
        if(num!=parseFloat(num) || num.toString().indexOf('-')>-1 || num==0){
          callback(new Error('请输入正确的数量！'))
        }else{
          callback();
        }
      };
      //套餐包
      let checkPackage=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        var selectPackage=this.addGoods.selectPackage;
        //console.log(unitPrice)
        if(selectPackage=="" && this.selectGoodsType==0){
          callback(new Error('请选择套餐包！'))
        }else{
          callback();
        }
      };
      //位置
      let checkLocation=(rule, value, callback)=>{
        //console.log(this.ruleForm.fileList)
        var selectLocation=this.addGoods.selectLocation;
        //console.log(unitPrice)
        if(selectLocation=="" && this.selectGoodsType==0){
          callback(new Error('请选择位置信息！'))
        }else{
          callback();
        }
      };
      return {
        goodsSearch:'',//商品搜索
        timeValue: '',//记录开始时间和结束时间
        tableData: [],
        currentPage: 1,//分页当前页数
        pageSize: 10,//分页默认每页条数
        pageTotal: 0,//页数总数
        delivery:'收货',
        goodsShow:0,//控制编辑数量列是否显示
        type:0,//1，审核、  2，商品
        addDialogVisible:false,//新增弹窗
        addListData:[
          {
            goodsType: '111',
            list:'2222'
          }
        ],//弹窗列表数据
        addGoodsVisible:false,//新增商品
        selectGoodsType:0,
        editGoodsFloag:0,
        multipleSelection: [],//多选
        addGoods:initAddGoods(),
        selectGoods:{},//选中商品
        goodsListVisible:false,//商品列表弹窗
        addGoodsRules:{
          selectPackage:[
            { required: true, validator: checkPackage, trigger: 'blur' }
          ],
          selectLocation:[
            { required: true, validator: checkLocation, trigger: 'blur' }
          ],
          num:[
            { required: true, validator: checkNum, trigger: 'blur' }
          ]
        },
        goodsData:[],//商品列表
        refuseVisible:false,//审核不通过的弹窗
        financialRemark:'',//拒绝的原因
        // allPrices:'',//小计
        // nums:0,//订单的总件数
        goodsStatus:'',
        btnStatus:0,
        orderNo:-1,
        orderStatus:'',
        messageTitle:'',//新增、编辑的提示消息
        confirmBtn:true,//收货确认收货的按钮
        ArrivedBtn:'',//已到货的按钮
        roleAuthList:this.$store.state.roleAuthList,
        firstBtnReview:false,//一审
        secondBtnReview:false,//二审
        thirdBtnReview:false,//三审
        addBtnShow:false,//新增
        delBtnShow:false,//删除
        showBtnShow:false,//查看
        submitBtnShow:false,//提交
        backBtnShow:false,//撤回
        purchaseBtnShow:false,//采购
        downUrl:'',//下载路径
        btnShow:true,//现在按钮的禁用
      }
    },
    mounted() {
      //判断是不是草稿状态，决定数量是不是能修改
      this.btnStatus = this.$route.query.btnStatus;
      this.orderNo =  this.$route.query.orderNo;//订单编号
      this.orderStatus = this.$route.query.orderStatus;//订单状态
      let type = this.$route.query.type;
      if(this.orderNo){
        this.getData()
        this.handlePrint();
      }
      // console.log(this.roleAuthList)
      //接受发货页面传过来的参数，判断审核、商品
      if(type){
        this.type = type;
      }
      if(this.roleAuthList.indexOf('1')>-1){
        this.addBtnShow=true;
      }
      if(this.roleAuthList.indexOf('2')>-1){
        this.delBtnShow=true;
      }
      if(this.roleAuthList.indexOf('4')>-1){
        this.purchaseBtnShow=true;
      }
      if(this.roleAuthList.indexOf('5')>-1){
        this.showBtnShow=true;
      }
      if(this.roleAuthList.indexOf('6')>-1){
        this.submitBtnShow=true;
      }
      if(this.roleAuthList.indexOf('8')>-1){
        this.firstBtnReview=true;
      }
      if(this.roleAuthList.indexOf('9')>-1){
        this.secondBtnReview=true;
      }
      if(this.roleAuthList.indexOf('10')>-1){
        this.thirdBtnReview=true;
      }
    },
    methods: {
      //分页方法
      handleSizeChange(val) {
        this.pageSize = val;
        goodsListAll(this);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        goodsListAll(this);
      },
      //选择商品
      selectGoodsFun(val) {
        if (this.tableData.some(item => item.goodsCode == val.goodsCode)) {
          this.$message({
            message: '该商品信息已存在，无须重复添加!',
            type: 'warning'
          })
        } else {
          val.goodsImages = val.goodsImages.split(',')[0];
          this.tableData.unshift(val);
          this.addDialogVisible = false;
        }
      },
      getData() {
        this.$ajax.post(this.$store.state.localIP + 'queryStockGoods', {orderNo: this.orderNo})
          .then(response => {
            if (response.data.retCode == 0) {
              this.tableData = response.data.data;
            }
          })
      },
      //总计
      getSummaries(param) {
          const {columns, data} = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总计';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            // console.log(values)
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              // sums[index] += ' 元';
            } else {
              sums[index] = '--';
            }
          });
        if(param.data.length>0){
          let total=0;
          for (let i =0;i<this.tableData.length;i++) {
            // console.log(this.tableData[i].goodsNum)
            // console.log((this.tableData[i].goodsNum*this.tableData[i].unitPrice*100))
            total = parseInt(this.tableData[i].goodsNum*this.tableData[i].unitPrice*100)+ total
          }
          for(let j =1;j<=7;j++){
            sums[j]="--";
          }
          if(total>0){
            sums[9]='￥'+total/100;
          }else{
            sums[9]="--";
          }

        }
        return sums;
      },
      //时间格式化
      timeFomit(timeDate) {
        //console.log(timeDate)
        let time = (new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
        let timeArr = time.split(' ');
        return timeArr;
      },
      //获取小计的金额
      getPrices(index,data){
        this.tableData[index].subtotalPrice = parseInt(this.tableData[index].goodsNum*this.tableData[index].unitPrice*100)/100;
      },
      //删除新增列表里的数据
      handleDelete(data){
        for(let i =0;i<this.tableData.length;i++){
          if(data.id == this.tableData[i].id){
            this.tableData.splice(i,1);
          }
        }
      },
      handleAdd(){
        this.addDialogVisible = true;
      },
      handleCloseGoods(done){
        this.selectGoodsType=0;
        this.editGoodsFloag=0;
        done();
      },
      handleDelivery(){
        // this.confirmBtn = false
        this.$router.push({path:'/storeManage/confirmGoods',query:{orderNo:this.orderNo}})
      },
      //确认收货
      handleConfirmDelivery(){
        this.$ajax.post(this.$store.state.localIP+'updateStoreStock',{orderNo:this.orderNo,status:8})
          .then(response=>{
            if(response.data.retCode==0){
              this.$message({
                type: 'success',
                message: '已收货'
              });
              this.getData();
            }
          })
      },
      handleCancel(){
        this.delivery = '收货';
        // this.confirmBtn = true
      },
      handleBack(){
        this.$router.push({path:'/storeManage/inGoods'})
      },
      handlePrint(){
        this.$ajax.post(this.$store.state.localIP+'downLoadStockGoods',{orderNo:this.orderNo})
          .then(response=>{
            if(response.status==200){
              this.downUrl = this.$store.state.localIP+response.data;
              this.btnShow = false;
              // this.$message({
              //   type: 'success',
              //   message: this.messageTitle
              // });
            }
          })
      },
      handleSave(){
        var reg=/^[+]{0,1}(\d+)$/
        if(this.tableData.some(item=>!item.goodsNum)){
          this.$message({
            message: '数量不能为空！',
            type: 'warning'
          })
        }else if(this.tableData.length<=0){
          this.$message({
            message: '列表不能为空！',
            type: 'warning'
          })
        }else if((this.tableData.some(item=>!reg.test(item.goodsNum)))){
          this.$message({
            message: '数量只能为正整数！',
            type: 'warning'
          })
        } else{
          let total = 0;
          let nums = 0;
          //得到总金额
          for(let i=0;i<this.tableData.length;i++){
            total = total + this.tableData[i].subtotalPrice;
            nums = JSON.parse(nums) + JSON.parse(this.tableData[i].goodsNum)
            if(!this.tableData[i].articleNum){
              this.tableData[i].articleNum=''
            }
          }
          let data={
            totalAmount:total,
            unit:nums,
            buyerId:this.$store.state.userCode,
            buyer:this.$store.state.userName,
            stockGoods:this.tableData
          }
          if(this.orderNo){
            data.orderNo = this.orderNo;//编辑需要传订单编号
            this.messageTitle = '编辑成功'
          }else {
            this.messageTitle = '新增成功'
          }
          this.$ajax.post(this.$store.state.localIP+'saveStoreStock',data)
            .then(response=>{
              if(response.data.retCode==0){
                this.$message({
                  type: 'success',
                  message: this.messageTitle
                });
              }
              this.handleBack();
            })
        }
      },
      handlePass(){
        this.$confirm('审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning'
        }).then(() => {
          let data={
            orderNo:this.orderNo,
          };
          if(this.$store.state.userCode == 1){
            //超级管理员
            if(this.orderStatus == 2){
              //一审
              data.status = 3;
              data.firstReview = this.$store.state.userName;
            }else if(this.orderStatus == 3){
              //二审
              data.status = 4;
              data.secondReview = this.$store.state.userName;
            }else if(this.orderStatus == 4){
              //三审
              data.status = 6;
              data.threeRview = this.$store.state.userName;
            }
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',data)
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '审核成功'
                  });
                  this.$router.push({path:'/storeManage/inGoods'})
                }else{
                  this.$message({
                    type: 'warning',
                    message: response.data.retMsg+'，请重新查看该订单状态'
                  });
                }
                // this.getData();
              })
          }else{
            //非超级管理员,,获取完用户的权限，给参数赋值，传状态
            if(this.firstBtnReview){
              //一审
              data.status = 3;
              data.firstReview = this.$store.state.userName;
            }else if(this.secondBtnReview){
              //二审
              data.status = 4;
              data.secondReview = this.$store.state.userName;
            }else if(this.thirdBtnReview){
              //三审
              data.status = 6;
              data.threeRview = this.$store.state.userName;
            }
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',data)
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '审核成功'
                  });
                  this.$router.push({path:'/storeManage/inGoods'})
                }else{
                  this.$message({
                    type: 'warning',
                    message: response.data.retMsg+'，请重新查看该订单状态'
                  });
                }
                // this.getData();
              })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      //审核确定按钮
      handleResult(){
        let data={
          orderNo:this.orderNo,
          reviewRemark:this.financialRemark,
          status:5
        };
        if(this.$store.state.userCode == 1){
          //超级管理员
          if(this.orderStatus == 2){
            //一审
            // data.status = 3;
            data.firstReview = this.$store.state.userName;
          }else if(this.orderStatus == 3){
            //二审
            // data.status = 4;
            data.secondReview = this.$store.state.userName;
          }else if(this.orderStatus == 4){
            //三审
            // data.status = 6;
            data.threeRview = this.$store.state.userName;
          }
          if(this.financialRemark == ''){
            this.$message({
              message:'拒绝原因不能为空',
              type:'warning'
            })
          }else{
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',data)
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'warning',
                    message: '已拒绝'
                  });
                  this.$router.push({path:'/storeManage/inGoods'})
                }else{
                  this.$message({
                    type: 'warning',
                    message: response.data.retMsg+'，请重新查看该订单状态'
                  });
                }

              })
          }

        }else{
          //判断权限
          if(this.firstBtnReview){
            //一审
            // data.status = 3;
            data.firstReview = this.$store.state.userName;
          }else if(this.secondBtnReview){
            //二审
            // data.status = 4;
            data.secondReview = this.$store.state.userName;
          }else if(this.thirdBtnReview){
            //三审
            // data.status = 6;
            data.threeRview = this.$store.state.userName;
          }
          if(this.financialRemark == ''){
            this.$message({
              message:'拒绝原因不能为空',
              type:'warning'
            })
          }else{
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',data)
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '已拒绝'
                  });
                  this.$router.push({path:'/storeManage/inGoods'})
                }else{
                  this.$message({
                    type: 'warning',
                    message: response.data.retMsg+'，请重新查看该订单状态'
                  });
                }
                // this.getData();
              })
          }

        }
      },
      //拒绝弹窗取消按钮
      refuseCancel(){
        this.refuseVisible = false;
        // let data={
        //   orderNo:this.orderNo,
        //   status:5
        // }
        // if(this.firstBtnReview){
        //   //一审
        //   data.firstReview = this.$store.status.userName;
        // }else if(this.secondBtnReview){
        //   //二审
        //   data.secondReview = this.$store.status.userName;
        // }else if(this.thirdBtnReview){
        //   //三审
        //   data.threeRview = this.$store.status.userName;
        // }
        // this.$ajax.post(this.$store.state.localIP+'updateStoreStock',data)
        //   .then(response=>{
        //     if(response.data.retCode==0){
        //       this.$message({
        //         type: 'success',
        //         message: '审核成功'
        //       });
        //     }
        //     this.getData();
        //   })
      },
      //拒绝按钮
      handleRefuse(){
        this.refuseVisible = true;

      },
      // submitListCancel(){
      //   this.addDialogVisible = false
      // },
      searchGoods(){
        this.currentPage=1;
        goodsListAll(this)
      }
    }
  }
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

  //获取商品列表
  function goodsListAll(obj){
    //console.log(obj.currentPage)
    const loading =openLoad(obj);
    obj.$ajax.post(obj.$store.state.localIP+"queryGoodsInfomation",{
      "start":(obj.currentPage-1)*obj.pageSize,
      "length":obj.pageSize,
      "search":obj.goodsSearch
    })
      .then(response=>{
        loading.close();
        //console.log(response)
        if(response.data.retCode==0){
          var list=response.data.goodsInfomations;
          //console.log(list)
          obj.pageTotal=response.data.countNum;
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
          obj.$message.error('获取商品列表失败！');
        }
      })
      .catch((error)=>{
        loading.close();
        console.log(error)
        obj.$message.error('获取商品列表失败！');
      })
  }
  function initAddGoods(){
    var data={
      packageList:[],//套餐包列表
      selectPackage:'',//选中套餐包
      selectLocation:'',//选中位置
      locationList:[],//位置列表
      num:1//数量
    }
    return data;
  }
</script>

<style scoped>
  .filter .left {
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    width: 200px;
  }
  .btnList{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
  .footerBtn{
    margin: 60px auto 0;
    text-align: center;
  }
  .goodsListFilter{
    width: 100%;
    box-sizing: border-box;
  }
  .search{
    margin:20px 0px;
  }
  .goodsListFilter .left:first-child{
    float: left;
    margin-left: 0px;
    margin-top: 20px;
    width: 300px;
  }
  .goodsListFilter .left{
    float: right;
    margin-left: 20px;
    margin-top: 20px;
    width: 100px;
  }
  .el-dialog .el-button{
    width: 100px;
  }
  .dialogFilter{
    margin-bottom: 20px;
  }
  .dialogFilter .el-button{
    width: 100px;
  }
  .dialogFilter .el-input{
    width: auto;
  }
  .hrefA{
    color: #01AEF0;
    text-decoration: underline;
    cursor: pointer;
  }
  .box{
  	max-height: 400px;
    overflow-y: auto;
  }
</style>
