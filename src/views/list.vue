<template>
	<div id="app">
		<div class="bgPic" v-if="!isCS">
			<img class="backBtn" @click='closeWin' :src="backIcon" alt="返回按钮">
		</div>
		<div v-else>
			<TopHeader :show="openHead" :title='title' :system='system' ref='header'>
				<a slot="left" class="left-btn" @click="back">
				</a>
				<div slot="right" >
					<a class='server-TEL' href="tel:400-921-9080" ></a>
				</div>
			</TopHeader>
			<div class="container">
				<div id="nav-bar" class="weui-flex">
					<div class="item weui-flex__item" v-for='(tab,index) in tabs' :key='tab.tabId' @click="changeTab(tab.tabId)">
						<a href="javascript:;" :class="{'active':tab.tabId == status}">{{tab.tabContent}}</a>
					</div>
				</div>
				<div class="swiper-container" :style="{height:autoHeigth()}">
					<div class="swiper-wrapper">
						<div class="swiper-slide" style="height:auto;">
							<div class="swiper-slide-slideDown">
								<span class="slideDown" ref='slideDown'>下拉加载更多</span>
							</div>
							<div class="content">
								<template >
									<div v-if='swiperConf.orderList && swiperConf.orderList.length>0'>
										<div  v-for="(item,index) in swiperConf.orderList" :key="item.order_num">
											<list-item 
												:order='item' 
												:nativeInfo='nativeInfo'
												@cancelFn='cancelFn' 
												@payFn='payFn' 
												@queryFn='queryFn'
												@confirmFn='confirmFn'
												>
											</list-item>
										</div>
									</div>
									<div v-show='swiperConf.orderList && swiperConf.orderList.length == 0'>
										<empty><p slot="title" ref='loadTip'>暂无数据</p></empty>
									</div>
								</template>
							</div>
						</div>
						<div class="swiper-slide-slideUp">
							<span class="slideUp" ref="slideUp">上拉加载更多</span>
						</div>
					</div>
				</div>
			</div>
			
			<pay-comm :payShow='payShow' :payPrice='payPrice' @pickedFn='pickedFn' :payList='payList' @confirmPay='confirmPay' @delPay='delPay'></pay-comm>
		
		</div>
		
	</div>
</template>

