iweb.controller('i003', function($scope) {
    $scope.tabIndex=1
    $scope.formObj={
        realName:'王俊凯'
    }

    $scope.submit=function () {
        console.log($scope.formObj)
    }
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
})