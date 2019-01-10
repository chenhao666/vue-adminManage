<template>
	<div class="homeDesign">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设计师</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">方案列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>方案列表</span>
			</div>
			<div class="line"></div>
			<!--批量操作-->
			<div class="editBtn">
				<!--<el-button type="danger" @click="delQuery" style="float: left;">批量删除</el-button>-->
				<el-button @click="addProgramme" v-if="addBtnShow" type="primary"><span class="iconfont icon-crm11"></span>添加方案</el-button>
				<div class="clear"></div>
			</div>
			<div class="programmeList">
				<el-table 
					border 
					ref="multipleTable"
					:data="tableData" 
					:stripe="true" 
					tooltip-effect="dark" 
					style="width: 100%;">
					<!--<el-table-column type="selection" width="55">
					</el-table-column>-->
					<el-table-column prop="designName" label="方案名称" min-width="150" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="houseName" label="楼盘" min-width="100" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="houseModel" label="户型" min-width="80">
					</el-table-column>
					<el-table-column prop="styleName" label="风格" min-width="80">
					</el-table-column>
					<el-table-column prop="mobileNum" label="手机号" min-width="100" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" label="修改时间" min-width="120">
						<template slot-scope="props">
							 <div>{{ formatDate(props.row.createTime).day }}</div>
							 <div>{{ formatDate(props.row.createTime).time }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" v-if="editBtnShow || delBtnShow">
						<template slot-scope="scope">
							<el-button
					          size="mini"
					          style="margin: 5px 10px;"
					          v-if="editBtnShow"
					          @click="handleSend(scope.$index, scope.row)">{{ scope.row.isUsed==0 ? "撤回方案" : "发送方案"  }}</el-button>
							<el-button
					          size="mini"
					          style="margin: 5px 10px;"
					          v-if="editBtnShow"
					          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					          <el-button
					          size="mini"
					          style="margin: 5px 10px;"
					          v-if="editBtnShow"
					          @click="handleEditGoods(scope.$index, scope.row)">商品编辑</el-button>
					        <el-button
					          size="mini"
					          style="margin: 5px 10px;"
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
			</div>
		</el-card>
		
		<!--发送方案-->
		<el-dialog 
			title="发送方案" 
			:visible.sync="dialogVisible" 
			width="600px" 
			:append-to-body="true" 
			:close-on-click-modal="false" 
			:before-close="handleClose">
			<!--表单开始-->
			<el-form  ref="ruleForm" :model="ruleForm" :rules="rules" label-width="85px">
				<el-form-item label="方案名称：" prop="name">
					<el-input disabled v-model="ruleForm.name" @change="inputFlag=1"></el-input>
				</el-form-item>
				<!--<el-form-item label="选择风格：" prop="styleName">
					<el-select v-model="ruleForm.styleName" placeholder="请选择" @change="inputFlag=1">
					    <el-option
					      v-for="(item,index) in styleList"
					      :key="index"
					      :label="item.styleName"
					      :value="item.styleName">
					    </el-option>
					</el-select>
				</el-form-item>-->
				<!--<el-form-item label="选择品牌：" prop="brand">
					<el-select v-model="ruleForm.brand" placeholder="请选择" @change="inputFlag=1">
					    <el-option
					      v-for="(item,index) in ruleForm.brandList"
					      :key="index"
					      :label="item.brandName"
					      :value="item.brandName">
					    </el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item label="手机号：" prop="mobile">
					<el-input  v-model="ruleForm.mobile" @change="inputFlag=1"></el-input>
				</el-form-item>
			</el-form>
			<!--表单结束-->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
		
		<!--添加方案-->
		<el-dialog 
			title="添加方案" 
			:visible.sync="addProgrammeVisible" 
			width="600px" 
			:append-to-body="true" 
			:close-on-click-modal="false" 
			:before-close="handleClose">
			<!--表单开始-->
			<el-form  ref="addForm" :model="addForm" :rules="addRules" label-width="85px">
				<el-form-item label="方案名称：" prop="name">
					<el-input  v-model="addForm.name" @change="inputFlag=1"></el-input>
				</el-form-item>
				<el-form-item label="选择楼盘：" prop="floor">
					<el-select v-model="addForm.floor" placeholder="请选择" @change="selectFloor">
					    <el-option
					      v-for="(item,index) in addForm.floorList"
					      :key="index"
					      :label="item.houseName"
					      :value="item.houseName">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择户型：" prop="house">
					<el-select v-model="addForm.house" placeholder="请选择" @change="inputFlag=1">
					    <el-option
					      v-for="(item,index) in addForm.houseList"
					      :key="index"
					      :label="item.houseModel"
					      :value="item.houseModel">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择风格：" prop="styleName">
					<el-select v-model="addForm.styleName" placeholder="请选择" @change="inputFlag=1">
					    <el-option
					      v-for="(item,index) in styleList"
					      :key="index"
					      :label="item.styleName"
					      :value="item.styleId+','+item.styleName">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!--表单结束-->
			<span slot="footer" class="dialog-footer">
				<el-button type="primary"  @click="submitAddForm('addForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name:'homeDesign',
	data(){
		//手机号码验证
		let checkMobile=(rule, value, callback)=>{
			let Ptest=/^1[34578]{1}\d{9}$/;
			if(!Ptest.test(value)){
				callback(new Error('请输入正确的手机格式'))
			}else{
				callback();
			}
		};
		return{
			addBtnShow:false,
			delBtnShow:false,
			editBtnShow:false,
			roleAuthList:this.$store.state.roleAuthList,
			dialogVisible:false,//弹窗
			inputFlag:0,//弹窗状态
			tableData: [],
			currentPage: 1,//分页当前页数
	        pageSize:10,//分页默认每页条数
	        pageTotal:0,//页数总数
	        styleList:[],//风格列表
	        ruleForm:initForm(),
	        addForm:initAddForm(),
	        addProgrammeVisible:false,//添加方案
	        editFlag:0,
	        //表单验证
	        rules:{
	        	mobile:[
	        		{  required: true, validator: checkMobile, trigger: 'blur' }
	        	],
	        	brand:[
	        		{ required: true, message: '请选择品牌', trigger: 'blur' }
	        	],
	        	styleName:[
	        		{ required: true, message: '请选择风格', trigger: 'blur' }
	        	]
	        },
	        addRules:{
	        	name:[
	        		{ required: true, message: '请填写方案名', trigger: 'blur' }
	        	],
	        	floor:[
	        		{ required: true, message: '请选择楼盘', trigger: 'blur' }
	        	],
	        	house:[
	        		{ required: true, message: '请选择户型', trigger: 'blur' }
	        	],
	        	styleName:[
	        		{ required: true, message: '请选择风格', trigger: 'blur' }
	        	]
	        }
		}
	},
	//挂载
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
		//方案列表
		programeList(this);
		//获取风格列表
		styleList(this);
	},
	beforeDestroy(){
		this.dialogVisible=false;
	},
	methods: {
		//发送方案
		handleSend(index, row){
			//console.log(row)
			if(row.isUsed==0){
				this.$confirm('确定撤回当前方案吗?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		      	}).then(() => {
					const loading =openLoad(this);
					this.$ajax.post(this.$store.state.localIP+'updateUserProgram',{designInfoId:row.designId})
					.then(res=>{
						loading.close();
						//console.log(res)
						if(res.data.retCode==0){
							this.$message({
								message: '撤回成功!',
								type: 'success'
							});
							programeList(this);
						}else{
							this.$message.error("撤回失败！");
						}
					})
					.catch((error)=>{
						loading.close();
						console.log(error);
						this.$message.error("网络连接错误~~");
					})
		      	}).catch(() => {
			        this.$message({
			          	type: 'info',
			          	message: '已取消操作'
			        }); 
			    })
				
			}else{
				this.ruleForm=initForm();
				brandList(this);
				this.dialogVisible=true;
				var that=this;
				this.ruleForm.name=row.designName;
				this.ruleForm.programmeId=row.designId;
				/*this.ruleForm.styleName=row.styleName;
				this.ruleForm.pic=row.planPic;*/
				this.ruleForm.mobile=row.mobileNum;
			}
		},
		 //表单提交
   		submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	          	const loading =openLoad(this);
	          	this.$ajax.post(this.$store.state.localIP+'sendUserProgram',{
	          		mobileNum:this.ruleForm.mobile,
	          		/*brandName:this.ruleForm.brand,*/
	          		desigName:this.ruleForm.name,
	          		designInfoId:this.ruleForm.programmeId,
	          		/*houseModelUrl:this.ruleForm.pic,
	          		threeDurl:this.ruleForm.threeDpic,
	          		styleName:this.ruleForm.styleName*/
	          	})
				.then(res=>{
					//console.log(res)
					loading.close();
					if(res.data.retCode==0){
						this.$message({
							message: '方案发送成功!',
							type: 'success'
						});
						programeList(this);
						this.dialogVisible=false;
					}else{
						this.$message.error(res.data.retMsg);
					}
				})
				.catch((error)=>{
					loading.close();
					console.log(error);
					this.$message.error("网络连接错误~~");
				})
	          } else {
	            this.$message.error('表单提交失败！');
	            return false;
	          }
	        });
      	},
      	
		 //编辑
     	handleEdit(index, row) {
	        //console.log(index, row);
	        //console.log(row)
	        /*this.$router.push({path:'/designer/editHomeDesign/'+row.designId})*/
	       	this.addForm=initAddForm();
	       	var that=this;
	    	floorList(this,function(){	    	
	    		that.addForm.name=row.designName;
	    		that.addForm.floor=row.houseName;
	    		houseList(that,function(){
	    			that.addForm.house=row.houseModel;
	    			that.addForm.styleName=row.styleId+','+row.styleName;
		    		that.addProgrammeVisible=true;
		    		that.editFlag=row.designId;
	    		});
	    	});//获取楼盘列表
      	},
      	handleEditGoods(index, row) {
	        //console.log(index, row);
	        //console.log(row)
	        this.$router.push({path:'/designer/editGoods/'+row.designId});
	       
      	},
	    //删除
	    handleDelete(index, row) {
	      	//console.log(index, row);
	      	//console.log(row);
	      	this.$confirm('确定删除当前方案吗?', '提示', {
	        	confirmButtonText: '确定',
	        	cancelButtonText: '取消',
	        	type: 'warning'
	      	}).then(() => {
				dropProgramme(this,row.designId);
	      	}).catch(() => {
	        this.$message({
	          	type: 'info',
	          	message: '已取消删除'
	        });          
	      });
	    },
	    addProgramme(){
	    	/*this.$router.push({path:'/designer/homeDesign'})*/
	    	this.addForm=initAddForm();
	    	this.editFlag=0;
	    	var that=this;
	    	floorList(this,function(){	    		
	    		that.addProgrammeVisible=true;
	    	});//获取楼盘列表
	    },
	    //分页方法
	    handleSizeChange(val) {
	     	// console.log(`每页 ${val} 条`);
	    	this.pageSize=val;
	    	programeList(this);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.currentPage=val;
	        programeList(this);
	    },
	    //关闭弹窗
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
	    /*时间戳格式*/
	   	formatDate(d){
	   		var now=new Date(d)
	   		var year = now.getFullYear(),
		　　	month = now.getMonth() + 1,
		　　	date = now.getDate(),
		　　	hour = now.getHours(),
		　　	minute = now.getMinutes(),
		　　	second = now.getSeconds();
			return {
				day:year + "-" + month + "-" + date,
				time:hour + ":" + minute + ":" + second
			}
	   	},
	   	//选择楼盘
	   	selectFloor(){
	   		this.inputFlag=1;
	   		houseList(this,function(){});
	   	},
	   	//新增方案
	   	submitAddForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	          	const loading =openLoad(this);
	          	var styleArr=this.addForm.styleName.split(',');
	          	var data={
	          		//"designId":0,//方案ID
					"designName":this.addForm.name,//反感名称
					"houseName":this.addForm.floor,//楼盘名称
					'houseModel':this.addForm.house,//户型
					"styleId":styleArr[0],//风格ID
					"styleName":styleArr[1]//风格名称
	          	}
	          	if(this.editFlag){
	          		data.designId=this.editFlag;
	          	}
	          	this.$ajax.post(this.$store.state.localIP+'saveDesignScheme',data)
				.then(res=>{
					loading.close();
					//console.log(res)
					if(res.data.retCode==0){
						this.$message({
					        message: '操作成功!',
					        type: 'success'
					    });	
					    this.addProgrammeVisible=false;
					    programeList(this);
					}else{
						this.$message.error(res.data.retMsg);
					}
				})
				.catch(error=>{
					loading.close();
					console.log(error);
					this.$message.error("操作失败！");
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
//获取方案列表
function programeList(obj){
	const loading =openLoad(obj);
	let data={
		"start":(obj.currentPage-1)*obj.pageSize,
		"length":obj.pageSize
	}
	obj.$ajax.post(obj.$store.state.localIP+'queryDesignScheme',data)
	.then(res=>{
		//console.log(res)
		loading.close();
		if(res.data.retCode==0){
			obj.tableData=res.data.designSchemes || [];
			obj.pageTotal=res.data.countNum || 0;
		}else{
			obj.$message.error(res.data.retMsg);
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}

//删除方案
function dropProgramme(obj,designId){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'deleteDesignScheme',{designId:designId})
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.retCode==0){
			obj.$message({
		        message: '方案删除成功!',
		        type: 'success'
		    });
		    obj.pageTotal-=1;
			if(obj.pageTotal==(obj.currentPage-1)*obj.pageSize && obj.pageTotal!=0){
				obj.currentPage-=1;
			}
			programeList(obj);
		}else{
			obj.$message.error(res.data.retMsg);
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
//获取发送的手机号
/*function userList(obj,callback){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'queryUserProgramInfo')
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.retCode==0){
			callback(res);
		}else{
			obj.$message.error("获取用户列表失败！");
		}
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}*/
//获取风格列表
function styleList(obj){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'selectStyleInfo')
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.retCode==0){
			obj.styleList=res.data.styleInfoList;
		}else{
			obj.$message.error(res.data.retMsg);
		}
	})
	.catch(error=>{
		loading.close();
		console.log(error);
		obj.$message.error("获取风格列表失败！");
	})
}
//获取楼盘列表
function floorList(obj,callback){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'selectHouses')
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.retCode==0){
			obj.addForm.floorList=res.data.housesList;
			callback();
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
function houseList(obj,callback){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'selectProCityHouse',{houseName:obj.addForm.floor})
	.then(res=>{
		loading.close();
		//console.log(res)
		if(res.data.retCode==0){
			obj.addForm.house='';
			obj.addForm.houseList=res.data.provinceList;
			callback();
		}else{
			obj.$message.error(res.data.retMsg);
		}
	})
	.catch(error=>{
		loading.close();
		console.log(error);
		obj.$message.error("获取户型列表失败！");
	})
}
//获取品牌列表
function brandList(obj){
	obj.$ajax.post(obj.$store.state.localIP+'selectBrand',{brandType:1})
	.then(res=>{
		//console.log(res)
		if(res.data.retCode==0){
			obj.ruleForm.brandList=res.data.brandList;
		}else{
			obj.$message.error("获取品牌列表失败！");
		}
	})
	.catch(error=>{
		console.log(error);
		obj.$message.error("获取品牌列表失败！");
	})
}
function initForm(){
	var data={	 
	        	name:'',//方案名称
	        	pic:'',//户型图
	        	mobile:'',//手机号
	        	threeDpic:'',//3D全景图
	        	brandList:[],//品牌列表
	        	styleName:'',//风格
	        	brand:'',//品牌
	        	programmeId:'',//选中品牌ID
	        }
	return data;
}
function initAddForm(){
	var data={	 
	        	floor:'',//楼盘
	        	floorList:[],//楼盘列表
	        	name:'',//方案名称
	        	house:'',//户型名称
	        	houseList:[],//户型列表
	        	styleName:'',//风格名称
	        }
	return data;
}

</script>

<style scoped>
.editBtn{
	margin-top: 30px;
	width: 100%;
	text-align: right;
}
.programmeList{
	margin-top: 30px;
}
</style>