<script>
	
	import {weui} from '@/assets/js/weui'; //生产版
	import Tools from '@/assets/js/util/tools';
	import Http from '@/assets/js/util/http';

	import {mapState,mapGetters,mapActions} from 'vuex'; //引入映射
	import TopHeader from '../components/TopHeader'; //头部组件
	import PayComm from '../components/PayComm'; //支付组件
	import ListItem from '../views/listItem'; //列表组件
	import Empty from '../components/empty'; //空组件

	window.weui = weui;
	window.Tools = Tools;

	let _export = {
		name: 'List',
		data() {
			return {
				isCS:false, //是否是长沙
				backIcon: require("../../static/images/backBtn.png"), //背景图片
				system: '' , //安卓顶部padding-top去掉
				payShow:false,
				// picked: '',
				openHead: true,
				title: '我的货单',
				backurl: '/list',
				mySwiper:null,
				currentPage: 1, // 第一页
				numPerPage: 10, // 默认十条
				status:1, //当前tab 默认01--全部
				activeIndex:0, 
				// nativeInfo:null, //用户信息
				// payList:[], //支付方式
				payPrice:'',//应支付金额
				orderNum: '', //订单号
				order:{}, //当前支付的这笔订单
				isPayFail : false, //是否支付失败了
				swiperConf : {  //swiper默认参数
					virtualSize:0,
					distance: 80 ,
					refreshFlag:0, //
					isLoadMore:true, //是否有更多数据
					isPage:true, //是否分页
					orderList:null  //渲染容器数据
				},
				tabs:[{
					tabId : '1',
					tabContent:'全部'
				},{
					tabId : '2',
					tabContent:'待付款'
				},{
					tabId : '3',
					tabContent:'待发货'
				},{
					tabId : '4',
					tabContent:'待收货'
				},{
					tabId : '5',
					tabContent:'已完成'
				}]
			}
		},
		beforeMount() {
			const self = this;
			this.$store.commit('getNativeInfo'); //获取用户信息
			
			Tools.JsToNative.callHandler('onBackPressed',null,function() {
				Tools.JsToNative.callHandler('back',null,null);
			});

			let _province = self.$store.state.nativeInfo.province,
				_city = self.$store.state.nativeInfo.city;

			if(_province == '931' && (_city == '932' || _city == '1053') ) {
				self.isCS = true;
			}

		},
		mounted() {
			const self = this;

			self.system = self.$store.state.nativeInfo.operation_sys;
			self.fetchData(); //获取首页数据
			//获取支付方式列表
			self.$store.dispatch('getPayType'); //获取支付方式
			//初始化swiper 获取列表数据
			self.mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				slidesPerView: 'auto',
				mousewheelControl: true,
				freeMode: true,
				scrollContainer: true,
				resistance: true,
				touchAngle: 60,
				observer: true,
				observeParents: true,
				setWrapperSize: true,
				iOSEdgeSwipeDetection: true,
				onInit: (swiper) => {
					// Tools.AppAjax.post();
				},
				onTouchStart: (swiper) => {
                	self.swiperConf.virtualSize = swiper.virtualSize;
            	},
				onTouchMove: (swiper) => {
					var size = swiper.height - self.swiperConf.virtualSize;
					//下拉
					if(swiper.translate > 0 && swiper.translate <= 40){
						self.swiperConf.refreshFlag = 0;
						self.$refs.slideDown.innerHTML='下拉加载更多';
						
					}else if(swiper.translate > 40){
						self.swiperConf.refreshFlag = 1;
						self.$refs.slideDown.innerHTML='松手刷新....';

					}
					//上拉
					if(swiper.translate < size && swiper.translate >= size - 40){
						self.swiperConf.refreshFlag = 0;
						if(self.swiperConf.isLoadMore){
							self.$refs.slideUp.innerHTML='上拉加载更多';
						}else{
							self.$refs.slideUp.innerHTML='无更多数据了';
						}
					}else if(swiper.translate < (size - 40)){
						self.swiperConf.refreshFlag = -1;
						if(self.swiperConf.isLoadMore){
							self.$refs.slideUp.innerHTML='松手刷新...';
						}else{
							self.$refs.slideUp.innerHTML='无更多数据了';
						}
					}
				},
				onTouchEnd: (swiper) => {
					if(self.swiperConf.refreshFlag > 0){
						//执行下拉函数
						// console.log('执行下拉函数');
						self.currentPage = 1;
						self.swiperConf.isLoadMore = true;
						//地址  参数
						// console.log('下拉刷新接口->' + address + '下拉接口入参->' + JSON.stringify(params));

						self.fetchData(); //刷新页面
					}else if(self.swiperConf.refreshFlag < 0){
						//执行上拉函数
						// console.log('执行上拉函数');
						if(!self.swiperConf.isLoadMore){
							return;
						}
						// 页码+1
						self.currentPage++; //页码+1
						self.fetchData(); //刷新页面
					}
					
					
					self.swiperConf.refreshFlag = 0;
				},
			}); 
		},
		computed: {
			...mapGetters(['payList']),
			...mapState(['nativeInfo'])
		},
		watch: {
			"nativeInfo" :function(val) {
				const self = this;
				// console.log('用户信息',val);
				// self.system = val.operation_sys;
                // self.fetchData(); //获取首页数据
                // //获取支付方式列表
                // self.$store.dispatch('getPayType'); //获取支付方式
			}
		},
		methods: {
			closeWin() {
				Tools.JsToNative.callHandler('back',null,null);
			},
			back() { //点击返回
				Tools.JsToNative.callHandler('back',null,null);
			},
			autoHeigth() {
				let body_h = parseInt(document.body.clientHeight, 10),
				header_h = $('.TopHeader').height(),
				tab_h = $('#nav-bar').height();
				return  (body_h - header_h - tab_h) + 'px';
			},
			//请求列表
			fetchData(){
				const self = this;

				weui.loading(); //请求后台接口 loading
				let __store = self.$store.state.nativeInfo ; 

				let _url = Inter.getOrderList,
				    param = {
						user_id:__store.user_id,
						platform : __store.platform,
						type:self.status,
						page:self.currentPage,	
						version:__store.version,
						operation_sys:__store.operation_sys
					},
					okFn = (res) => {
						weui.loading().hide();

						if(res.data.code == '0') { //正常
							let _list = res.data.data.list,
							__list = self.swiperConf.orderList,
							_totalNum = res.data.data.total_cnt; //总条数
						
							//将获取到的数据添加到orderlist
							if(self.currentPage==1) {
								self.swiperConf.orderList = _list;
							}else {
								self.swiperConf.orderList = __list.concat(_list);
							}

							if(self.swiperConf.orderList.length >= _totalNum ) {
								//判断是否有更多数据
								self.swiperConf.isLoadMore = false;
							}
						}else if (res.data.code == '2') { //异常
							Tools.Message.show('请求异常',true,2);
						}
					},
					failFn = (err) => {
						weui.loading().hide();

						Tools.Message.show('请求失败',true,2);
					};
				// console.log('获取货单的入参',param);
				Http.__post(_url,param,okFn,failFn);

				//渲染成功后方可重新計算高度
				self.$nextTick(function() {
					// console.log('error1',self.mySwiper);
					// self.mySwiper.translate = 0;
					self.mySwiper.update && self.mySwiper.update();
				});
				
			},
			
			//重置页面请求参数
			resetParam() {
				const self = this;

				self.currentPage = 1 ; //重置页数
				self.swiperConf.isLoadMore = true; //默认可以加载更多
				self.swiperConf.orderList = []; //清空列表
				self.$nextTick(() => {
					self.mySwiper.update && self.mySwiper.update(); 
				});
			},
			//点击切换状态 type-切换类型 num-订单编号
			changeStatus(type,num,cb) {
				const self = this;
				let __store = self.$store.state.nativeInfo ; 
				weui.loading();
				let _url,
					param={
						order_num:num,
						user_id:__store.user_id,
						platform : __store.platform,
						version:__store.version,
						operation_sys:__store.operation_sys
					},
					okFn = (res) => {
						// console.log(res);
						weui.loading().hide();

						if(res.data.code == '0') { //正常
							typeof cb == 'function' && cb(res);
						}else if (res.data.code == '2') { //异常
							Tools.Message.show('请求异常',true,2);
						}
					},
					failFn = (err) => {
						weui.loading().hide();
						Tools.Message.show('请求失败',true,2);
					};
				
				switch(type) {
					case 'cancel': //取消
						_url = Inter.updateOrderCancel;
						break;
					case 'confirm': //确认
						_url = Inter.updateOrderShipping;
						break;
					case 'pay': //支付
						_url = Inter.checkOrderIsFail;
						break;	
				}

				Http.__post(_url,param,okFn,failFn);
			},
			changeTab(index) {
				const self = this;

				self.resetParam(); //重置参数
				self.status = index;  //当前tab
				self.fetchData();

				//渲染成功后方可重新計算高度
				self.$nextTick(function() {
					self.mySwiper.translate = 0;
				});
			},
			//取消订单
			cancelFn(num) {
				const self = this;
				// console.log('取消订单'+num);
				weui.confirm('', {
					title: '确认取消订单',
					buttons: [{
						label: '否',
						type: 'default',
						onClick: function(){ 
							// console.log('no') 
						}
					}, {
						label: '是',
						type: 'primary',
						onClick: function(){ 
							// console.log('yes') ;
							self.changeStatus('cancel',num,function() {
								self.resetParam(); //重置参数
								self.fetchData(); //刷新页面
							});
						}
					}]
				});
			},
			//立即支付
			payFn(num,price,order) {
				const self = this;
				// console.log('立即支付',num,price);
				self.payPrice = price;
				self.orderNum = num ;
				self.order = order ;
				weui.confirm('', {
					title: '确认支付',
					buttons: [{
						label: '否',
						type: 'default',
						onClick: function(){}
					}, {
						label: '是',
						type: 'primary',
						onClick: function(){ 
							// console.log('yes') ;
							self.changeStatus('pay',num,function(res) {
								let _status = res.data.data.status ;
								if(_status==1) { //无效
									Tools.Message.show('该订单已失效！',true,2);
									return ;
								}else if(_status==0) { //有效
									//弹起支付组件
									self.payShow =true; 
								}
							});
						}
					}]
				});
			},

			//选择支付方式
			pickedFn(id) {    
				this.picked = id;
			},
			//处理商品列表数据
			handleGoodList(list) {
				var _arr = [];_arr.length=list.length;
				for(var i=0;i<list.length;i++) {
					var _item = list[i];
					   _arr[i]=  {};
					for(var k in _item) {
						if(k== 'spu_price' || k=='quantity') {
							_arr[i][k] = _item[k];
						}
					} 
					_arr[i]["sku_id"] = "";
				}

				return JSON.stringify(_arr) ;
			},
			//点击确定 -确认支付
			confirmPay(_param) {
				const self = this;
				//先确定已选中
				weui.loading();
				var _picked = self.$store.state.picked ;
				var __store = self.$store.state.nativeInfo ;
				let _url,
					param = {
						user_id:__store.user_id,
						platform : __store.platform,
						version:__store.version,
						operation_sys:__store.operation_sys,
						order_num:this.order.order_num,
						inventory:this.order.inventory,
						status:this.order.status,
						goods_list:this.handleGoodList(this.order.goods_list),
						total_quantity:this.order.total_quantity,
						total_price:this.order.total_price
					},
					okFn = (res) => {
						self.payShow = false ;
						// console.log(res);
						weui.loading().hide();
						if(res.data.code == '0') { //正常
							//预下单成功后调用客户端支付
							var _id ;
							if(_picked == '1') { //微信
								_id = res.data.data;
							}else if(_picked == '2') { //支付宝
								_id = res.data.data.prepay_id ;
							}
							var _param = {
								"type":_picked+'', //支付方式
								"orderString":_id , //预订单标识
								"successUrl":Inter.successUrl //跳转成功页
							};
							// console.log('提交给native的订单信息',_param);
							Tools.JsToNative.callHandler('pay',_param,null);
						}else if (res.data.code == '2') { //异常
							Tools.Message.show('订单异常',true,2);
						}
					},
					failFn = (err) => {
						weui.loading().hide();
						self.payShow = _param.payShow;  //隐藏支付组件

						Tools.Message.show('请求失败',true,2);
					};
				switch(_picked) {
					case 1: //微信支付
						_url = Inter.wxpayPreorder;

						break;
					case 2: //支付宝支付
						_url = Inter.zfbpayPreorder;

						break
				}

				Http.__post(_url,param,okFn,failFn);

			},
			//点击x删除支付组件
			delPay(_param) { 
				this.payShow = _param.payShow;
			},
			//物流查询
			queryFn(num) {
				// console.log('物流查询'+num);
				this.$router.push({path:'/detail/'+num});
			},
			//确认收货
			confirmFn(num) {
				const self = this;
				// console.log('确认收货'+num);
				weui.confirm('', {
					title: '确认该订单已收货',
					buttons: [{
						label: '否',
						type: 'default',
						onClick: function(){ 
							// console.log('no') 
						}
					}, {
						label: '是',
						type: 'primary',
						onClick: function(){ 
							// console.log('yes') ;
							self.changeStatus('confirm',num,function() {
								self.resetParam(); //重置参数
								self.fetchData(); //刷新页面
							});
						}
					}]
				});
			}
		},
		components: {
			TopHeader,
			Empty,
			PayComm,
			ListItem
		}
	};

	export default _export;
