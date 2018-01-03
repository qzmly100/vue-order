
const Inter = {
    test: { //测试
        "queryPayType":"http://test-api2.smhui.cn:8086/smjr_service/pay/queryPayType", //获取支付方式
        "getOrderList":"http://test-api2.smhui.cn:8084/smh_order/order/getOrderList", //订单列表
        "updateOrderCancel":"http://test-api2.smhui.cn:8084/smh_order/order/updateOrderCancel", //取消订单
        "updateOrderShipping":"http://test-api2.smhui.cn:8084/smh_order/order/updateOrderShipping", //确认订单
        "checkOrderIsFail":"http://test-api2.smhui.cn:8084/smh_order/order/checkOrderIsFail", //立即支付
        "getOrderDetail":"http://test-api2.smhui.cn:8084/smh_order/order/getOrderDetail", //订单详情
        "wxpayPreorder":"http://test-api2.smhui.cn:8084/smh_order/order/wxpayPreorder", //微信支付
        "zfbpayPreorder":"http://test-api2.smhui.cn:8084/smh_order/order/zfbpayPreorder", //支付宝支付
        "successUrl":"http://test-api2.smhui.cn/jinhuobao/order/index.html#/success" //跳转成功页
    },
    prod: { //生产
        "queryPayType":"http://api2.smhui.cn:8086/smjr_service/pay/queryPayType", //获取支付方式
        "getOrderList":"http://api2.smhui.cn:8084/smh_order/order/getOrderList", //订单列表
        "updateOrderCancel":"http://api2.smhui.cn:8084/smh_order/order/updateOrderCancel", //取消订单
        "updateOrderShipping":"http://api2.smhui.cn:8084/smh_order/order/updateOrderShipping", //确认订单
        "checkOrderIsFail":"http://api2.smhui.cn:8084/smh_order/order/checkOrderIsFail", //立即支付
        "getOrderDetail":"http://api2.smhui.cn:8084/smh_order/order/getOrderDetail", //订单详情
        "wxpayPreorder":"http://api2.smhui.cn:8084/smh_order/order/wxpayPreorder", //微信支付
        "zfbpayPreorder":"http://api2.smhui.cn:8084/smh_order/order/zfbpayPreorder", //支付宝支付
        "successUrl":"http://api2.smhui.cn/jinhuobao/order/index.html#/success" //跳转成功页
    }
};

export default Inter.prod;