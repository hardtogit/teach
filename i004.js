iweb.controller('i004', function($scope) {
    $scope.tabIndex='全部'
    $scope.subjectListAll=[]
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
        $scope.getData(tabIndex)
    }
    $scope.goDetail=function (id){
        goto_view("i005?id="+id);
    }
    $scope.getData=function (content) {
        // if(apiconn.conn_state==='IN_SESSION'){
            ajax({
                obj:'user',
                act:'mycourselist',
                content:content,
                page_num:0,
                page_size:5
            },function (data) {
                $scope.subjectListAll=data.info
                PageObject({appendId:'i004page',currNum:1,pageCount:Math.ceil(data.count/5),callback:function (current) {
                    $scope.openPage(current-1)
                    }})
            })
        // }
    }
    $scope.openPage=function(current){
        ajax({
            obj:'user',
            act:'mycourselist',
            content:$scope.tabIndex,
            page_num:current,
            page_size:5
        },function (data) {
            $scope.subjectListAll=data.info
        })
    }
    $scope.goSelectClass=function(){
        goto_view('i002')
    }
    setTimeout(function(){
        $scope.getData('全部')
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData('全部')
        }
    })
})