</script>

<style lang='scss' scoped>
	// -重置weui的样式
	.weui-cells:after, .weui-cells:before {
		left: 0.38rem;
	}
	// 进货宝宣传页
	.bgPic {
		position: fixed;
		top: 0;
		left: 0;
		right:0;
		bottom:0;
		width:100%;
		height:100%;
		// background: url('../../static/images/bgPic.jpg') no-repeat;
		background: url('../assets/images/bgPic.jpg') no-repeat;
		background-size: cover;
		z-index: 99;
		.backBtn {
			position: absolute;
			top: 20px;
			left:25px;
			width: 30px;
			height: 30px;
		}
	}

	.TopHeader {
		border-bottom: 1px solid #999;
		.header-left {
			.left-btn {
				position: relative;
				padding: 13px 20px;
				&:before {
					content: " ";
					display: inline-block;
					transform: rotate(45deg);
					height: .9em;
					width: .9em;
					border-width: 0 0 2px 2px;
					border-color: #9b9b9b;
					border-style: solid;
					position: absolute;
					left: 1em;
					top: 0.8em;
				}
			}
		}
	}

	//swiper样式
	.swiper-slide { 
		.swiper-slide-slideDown{ position:absolute; line-height:20px; text-align:center; top:-20px; width:100%; }
		.content{ padding-bottom:20px; }
	}
	.swiper-slide-slideUp{ position:absolute; line-height:20px; text-align:center; bottom:-20px; width:100%; }
		

</style>