<template>
    <div class="confirmGoods">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/storeManage/inGoods' }">门店管理</el-breadcrumb-item>
        <el-breadcrumb-item class="fontWeight">收货列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="clear"></div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品列表</span>
        </div>
        <div class="line"></div>
        <div class="btnList">
          <a :href="downUrl" download><el-button :disabled="btnShow" type="primary">打印审批单</el-button></a>
          <el-button type="info" @click="handleBack()" style="margin-left: 10px">取消</el-button>
          <el-button type="primary" @click="handleDelivery()">确认收货</el-button>
        </div>

        <!--采购列表-->
        <div class="box">
          <el-table border :data="tableData" :stripe="true" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
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
            <el-table-column prop="goodsColor" label="颜色材质" min-width="60" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="specifications" label="规格" min-width="60" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="goodsNum" label="数量" min-width="60" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="subtotalPrice" label="实到" min-width="60">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.actualNum"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "confirmGoods",
      data(){
          return{
            tableData:[],
            actualNum:0,//实到货物的数量
            orderNo:'',//订单编号
            multipleSelection:[],//多选的集合
            downUrl:'',//下载PDF路径
            btnShow:''
          }
      },
      mounted(){
          this.orderNo = this.$route.query.orderNo;
          this.getData();
          this.handlePrint();
      },
      methods:{
        handlePrint(){
          this.$ajax.post(this.$store.state.localIP+'downLoadStockGoods',{orderNo:this.orderNo})
            .then(response=>{
              if(response.status==200){
                this.downUrl = this.$store.state.localIP+response.data;
                this.btnShow = false;
              }
            })
        },
        handleBack(){
          this.$router.go(-1)
        },
        handleDelivery(){
          var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
          if(this.multipleSelection.length>0){
            if(this.multipleSelection.some(item=>item.actualNum>item.goodsNum)){
              this.$message({
                message:'实到数量不能大于商品剩余数量',
                type:'warning'
              })
            }else if(this.multipleSelection.some(item=> !reg.test(item.actualNum))){
              this.$message({
                message:'实到数量必须为正整数',
                type:'warning'
              })
            }else{
              let data = {
                receiveInfo:this.multipleSelection,
                empId:this.$store.state.userCode
              }
              this.$ajax.post(this.$store.state.localIP + 'saveReceiveStockInfo',data)
                .then(response => {
                  if (response.data.retCode == 0) {
                    this.$router.push({path:'/storeManage/inGoods'})
                  }
                })
            }

          }else{
            this.$message({
              message:'请勾选需要收货的商品',
              type:'warning'
            })
          }

        },
        // compareNum(index,val){
        //   console.log(val);
        //   console.log(index);
        //   console.log(this.tableData)
        // },
        getData(){
          this.$ajax.post(this.$store.state.localIP + 'receiveStockInfo', {orderNo: this.orderNo})
            .then(response => {
              if (response.data.retCode == 0) {
                this.tableData = response.data.data;
                this.tableData.forEach(item=>{
                  item.goodsImages = item.goodsImages.split(",")[0];
                  item.actualNum = parseInt(item.goodsNum);//为actualNum字段赋初始值
                })
              }
            })
        },
        handleSelectionChange(val){
          this.multipleSelection = val;
        }
      }
    }
</script>

<style scoped>
  .btnList{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
  .box{
    max-height: 400px;
    overflow-y: auto;
  }
</style>
