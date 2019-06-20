iweb.controller('i016', function($scope,$routeParams) {
    $scope.classList=[]
        $scope.getData=function () {
            ajax({
                obj:'pc',
                act:'search',
                name:$routeParams.searchKey
            },function (data) {
                $scope.classList=data.info
            })
        }
    $scope.goDetail=function(item){
        if(item.number>1){
            goto_view('i009?name='+item.name+'&classid='+$scope.classCurrent+'&id='+item.id)
        }else{
            goto_view('i010?id='+item.course_id)
        }

    }
        setTimeout(function () {
            $scope.getData()

        },500)





})