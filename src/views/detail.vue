<template>
	<div>
		<TopHeader :show="openHead" :title='title' :system='system' ref='header'>
			<router-link :to="backurl" slot="left" class="left-btn" >
			</router-link>
			<div slot="right">
				<a class='server-TEL' href="tel:400-921-9080" ></a>
			</div>
		</TopHeader>
		<div class='container' :style="{height:autoHeigth()}">
			<!-- 订单状态 -->
			<section class="orderStatus-container">
				<div class="weui-cells"> 
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">订单状态：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span class="status">{{order.status}}</span>
						</div> 
						<div class="weui-cell__ft"> 
						</div> 
					</div>
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">订单编号：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span>{{order.order_num}}</span>
						</div> 
						<div class="weui-cell__ft"> 
						</div> 
					</div>
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">下单日期：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span>{{order.inventory}}</span>
						</div> 
						<div class="weui-cell__ft"> 
						</div> 
					</div>
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">订单金额：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span class="money">￥{{order.total_price && (order.total_price/100).toFixed(2)}}</span>
						</div> 
						<div class="weui-cell__ft"> 
						</div> 
					</div>
				</div>
			</section>
			<div class="split"></div>
			<!-- 商品信息 -->
			<section class="pro-container">
				<div class="weui-cells__title">商品信息</div>
				<div class="weui-cells"> 
					<div class="weui-cell" v-for='(item,index) in order.goods_list' :key='index'>
						<div class="weui-cell__hd">
							<img :src="item.img3_path" alt="" />
						</div> 
						<div class="weui-cell__bd"> 
							<p class="pro_title">{{item.name}}</p>
							<p class="pro_desc">
								<span v-for="(itm,idx) in item.sku_list" :key="idx">{{itm.desc}}:{{itm.sub_desc}} </span>
							</p>
							<p class="pro_price">
								<span class="price" >￥ {{item.spu_price && (item.spu_price/100).toFixed(2)}}</span><span class="price_label">市场价</span><span class="count">x{{item.quantity}}</span>
							</p>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
				</div>
			</section>
			<div class="split"></div>
			<!-- 物流信息 -->
			<section class="logis-container">
				<div class="weui-cells__title">物流信息</div>
				<div class="weui-cells"> 
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">物流公司：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span>{{order.shipping_company}}</span>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">物流单号：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span>{{order.shipping_num}}</span><a class='duplicate' @click='duplicateFn(order.shipping_num)' v-show='!!order.shipping_num'>复制单号</a>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
				</div>
				<div class="split"></div>
				<!-- 地址 -->
				<div class="weui-cells"> 
					<div class="weui-cell">
						<div class="weui-cell__hd">
							<label class="weui-label">{{order.name}}</label>
						</div> 
						<div class="weui-cell__bd"> 
							<span>{{order.mobile}}</span>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
					<div class="weui-cell">
						<div class="weui-cell__hd">
							
						</div> 
						<div class="weui-cell__bd"> 
							<p>{{order.address}}</p>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
				</div>
				<div class="split"></div>
				<!-- 备注 -->
				<div class="weui-cells"> 
					<div class="weui-cell mark">
						<div class="weui-cell__hd">
							<label class="weui-label">备注说明：</label>
						</div> 
						<div class="weui-cell__bd"> 
							<p>{{order.postscript}}</p>
						</div> 
						<div class="weui-cell__ft"> 
							
						</div> 
					</div>
				</div>
			</section>
			<!-- 订单操作 -->
			<section class="handle-container">
				<div class="weui-cell">
					<div class="weui-cell__hd">
					</div> 
					<div class="weui-cell__bd"> 
					</div> 
					<div class="weui-cell__ft"> 
						<div class="btn_wrapper">
						<div v-if="order.status=='待付款'">
							<a class="btn cancel" @click="cancelFn(order.order_num)">取消订单</a>
							<a class="btn pay" @click='payFn(order.order_num)'>立即支付</a>
						</div>
						<div v-else-if="order.status=='待收货'">
							<a class="btn confirm" @click='confirmFn(order.order_num)'>确认收货</a>
						</div>
					</div>
					</div> 
				</div>
			</section>
		</div>
		
		<pay-comm :payShow='payShow' :payPrice='payPrice' @pickedFn='pickedFn' :payList='payList' @confirmPay='confirmPay' @delPay='delPay'></pay-comm>
		
	</div>
