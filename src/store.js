import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)
function stateValue(state){
	//let Base64 = new Base64();
	if(sessionStorage.getItem(Base64.encode('username'))){
		state.userName=Base64.decode(sessionStorage.getItem(Base64.encode('username')));
	}
	if(sessionStorage.getItem(Base64.encode('userCode'))){
		state.userCode=Base64.decode(sessionStorage.getItem(Base64.encode('userCode')));
	}
	if(sessionStorage.getItem(Base64.encode('roleName'))){
		state.roleName=Base64.decode(sessionStorage.getItem(Base64.encode('roleName')));
	}
	if(sessionStorage.getItem(Base64.encode('loginFlag'))){
		state.loginFlag=Base64.decode(sessionStorage.getItem(Base64.encode('loginFlag')));
	}
	if(sessionStorage.getItem(Base64.encode('userPower'))){
		state.userPower=JSON.parse(Base64.decode(sessionStorage.getItem(Base64.encode('userPower'))));
	}
	//酷家乐
	if(sessionStorage.getItem(Base64.encode('token'))){
		state.accessToken=sessionStorage.getItem(Base64.encode('token'));
	}
	if(sessionStorage.getItem('cityID')){
		state.cityID=sessionStorage.getItem('cityID');
	}
	if(sessionStorage.getItem('cityName')){
		state.cityName=sessionStorage.getItem('cityName');
	}
	//设计师
	if(sessionStorage.getItem(Base64.encode('appuid'))){
		state.appuid=JSON.parse(Base64.decode(sessionStorage.getItem(Base64.encode('appuid'))));
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
	localIP:'http://192.168.2.62:8080/ourHouse/',
	//localIP:'/ourHouse/',
	status:1,
	//及时聊天对象数组
	friendList:sessionStorage.getItem('chat') || []
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
	},
	//存储聊天对象
	friendList(state,data){
		var flag=0;
		var list;
		var name=data.from;
		if(sessionStorage.getItem('chat')){
			list=JSON.parse(sessionStorage.getItem('chat'));
		}else{
			list=[];
		}
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				if(list[i].name==name){
					let info={
						name:name,
						info:data.data
					}
					list[i].msg.push(info);
					list[i].num+=1;
					flag=1;
				}
			}
			if(!flag){
				var info={
					name:name,
					id:data.id,
					msg:[{name:name,info:data.data}],
					num:1
				}
				list.push(info);
			}
		}else{
			var info={
				name:name,
				id:data.id,
				msg:[{name:name,info:data.data}],
				num:1
			}
			list.push(info);
		}
		sessionStorage.setItem('chat',JSON.stringify(list));
		state.friendList=sessionStorage.getItem('chat');
	},
	//修改消息数量
	changeNum(state,index){
		var list=JSON.parse(sessionStorage.getItem('chat'));
		list[index].num=0;
		sessionStorage.setItem('chat',JSON.stringify(list));
		state.friendList=sessionStorage.getItem('chat');
	}
}

const actives={
	
}

export default new Vuex.Store({
	state,
	mutations,
	actives
})
