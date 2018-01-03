<template>
	<div>
		<div class="weui-cells wrapper"> 
			<div class="weui-cell">
				<div class="weui-cell__hd">
					 <label class="weui-label">进货时间:{{order.inventory}}</label>
				</div> 
				<div class="weui-cell__bd"> 
					<input class="weui-input" readonly  placeholder="" > 
				</div> 
				<div class="weui-cell__ft"> 
					<span>{{order.status}}</span>
				</div> 
			</div> 
			<router-link :to="{name:'Detail',params:{id:order.order_num}}" >
				<div class="weui-cell" v-for='(item,index) in order.goods_list' :key='index'>
					<div class="weui-cell__hd">
						<div class="img-box">
							<img :src="item.img3_path" alt="" />
						</div>	
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
			</router-link>
			<div class="weui-cell">
				<div class="weui-cell__hd">
				</div> 
				<div class="weui-cell__bd"> 
				</div> 
				<div class="weui-cell__ft"> 
					<span class="pro_count">商品数:{{order.total_quantity}}</span><span class="pro_payment"><i>货款:</i><i>￥{{order.total_price && (order.total_price/100).toFixed(2)}}</i></span>
				</div> 
			</div>
			<div class="weui-cell">
				<div class="weui-cell__hd">
				</div> 
				<div class="weui-cell__bd"> 
				</div> 
				<div class="weui-cell__ft"> 
					<div class="btn_wrapper">
						<div v-if="order.status=='待付款'">
							<a class="btn cancel" @click="cancel_order(order.order_num)">取消订单</a>
							<a class="btn pay" @click='ready_pay(order.order_num,order.total_price)'>立即支付</a>
						</div>
						<div v-else-if="order.status=='待收货'">
							<a class="btn query" @click="query_order(order.order_num)">物流查询</a>
							<a class="btn confirm" @click='confirm_order(order.order_num)'>确认收货</a>
						</div>
					</div>
				</div> 
			</div>
		</div>
		<div class="split"></div>
	</div>
</template>

<script>
	let _export = {
		name: 'ListItem',
		data() {
			return {
				desc:'',
				sub_desc:''
			}
		},
		props:['order','nativeInfo'],
		mounted() {},
		methods:{
			//处理接口返回的规格 颜色、尺码、款式---红色、39码、男式
			handle_Sku(str1,str2) {
				let _str1 = str1.split('、'),
					_str2 = str2.split('、');
				let arr=[];
				for(let i=0; i<_str1.length;i++) {
					let __arr = [_str1[i],_str2[i]].join(':');
					arr.push(__arr);
				}

				return arr.join(' ');
			},
			//取消订单
			cancel_order(num) {
				// console.log(num);
				this.$emit('cancelFn',num);
			},
			//立即支付
			ready_pay(num,price) {
				// console.log(num);
				let _order = this.order;
				this.$emit('payFn',num,price,_order);
			},
			//物流查询
			query_order(num) {
				this.$emit('queryFn',num);
			},
			//立即支付
			confirm_order(num) {
				this.$emit('confirmFn',num);
			}
		},
		components: {}
	};
	export default _export;
</script>

<style lang='scss' scoped>
	// 重置weui的样式
	.wrapper {
		margin-top:0;
		p {
			margin: 0;
		}
		.weui-cell {
			padding: 8px 15px;
			.weui-cell__hd {
				.weui-label {
					min-width: 4.5rem;
					font-size:12px;
					color:#9b9b9b;
					text-align:left;
				}
				.img-box {
					background:#ffffff;
					border-radius:4px;
					width:1rem;
					height:1rem;
					overflow:hidden;
					img {
						width:100%;
						height:100%;
					}
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
				.pro_desc {}
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
		}
	}	
	
	.weui-cells:after, .weui-cells:before {
		left: 0.3rem;
	}
	.weui-cells {
		&:first-child{
			&:before {
				
			}
		}
	}
	.split {
		width: 100%;
		height: 0.2rem;
		background: #f7f7f7;
	}
</style>