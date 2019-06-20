iweb.controller('i011', function($scope,$routeParams) {
    $scope.address={}
    $scope.class={}
    $scope.tabIndex=1
    $scope.money=0.00
    $scope.couponList=[]
    $scope.selectCoupon={}
    $scope.visible=false

    $scope.regionData={
        areaprovince:undefined,
        areacity:undefined,
        areacounty:undefined
    }
    $scope.regionList= {
        province: [],
        city: [],
        county: []
    }
    $scope.changeTab=function (tabIndex) {
        $scope.tabIndex=tabIndex

    }
    $scope.show=function(){
        $scope.visible=true
    }
    $scope.hidden=function(){
        $scope.visible=false
    }
    $scope.save=function(){
        var mobileReg = /^1[0-9]\d{9}$/; // 手机号
        if(!mobileReg.test($scope.address.phone)){
            layer.msg('请输入正确的手机号',{icon:0})
            return
        }
        ajax(Object.assign($scope.address,{
            province:$scope.regionData.areaprovince,
            city:$scope.regionData.areacity,
            county:$scope.regionData.areacounty,
            obj:'user',
            act:'setaddress'
        }),function () {
            layer.msg('操作成功',{icon:1})
            $scope.visible=false
            ajax({
                obj:'user',
                act:'coursedetail',
                course_id:$routeParams.id
            },function (data) {
                $scope.class = data.info
                if (data.info.address.phone) {
                    $scope.address =angular.copy(data.info.address);
                    $scope.formatRegion('city', data.info.address.province)
                    $scope.formatRegion('county', data.info.address.city)
                    $scope.regionData = {
                        areaprovince: data.info.address.province,
                        areacity: data.info.address.city,
                        areacounty: data.info.address.county
                    }
                }
            })
        })
    }
    $scope.getData=function () {
        ajax({
            obj:'user',
            act:'coursedetail',
            course_id:$routeParams.id
        },function (data) {
            $scope.class=data.info
            $scope.money=data.info.price.toFixed(2)
            if(data.info.address.phone){
                $scope.address=angular.copy(data.info.address);
                $scope.formatRegion('city',data.info.address.province)
                $scope.formatRegion('county',data.info.address.city)
                $scope.regionData={
                    areaprovince:data.info.address.province,
                    areacity:data.info.address.city,
                    areacounty:data.info.address.county
                }
            }
            ajax({
                obj:'user',
                act:'paycouponlist',
                recordid:$routeParams.id,
                recordtype:data.info.recordtype
            },function (res) {
                $scope.couponList=res.info
            })
        })
        $scope.formatRegion('province','province')

    }
    $scope.choice=function(item){
        if(item.status==='false'){
            layer.msg(item.description,{icon:0})
            return
        }else{
            if($scope.selectCoupon.discoupon_id===item.discoupon_id){
                $scope.selectCoupon={}
                $scope.money=$scope.class.price
            }else{
                $scope.selectCoupon=item
                $scope.money= parseFloat($scope.class.price-item.money).toFixed(2)
            }
        }
    }
    $scope.formatRegion=function(type,parameter,action){
        if(type==='province') {
            ajax({
                obj: 'user',
                act: 'provincecity',
                type:type,
                parameter:parameter

            }, function (data) {
                $scope.regionList.province = data.info
                $scope.regionList.city=[]
                $scope.regionList.county=[]

            })
        }
        if(type==='city'){
            ajax({
                obj: 'user',
                act: 'provincecity',
                type:type,
                parameter:parameter
            },function (data) {
                $scope.regionList.city=data.info
                if(action){
                    $scope.regionData.areacity=undefined
                    $scope.regionData.areacounty=undefined
                }

                $scope.regionList.county=[]

            })
        }
        if(type==='county'){
            ajax({
                obj:'user',
                act:'provincecity',
                type:type,
                parameter:parameter

            },function (data) {
                $scope.regionList.county=data.info
                if(action){
                    $scope.regionData.areacounty=undefined
                }
            })
        }
    }
    $scope.submit=function(){
       ajax({
           obj:'user',
           act:'pcgetpayinfo',
           paytype:'wechatpay',
           recordtype:$scope.class.recordtype,
           recordid:$routeParams.id,
           money:parseFloat($scope.money).toFixed(2),
           discouponid:$scope.selectCoupon.discoupon_id?$scope.selectCoupon.discoupon_id:'',
           discoupon:$scope.selectCoupon.money?$scope.selectCoupon.money:'',
	       payport:'pc'

       },function (data) {
           if(data.info.flag===0){
               goto_view('i006')
           }else{
               goto_view('i012?id='+data.info.order_id)
           }

       })
    }
    setTimeout(function () {
        $scope.getData()
    },500)
})