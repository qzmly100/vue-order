import Vue from 'vue'
import Vuex from 'vuex'

import {weui} from '@/assets/js/weui'; //生产版
import Tools from '@/assets/js/util/tools';
import Http from '@/assets/js/util/http';

Vue.use(Vuex)

export default new Vuex.Store({
    state: { //全局数据
        nativeInfo:null, //用户信息
        payList:[], //支付方式
        picked:'' //当前选中的支付方式
    },
    getters:{  //get
        nativeInfo:state => state.nativeInfo,
        payList: state => state.payList
    },
    mutations: {
        getNativeInfo(state) {
            var handleUrl = (function() {
                var url=window.location.href;  
                var rep=/[?&][^?&]+=[^?&]+/g;//全局匹配所有"?"和“&”后面的键值对
                var arr=url.match(rep);//执行匹配操作，返回键值对数组
                var obj={};  
                if(arr){  
                    arr.forEach(function(item){  
                        var tempArr = item.substring(1).split('=');  
                        var key = decodeURIComponent(tempArr[0]);  
                        var val = decodeURIComponent(tempArr[1]);  
                        obj[key] = val;  
                    })  
                }  
                return obj ;
            })();
            if(JSON.stringify(handleUrl) == '{}') {
                return;
            }
            state.nativeInfo = {
                user_id:handleUrl.user_id || '',
                platform:handleUrl.platform || '',
                version:handleUrl.version || '',
                operation_sys:handleUrl.operation_sys || '',
                province:handleUrl.province || '',
                city:handleUrl.city || ''
            } ;

            // console.log('handleUrl:',handleUrl);
        },
        changePayList(state,payList) {
            state.payList = payList
        }
    },
    actions: {
        //获取用户相关信息
        getNativeInfo({commit,state}) {
            // const self = this;
            // weui.loading(); //请求后台接口 loading
            
            // Tools.JsToNative.callHandler('getParams',null,(res)=> {
            //     weui.loading().hide();
            //     state.nativeInfo = res ;
            // });
        },
        //获取支付方式
        getPayType({commit,state}) {
            const self = this;
            weui.loading(); //请求后台接口 loading
            let _url = Inter.queryPayType,
                param = {
                    user_id:state.nativeInfo.user_id,
                    platform : state.nativeInfo.platform,
                    version:state.nativeInfo.version,
                    operation_sys:state.nativeInfo.operation_sys
                },
                okFn = (res) => {
                    weui.loading().hide();

                    if(res.data.code == '0') { //正常
                        state.payList = res.data.data.list;
                        state.picked = res.data.data.list[0].id;
                    }else if (res.data.code == '2') { //异常
                        Tools.Message.show('请求异常',true,2);
                    }
                },
                failFn = (err) => {
                    weui.loading().hide();
                    Tools.Message.show('请求失败',true,2);
                };

            Http.__post(_url,param,okFn,failFn);
        }
    }
})