<template>
    <div>
        <yd-popup v-model="payShow" position="bottom" height="50%" :close-on-masker=false >
			<div slot='top'>
				<div style="height: 47px; line-height: 47px; text-align:center; color:#4a4a4a; font-size:17px; background-color: #FFF; border-bottom:1px solid #e5e5e5;" class="confirm-title">确认付款<span @click="delPay">X</span></div>
			</div>
			<div class="content">
				<p class='pay-num'>￥{{payPrice && (payPrice/100).toFixed(2)}}</p>
				<div class="pay-type">
					<yd-cell-group>
						<yd-cell-item type="radio" v-for='(item,index) in payList' :key='index' >
                            <img slot="icon" :src="item.icon_path"/>
							<span slot="left">{{item.desc}}</span>
							<!-- <input slot="right" type="radio" :value="item.id" v-model="picked" @change='changePicked'/> -->
							<input slot="right" type="radio" :value="item.id" v-model="picked"/>
						</yd-cell-item>
					</yd-cell-group>
				</div>
			</div>
			<div slot='bottom' >
				<div @click='confirmPay' style="height: 44px; line-height: 44px; text-align:center; color:#FFF; font-size:17px; background-color: #647cff; border-bottom:1px solid #e5e5e5;">确定</div>
			</div>
        </yd-popup>
    </div>
</template>

<script>

    import Tools from '@/assets/js/util/tools';

    let _export = {
        name:'PayComm',
        data() {
            const self = this;
                return {
                    // picked:'' //deng
                }

        },
        created() {
            // const self = this;
            // self.$nextTick(function() {
            //     console.log('000',self.picked);
            //         self.cpicked=self.picked //deng
            // });
        },
        computed: {

            picked: {
                get:function() {
                    return this.$store.state.picked;
                },
                set:function(val) {
                    this.$store.state.picked =val;
                }
                
            }
        },
        props:{
            // picked:{
            //     type:String,
            //     required:true
            // },
            payShow: {
                type: Boolean,
                required: true
            },
            payPrice: {
                type:String,
                required:true
                // validator(money) {
                //     return money
                // }
            },
            payList: {
                type:Array,
                required:true,
                // default() {
                //     return []
                // }
            }
        },
        methods: {
            pickedFn(id) {
                this.$emit('pickedFn',id);
            },
            //点击遮罩 有bug
            //点击确定 -确认支付
			confirmPay() {
                //先确定已选中
                if(!this.picked) {
                    Tools.Message.show('请选择支付方式',true);
                    return;
                }
                //传一个支付参数给父组件 用于调原生支付控件
                var _param = {
                    payShow : false,
                    payTypeId : this.picked,  //支付方式
                    payPrice : this.payPrice
                }
                this.$emit('confirmPay',_param);
            },
            delPay() {
                var _param = {
                    payShow : false
                }
                this.$emit('delPay',_param);
            },
            //去掉v-model  用v-model @change来代替
            changePicked(e) {
                this.picked = e.target.value;
            }
        }
    };

    export default _export;
</script>

<style lang='scss' scoped>

</style>

