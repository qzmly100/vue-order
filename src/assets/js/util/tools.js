// import './jsNative';



window.NativeAndroid = {
    actions: [],
};

/**
 * 调用此方法以调用原生方法和传值
 * @param name 原生方法名称
 * @param body 参数
 * @param callBack 回调
 */
window.NativeAndroid.jsCall = function (name, body) {

    if (!name) { return; }

    return window.contect.callNative(handlerName,param);
};

/**
 * 调用此方法以调用原生方法和传值
 * @param name 原生方法名称
 * @param body 参数
 * @param callBack 回调
 */
window.NativeAndroid.asyncJSCall = function (name, body, callBack) {

    if (!name) { return; }

    // 是否含有回调。传送此字段给APP，可以减少不必要的开支，APP不用处理回调
    var withCallBack = !!callBack;

    var date = new Date();

    var id = date.toISOString();

    var newAction = {
        time: id,
        callBack: callBack,
    };

    NativeAndroid.actions.push(newAction);

    window.contect.callNative(name, id, body);
};

/**
 * 此方法为内部使用，用来原生回调
 * @param time
 * @param body
 */
window.NativeAndroidJSBridge = function(time, body) {
    if (!time) {
        return;
    }
    if (!NativeAndroid.actions) {
        return;
    }
    for (var index in NativeAndroid.actions) {
        var action = NativeAndroid.actions[index];

        if (action.time === time) {
            var callBack = action.callBack;
            if (callBack && typeof callBack === 'function') {
                if (body) {
                    callBack(body)
                } else {
                    callBack()
                }
            }
            break;
        }
    }
}

/**
 * ios调用
 */

const Tools = {};  //工具类大对象 
//接口请求
Tools.AppAjax =  {
    /**
     * Get请求
     * @param url	请求路径
     * @param successFunc	请求成功后执行函数
     * @param errorFunc	请求异常后执行函数
     */
    get: function(url, successFunc, errorFunc) {
        $.ajax({
            url: url,
            type: "GET",
            asysc: true,
            cache: false,
            dataType: 'json',
            success: function(response) {
                successFunc && successFunc(response);
            },
            error: function(response) {
                errorFunc && errorFunc(response);
            }
        });
    },
    /**
     * Post请求
     * @param url	请求路径
     * @param data	请求参数
     * @param successFunc	请求成功后执行函数
     * @param errorFunc	请求异常后执行函数
     */
    post: function(url, data, successFunc, errorFunc) {
        $.ajax({
            url: url,
            type: "POST",
            asysc: true,
            cache: false,
            data: data,
            dataType: 'json',
            success: function(response) {
                successFunc && successFunc(response);
            },
            error: function(response) {
                errorFunc && errorFunc(response);
            }
        });
    },
    /**
     * JSONP请求
     * @param url	请求路径
     * @param data	请求参数
     * @param successFunc	请求成功后执行函数
     * @param errorFunc	请求异常后执行函数
     */
    jsonp: function(url, data, successFunc, errorFunc) {
        $.ajax({
            url: url,
            type: "POST",
            asysc: true,
            cache: false,
            data: data,
            dataType: 'jsonp',
            jsonp: "callbackFunc",
            jsonpCallback: "callbackFunc",
            success: function(response) {
                successFunc && successFunc(response);
            },
            error: function(response) {
                errorFunc && errorFunc(response);
            }
        });
    }
};
// Message
Tools.Message = Tools.Weui_Message = {
    obj : {
        node : null,
        title:null //内容
    },
    _init : function(){
        var div = document.createElement('div');
        div.innerHTML = '<div id="message">'+
                            '<div class="weui-mask_transparent"></div>'+
                            '<div class="weui-toast weui-animate-fade-in">'+
                                '<p class="weui-toast__content" id="message_title">操作成功</p>'+
                            '</div> '+
                        '</div>';
        document.body.appendChild(div);
    },
    show : function(msg, autoHide, seconds){
        var self = this;
        self.obj.node = document.getElementById("message");
        self.obj.title = document.getElementById("message_title");
        if (!self.obj.node) {
            self._init();
            self.obj.node = document.getElementById("message");
            self.obj.title = document.getElementById("message_title");
        }
        self.obj.title.innerHTML = msg;
        self.obj.node.style.display = "block";
        if(autoHide){
            setTimeout(function(){
                self.hide();
            }, seconds * 1000 || 1000);
        }
        return self;
    },
    hide : function(){
        var self = this;
        if(self.obj.node){
            self.obj.node.style.display = "none";
            self.obj.title.innerHTML = "";
        }
        return self;
    },
    done : function(f){
        f && typeof f === 'function' && f(this.obj.node);
    }
}
//客户端交互
Tools.JsToNative = {
    /**
     * 调用原生方法
     * @param handlerName 功能名称 （loadUrl--跳转新页面 back--销毁页面 getParams--获取参数）
     * @param param	入数             url(String)         null          null
     * @param callBack	回调         null                null          android/jsonObject-ios/字典
     */
    callHandler: function(handlerName, param,callBack) {
        var self = this;

        var u = navigator.userAgent;
        //android终端
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        //ios终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        // console.log(NativeAndroid.asyncJSCall);
        // NativeAndroid.asyncJSCall(handlerName, param, callBack)	
        if(isAndroid) {
            NativeAndroid.asyncJSCall(handlerName, JSON.stringify(param), callBack)	
        }else if(isiOS) {
            Native.jsCall(handlerName, param, callBack)
        }
    }
} 

export default Tools;