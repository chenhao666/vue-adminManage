<template>
	<div class="floorRegister">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  	<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  	<el-breadcrumb-item :to="{ path: '/userManage/bannerManage' }">用户管理</el-breadcrumb-item>
		  	<el-breadcrumb-item class="fontWeight">楼盘登记</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>楼盘登记</span>
			</div>
			<div class="line"></div>
			
			<!--批量操作-->
			<div class="editBtn">
				<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>
				<el-button @click="addFloor" type="primary"><span class="iconfont icon-crm11"></span>添加楼盘</el-button>
				<div class="clear"></div>
			</div>
			
			<!--楼盘列表-->
			<el-table ref="multipleTable" border :data="tableData" :stripe="true" tooltip-effect="dark"  @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<!--<el-table-column label="ID" width="80"  prop="id">
					<template slot-scope="scope">{{ scope.row.id }}</template>
				</el-table-column>-->
				<el-table-column prop="houseName" label="楼盘名" width="150">
				</el-table-column>
				<el-table-column prop="city" label="城市" width="150">
				</el-table-column>
				<el-table-column prop="coverPic" label="楼盘封面" width="300">
					<template slot-scope="scope">
						<img :src="scope.row.coverPic" alt="" class="houseImg"/>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="楼盘地址" width="150" show-overflow-tooltip>
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
			  <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="85px">
			  	<el-form-item label="所在城市：" prop='selectedOptions'>
					<el-cascader :show-all-levels="false" :options="ruleForm.options"  v-model="ruleForm.selectedOptions" @change="handleChange">
					</el-cascader>
				</el-form-item>
				
			  	<el-form-item label="楼盘名" prop="name">
			  		<el-input v-model="ruleForm.name"  @change="inputFlag=1"></el-input>
			  	</el-form-item>
			  	
			  	<el-form-item label="详细地址：" prop='address'>
					<el-input v-model="ruleForm.address"  @change="inputFlag=1"></el-input>
				</el-form-item>
				
				<el-form-item label="封面图：" prop='pic'>
					<el-upload
					  action="https://up.qbox.me/"
					  list-type="picture-card"
					  :file-list="ruleForm.fileList"
					  :on-success="uploadSuccess"
					  ref="upload"
					  :on-error="uploadError"
					  :on-change="changePic"
					  :data="ruleForm.uploadData"
					  :auto-upload="false">
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-alert
					    title="图片尺寸为290*215像素"
					    type="success"
					    style="margin-top: 20px;">
					</el-alert>
					
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
	export default{
		name:'floorRegister',
		data () {
			//封面图验证
			let checkPic=(rule, value, callback)=>{
				//console.log(this.ruleForm.fileList)
				if(this.ruleForm.fileList.length==0){
					callback(new Error('请选择楼盘封面！'))
				}else{
					callback();
				}
			};
			return {
				tableData:[],
				multipleSelection: [],//多选
		        multipleFlag:false,//全选状态
		        currentPage: 1,//分页当前页数
		        pageSize:5,//分页默认每页条数
		        pageTotal:0,//页数总数
		        dialogVisible: false,//弹窗状态
		        dialogTitle:'提示',
		        dialogFlag:0,
		        inputFlag:0,//表单修改标记
		        formLoading:true,//弹窗数据加载
		        ruleForm:formInit(),
		        //表单验证
		        rules:{
		        	name:[
		        		{ required: true, message: '请输入楼盘名称', trigger: 'blur' }
		        	],
		        	selectedOptions:[
		        		{ required: true, message: '请选择城市', trigger: 'blur' }
		        	],
		        	address:[
		        		{ required: true, message: '请输入详细地址', trigger: 'blur' }
		        	],
		        	pic:[
		        		{  required: true, validator: checkPic, trigger: 'blur' }
		        	]
		        }
			}
		},
		mounted(){
			floorList(this);
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
			      	delFloor(this,data);
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
		      floorList(this);
		    },
		    handleCurrentChange(val) {
		      //console.log(`当前页: ${val}`);
		      this.currentPage=val;
		      floorList(this);
		    },
		    //编辑
      		handleEdit(index, row) {
      			this.dialogFlag=row.id;
      			this.ruleForm=formInit();
      			//console.log(row)
      			this.dialogTitle="编辑楼盘";
        		this.dialogVisible = true;//打开弹窗
        		//修改信息
        		this.ruleForm.coverPic=row.coverPic;//图片
        		if(row.city==row.province){
        			this.ruleForm.selectedOptions.push(row.city)
        		}else{
        			this.ruleForm.selectedOptions.push(row.province);
        			this.ruleForm.selectedOptions.push(row.city)
        		}
        		this.ruleForm.address=row.address;
        		this.ruleForm.name=row.houseName;
        		this.ruleForm.fileList.push({name:row.houseName,url:row.coverPic});
      		},
	     	//删除
	      	handleDelete(index, row) {
	      		this.$confirm('确定删除当前楼盘吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          let data={"id":row.id};
		          delFloor(this,data);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
	      	},
	      	//添加楼盘
	      	addFloor(){
	      		this.ruleForm=formInit();
		      	this.dialogTitle="添加楼盘";
		      	this.dialogVisible = true;//打开弹窗
		      	this.dialogFlag=0;
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
		    //提交表单
		    submitForm(formName) {
		      	this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	this.ruleForm.disabled=true;
			        	const loading =openLoad(this,"Loading...");
			        	if(this.ruleForm.picChange){
			        		this.$ajax.post(this.$store.state.localIP+'qiNiuToken',{})
					        .then((response)=>{
					        	//console.log(response);
					        	loading.close();
					        	if(response.data.retCode==0){
					        		var qiniutoken=response.data.token;
					        		this.ruleForm.uploadData.token=response.data.token;
					        		//console.log(this.uploadData)
					        		//上传图片信息
					        		this.$refs.upload.submit();
					        	}else{
					        		this.ruleForm.disabled=false;
					        		loading.close();
					        		this.$message.error('获取token失败！');
					        	}
					        	
					        })
					        .catch((error)=>{
					        	this.ruleForm.disabled=false;
					        	console.log(error)
					        	loading.close();
								this.$message.error('获取token失败！');
							})
			        	}else{
			        		var len=this.ruleForm.selectedOptions.length;
			        		var data={
								"city":this.ruleForm.selectedOptions[len-1],
								"province":this.ruleForm.selectedOptions[0],
								"houseName":this.ruleForm.name,
								"coverPic":this.ruleForm.coverPic,
								"address":this.ruleForm.address
							}
			        		if(this.dialogFlag!=0){
				      			data.id=this.dialogFlag;
				      		}
			        		loading.close();
							addFloor(this,data);
			        	}
			        } else {
			          	this.$message.error('表单提交失败！');
			          	return false;
			        }
		      	});
		    },
		    //图片上传
		    uploadSuccess(response, file, fileList){
				//获取城市名称
	      		var len=this.ruleForm.selectedOptions.length;
	      		this.ruleForm.coverPic=this.$store.state.qiniuUrl+response.key;
				var data={
					"city":this.ruleForm.selectedOptions[len-1],
					"province":this.ruleForm.selectedOptions[0],
					"houseName":this.ruleForm.name,
					"coverPic":this.ruleForm.coverPic,
					"address":this.ruleForm.address
				}
				if(this.dialogFlag!=0){
	      			data.id=this.dialogFlag;
	      		}
				addFloor(this,data);
		    },
		    //改变图片
		    changePic(file, fileList){
		    	//console.log(fileList);
		    	var len=fileList.length;
		    	this.ruleForm.fileList=[fileList[len-1]];
		    	this.ruleForm.picChange=1;
		    },
		    //上传失败
		    uploadError(err, file, fileList){
		    	this.$message.error('图片上传失败！');
		    	this.ruleForm.disabled=false;
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
	//获取楼盘列表
	function floorList(obj){
		const loading =openLoad(obj,"获取列表中...");
		obj.$ajax.post(obj.$store.state.localIP+"queryHouses",{
			"start":(obj.currentPage-1)*obj.pageSize,
			"length":obj.pageSize
		})
		.then(response=>{
			loading.close();
			//console.log(response)
			if(response.data.retMsg==0){
				obj.tableData=response.data.housesList;
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
	//新增楼盘信息
	function addFloor(obj,data){
		obj.$ajax.post(obj.$store.state.localIP+"saveHouses",data)
		.then(response=>{
			//console.log(response)
			if(response.data.retMsg==0){
				obj.ruleForm.disabled=false;
				obj.$message({
				  message: '操作成功!',
				  type: 'success'
				});
				obj.dialogVisible = false;//关闭弹窗
				obj.dialogFlag=0;
				floorList(obj);
			}else{
				obj.$message.error('新增楼盘信息失败！');
			}
		})
		.catch((error)=>{
			obj.ruleForm.disabled=false;
	        console.log(error)
			obj.$message.error('新增楼盘信息失败！');
		})
	}
	//表单初始化
	function formInit(){
		let data={
		        name: '',
		        address:'',//地址
		        options:cityData.cityData,//城市数据
         		selectedOptions: [],//所在城市
         		fileList:[],//图片列表
         		uploadData:{'token':''},//上传图片附带的token
         		coverPic:"",//封面图
         		picChange:0,
         		disabled:false//按钮禁用
	        }
		return data;
	}
	//删除楼盘
	function delFloor(obj,data){
		obj.$ajax.post(obj.$store.state.localIP+"deleteHouses",data)
		.then(response=>{
			//console.log(response)
			if(response.data.retMsg==0){
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
				floorList(obj);
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
	.houseImg{
		width: 90%;
		height: auto;
	}
</style>