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
//引入状态管理器
import store from './store.js'
//拖动排序
import VueDND from 'awe-dnd'
//引用环信聊天
import webIM from 'easemob-websdk';
//引用相关配置
import './commJs/webim.base.config.js';

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
