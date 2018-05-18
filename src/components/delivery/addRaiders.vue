<template>
	<div class="addRaiders">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>信息发布</el-breadcrumb-item>
		  <el-breadcrumb-item class="fontWeight">新增攻略</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="clear"></div>
		
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>新增攻略</span>
			</div>
			<div class="line"></div>
			
			<div class="text item addPackageForm">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="标题：" prop="title">
								<el-input v-model="ruleForm.title" :maxlength="30"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="攻略类别：" prop="raidersType">
								<el-select v-model="ruleForm.raidersType" placeholder="攻略类别">
									<el-option label="验房" value="1,验房"></el-option>
									<el-option label="设计" value="2,设计"></el-option>
									<el-option label="合同" value="3,合同"></el-option>
									<el-option label="拆改" value="4,拆改"></el-option>
									<el-option label="水电" value="5,水电"></el-option>
									<el-option label="泥瓦" value="6,泥瓦"></el-option>
									<el-option label="木工" value="7,木工"></el-option>
									<el-option label="油漆" value="8,油漆"></el-option>
									<el-option label="竣工" value="9,竣工"></el-option>
									<el-option label="软装" value="10,软装"></el-option>
									<el-option label="入住" value="11,入住"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="封面上传：" prop="imageUrl">
								<el-upload
								  class="upload-demo"
								  :action="uploadPic"
								  :data="uploadData"
								  :limit="1"
								  :on-error="uploadError"
								  :on-success="handlePictureCardPreview"
								  :on-preview="handlePreview"
								  :on-remove="handleRemove"
								  :on-exceed="onExceed"
								  :before-upload="beforeAvatarUpload"
								  :file-list="fileList"
								  list-type="picture">
								  <el-button size="small" type="primary">点击上传</el-button>
								  <div slot="tip" class="el-upload__tip">只能上传100*80px 且大小不超过3M</div>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
					
					
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="攻略详情：" prop="pic">
								<textarea name="content" style="width:800px;height:400px;visibility:hidden;"></textarea>
							</el-form-item>
						</el-col>
					</el-row>
					
					<div style="text-align: center;padding: 30px 0px;">
						<el-button  @click="goBack">取消</el-button>
						<el-button type="primary" @click="release('ruleForm')">发布</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">存草稿</el-button>
					</div>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
	name:'addRaiders',
	data(){
		let checkURL=(rule ,value,callback) => {
			if(this.imageUrl){
				callback();
			}else{
				callback(new Error('请选择上传封面图'));
			}
		}
		return{
			fileList:[],//上传图片列表
			imageUrl:'',//图片地址
			uploadPic:this.$store.state.localIP+'imgUpload',//图片上传
			uploadData:{
				'type':'decorateImg'
			},
			ruleForm:{
				title:"",//标题
				raidersType:"",//攻略类别
			},
			//表单验证
		    rules:{
		    	title: [
			        { required: true, message: '请输入标题', trigger: 'blur' }
			    ],
			    imageUrl: [
			        { validator: checkURL, trigger: 'blur' }
			    ],
			    raidersType: [
			         { required: true, message: '请选择类别', trigger: 'blur' }
			    ]
		    }
		}
	},
	//挂载
	mounted(){		
		//初始化文本编辑器
		//var editor;
	    this.editor = KindEditor.create('textarea[name="content"]', {
	       	cssPath : '/ourHouse/static/edit/plugins/code/prettify.css',
			//uploadJson : '/ourHouse/static/edit/jsp/upload_json.jsp',
			uploadJson:this.$store.state.localIP+'uploadJson',
			//fileManagerJson : '/ourHouse/static/edit/jsp/file_manager_json.jsp',
			fileManagerJson: this.$store.state.localIP+'fileManagerJson',
	        allowFileManager : true
	    });
	},
	methods: {
		//上传成功
		handlePictureCardPreview(response, file) {
			if(response.retCode==0){
	    		this.$message({
					message: '图片上传成功!',
					type: 'success'
				});
		        this.imageUrl = response.url;
	    	}else{
	    		this.$message.error(response.retMsg);
	    	}
        	//this.imageUrl = URL.createObjectURL(file.raw);
      	},
      	//上传失败
      	uploadError(err, file, fileList){
	    	this.$message.error("图片上传失败");
	    	console.log(err);
	    },
	    
	    //上传前
     	beforeAvatarUpload(file) {
        	//const isJPG = file.type === 'image/jpeg';
        	const isLt2M = file.size / 1024 / 1024 < 3;

        	/*if (!isJPG) {
          	this.$message.error('上传头像图片只能是 JPG 格式!');
        	}*/
        	if (!isLt2M) {
          	this.$message.error('上传头像图片大小不能超过 3MB!');
        	}
        	//return isJPG && isLt2M;
        	return isLt2M;
      	},
      	onExceed(){
	    	this.$message({
				message: '前先删除图片在进行上传操作',
				type: 'warning'
			});
	    },
		//上传图片删除
		handleRemove(file, fileList) {
        	//console.log(file, fileList);
        	this.imageUrl ="";
      	},
      	//预览
      	handlePreview(file) {
        	//console.log(file);
     	},
		//返回
      	goBack(){
      		window.history.go(-1);
      	},
      	//发布
      	release(formName) {
	        this.$refs[formName].validate((valid) => {
	          	if (valid) {
					this.$confirm('确定要发布吗?', '提示', {
		          		confirmButtonText: '确定',
		          		cancelButtonText: '取消',
		          		type: 'warning'
		        	}).then(() => {
		        		let typeArr=this.ruleForm.raidersType.split(',');
		          		let data={
		          			coverPic:this.imageUrl,
		          			title:this.ruleForm.title,
		          			stageId:typeArr[0],
		          			stageName:typeArr[1],
		          			details:this.editor.html(),
		          			isUsed:0
		          		}
						addRaiders(this,data)
		        	}).catch(() => {
		            
		       	 	});
	          	} else {
	          		this.$message.error("表单提交失败！");
	            	//console.log('error submit!!');
	            	return false;
	          	}
	        });
      	},
		//存草稿
		submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          	if (valid) {
	          		let typeArr=this.ruleForm.raidersType.split(',');
	          		let data={
	          			coverPic:this.imageUrl,
	          			title:this.ruleForm.title,
	          			stageId:typeArr[0],
	          			stageName:typeArr[1],
	          			details:this.editor.html(),
	          			isUsed:1
	          		}
					addRaiders(this,data)
	          	} else {
	          		this.$message.error("表单提交失败！");
	            	//console.log('error submit!!');
	            	return false;
	          	}
	        });
      	}
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

function addRaiders(obj,data){
	const loading =openLoad(obj);
	obj.$ajax.post(obj.$store.state.localIP+'addDecorateInfo',data)
	.then(response=>{
		loading.close();
		if(response.data.retCode==0){
            obj.$message({
				message: '攻略新增成功!',
				type: 'success'
			});
			obj.$router.push({path:'/delivery/raiders'})
        }else{
           	obj.$message.error(response.data.retMsg);
        }
	})
	.catch((error)=>{
		loading.close();
		console.log(error);
		obj.$message.error("网络连接错误~~");
	})
}
</script>

<style scoped>
	.el-input,.el-select{
		max-width: 200px;
	}
	.upload-demo,.el-upload-list{
		max-width: 400px;
	}
</style>