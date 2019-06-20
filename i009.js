iweb.controller('i009', function($scope,$routeParams) {
    $scope.name=$routeParams.name
    $scope.classList=[];
      $scope.getData=function () {
          ajax({
              obj:'pc',
              act:'courselist',
              classid:$routeParams.classid,
              id:$routeParams.id?$routeParams.id:'',
              name:$routeParams.name
          },function (data) {
              $scope.classList=data.info
          })
      }
      setTimeout(function () {
          $scope.getData()
      },500)
    $scope.goDetail=function(item){
         goto_view('i010?id='+item.course_id)
    }
})