</template>

<script>
	import {weui} from '@/assets/js/weui'; //生产版
	import Tools from '@/assets/js/util/tools';
	import Http from '@/assets/js/util/http';

	import {mapState,mapGetters,mapActions} from 'vuex'; //引入映射
	import TopHeader from '../components/TopHeader'; //头部组件
	import PayComm from '../components/PayComm'; //支付组件
	
	window.weui = weui;
	window.Tools = Tools;

	let _export = {
		name: 'Detail',
		data() {
			// console.log('列表页传过来的 ：',this.$route.params);
			return {
				system: '' , //安卓顶部padding-top去掉
				payShow:false, //支付组件
				// picked: '',
				openHead: true,
				title: '订单详情',
				backurl: '/list',
				order_num:this.$route.params.id, //订单编号
				// payList:[], //支付方式
				payPrice:'',//应支付金额
				order:{} ,//详情页内容
				isPayFail : false //是否支付失败了
			}
		},
		beforeMount() {
			const self = this ;
			Tools.JsToNative.callHandler('onBackPressed',null,function() {
				// console.log('详情页回调');
				self.$router.push({path:'/list'});
			});
		},
		computed: {
			...mapGetters(['payList']),
			...mapState(['nativeInfo'])
		},
		mounted() {
			const self = this;
			self.system = self.$store.state.nativeInfo.operation_sys
			self.fetchData();
		},
		methods: {
			autoHeigth() {
				let body_h = parseInt(document.body.clientHeight, 10),
				header_h = $('.TopHeader').height(),
				tab_h = $('#nav-bar').height();
				return  (body_h - header_h - tab_h) + 'px';
			},
			//获取订单信息
			fetchData() {
				const self = this;
				let __store = self.$store.state.nativeInfo ; 
				let _url = Inter.getOrderDetail,
						param = {
							order_num:self.order_num ,
							user_id:__store.user_id ,
							platform : __store.platform ,
							version:__store.version ,
							operation_sys:__store.operation_sys 
						},
						okFn = (res) => {
							weui.loading().hide();

							if(res.data.code == '0') { //正常
							
								self.order = res.data.data;
							}else if (res.data.code == '2') { //异常
								Tools.Message.show('请求异常',true,2);
							}
						},
						failFn = (err) => {
							weui.loading().hide();

							Tools.Message.show('请求失败',true,2);
						};
				
				Http.__post(_url,param,okFn,failFn);

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
								//取消订单--跳转列表页
								self.$router.push({path:'/list'});
							});
						}
					}]
				});
			},
			//立即支付
			payFn(num) {
				const self = this;
				// console.log('立即支付'+num);
				self.payPrice = self.order.total_price;
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
			//微信-支付宝预下单
			preorder() {
				let _picked = this.$store.state.picked ;
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
						
						weui.loading().hide();
						self.payShow = false ;
						
						if(res.data.code == '0') { //正常
							//预下单成功后调用客户端支付
							var _id ;
							if(_picked == '1') { //微信
								_id = res.data.data;
							}else if(_picked == '2') { //支付宝
								_id = res.data.data.prepay_id ;
							}
							var _param = {
								"type":_picked + '', //支付方式
								"orderString":_id, //预订单标识 
								"successUrl":Inter.successUrl //跳转成功页
							};
							Tools.JsToNative.callHandler('pay',_param,null);
						}else if (res.data.code == '2') { //异常
							Tools.Message.show('请求异常',true,2);
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
			//点击稍后再试
			tryLate() {
				this.isPayFail = false ;
			},
			//点击重新支付
			payAgain() {
				const self = this;
				self.isPayFail = false ;
				self.payFn(self.order.order_num);
			},
			//点击x删除支付组件
			delPay(_param) { 
				this.payShow = _param.payShow;
			},
			//选择支付方式
			pickedFn(id) {
				this.picked = id;
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
						onClick: function(){ }
					}, {
						label: '是',
						type: 'primary',
						onClick: function(){ 
							self.changeStatus('confirm',num,function() {
								//确认收货--跳转列表页
								self.$router.push({path:'/list'});
							});
						}
					}]
				});
			},
			//复制单号
			duplicateFn(num) {
				// console.log('复制单号'+num);

				const self = this;
				Tools.JsToNative.callHandler('cloneOrderNo',num);
			},
		},
		components: {
			TopHeader,
			PayComm
		}
	};
	export default _export;
