iweb.controller('i013', function($scope,fileReader) {

    $scope.tabIndex=1
    $scope.couponList=[]
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
        const history=tabIndex===1?'false':'true'
        $scope.getData(history)
    }
    $scope.getData=function (content) {
        ajax({
            obj:'user',
            act:'mycouponlist',
            history:content,
            page_num:0,
            page_size:1000
        },function (data) {
            $scope.couponList=data.info
        })
    }
    setTimeout(function(){
        $scope.getData('false')
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData('false')
        }
    })

})