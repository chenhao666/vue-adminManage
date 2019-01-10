<template>
	<div class="discountManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">活动管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>

		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>活动管理</span>
			</div>
			<div class="line"></div>
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" v-if="delBtnShow" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addDiscount" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加活动</el-button>
				<div class="clear"></div>
			</div>

			<!--折扣列表-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="activName" label="活动名称" min-width="150" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="houseName" label="楼盘" min-width="80">
				</el-table-column>
				<el-table-column prop="houseModel" label="户型" min-width="80">
				</el-table-column>
				<el-table-column prop="packageName" label="套餐包" min-width="80">
				</el-table-column>
        <el-table-column prop="discount" label="优惠类型" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.discount==0">满减</span>
            <span v-if="scope.row.discount==1">折扣</span>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="优惠内容">
          <template slot-scope="scope">
            <span>满￥{{scope.row.totalAmout}}减￥{{scope.row.subAmout}}</span>
          </template>
        </el-table-column>
				<el-table-column prop="startTime" label="开始时间" min-width="100">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.startTime)[0] }}</div>
						<div>{{ timeFomit(props.row.startTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束时间" min-width="100">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.endTime)[0] }}</div>
						<div>{{ timeFomit(props.row.endTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" v-if="editBtnShow || delBtnShow">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          v-if="editBtnShow"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
			          v-if="delBtnShow"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

		<!--dialog弹窗-->
		<div class="edit_dialog">
			<el-dialog
			  :title="dialogTitle"
			  :visible.sync="dialogVisible"
			  width="600px"
			  :append-to-body="true"
			  :close-on-click-modal="false"
			  :before-close="handleClose">
			  <!--表单开始-->
			  <el-form v-loading="formLoading" ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">
          <el-form-item label="活动名称：" prop='activeName'>
            <el-input v-model="ruleForm.activeName" @change="inputFlag=1"></el-input>
          </el-form-item>

          <el-form-item label="楼盘：" prop="floor">
            <el-select v-model="ruleForm.floor" placeholder="请选择" @change="selectFloor">
              <el-option
                v-for="(item,index) in ruleForm.floorList"
                :key="index"
                :label="item.houseName"
                :value="item.houseName">
              </el-option>
            </el-select>
          </el-form-item>

			  	<el-form-item label="户型：" prop="houseType">
			  		<el-select v-model="ruleForm.houseType" placeholder="请选择户型" @change="inputFlag=1" :disabled="houseDisabled">
						  <el-option
                v-for="(item,key) in ruleForm.houseTypeList"
                :key="key"  :label="item.houseModel"
                :value="item.houseModel"
              ></el-option>
					  </el-select>
			  	</el-form-item>

			  	<el-form-item label="套餐包：" prop="package">
			  		<el-select v-model="ruleForm.package" placeholder="请选择包" @change="packChange">
						<el-option
              v-for="(item,key) in ruleForm.packageList"
              :key="key"
              :label="item.packgeName"
              :value="item.packageId+','+item.packgeName"
            ></el-option>
					</el-select>
			  	</el-form-item>

			  	<el-form-item label="满减：" prop='totalAmout' style="display: inline-block;width: 50%">
            <span>满￥</span>
					  <el-input v-model="ruleForm.totalAmout" @change="inputFlag=1" style="width: 70%"></el-input>
				  </el-form-item>

          <el-form-item prop='subAmout' style="display: inline-block;width: 50%;margin-left: -85px">
            <span>减￥</span>
            <el-input v-model="ruleForm.subAmout" @change="inputFlag=1" style="width: 70%"></el-input>
          </el-form-item>

				<el-form-item label="时效：" prop='timeRange'>
					<el-date-picker
				      v-model="ruleForm.timeRange"
				      type="datetimerange"
				      value-format="yyyy-MM-dd HH:mm:ss"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</el-form-item>

			  </el-form>
			  <!--表单结束-->
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="ruleForm.disabled">确 定</el-button>
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	// import cityData from  "../../commJs/city.data.js"
	export default {
		name:'discountManage',
		data () {
			//金额验证
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      var validatePrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('金额不能为空'))
        }
        // setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error('请输入正确的金额'))
          } else {
            callback()
          }
        // }, 1000)
      }

			return {
				addBtnShow:false,
				delBtnShow:false,
				editBtnShow:false,
				roleAuthList:this.$store.state.roleAuthList,
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
            houseDisabled:false,
		        currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogTitle:'提示',
		        dialogFlag:0,
		        inputFlag:0,//表单修改标记
		        formLoading:true,//弹窗数据加载
            packageData:'',
		        ruleForm:formInit(),
		        //表单验证
		        //表单验证
		        rules:{
              activeName:[
		        		{ required: true, message: '请输入活动名称', trigger: 'blur' }
		        	],
              floor:[
		        		{ required: true, message: '请选择楼盘', trigger: 'blur' }
		        	],
              houseType:[
                { required: true, message: '请选择户型', trigger: 'blur' }
              ],
              totalAmout:[
		        		{  required: true, validator: validatePrice, trigger: 'blur' }
		        	],
              subAmout:[
                {  required: true, validator: validatePrice, trigger: 'blur' }
              ],
		        	package:[
		        		{ required: true, message: '请选择包', trigger: 'blur' }
		        	],
		        	timeRange:[
		        		{ required: true, message: '请选择时效', trigger: 'blur' }
		        	]
		        }
			}
		},
		mounted(){
			if(this.roleAuthList.indexOf('1')>-1){
				this.addBtnShow=true;
			}
			if(this.roleAuthList.indexOf('2')>-1){
				this.delBtnShow=true;
			}
			if(this.roleAuthList.indexOf('3')>-1){
				this.editBtnShow=true;
			}
			discountList(this);
		},
		beforeDestroy(){
			this.dialogVisible=false;
		},
		methods:{
			 //全选
		    toggleSelection() {
		    	//更改状态
		    	this.multipleFlag=!this.multipleFlag;
		      if (this.multipleFlag) {
		        let rows=this.tableData;
		        rows.forEach(row => {
		          this.$refs.multipleTable.toggleRowSelection(row);
		        });
		      } else {
		        this.$refs.multipleTable.clearSelection();
		      }
		    },
		    handleSelectionChange(val) {
		      this.multipleSelection = val;
		    },
			//批量删除
		    delQuery(){
		    	//console.log(this.multipleSelection);
		    	if(this.multipleSelection.length==0){
		    		 this.$message({
			        	showClose: true,
			        	message: '请选择要删除的选项！',
			        	type: 'warning'
			      });
		    	}else{
			    	this.$confirm('确定删除当前活动吗?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
				    }).then(() => {
				      	let delArr=[];
				      	let multi=this.multipleSelection;
				      	for(let i=0;i<multi.length;i++){
				      		delArr.push(multi[i].id);
				      	}
				      	let data={"id":delArr.join(',')};
				      	delDiscount(this,data);
			      	}).catch(() => {
				        this.$message({
				          type: 'info',
				          message: '已取消删除'
				        });
			      	});
			  	}
		    },
		    //分页方法
		    handleSizeChange(val) {
		      //console.log(`每页 ${val} 条`);
		      this.pageSize=val;
		      discountList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      discountList(this);
		    },
		     //编辑
      		handleEdit(index, row) {
            this.ruleForm=formInit();
            packageList(this);//获取套餐包列表
		        this.packageData = row.packageId+','+row.packageName;
		      	this.dialogTitle="编辑活动";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.id;
            this.ruleForm ={
              activeName:row.activName,
              floor:row.houseName,
              houseType:row.houseModel,
              packageId:row.packageId,
              package:row.packageName,
              totalAmout:JSON.stringify(row.totalAmout),
              subAmout:JSON.stringify(row.subAmout),
              houseId:row.houseId,
              timeRange:[row.startTime.split(".")[0],row.endTime.split(".")[0]],
              floorList:this.ruleForm.floorList,
              houseTypeList:this.ruleForm.houseTypeList
            }
            if(this.ruleForm.floor == "全部"){
              this.ruleForm.houseType = '全部';
              this.houseDisabled = true;
            }else{
              this.houseDisabled = false;
              var that = this;
              houseTypeList(this,function () {
                if(that.ruleForm.houseTypeList.length==0) {
                  that.ruleForm.houseType = "全部";
                  that.houseDisabled = true;
                }
              });
            }
            floorList(this)
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前活动吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"id":row.id};
		          delDiscount(this,data);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
	      	},
          packChange(val){
            this.inputFlag=1;
            this.packageData = val;
          },
          //选择楼盘
          selectFloor(vId){
            this.inputFlag=1;
            let that = this;
            houseTypeList(this,function () {
              if(that.ruleForm.houseTypeList.length>0){
                that.ruleForm.houseType = that.ruleForm.houseTypeList[0].houseModel;
              }else{
                that.ruleForm.houseType = "全部";
                that.houseDisabled = true;
              }
            });
            if(this.ruleForm.floor == "全部"){
              this.ruleForm.houseType = '全部';
              this.houseDisabled = true;
            }else{
              this.houseDisabled = false;
            }
            let obj = {};
            obj = this.ruleForm.floorList.find((item)=>{//这里的userList就是上面遍历的数据源
              return item.houseName === vId;//筛选出匹配数据
            });
            this.ruleForm.houseId = obj.id;
          },
	      	//添加折扣
	      	addDiscount(){
	      		this.ruleForm=formInit();
		      	this.dialogTitle="添加活动";
		      	this.dialogFlag=0;
            this.dialogVisible = true;
		      	var that = this
            if(this.ruleForm.floor == "全部"){
              this.ruleForm.houseType = '全部';
		      	  this.houseDisabled = true;
            }else{
              this.houseDisabled = false;
            }
            if(this.ruleForm.package=="全部"){
		      	  this.ruleForm.package='0,全部'
            }
            floorList(this);//获取楼盘列表
            packageList(this);//获取套餐包列表
	      	},
	      	//dialog弹窗
		    handleClose(done) {
		    	if(this.inputFlag){
		    		this.$confirm('当前有未保存内容,确认关闭?', '提示', {
			        	confirmButtonText: '确定',
			        	cancelButtonText: '取消',
		        		type: 'warning'
		        	})
		    		.then(_ => {
			          done();
			          this.inputFlag=0;
			      })
			      .catch(_ => {});
		    	}else{
		    		done();
		    		this.inputFlag=0;
		    	}
		    },
		     //城市三级联动
		    handleChange(value) {
		    	this.inputFlag=1;
		     	//console.log(value);
		    },
		    //时间格式化
		    timeFomit(timeDate){
		    	//console.log(timeDate)
		    	let time=(new Date(timeDate)).Format("yyyy-MM-dd hh:mm:ss");
		    	let timeArr=time.split(' ');
		    	return timeArr;
		    },
		    //提交表单
		    submitForm(formName) {
		      	this.$refs[formName].validate((valid) => {
			        if (valid) {
			          console.log(this.ruleForm)
			          this.ruleForm.disabled=true;
         			let data= {
                activName:this.ruleForm.activeName,
                houseId:this.ruleForm.houseId,
                houseName:this.ruleForm.floor,
                houseModel:this.ruleForm.houseType,
                totalAmout:this.ruleForm.totalAmout,
                subAmout:this.ruleForm.subAmout,
                startTime:this.ruleForm.timeRange[0],
                endTime:this.ruleForm.timeRange[1]
              }
              if(this.ruleForm.floor == '全部'){
         			  data.houseId = '0'
              }
                if(this.dialogFlag!==0){
                  data.id=this.dialogFlag;
                }
                if(this.dialogTitle=="编辑活动"){
                    data.packageId=this.packageData.split(",")[0],
                    data.packageName=this.packageData.split(",")[1]
                }

                if(this.dialogTitle=="添加活动"){
                    data.packageName = this.ruleForm.package.split(",")[1];
                    data.packageId = this.ruleForm.package.split(",")[0];
                }
			        	this.$ajax.post(this.$store.state.localIP+'saveDiscount',data)
			        	.then(res=>{
			        		this.ruleForm.disabled=false;
			        		if(res.data.retCode==0){
			        			this.$message({
								  	message: '操作成功!',
								  	type: 'success'
								    });
                    this.dialogVisible=false;
                    discountList(this);
			        		}else if(res.data.retCode==-1){
			        			this.$message({
                      message: res.data.retMsg,
                      type: 'warning'
                    });
			        		}else{
                    this.$message.error('操作失败！');
                  }
			        	})
			        	.catch(error=>{
			        		console.log(error)
			        		this.ruleForm.disabled=false;
			        		this.$message.error('操作失败！');
			        	})
			        } else {
			          	this.$message.error('表单提交失败！');
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
	//表单初始化
	function formInit(){
		let data={
        floor:'全部',//楼盘
        floorList:[],//楼盘列表
			  programme:'',//方案
		    programmeList: [],//方案列表
        houseType:'全部',//户型
        houseTypeList:[],//户型方案列表
		    package:'全部',//包
		    packageList:[],//包列表
		    discount:[],//折扣
        totalAmout:'',//满价格
        subAmout:'',//活动优惠价格
		    // options:cityData.cityData,//城市数据
        selectedOptions: [],//所在城市
        timeRange:[],//有效范围
        disabled:false//按钮禁用
	    }
		return data;
	}
	//获取方案列表
	// function programeList(obj,start,callback){
	// 	obj.formLoading=true;
	// 	let data={
	// 		'url':'https://openapi.kujiale.com/v2/design/list',
	// 		'KujiaLe':{
	// 			'start':start,
	// 			'num':50,
	// 			'appuid': hex_md5(obj.$store.state.userCode)
	// 		},
	// 		'appuid':obj.$store.state.userCode,
	// 		'params':'',
	// 		'method':'get'
	// 	}
	// 	obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
	// 	.then(res=>{
	// 		//console.log(res)
	// 		let list=res.data;
	// 		if(list.c==0){
	// 			if(list.d.result){
	// 				obj.ruleForm.programmeList=obj.ruleForm.programmeList.concat(list.d.result);
	// 				//console.log(obj.ruleForm.programmeList)
	// 				var listnum=start+50;
	// 				if(list.d.totalCount<listnum || list.d.totalCount==listnum){
	// 					packageList(obj,function(){
	// 						callback();
	// 					})
	// 				}else{
	// 					programeList(obj,listnum,callback)
	// 				}
	// 			}else{
	// 				obj.$message.error("获取方案列表失败~~");
	// 			}
	// 		}else{
	// 			obj.$message.error("获取方案列表失败~~");
	// 		}
	// 	})
	// 	.catch((error)=>{
	// 		console.log(error);
	// 		obj.$message.error("网络连接错误~~");
	// 	})
	// }
	//获取包列表
	function packageList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryGoodsPackageList")
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.formLoading=false;
				obj.ruleForm.packageList=response.data.goodsPackages;
				obj.ruleForm.packageList.unshift({
          packageId:0,
          packgeName:'全部'
        })
			}else{
				obj.$message.error('获取包列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取包列表失败！');
		})
	}
  //获取楼盘列表
  function floorList(obj){
    const loading =openLoad(obj);
    obj.$ajax.post(obj.$store.state.localIP+'selectHouses')
      .then(res=>{
        loading.close();
        if(res.data.retCode==0){
          obj.ruleForm.floorList=res.data.housesList;
          obj.ruleForm.floorList.unshift({
            houseName:'全部',
            id:0
          })
          // callback()
        }else{
          obj.$message.error(res.data.retMsg);
        }
      })
      .catch(error=>{
        loading.close();
        console.log(error);
        obj.$message.error("获取楼盘列表失败！");
      })
  }

  //获取户型列表
  function houseTypeList(obj,callback){
    const loading =openLoad(obj,"获取列表中...");
    obj.$ajax.post(obj.$store.state.localIP+"selectProCityHouse",{houseName:obj.ruleForm.floor})
      .then(response=>{
        loading.close();
        if(response.data.retCode==0){
          obj.formLoading=false;
          obj.ruleForm.houseTypeList=response.data.provinceList;
          callback();
        }else{
          obj.$message.error('获取户型列表失败！');
        }
      })
      .catch((error)=>{
        loading.close();
        console.log(error)
        obj.$message.error('获取户型列表失败！');
      })
  }

	//获取折扣列表
	function discountList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryDiscountList",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retCode==0){
				obj.tableData=response.data.distcountList;
				obj.pageTotal=response.data.countNum;
			}else{
				obj.$message.error('获取楼盘列表失败！');
			}
		})
		.catch((error)=>{
			loading.close();
	        console.log(error)
			obj.$message.error('获取楼盘列表失败！');
		})
	}
	//删除折扣信息
	function delDiscount(obj,data){
		obj.$ajax.post(obj.$store.state.localIP+"deleteDiscount",data)
		.then(response=>{
			//console.log(response)
			if(response.data.retCode==0){
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
				var list=data.id.toString();
				if(list.indexOf(',')>-1){
					var listArr=list.split(',');
					obj.pageTotal-=listArr.length;
				}else{
					obj.pageTotal-=1;
				}
				if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
					obj.currentPage-=1;
				}
				discountList(obj);
			}else{
				obj.$message.error('删除失败！');
			}
		})
		.catch((error)=>{
	        console.log(error)
			obj.$message.error('删除失败！');
		})
	}
</script>

<style scoped="scoped">
	.editBtn{
		width: 100%;
		text-align: right;
		margin-top: 20px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}
	.el-select{
		width: 100%;
	}
	.el-select .el-input__inner{
		width: 100%;
	}
  .el-cascader{
    width: 100%;
  }
</style>
