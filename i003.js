iweb.controller('i003', function($scope,fileReader) {
    $scope.tabIndex=1
    $scope.header=''
    $scope.userInfo={}
    $scope.classList=[]
    $scope.regionData={
        areaprovince:undefined,
        areacity:undefined,
        areacounty:undefined
    }
    $scope.regionList= {
        province: [],
        city: [],
        county: []
    }
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
    $scope.formatRegion=function(type,parameter,action){
        if(type==='province') {
            ajax({
                obj: 'user',
                act: 'provincecity',
                type,
                parameter

            }, function (data) {
                $scope.regionList.province = data.info
                $scope.regionList.city=[]
                $scope.regionList.county=[]

            })
        }
        if(type==='city'){
            ajax({
                obj: 'user',
                act: 'provincecity',
                type,
                parameter
            },function (data) {
                $scope.regionList.city=data.info
                if(action){
                    $scope.regionData.areacity=undefined
                    $scope.regionData.areacounty=undefined
                }

                $scope.regionList.county=[]

            })
        }
         if(type==='county'){
             ajax({
                 obj:'user',
                 act:'provincecity',
                 type,
                 parameter

             },function (data) {
                 $scope.regionList.county=data.info
                 if(action){
                     $scope.regionData.areacounty=undefined
                 }
             })
         }



        }
    $scope.setClass=function(id){
        $scope.userInfo.class_id=id
    }
    $scope.getData=function () {
        // if(apiconn.conn_state==='IN_SESSION'){
            ajax({
                obj:'user',
                act:'readmyinfo',
            },function (data) {
                $scope.userInfo=data.info
                if(data.info.areaprovince){
                    $scope.formatRegion('city',data.info.areaprovince)
                    $scope.formatRegion('county',data.info.areacity)
                }
                $scope.regionData={
                    areaprovince:data.info.areaprovince,
                    areacity:data.info.areacity,
                    areacounty:data.info.areacounty
                }
            })
            ajax({
                obj:'user',
                act:'classlist',
            },function (data) {
                $scope.classList=data.info
            })
            $scope.formatRegion('province','province')
        // }
    }
    $scope.setData=function(){
        ajax(Object.assign({obj:'user',act:'setmyinfo'},$scope.userInfo,{name:$scope.userInfo.realname,fid:$scope.userInfo.headfid,classid:$('#level').val()},$scope.regionData),function () {
            layer.msg('修改成功',{icon:1})
        })
    }
    setTimeout(function () {
        $scope.getData()
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData()
        }
    })
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
        if (jo.obj == "user" && jo.act == "provincecity" && !jo.ustr) {
            console.log(jo,'sssssssssssssssssssssssssssssssssssssssssss')
        }
    });
})