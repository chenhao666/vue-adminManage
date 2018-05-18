import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)
function stateValue(state){
	let base64 = new Base64();
	if(sessionStorage.getItem(base64.encode('username'))){
		state.userName=base64.decode(sessionStorage.getItem(base64.encode('username')));
	}
	if(sessionStorage.getItem(base64.encode('userCode'))){
		state.userCode=base64.decode(sessionStorage.getItem(base64.encode('userCode')));
	}
	if(sessionStorage.getItem(base64.encode('roleName'))){
		state.roleName=base64.decode(sessionStorage.getItem(base64.encode('roleName')));
	}
	if(sessionStorage.getItem(base64.encode('loginFlag'))){
		state.loginFlag=base64.decode(sessionStorage.getItem(base64.encode('loginFlag')));
	}
	if(sessionStorage.getItem(base64.encode('userPower'))){
		state.userPower=JSON.parse(base64.decode(sessionStorage.getItem(base64.encode('userPower'))));
	}
	//酷家乐
	if(sessionStorage.getItem(base64.encode('token'))){
		state.accessToken=sessionStorage.getItem(base64.encode('token'));
	}
	if(sessionStorage.getItem('cityID')){
		state.cityID=sessionStorage.getItem('cityID');
	}
	if(sessionStorage.getItem('cityName')){
		state.cityName=sessionStorage.getItem('cityName');
	}
	//设计师
	if(sessionStorage.getItem(base64.encode('appuid'))){
		state.appuid=JSON.parse(base64.decode(sessionStorage.getItem(base64.encode('appuid'))));
	}
}

//全局数据
const state={
	userName:"",
	roleName:"",
	loginFlag:"",
	userPower:"",
	userCode:"",
	cityID:'',
	cityName:'',
	appuid:'',//设计师
	accessToken:'',
	//localIP:'http://192.168.2.62:8080/ourHouse/',
	localIP:'/ourHouse/',
	status:1
}
stateValue(state);
//触发状态
const mutations={
	loginFlag(state){
		stateValue(state);
		router.push({path:'/'});
	},
	connectStatus(state,data){
		state.status=data;
	}
}

const actives={
	
}


export default new Vuex.Store({
	state,
	mutations,
	actives
})
