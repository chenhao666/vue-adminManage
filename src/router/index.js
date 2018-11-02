import Vue from 'vue'
import Router from 'vue-router'
//默认页
import IndexP from '@/components/index'
//首页
import Index from '@/components/index/index'
//登录
import Login from '@/components/login/login'
//角色管理
import RoleManage from '@/components/power/roleManage'
//权限管理
import PowerManage from '@/components/power/powerManage'
//管理员列表
import UserManage from '@/components/power/userManage'

//客户管理-预约
import Reservations from '@/components/customer/reservations'
//客户管理-客户
import Customer from '@/components/customer/customer'
//客户管理-预约-登记
import CustomerCheckIn from '@/components/customer/checkIn'
//客户管理-预约-新增客户登记
import AddCustomer from '@/components/customer/addCustomer'
//客户管理-预约-客户详情查看
import CustomerLookInfo from '@/components/customer/lookInfo'
//客户管理-客户-客户资料
import CustomerInfo from '@/components/customer/customerInfo'
//客户管理-客户-记事本
import NoteBook from '@/components/customer/noteBook'

//订单管理-订单列表
import OrderList from '@/components/order/orderList'
//订单管理-订单列表-施工
import Construction from '@/components/order/construction'
//订单管理-订单列表-方案
import Programme from '@/components/order/programme'
//订单管理-订单列表-详情
import OrderInfo from '@/components/order/orderInfo'
//订单管理-订单列表-客户
import OrderCustomer from '@/components/order/orderCustomer'
//订单管理-订单列表-客户详情
import OrderCustomerInfo from '@/components/order/orderCustomerInfo'

//设计师-添加方案
import HomeDesign from '@/components/design/homeDesign'
//设计师-编辑方案
import EditHomeDesign from '@/components/design/editHomeDesign'
//设计师-设计方案
import DesignProgramme from '@/components/design/programme'
//设计师-商品编辑
import EditGoods from '@/components/design/editGoods'


//信息发布-装修攻略
import Raiders from '@/components/delivery/raiders'
//信息发布-新增攻略
import AddRaiders from '@/components/delivery/addRaiders'
//信息发布-编辑攻略
import EditRaiders from '@/components/delivery/editRaiders'
//信息发布-套餐
import DeliveryPackage from '@/components/delivery/package'
//信息发布-套餐设计
import DeliveryHomeDesign from '@/components/delivery/homeDesign'
//信息发布-编辑设计
import DeliveryEditHomeDesign from '@/components/delivery/editHomeDesign'
//信息发布-新增套餐
import AddDeliveryPackage from '@/components/delivery/addPackage'
//信息发布-编辑套餐
import EditDeliveryPackage from '@/components/delivery/editPackage'
//客服
import CustomerService from '@/components/customerService/customerService'
//用户管理-轮播图
import BannerManage from '@/components/userManage/bannerManage'
//用户管理-楼盘登记
import FloorRegister from '@/components/userManage/floorRegister'
//用户管理-品牌管理
import BrandManage from '@/components/userManage/BrandManage'
//用户管理-风格管理
import StyleManage from '@/components/userManage/styleManage'
//用户管理-折扣管理
import DiscountManage from '@/components/userManage/discountManage'

//商品管理-商品管理
import CommodityEntry from '@/components/commodityManage/commodityEntry'
//商品管理-套餐包管理
import CommodityPackage from '@/components/commodityManage/commodityPackage'
//商品管理-位置管理
import LocationManage from '@/components/commodityManage/locationManage'
//商品管理-商品类型管理
import CommodityType from '@/components/commodityManage/commodityType'

//订单-订单管理
import PackageOrder from '@/components/userOrder/userOrder'
//订单-订单管理-订单详情
import userOrderInfo from '@/components/userOrder/orderInfo'
//订单-订单管理-采购
import Purchase from '@/components/userOrder/purchase'
//404页面
import Page404 from '@/components/error/page404'


