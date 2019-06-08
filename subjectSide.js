iweb.controller('subjectSide', function($scope,$route) {
   $scope.path=$route.current.$$route.originalPath
        $scope.objInfo={}
        $scope.getData=function () {
            if(apiconn.conn_state==='IN_SESSION'){
                ajax({
                    obj:'user',
                    act:'readmyinfo',
                })
            }
        }
    $scope.setClass=function(class_id){
       $scope.userInfo.class_id=class_id
    }
        $scope.getData()
        $scope.$on("STATE_CHANGED_HANDLER", function() {
            if(apiconn.conn_state==='IN_SESSION'){
                $scope.getData()
            }
        })
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
        if (jo.obj == "user" && jo.act == "readmyinfo" && !jo.ustr) {
            // setTimeout(function () {
                $scope.objInfo=jo.info
            // },2000)

        }
    });
})