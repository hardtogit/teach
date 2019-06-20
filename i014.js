iweb.controller('i014', function($scope,$routeParams) {
    $scope.teacherDetail={}
    $scope.tabIndex=1
    $scope.changeTab=function (tabIndex) {
        $scope.tabIndex=tabIndex

    }
    $scope.goDetail=function(item){
        // if(item.number>1){
        //     goto_view('i009?name='+item.name+'&classid='+item.classid+'&id='+item.id)
        // }else{
            goto_view('i010?id='+item.course_id)
        // }
    }

    $scope.getData=function(){
        ajax({
            obj:'user',
            act:'teacherdetail',
            mainid:$routeParams.id
        },function (data) {
            $scope.teacherDetail=data.info
        })
    }


    setTimeout(function () {
        $scope.getData()
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData()
        }
    })
})