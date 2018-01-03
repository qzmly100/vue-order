<template>
    <div>
        <TopHeader :show="openHead" :title='title' :white='isWhite' :system='system' ref='header'>
            
        </TopHeader>

        <div class="container">
            <div class='pic'>
                <img :src="successIcon" alt="">
            </div>
            <div class="tip-text">
                <p class="s_tip">
                    恭喜支付成功<br/>
                    掌柜正在拼命发货中
                </p>
                <p class="p_center">
                    您可以在“个人中心”中查看参团订单
                </p>
            </div>
            <div class="btn-area">
                <a href="javascript:;" @click='lookupOrder'>查看我的订单</a>    
                <a href="javascript:;" @click='continus'>再逛逛</a>    
            </div>  
        </div>

    </div>
</template>
<script>
    import TopHeader from './TopHeader'; //头部组件
    import Tools from '@/assets/js/util/tools';

	let _export = {
        name:"Success",
		data() {
			return {
                system:'',
                openHead: true,
                title: '支付成功',
                isWhite: 'white',
                nativeInfo:null,
                successIcon:require("../../static/images/success.png")
			}
        },
        beforeMount() {
            const self = this;
            
            this.$store.commit('getNativeInfo'); //获取用户信息
            Tools.JsToNative.callHandler('onBackPressed',null,function() {
				Tools.JsToNative.callHandler('jumpToPurchaseGoods',null);
			});
        },
        mounted() {
            const self = this;
            self.system = self.$store.state.nativeInfo.operation_sys;
        },
        watch: {},
		methods: {
            lookupOrder() {
                let _url =window.location.href;
                let _str = _url.split('?')[1];
                this.$router.push({path:'/list?'+_str});
            },
            continus() {
                Tools.JsToNative.callHandler('jumpToPurchaseGoods',null);
            }

        },
        components : {
            TopHeader
        }
	};
	export default _export;
</script>
<style lang="scss" scoped type="text/css">
	// 重置weui的样式
	.weui-cells:after, .weui-cells:before {
		left: 0.38rem;
	}
	.TopHeader {
        color: #FFF;
        background:#647cff;
		border-bottom: 1px solid #999;
		.header-left {}
        .title {
            color: #FFF !important;
        }
    }
    .container {
        .pic {
            width:1.6rem;
            height:1.6rem;
            margin: 2rem auto 0;
            overflow:hidden;
            img {
                width:100%;
                height:100%;             
            }
        }
        .tip-text {
            text-align: center;
            .s_tip {
                letter-spacing:0;
                line-height:18px;
                margin-top: 11px;
                font-size:14px;
                color:#4a4a4a;
            }
            .p_center {
                line-height:12px;
                margin-top:13px;
                font-size:12px;
                color:#9b9b9b;
                letter-spacing:0;
            }
        }
        .btn-area {
            padding-top:0.6rem;
            font-size:0;
            text-align:center;
            a {
                display:inline-block;
                width: 40% ;
                height:0.88rem;
                line-height: 0.88rem;
                text-align:center;
                border: 1px solid #647cff;
                border-radius: 0.1rem;
                font-size:0.34rem; 
                &:first-child {
                    color: #647cff;
                    margin-right:0.3rem;
                }
                &:last-child {
                    color: #fff ;
                    background:#647cff;
                }
            }
        }
    }

</style>
