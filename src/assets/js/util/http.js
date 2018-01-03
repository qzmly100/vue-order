
const axios = require('axios')

const HTTP = {
    /**
     * url --baseUrl
     * param -- 入参 {id:'',name:''}
     * key --http:****.com?key=param
     */
    handleUrl: function(url,param,key) {
        var _paramStr = '';
        if(param instanceof String || param instanceof Number || param instanceof Boolean) {
            _paramStr+="&"+key+"'"+encodeURIComponent(param)+"'";
        }else {
            for(var k in param) {
                _paramStr += "&"+k + "=" + "'" +param[k] + "'"
            }
        }
        _paramStr= url + '?' +_paramStr.slice(1);
       
        return _paramStr ;
    },
    /**
     * Get请求
     * @param url	请求路径
     * @param successFunc	请求成功后执行函数
     * @param errorFunc	请求异常后执行函数
     */
    get: function(url,data, successFunc, errorFunc) {
        axios({
            method:"GET",
            url:url,
            data:data  //入参
        }).then(function(res){ //成功
            successFunc && successFunc(res);
        })
        .catch(function(err){
            errorFunc && errorFunc(err);
        })
    },
    /**
     * Post请求
     * @param url	请求路径
     * @param data	请求参数
     * @param successFunc	请求成功后执行函数
     * @param errorFunc	请求异常后执行函数
     */
    __post: function(url, param, successFunc, errorFunc) {
        var self = this ;        
        axios({
            method:"POST",
            url:self.handleUrl(url,param),
            data:{emulateJSON: true }   //入参
        }).then(function(res){ //成功
            successFunc && successFunc(res);
        })
        .catch(function(err){
            errorFunc && errorFunc(err);
        })
    },
    /**
     * 特殊情况的请求格式
     */
    post: function(url,param, successFunc, errorFunc) {
        axios({
            method:"POST",
            url:url,
            data:param //入参
        }).then(function(res){ //成功
            successFunc && successFunc(res);
        })
        .catch(function(err){
            errorFunc && errorFunc(err);
        })
    }
};

export default HTTP;