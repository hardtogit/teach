iweb.controller('i005', function($scope,$routeParams) {
    $scope.tabIndex=1
    $scope.subject={}
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
    if(apiconn.conn_state==='IN_SESSION'){
        ajax({obj:'user',act:'mycoursedetail',course_id:$routeParams.id},function (data) {
            $scope.subject=data.info
        })


    }
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            ajax({obj:'user',act:'mycoursedetail',course_id:$routeParams.id},function (data) {
                $scope.subject=data.info
            })


        }
    })

})