<template>
	<div class="discountManage">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">折扣管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>折扣管理</span>
			</div>
			<div class="line"></div>
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addDiscount" type="primary"><span class="iconfont icon-crm11"></span>添加折扣</el-button>
				<div class="clear"></div>
			</div>
			
			<!--折扣列表-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="desigName" label="套餐名" width="200" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="packageName" label="包名" width="100">
				</el-table-column>
				<el-table-column prop="city" label="城市" width="100">
				</el-table-column>
				<el-table-column prop="discount" label="折扣" width="100">
				</el-table-column>
				<el-table-column prop="startTime" label="开始时间" width="150">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.startTime)[0] }}</div>
						<div>{{ timeFomit(props.row.startTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束时间" width="150">
					<template slot-scope="props">
						<div>{{ timeFomit(props.row.endTime)[0] }}</div>
						<div>{{ timeFomit(props.row.endTime)[1] }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          style="margin: 5px 5px;"
			          type="danger"
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
			  	<el-form-item label="所在城市：" prop='selectedOptions'>
					<el-cascader :show-all-levels="false" :options="ruleForm.options"  v-model="ruleForm.selectedOptions" @change="handleChange">
					</el-cascader>
				</el-form-item>
				
			  	<el-form-item label="选择方案：" prop="programme">
			  		<el-select v-model="ruleForm.programme" placeholder="请选择方案" @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.programmeList" :key="key"  :label="item.name" :value="item.designId+','+item.name"></el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="选择类别：" prop="package">
			  		<el-select v-model="ruleForm.package" placeholder="请选择包" @change="inputFlag=1">
						<el-option v-for="(item,key) in ruleForm.packageList" :key="key"  :label="item.name" :value="item.id+','+item.name"></el-option>
					</el-select>
			  	</el-form-item>
			  	
			  	<el-form-item label="折扣：" prop='discount'>
					<el-input v-model="ruleForm.discount" maxlength="3"    @change="inputFlag=1"></el-input>
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
	import cityData from  "../../commJs/city.data.js"
	export default {
		name:'discountManage',
		data () {
			return {
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:10,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogTitle:'提示',
		        dialogFlag:0,
		        inputFlag:0,//表单修改标记
		        formLoading:true,//弹窗数据加载
		        ruleForm:formInit(),
		        //表单验证
		        //表单验证
		        rules:{
		        	selectedOptions:[
		        		{ required: true, message: '请选择城市', trigger: 'blur' }
		        	],
		        	programme:[
		        		{ required: true, message: '请选择方案', trigger: 'blur' }
		        	],
		        	discount:[
		        		{ required: true, message: '请输入折扣信息', trigger: 'blur' }
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
			    	this.$confirm('确定删除当前用户吗?', '提示', {
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
      			//console.log(row)
      			this.ruleForm=formInit();
		      	this.dialogTitle="编辑折扣";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=row.id;
		      	var that=this;
				programeList(this,0,function(){
					that.ruleForm.programme=row.designId+','+row.desigName;
					that.ruleForm.package=row.packageId+','+row.packageName;
					that.ruleForm.discount=row.discount;
					if(row.startTime && row.endTime){
						that.ruleForm.timeRange.push(row.startTime);
						that.ruleForm.timeRange.push(row.endTime);
					}
					if(row.city==row.province){
	        			that.ruleForm.selectedOptions.push(row.city)
	        		}else{
	        			that.ruleForm.selectedOptions.push(row.province);
	        			that.ruleForm.selectedOptions.push(row.city)
	        		}
				});
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前折扣吗?', '提示', {
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
	      	//添加折扣
	      	addDiscount(){
	      		this.ruleForm=formInit();
		      	this.dialogTitle="添加折扣";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
		      	programeList(this,0,function(){});
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
			        	this.ruleForm.disabled=true;
         				let packageArr=this.ruleForm.package.split(",");
         				let len=this.ruleForm.selectedOptions.length;
         				let programmeArr=this.ruleForm.programme.split(",");
         				//console.log(this.ruleForm.timeRange)
			        	let data={
			        		packageId:packageArr[0],
			        		packageName:packageArr[1],   //商品包名
			        		province:this.ruleForm.selectedOptions[0],//省份
						    city:this.ruleForm.selectedOptions[len-1],//城市
						    discount:this.ruleForm.discount,   //折扣力度
						    designId:programmeArr[0],     //设计方案id
						    desigName:programmeArr[1],    //方案名称 
						    startTime:this.ruleForm.timeRange[0],
						    endTime:this.ruleForm.timeRange[1]
			        	}
			        	if(this.dialogFlag!=0){
			        		data.id=this.dialogFlag;
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
			programme:'',//方案
		    programmeList: [],//方案列表
		    package:'',//包
		    packageList:[],//包列表
		    discount:'',//折扣
		    options:cityData.cityData,//城市数据
        	selectedOptions: [],//所在城市
        	timeRange:[],//有效范围
         	disabled:false//按钮禁用
	    }
		return data;
	}
	//获取方案列表
	function programeList(obj,start,callback){
		obj.formLoading=true;
		let data={
			'url':'https://openapi.kujiale.com/v2/design/list',
			'KujiaLe':{
				'start':start,
				'num':50,
				'appuid': hex_md5(obj.$store.state.userCode)
			},
			'appuid':obj.$store.state.userCode,
			'params':'',
			'method':'get'
		}
		obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
		.then(res=>{
			//console.log(res)
			let list=res.data;
			if(list.c==0){
				if(list.d.result){
					obj.ruleForm.programmeList=obj.ruleForm.programmeList.concat(list.d.result);
					//console.log(obj.ruleForm.programmeList)
					var listnum=start+50;
					if(list.d.totalCount<listnum || list.d.totalCount==listnum){
						packageList(obj,function(){
							callback();
						})
					}else{
						programeList(obj,listnum,callback)
					}
				}else{
					obj.$message.error("获取方案列表失败~~");
				}
			}else{
				obj.$message.error("获取方案列表失败~~");
			}
		})
		.catch((error)=>{
			console.log(error);
			obj.$message.error("网络连接错误~~");
		})
	}
	//获取包列表
	function packageList(obj,callback){
		let data={
			'url':'https://openapi.kujiale.com/v2/commodity/cat',
			'KujiaLe':{
				'index':1
			},
			'params':'',
			'method':'get'
		}
		obj.$ajax.post(obj.$store.state.localIP+'queryKujiaLeInfo',data)
		.then(res=>{
			if(res.data.d.model){
				obj.formLoading=false;
				obj.ruleForm.packageList=res.data.d.model;
				callback();
			}else{
				obj.$message.error("获取包列表失败！");	
			}
		})
		.catch(error=>{
			console.log(error);
			obj.$message.error("获取包列表失败！");
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
			if(response.data.retMsg==0){
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
			if(response.data.retMsg==0){
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
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
</style>