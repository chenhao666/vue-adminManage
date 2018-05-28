//引用环信聊天
import WebIM from 'easemob-websdk';
import './WebIM.config.js';
//引用表情图片文件
WebIM.Emoji = {
    path: '../static/img/faces/'  /*表情包路径*/
    , map: {
	        '[):]': 'ee_1.png',
	        '[:D]': 'ee_2.png',
	        '[;)]': 'ee_3.png',
	        '[:-o]': 'ee_4.png',
	        '[:p]': 'ee_5.png',
	        '[(H)]': 'ee_6.png',
	        '[:@]': 'ee_7.png',
	        '[:s]': 'ee_8.png',
	        '[:$]': 'ee_9.png',
	        '[:(]': 'ee_10.png',
	        '[:\'(]': 'ee_11.png',
	        '[:|]': 'ee_18.png',
	        '[(a)]': 'ee_13.png',
	        '[8o|]': 'ee_14.png',
	        '[8-|]': 'ee_15.png',
	        '[+o(]': 'ee_16.png',
	        '[<o)]': 'ee_12.png',
	        '[|-)]': 'ee_17.png',
	        '[*-)]': 'ee_19.png',
	        '[:-#]': 'ee_20.png',
	        '[:-*]': 'ee_22.png',
	        '[^o)]': 'ee_21.png',
	        '[8-)]': 'ee_23.png',
	        '[(|)]': 'ee_24.png',
	        '[(u)]': 'ee_25.png',
	        '[(S)]': 'ee_26.png',
	        '[(*)]': 'ee_27.png',
	        '[(#)]': 'ee_28.png',
	        '[(R)]': 'ee_29.png',
	        '[({)]': 'ee_30.png',
	        '[(})]': 'ee_31.png',
	        '[(k)]': 'ee_32.png',
	        '[(F)]': 'ee_33.png',
	        '[(W)]': 'ee_34.png',
	        '[(D)]': 'ee_35.png'
	    }
};
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
//登录信息
var options = { 
  apiUrl: WebIM.config.apiURL,
  user: '123456',
  pwd: '123456',
  appKey: WebIM.config.appkey
};
conn.open(options);
conn.listen({
    onOpened: function ( message ) {          //连接成功回调
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();       
        console.log(message)
    },  
})