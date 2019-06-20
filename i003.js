iweb.controller('i003', function($scope,fileReader) {
    $scope.tabIndex=1
    $scope.header=''
    $scope.visible=false,
    $scope.userInfo={}
    $scope.classList=[]
    $scope.address={}
    $scope.regionData={
        areaprovince:undefined,
        areacity:undefined,
        areacounty:undefined
    }
    $scope.addressRegionData={
        areaprovince:undefined,
        areacity:undefined,
        areacounty:undefined
    }
    $scope.regionList= {
        province: [],
        city: [],
        county: []
    }
    $scope.addressRegionList= {
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
    $scope.show=function(){
        $scope.visible=true
    }
    $scope.hidden=function(){
        $scope.visible=false
    }
    $scope.save=function(){
        var mobileReg = /^1[0-9]\d{9}$/; // 手机号
        if(!mobileReg.test($scope.address.phone)){
            layer.msg('请输入正确的手机号',{icon:0})
            return
        }
        ajax(Object.assign($scope.address,{
            province:$scope.addressRegionData.areaprovince,
            city:$scope.addressRegionData.areacity,
            county:$scope.addressRegionData.areacounty,
            obj:'user',
            act:'setaddress'
        }),function () {
            layer.msg('操作成功',{icon:1})
            $scope.visible=false
            $scope.getData()
        })
    }
    $scope.formatRegion=function(type,parameter,action){
        if(type==='province') {
            ajax({
                obj: 'user',
                act: 'provincecity',
                type:type,
                parameter:parameter

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
                type:type,
                parameter:parameter
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
                 type:type,
                 parameter:parameter

             },function (data) {
                 $scope.regionList.county=data.info
                 if(action){
                     $scope.regionData.areacounty=undefined
                 }
             })
         }
        }
    $scope.formatAddressRegion=function(type,parameter,action){
        if(type==='province') {
            ajax({
                obj: 'user',
                act: 'provincecity',
                type:type,
                parameter:parameter

            }, function (data) {
                $scope.addressRegionList.province = data.info
                $scope.addressRegionList.city=[]
                $scope.addressRegionList.county=[]

            })
        }
        if(type==='city'){
            ajax({
                obj: 'user',
                act: 'provincecity',
                type:type,
                parameter:parameter
            },function (data) {
                $scope.addressRegionList.city=data.info
                if(action){
                    $scope.addressRegionList.areacity=undefined
                    $scope.addressRegionList.areacounty=undefined
                }

                $scope.addressRegionList.county=[]

            })
        }
        if(type==='county'){
            ajax({
                obj:'user',
                act:'provincecity',
                type:type,
                parameter:parameter

            },function (data) {
                $scope.addressRegionList.county=data.info
                if(action){
                    $scope.addressRegionList.areacounty=undefined
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
                $scope.address=angular.copy(data.info.address)
                $scope.addressRegionData={
                    areaprovince:$scope.address.province,
                    areacity:$scope.address.city,
                    areacounty:$scope.address.county
                }
                if(data.info.address.province){
                    $scope.formatAddressRegion('city',$scope.address.province)
                    $scope.formatAddressRegion('county',$scope.address.city)
                }
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
            $scope.formatAddressRegion('province','province')
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