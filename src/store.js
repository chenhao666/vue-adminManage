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
	if(sessionStorage.getItem(Base64.encode('roleID'))){
		state.roleID=Base64.decode(sessionStorage.getItem(Base64.encode('roleID')));
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
	// localIP:'http://192.168.1.122:8080/ourHouse/',
	localIP:'http://192.168.1.62:8080/ourHouse/',
	//localIP:'/ourHouse/',
	status:1,
	//及时聊天对象数组
	friendList:sessionStorage.getItem('chat') || [],
	qiniuUrl:'http://images.wojiali.cn/'
}
stateValue(state);
//触发状态
const mutations={
	loginFlag(state){
		stateValue(state);
		state.friendList=sessionStorage.getItem('chat') || [];
		router.push({path:'/'});
	},
	connectStatus(state,data){
		state.status=data;
	},
	//存储聊天对象
	friendList(state,data){
		//console.log(data)
		if(data.ext.type==2){
			data.data='<a href="'+data.ext.imageUrl+'" target="_blank"><img src='+data.ext.imageUrl+' width="80"></a>';
		}else if(data.ext.type==3){
			data.data='<audio src='+data.ext.voiceUrl+' controls width="200" height="50"></audio>';
		}else{
			data.data=data.data.replace(/((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,"<a target='_black' href='$&'>$&</a>");
		}
		//console.log(data.data)
		var timestamp = Date.parse(new Date());
		var time=parseInt(timestamp/60000);
		var flag=0;//标记
		var timeFlag=0;//时间标记
		var list;
		var name=data.ext.account;
		if(sessionStorage.getItem('chat')){
			list=JSON.parse(sessionStorage.getItem('chat'));
		}else{
			list=[];
		}

		//console.log(list)
		if(list.length>0){
			for(let i=0;i<list.length;i++){
				if(list[i].name==name){
					let info={
						name:name,
						info:data.data
					}
					var msgArr=list[i].msg;
					for(var j in msgArr){
						if(Math.abs(parseInt(j/60000)-time)<4){
							timeFlag=1;
							msgArr[j].push(info);
						}
					}
					if(!timeFlag){
						msgArr[timestamp]=[info];
					}
					list[i].msg=msgArr;
					list[i].lastMsg=data.data;
					list[i].num+=1;
					let dataMsg=list[i];
					list.splice(i,1);
					list.unshift(dataMsg);
					flag=1;
				}
			}
			if(!flag){
				var info={
					name:name,
					msg:{},
					lastMsg:data.data,
					num:1
				}
				info.msg[timestamp]=[{name:name,info:data.data}];
				list.unshift(info);
			}
		}else{
			var info={
				name:name,
				msg:{},
				lastMsg:data.data,
				num:1
			}
			info.msg[timestamp]=[{name:name,info:data.data}];
			list.unshift(info);
		}
		sessionStorage.setItem('chat',JSON.stringify(list));
		state.friendList=sessionStorage.getItem('chat');
	},
	//存储表情聊天对象
	friendEmojiMessage(state,data){
		var dataEmojiList = data.data;
		//console.log(dataEmojiList)
		var dataEmoji="";
		for(var i = 0; i <dataEmojiList.length ; i++){
		    //console.log(dataEmojiList[i]);
		    if(dataEmojiList[i].type=="emoji"){
		    	dataEmoji+="<img src='"+dataEmojiList[i].data+"' style='vertical-align:middle;'>"
		    }else{
		    	dataEmoji+=dataEmojiList[i].data;
		    }
		}
		dataEmoji+="<div class='clear'></div>";
		//console.log(data.data)
		var timestamp = Date.parse(new Date());
		var time=parseInt(timestamp/60000);
		var flag=0;//标记
		var timeFlag=0;//时间标记
		var list;
		var name=data.ext.account;
		if(sessionStorage.getItem('chat')){
			list=JSON.parse(sessionStorage.getItem('chat'));
		}else{
			list=[];
		}
		dataEmoji=dataEmoji.replace(/((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,"<a target='_black' href='$&'>$&</a>");
		//console.log(list)
		if(list.length>0){
			for(let i=0;i<list.length;i++){
				if(list[i].name==name){
					let info={
						name:name,
						info:dataEmoji
					}
					var msgArr=list[i].msg;
					for(var j in msgArr){
						if(Math.abs(parseInt(j/60000)-time)<4){
							timeFlag=1;
							msgArr[j].push(info);
						}
					}
					if(!timeFlag){
						msgArr[timestamp]=[info];
					}
					list[i].msg=msgArr;
					list[i].lastMsg=dataEmoji;
					list[i].num+=1;
					let dataMsg=list[i];
					list.splice(i,1);
					list.unshift(dataMsg);
					flag=1;
				}
			}
			if(!flag){
				var info={
					name:name,
					msg:{},
					lastMsg:dataEmoji,
					num:1
				}
				info.msg[timestamp]=[{name:name,info:dataEmoji}];
				list.unshift(info);
			}
		}else{
			var info={
				name:name,
				msg:{},
				lastMsg:dataEmoji,
				num:1
			}
			info.msg[timestamp]=[{name:name,info:dataEmoji}];
			list.unshift(info);
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