</script>

<style lang='scss' scoped>
	
	.TopHeader {
		border-bottom: 1px solid #999;
		.header-left {
			padding-left: 0;
			.left-btn {
				position: relative;
				padding: 13px 20px;
				&:before {
					content: " ";
					display: inline-block;
					transform: rotate(45deg);
					height: .8em;
					width: .8em;
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
	.container {
		overflow:auto;
	}
	.split {
		width: 100%;
		height: 0.2rem;
		background: #f7f7f7;
	}
	.weui-cells__title {
		margin: 0;	
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		font-size: 14px;
		color: #4a4a4a;
		background:#FFF;
	}
	.orderStatus-container {
		padding: 0.3rem;
		background:#FFF;
		.weui-cells  {
			margin-top: 0;
			&:before {
				display: none;
			}
			&:after {
				border-bottom:0;
			}
			.weui-cell {
				height: 0.3rem;
				line-height: 0.3rem;
				margin-bottom: 0.2rem;
				padding:0;
				font-size: 14px;
				&:before {
					display: none;
				}
				&:last-child {
					margin-bottom: 0;
				}
				.weui-label {
					width: auto;
					min-width:1.5rem;
					color: #9b9b9b;
				}
				.status {
					color: #647cff;
				}
				.money {
					color: #4a4a4a;
				}
				
			}
		}
		
	}
	.pro-container {
		.weui-cell {
			padding: 8px 15px;
			.weui-cell__hd {
				.weui-label {
					min-width: 5rem;
					font-size:12px;
					color:#9b9b9b;
					text-align:left;
				}
				img {
					background:#ffffff;
					border-radius:4px;
					width:1rem;
					height:1rem;
				}
			}
			.weui-cell__bd {
				padding-left: 0.2rem;
				font-size:12px;
				color:#9b9b9b;
				letter-spacing:0;
				text-align:left;
				.pro_title {
					font-size:14px;
					color:#4a4a4a;
					line-height:14px;
					text-align:left;
					margin-bottom: 0.1rem;
				}
				.pro_price {
					.price {
						font-size:14px;
						color:#ec621d;
						letter-spacing:-0.34px;
						text-align:justify;
					}
					.price_label {
						margin-left: 0.2rem;
					}
					.count {
						float: right;
					}
				}
			}
			.weui-cell__ft {
				font-size: 14px;
				text-align:right;
				.pro_count {
					margin-right: 0.3rem;
					font-size: 14px;
				}
				.pro_payment {
					i{
						&:first-child {
							color:#4a4a4a;
						}
						&:last-child {
							color: #ec621d;
						}
					}
				}
			}
		}
	}
	.logis-container {
		border-bottom: 1px solid #e5e5e5;
		.duplicate {
			display:inline-block;
			width:auto;
			min-width:0.9rem;
			height:0.28rem;
			line-height:0.28rem;
			margin-left:0.08rem;
			text-align:center;
			border-radius:2px;
			border:1px solid #9b9b9b;
			font-size:10px;
		}
		.weui-cells {
			margin-top:0;
			padding:0.3rem;
			.weui-cell {
				padding:0;
				line-height:12px;
				font-size:12px;
				color:#9b9b9b;
				&:first-child {
					margin-bottom:0.16rem;
				}
				&.mark {
					margin-bottom:0;
				}
				&:before {
					display:none;
				}
				.weui-label {
					width: auto;
					min-width: 1.2rem;
				}
			}
		}
	}

	.handle-container {
		background:#FFF;
		.btn_wrapper {
			.btn {
				display:inline-block;
				text-align:center;	
				border:1px solid #9b9b9b;
				border-radius:1.88rem;
				width:1.64rem;
				height:0.46rem;
				line-height:0.46rem;
				font-size:14px;
				&.cancel ,
				&.query {
					background:#FFF;
					color:#9b9b9b;
					margin-right:0.1rem;
				}
				&.pay ,
				&.confirm {
					background:#647cff;
					color:#FFF;
				}
			}
		}
	}
</style>