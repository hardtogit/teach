iweb.controller('i015', function($scope,$routeParams) {
    $scope.errorList=[]
    $scope.visible=false
    $scope.question={}
    // user examwronglist
    $scope.getData=function(){
        ajax({
            obj:'user',
            act:'examwronglist',
            page_num:0,
            page_size:9
        },function (data) {
            $scope.errorList=data.info
            PageObject({appendId:'i015page',currNum:1,pageCount:Math.ceil(data.count/9),callback:function (current) {
                    $scope.openPage(current-1)
                }})
        })
    }
    $scope.openPage=function(current){
        ajax({
            obj:'user',
            act:'examwronglist',
            page_num:current,
            page_size:9
        },function (data) {
            $scope.errorList=data.info
        })
    }
    $scope.handleSelect=function(question){
        $scope.question=question
        $scope.visible=true
    }
    $scope.hidden=function(){
        $scope.visible=false
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