// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入UI样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入通用样式
import '../static/css/comm.css'
//引入jq
import $ from 'jquery'
import '../static/js/jquery.particleground.min.js'
//引入axios
import Axios from 'axios'
//拖动排序
import VueDND from 'awe-dnd'
//引用环信聊天
let WebIM=require('easemob-websdk'); 
import './commJs/webim.base.config.js';
//引入七牛
import * as qiniu from 'qiniu-js'
//引入状态管理器
import store from './store.js'
//创建连接
var conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true
});
//用户登录
const options={ 
	apiUrl: WebIM.config.apiURL,
	user:null,
	pwd: null,
	appKey: WebIM.config.appkey
}
//修改原型链
Vue.prototype.$webim=WebIM;
Vue.prototype.$imconn=conn;
Vue.prototype.$imoption=options;
//使用拖拽
Vue.use(VueDND)
//修改原型链
Vue.prototype.$ajax = Axios

Vue.use(ElementUI)
Vue.config.productionTip = false

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz 
	if(isNaN(this.getMonth())){
		//console.log(this.getMonth())
		return '';
	}
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
