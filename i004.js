iweb.controller('i004', function($scope) {
    $scope.tabIndex=1
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            ajax({
                obj:'user',
                act:'mycourselist',
                content:'全部',
                page_num:0,
                page_size:5
            },function (data) {
                console.log(data)
            })
        }
    })

})