Vue.use(Router)
//let Base64 = new Base64();
export default new Router({
  mode:'history',
  //base: '/ourHouse/',
  routes: [
    {
      path: '/',
      component: IndexP,
      beforeEnter:(to,from,next)=>{
      	//console.log(to.path)
      	if(!sessionStorage.getItem('nav') || to.path=="/index"){      		
      		sessionStorage.setItem('nav','1')
      	}
      	//判断是否登录  未登录则跳转到登录页面
      	if(!sessionStorage.getItem(Base64.encode('loginFlag'))){
      		next({path:'/login'});
      	}else{
      		next();
      	}
      },
      children:[
      	{
      		path:'/',
      		redirect:'/index'
      	},
      	{
      		path:'/index',
      		name:'首页',
      		component:Index
      	},
      	{
      		path:'roleManage',
      		name:'角色管理',
      		component:RoleManage
      	},{
      		path:'powerManage',
      		name:'权限管理',
      		component:PowerManage
      	},{
      		path:'userManage',
      		name:'员工管理',
      		component:UserManage
      	},
      	{
      		path:'customer',
      		name:'客户管理',
      		redirect:'customer/reservations'
      	},
      	{
      		path:'customer/reservations',
      		name:'客户管理-预约&意向',
      		component:Reservations
      	},
      	{
      		path:'customer/reservations/addCustomer',
      		name:'客户管理-预约&意向-新增客户登记',
      		component:AddCustomer
      	},
      	{
      		path:'customer/reservations/:code',
      		name:'客户管理-预约&意向-客户登记',
      		component:CustomerCheckIn
      	},
      	{
      		path:'customer/reservations/find/:code',
      		name:'客户管理-预约&意向-客户详情',
      		component:CustomerLookInfo
      	},
      	{
      		path:'customer/customer',
      		name:'客户管理-客户 ',
      		component:Customer
      	},{
      		path:'customer/customerInfo/:code',
      		name:'客户管理-客户 -客户资料',
      		component:CustomerInfo		
      	},{
      		path:'customer/noteBook/:code',
      		name:'客户管理-客户 -记事本',
      		component:NoteBook		
      	},{
      		path:'orderManage',
      		name:'订单管理',
      		redirect:'orderManage/orderList'
      	},{
      		path:'orderManage/orderList',
      		name:'订单管理-订单列表',
      		component:OrderList		
      	},{
      		path:'orderManage/construction/:code',
      		name:'订单管理-订单列表-施工',
      		component:Construction		
      	},{
      		path:'orderManage/orderInfo/:code',
      		name:'订单管理—订单列表-施工',
      		component:OrderInfo		
      	},{
      		path:'orderManage/programme/:code',
      		name:'订单管理-订单列表-方案',
      		component:Programme		
      	},{
      		path:'orderManage/orderCustomer',
      		name:'订单管理-订单列表-客户',
      		component:OrderCustomer		
      	},{
      		path:'orderManage/orderCustomerInfo/:code',
      		name:'订单管理-订单列表-客户详细',
      		component:OrderCustomerInfo		
      	},{
      		path:'designer/homeDesign',
      		name:'设计师-添加方案',
      		component:HomeDesign		
      	},{
      		path:'designer/editHomeDesign/:code',
      		name:'设计师-编辑方案',
      		component:EditHomeDesign		
      	},{
      		path:'designer/programme',
      		name:'设计师-设计方案',
      		component:DesignProgramme		
      	},{
      		path:'designer/editGoods/:code',
      		name:'设计师-商品编辑',
      		component:EditGoods		
      	},{
      		path:'designer/chat',
      		name:'设计师-及时通讯',
      		component:CustomerService		
      	},{
      		path:'delivery/raiders',
      		name:'信息发布-装修攻略',
      		component:Raiders		
      	},{
      		path:'delivery/addRaiders',
      		name:'信息发布-新增攻略',
      		component:AddRaiders		
      	},{
      		path:'delivery/editRaiders/:code',
      		name:'信息发布-编辑攻略',
      		component:EditRaiders		
      	},{
      		path:'delivery/package',
      		name:'信息发布-套餐',
      		component:DeliveryPackage		
      	},{
      		path:'delivery/addPackage/:code',
      		name:'信息发布-新增套餐',
      		component:AddDeliveryPackage		
      	},{
      		path:'delivery/homeDesign',
      		name:'信息发布-套餐设计',
      		component:DeliveryHomeDesign		
      	},{
      		path:'delivery/editHomeDesign/:code',
      		name:'信息发布-编辑设计',
      		component:DeliveryEditHomeDesign		
      	},{
      		path:'delivery/editPackage/:code',
      		name:'信息发布-编辑套餐',
      		component:EditDeliveryPackage		
      	},{
      		path:'customerService/servicePersonal',
      		name:'客服',
      		component:CustomerService		
      	},{
      		path:'userManage/bannerManage',
      		name:'用户管理-轮播图',
      		component:BannerManage		
      	},{
      		path:'userManage/floorRegister',
      		name:'用户管理-楼盘登记',
      		component:FloorRegister		
      	},{
      		path:'userManage/brandManage',
      		name:'用户管理-品牌管理',
      		component:BrandManage		
      	},{
      		path:'userManage/styleManage',
      		name:'用户管理-品牌管理',
      		component:StyleManage		
      	},{
      		path:'userManage/discountManage',
      		name:'用户管理-折扣管理',
      		component:DiscountManage		
      	},{
      		path:'userOrder/packageOrder',
      		name:'订单-订单管理',
      		component:PackageOrder		
      	},{
      		path:'userOrder/orderInfo/:code',
      		name:'订单-订单详情',
      		component:userOrderInfo		
      	},{
      		path:'userOrder/purchase/:code',
      		name:'订单-采购',
      		component:Purchase		
      	},{
      		path:'commodityManage/commodityEntry',
      		name:'商品管理-商品录入',
      		component:CommodityEntry		
      	},{
      		path:'commodityManage/commodityPackage',
      		name:'商品管理-商品套餐包管理',
      		component:CommodityPackage		
      	},{
      		path:'commodityManage/locationManage',
      		name:'商品管理-位置管理',
      		component:LocationManage		
      	},{
      		path:'commodityManage/commodityType',
      		name:'商品管理-商品类型管理',
      		component:CommodityType		
      	}
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
    	path:'*',
    	name:'404',
    	component:Page404
    }
  ]
})
