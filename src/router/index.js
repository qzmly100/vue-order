import Vue from 'vue'
import Router from 'vue-router'
// import List from '@/views/list.vue'
// import Detail from '@/views/detail.vue'
// import Success from '../components/paySuccess.vue'



Vue.use(Router);

var _export = new Router({
	mode: 'hash',
	routes: [{
			path: '/',
			redirect: {
				path: '/list'
			}
		},
		{
			path: '/list',
			name: 'List',
			component: resolve => require(['@/views/list.vue'], resolve),
			
		},
		{
			path: '/detail/:id',
			name: 'Detail',
			component: resolve => require(['@/views/detail.vue'], resolve),
		},
		{
			path: '/success',
			name: 'Success',
			component: resolve => require(['../components/paySuccess.vue'], resolve),
		}
		// {
		// 	path: '/list',
		// 	name: 'List',
		// 	component: List,
			
		// },
		// {
		// 	path: '/detail/:id',
		// 	name: 'Detail',
		// 	component: Detail,
		// },
		// {
		// 	path: '/success',
		// 	name: 'Success',
		// 	component: Success,
		// }
	]
});

export default _export;