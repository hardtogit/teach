iweb.controller('i012', function($scope,$routeParams) {
    $scope.order={}
    $scope.order_id=''
    $scope.tabIndex='wechatpay'
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
        $scope.getCode()
    }
    $scope.timr=''


    $scope.validateWx=function(){
        ajax({
            obj:'user',
            act:'checkwepayInfo',
            id:$scope.order_id,
            type:'order'
        },function (data) {
            console.log(data)
            if(data.flag===1){
                layer.msg('支付成功',{icon:'1'})
                clearInterval($scope.timr)
                goto_view('i006')
            }
        })
    }
    $scope.getCode=function(){
        ajax({
            obj:'user',
            act:'pcgetpayinfo',
            paytype:$scope.tabIndex,
            recordtype:$scope.order.recordtype,
            recordid:$scope.order.course_id,
            money:$scope.order.pay_amount,
            discouponid:$scope.order.discouponid,
            discoupon:$scope.order.discoupon,
            payport:'pc',
            order_id:$routeParams.id
        },function (res) {
            $scope.order_id=res.info.order_id
            $('#code').empty()
            this.qrcode = new window.QRCode('code', {
                text: res.info.code_url,
                width: 230,
                height: 230,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: window.QRCode.CorrectLevel.M
            });
            if($scope.timr){
                clearInterval($scope.timr)
            }
            if($scope.tabIndex==='wechatpay'){
                $scope.timr=setInterval(function () {
                    $scope.validateWx()
                },2000)
            }

        })
    }
    $scope.getData=function(){
        ajax({
            obj:'user',
            act:'myorderdetail',
            order_id:$routeParams.id
        },function (data) {
            $scope.order=data.info
            $scope.getCode()
        })

    }

    setTimeout(function () {
        $scope.getData()
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function () {
        if (apiconn.conn_state === 'IN_SESSION') {
            $scope.getData()
        }
    })
})