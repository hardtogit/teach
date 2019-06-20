iweb.controller('i010', function($scope,$rootScope,$routeParams) {
    $scope.courseDetail={}
    $scope.visible=false
    $scope.couponlist=[]
      $scope.tabIndex=1
    $scope.changeTab=function (tabIndex) {
          $scope.tabIndex=tabIndex

    }
    $scope.getData=function () {
        ajax({
            obj:'user',
            act:'coursedetail',
          course_id:$routeParams.id
        },function (data) {
            $scope.courseDetail=data.info
        })
    }
    $scope.getCoupon=function(){
        //获取优惠卷
        ajax({
            obj:'user',
            act:'discouponlist',
            course_id:$routeParams.id,
            page_num:0,
            page_size:100
        },function (data) {
            console.log(data)
            $scope.couponlist=data.info
        })
    }
    $scope.goTeacherDetail=function(id){
        goto_view('i014?id='+id)
    }
    $scope.show=function(){
        $rootScope.validateLogin(function () {
            $scope.visible=true
            $scope.getCoupon()
        })
    }
    $scope.hidden=function(){
        $scope.visible=false
    }
    $scope.apply=function(){
        $rootScope.validateLogin(function () {
            goto_view('i011?id='+$routeParams.id)
        })

    }
    $scope.acceptCoupon=function(id){
         ajax({
             obj:'user',
             act:'discouponget',
             discoupon_id:id
         },function () {
                layer.msg('领取成功',{icon:1})
                $scope.getData()
         })
    }
    setTimeout(function () {
        $scope.getData()
    },500)
})

iweb.filter('showAsHtml',function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
})