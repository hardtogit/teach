iweb.controller('i003', function($scope,fileReader) {
    $scope.tabIndex=1
    $scope.header=''
    $scope.userInfo={}
    $scope.classList=[]
    $scope.submit=function () {
        console.log($scope.formObj)
    }
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
    //上传照片
    $scope.uploadImage = function(ele){
        fileReader.openFile(function(jo){
            $scope.$apply(function(){
                $scope.userInfo[ele] = jo.fid;
            })
        });
    };
    $scope.getData=function () {
        if(apiconn.conn_state==='IN_SESSION'){
            ajax({
                obj:'user',
                act:'readmyinfo',
            },function (data) {
                $scope.userInfo=data.info
            })
            ajax({
                obj:'user',
                act:'organizelist',
            },function (data) {
                let arr=[]
                data.info.forEach(function (item) {
                   arr=arr.concat(item.datas)
                })
                $scope.classList=arr
            })
        }
    }
    $scope.setData=function(){
        ajax(Object.assign({obj:'user',act:'setmyinfo'},$scope.userInfo,{name:$scope.userInfo.realname}),function () {
            console.log('修改成功')
        })
    }
    $scope.getData()
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData()
        }
    })

})