iweb.controller('i004', function($scope) {
    $scope.tabIndex='全部'
    $scope.subjectList=[]
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
        $scope.getData(tabIndex)
    }
    $scope.goDetail=function (id){
        goto_view("i005?id="+id);
    }
    $scope.getData=function (content) {
        if(apiconn.conn_state==='IN_SESSION'){
            ajax({
                obj:'user',
                act:'mycourselist',
                content:content,
                page_num:0,
                page_size:5
            },function (data) {
                $scope.subjectList=data.info
            })
        }
    }
    $scope.getData('全部')
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        $scope.getData('全部')
    })

})