iweb.controller('i008', function($scope) {

    // $scope.getData=function () {
    //     ajax({},function () {
    //
    //
    //
    //
    //     })
    //
    // }
    setTimeout(function () {
        // $scope.getData()
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function () {
        if (apiconn.conn_state === 'IN_SESSION') {
            // $scope.getData()
        }
    })



})