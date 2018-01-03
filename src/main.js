// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//全局配置
//前端环境
import 'babel-polyfill';

window.ENV = {
	debug: true, //调试
	test: true, //测试
	develop: true, //开发
};
//前端配置
window.CONFIG = {
	prefix: 'vue_cli_project', //前缀名称 用于文件名唯一前缀与设置本地存储的唯一名称使用
	ua: navigator.userAgent //用户标示
};
//引入外部css
import '@/assets/css/weui.min.css'
import '../static/swiper-3.4.0.min.css'

import 'vue-ydui/dist/ydui.rem.css';
//引入js
import flexible from '@/assets/js/flexible' //引入淘宝的自适应库
import Swiper from 'swiper'
//import {weui} from '@/assets/js/weui' //开发版
//import {weui} from '@/assets/js/weui.min'//生产版
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import YDUI from 'vue-ydui'
 
Vue.use(VueAxios, axios);
Vue.use(YDUI);

import router from './router/index'
import App from './App'
import store from './vuex/store' //状态管理

import Inter from '@/assets/js/util/interface'; //api

window.Inter=Inter;

Vue.config.productionTip = false;

var vm = new Vue({
	el: '#app',
	template: '<App/>',
	router,
	store,
	components: {
		App
	}
});

//全局路由钩子
router.afterEach((to, form, next) => {
	document.title = to.name;
});