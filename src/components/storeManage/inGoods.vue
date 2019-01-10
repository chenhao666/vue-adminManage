<template>
    <div class="inGoods">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/storeManage/inGoods' }">门店管理</el-breadcrumb-item>
        <el-breadcrumb-item class="fontWeight">进货</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="clear"></div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>进货</span>
        </div>
        <div class="line"></div>

        <!--基础信息-->
        <div class="filter">
          <div class="inlineBlock">
            <div class="left">
              <el-input v-model="searchParams.orderNo" placeholder="订单编号"></el-input>
            </div>
            <div class="left" v-if="firstBtnReview||secondBtnReview||thirdBtnReview">
              <el-select v-model="searchParams.storeName" placeholder="全部门店">
                <el-option
                  v-for="item in storeList"
                  :key="item.storeId"
                  :label="item.storeName"
                  :value="item.storeName">
                </el-option>
              </el-select>
            </div>
            <div class="left">
              <el-select v-model="searchParams.status" placeholder="全部状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="left">
              <el-input v-model="searchParams.buyer" placeholder="进货人"></el-input>
            </div>
            <div class="left_time_range">
              <el-date-picker
                v-model="timeValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                :start-placeholder="startTime"
                :end-placeholder="endTime"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>


            <div class="left">
              <el-button type="success" @click="handleSearch"><span class="iconfont icon-search"></span>搜索</el-button>
            </div>
            <div class="clear"></div>
          </div>
        </div>
        <div class="btnList">
          <el-button type="primary" @click="handleAdd()" v-if="addBtnShow">新增</el-button>
        </div>
        <!--采购列表-->
        <div class="box">
          <el-table border :data="tableData" :stripe="true" tooltip-effect="dark">
            <el-table-column prop="orderNo" label="订单编号" min-width="80">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="100" v-if="addBtnShow">
              <template slot-scope="scope">
                <div>{{scope.row.createTime }}</div>
                <!--<div>{{ scope.row.createTime }}</div>-->
              </template>
            </el-table-column>
            <el-table-column prop="submitTime" label="提交时间" min-width="100">
              <template slot-scope="scope">
                <!--<div>scope.row.submitTime</div>-->
                <div>{{ scope.row.submitTime? scope.row.submitTime:'' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="门店" min-width="80" v-if="firstBtnReview||secondBtnReview||thirdBtnReview">
            </el-table-column>
            <el-table-column prop="totalAmount" label="订单金额" min-width="80">
              <template slot-scope="scope">
                ￥{{scope.row.totalAmount}}
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="件数" min-width="50">
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="60">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">草稿</span>
                <span v-if="scope.row.status == 1">删除</span>
                <span v-if="scope.row.status == 2">进货一审</span>
                <span v-if="scope.row.status == 3">进货二审</span>
                <span v-if="scope.row.status == 4">进货三审</span>
                <span v-if="scope.row.status == 5">
                   <el-popover trigger="hover" placement="top" style="color: red">
                      <p style="max-width:390px;word-break: break-all">不通过原因：{{scope.row.reviewRemark}}</p>
                      <div slot="reference" class="name-wrapper">
                        进货未通过
                      </div>
                   </el-popover>
                </span>
                <span v-if="scope.row.status == 6">待采购</span>
                <span v-if="scope.row.status == 7">待收货</span>
                <span v-if="scope.row.status == 8">已完成</span>
              </template>
            </el-table-column>
            <el-table-column prop="buyer" label="进货员" min-width="60" show-overflow-tooltip>
            </el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button class="buttonStyle" size="mini" @click="handleCheck(scope.row)"
                        v-if="firstBtnReview&&scope.row.status==2">审核</el-button>
                <el-button class="buttonStyle" size="mini" @click="handleCheck(scope.row)"
                        v-if="secondBtnReview&&scope.row.status==3">审核</el-button>
                <el-button class="buttonStyle" size="mini" @click="handleCheck(scope.row)"
                        v-if="thirdBtnReview&&scope.row.status==4">审核</el-button>
                <el-button class="buttonStyle" size="mini" @click="goodsShow(scope.row)"
                        v-if="showBtnShow&&!(firstBtnReview&&scope.row.status==2)&&!(secondBtnReview&&scope.row.status==3)&&!(thirdBtnReview&&scope.row.status==4)">商品</el-button>
                <el-button class="buttonStyle" size="mini" @click="handleSubmit(scope.row)"
                        v-if="submitBtnShow&&(scope.row.status==0||scope.row.status==5)">提交</el-button>
                <el-button class="buttonStyle" size="mini" @click="handleBack(scope.row.orderNo)"
                        v-if="submitBtnShow&&scope.row.status == 2">撤回</el-button>
                <el-button class="buttonStyle" size="mini" @click="handleDelete(scope.row.orderNo)"
                          v-if="delBtnShow&&(scope.row.status == 0||scope.row.status == 5)">删除</el-button>
                <el-button class="buttonStyle" size="mini" @click="handlePurchase(scope.row)"
                          v-if="purchaseBtnShow&&(scope.row.status==6||scope.row.status==7||scope.row.status==8)">采购</el-button>
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

      </el-card>
    </div>
</template>

<script>
    export default {
      name: "inGoods",
      data(){
          return{
            searchParams:{
              orderNo:'',
              beginTime:'',
              endTime:'',
              status:'',
              buyer:'',
              storeName:''
            },
            statusList:[
              {
                label:'全部状态',
                value:'-1'
              }, {
                label:'草稿',
                value:'0'
              }, {
                label:'进货一审',
                value:'2'
              }, {
                label:'进货二审',
                value:'3'
              }, {
                label:'进货三审',
                value:'4'
              }, {
                label:'进货未通过',
                value:'5'
              }, {
                label:'待采购',
                value:'6'
              }, {
                label:'待收货',
                value:'7'
              }, {
                label:'已完成',
                value:'8'
              }
            ],
            timeValue:'',//记录开始时间和结束时间
            tableData:[],
            currentPage: 1,//分页当前页数
            pageSize:10,//分页默认每页条数
            pageTotal:0,//页数总数
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
            storeList:[],
            startTime:'',
            endTime:''
          }
      },
      mounted(){
        if(this.roleAuthList.indexOf('1')>-1){
          this.addBtnShow=true;
          this.startTime = '创建开始时间';
          this.endTime = '创建结束时间'
        }else{
          this.startTime = '提交开始时间';
          this.endTime = '提交结束时间'
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

        this.getData();
        this.getStoreList();
      },
      methods:{
        //分页方法
        handleSizeChange(val) {
          this.pageSize=val;
          this.getData()
        },
        handleCurrentChange(val) {
          this.currentPage=val;
          this.getData()
        },
        getStoreList(){
          this.$ajax.post(this.$store.state.localIP+'selectStore')
            .then(response=>{
              if(response.data.retCode==0){
                this.storeList = response.data.data;
                this.storeList.unshift({storeId:'',storeName:'全部门店'})
              }
            })
        },
        getData(){
          let data = {
            "start":(this.currentPage-1)*this.pageSize,
            "length":this.pageSize,
            "empName":this.$store.state.userName,
            "empId":this.$store.state.userCode,
          };
          if(this.searchParams.orderNo){
            data.orderNo = this.searchParams.orderNo
          }
          if(this.timeValue && this.addBtnShow){
            data.beginTime = this.timeValue[0];
            data.endTime = this.timeValue[1]
          }
          if(this.timeValue && !this.addBtnShow){
            data.submitBeginTime = this.timeValue[0];
            data.submitEndTime = this.timeValue[1]
          }
          if(this.searchParams.status){
            data.status = this.searchParams.status
          }
          if(this.searchParams.status==-1){
            data.status = ''
          }
          if(this.searchParams.buyer){
            data.buyer = this.searchParams.buyer
          }
          if(this.searchParams.storeName&&this.searchParams.storeName!=='全部门店'){
            data.storeName = this.searchParams.storeName
          }

          this.$ajax.post(this.$store.state.localIP+'queryStoreStockList',data)
            .then(response=>{
              if(response.data.retCode==0){
                if(response.data.data){
                  this.pageTotal = response.data.data.countNum;
                  this.tableData =response.data.data.dataList;
                  for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].createTime = this.tableData[i].createTime.split(".")[0]
                    if(this.tableData[i].submitTime){
                      this.tableData[i].submitTime = this.tableData[i].submitTime.split(".")[0]
                    }
                  }
                  // this.tableData.forEach(item=>{
                  //   item.createTime=item.createTime.split(".")[0]
                  //   if(item.submitTime){
                  //     item.submitTime=item.submitTime.split(".")[0]
                  //   }
                  // })
                }
              }
            })
        },
        handlePurchase(row){
        	//console.log(row.orderNo)
        	var num = Base64.encode(row.orderNo);
          	this.$router.push({path:'/storeManage/purchase/'+num})
        },
        handleAdd(){
          this.getUserPower();
        },
        getUserPower(){
          this.$ajax.post(this.$store.state.localIP+'queryEmpStoreInfo',{	empId:this.$store.state.userCode})
            .then(response=>{
              console.log(response.data)
              if(response.data.retCode==0){
                  this.$router.push({path:'/storeManage/goodsList',query:{btnStatus:1}});
              }else{
                this.$message({
                  message:response.data.retMsg,
                  type:'warning'
                })
              }
            })
        },
        handleSearch(){
          let data = {
            "start":0,
            "length":this.pageSize,
            "empName":this.$store.state.userName,
            "empId":this.$store.state.userCode,
          };
          this.currentPage = 1;
          if(this.searchParams.orderNo){
            data.orderNo = this.searchParams.orderNo
          }
          if(this.timeValue && this.addBtnShow){
            data.beginTime = this.timeValue[0];
            data.endTime = this.timeValue[1]
          }
          if(this.timeValue && !this.addBtnShow){
            data.submitBeginTime = this.timeValue[0];
            data.submitEndTime = this.timeValue[1]
          }
          if(this.searchParams.status){
            data.status = this.searchParams.status
          }
          if(this.searchParams.status==-1){
            data.status = ''
          }
          if(this.searchParams.buyer){
            data.buyer = this.searchParams.buyer
          }
          if(this.searchParams.storeName&&this.searchParams.storeName!=='全部门店'){
            data.storeName = this.searchParams.storeName
          }

          this.$ajax.post(this.$store.state.localIP+'queryStoreStockList',data)
            .then(response=>{
              if(response.data.retCode==0){
                if(response.data.data){
                  this.pageTotal = response.data.data.countNum;
                  this.tableData =response.data.data.dataList
                  for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].createTime = this.tableData[i].createTime.split(".")[0]
                    if(this.tableData[i].submitTime){
                      this.tableData[i].submitTime = this.tableData[i].submitTime.split(".")[0]
                    }
                  }
                }
              }
            })
        },
        //审核按钮
        handleCheck(data){
          //type:1,审核   2，商品
          // this.$router.push({path:'/storeManage/goodsList',query:{status:data.goodsStatus,type:1}});
          this.$router.push({path:'/storeManage/goodsList',query:{type:1,orderNo:data.orderNo,orderStatus:data.status}});
        },
        //商品按钮
        goodsShow(data){
          this.$router.push({path:'/storeManage/goodsList',query:{orderNo:data.orderNo,type:2,orderStatus:data.status}});
        },
        handleSubmit(data){
          this.$confirm('确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
          }).then(() => {
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',{
              orderNo:data.orderNo,
              type:1,
              status:2
            })
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '提交成功'
                  });
                  this.getData();
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
          });
        },
        handleDelete(data){
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
          }).then(() => {
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',{orderNo:data,status:1})
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
              message: '已取消提交'
            });
          });
        },
        handleBack(data){
          this.$confirm('确认撤回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
          }).then(() => {
            this.$ajax.post(this.$store.state.localIP+'updateStoreStock',{orderNo:data,status:0})
              .then(response=>{
                if(response.data.retCode==0){
                  this.$message({
                    type: 'success',
                    message: '已撤回'
                  });
                  this.getData();
                }else{
                  this.$message({
                    type: 'warning',
                    message: response.data.retMsg+'，请重新刷新页面'
                  });
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消撤回'
            });
          });
        },
        //时间格式化
        timeFomit(timeDate){
          //console.log(timeDate)
          let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
          let timeArr=time.split(' ');
          return timeArr;
        },
      }
    }
</script>

<style scoped>
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
  .left_time_range{
    float: left;
    margin-left: 19px;
    margin-top: 20px;
    width: auto;
  }
  .inGoods .buttonStyle{
    margin: 5px 0;
  }
  .btnList{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }

</style>
