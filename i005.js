iweb.controller('i005', function($scope,$routeParams) {
    $scope.tabIndex=1
    $scope.subject={}
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
    $scope.toLive =function(url,talk,status){
        // var liveUrl = "#/i101?gid="+talk+"&u="+url+"&s="+status;
        var liveUrl = "#/i101?gid=o15598664532377779483&u=rtmp://dev.pull.live.121tongbu.com/live/XtbjfRaUg49D2kWcR2&s=true";
        window.open(liveUrl,'_blank');
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