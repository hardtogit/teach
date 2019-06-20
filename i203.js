
iweb.controller('i203', function($scope) {
    $scope.classList=[]
    $scope.bannerList=[]
    $scope.subjectList=[]
    $scope.subjectObj={}

    $scope.classCurrent='全部'
    $scope.subjectCurrent='全部'

    $scope.publicList=[]
    $scope.chargeList=[]
    $scope.getSubject=function(id){
        $scope.subjectCurrent='全部'
        $scope.classCurrent=id
        $scope.getClass()
        $scope.subjectObj.forEach(function (item) {
            if(item._id===id){
                $scope.subjectList=item.datas
            }
        })

    }
    $scope.selectSubject=function(id){
        $scope.subjectCurrent=id
        $scope.getClass()
    }
    $scope.getClass=function(){
        ajax({
            obj:'pc',
            act:'homepage',
            classid:$scope.classCurrent,
            id:$scope.subjectCurrent==='全部'?'':$scope.subjectCurrent,
            page_num:0,
            page_size:1000
        },function (data) {
            $scope.publicList=data.free
            $scope.chargeList=data.info
        })
    }
    $scope.bannerGo=function(value){
        if(value.linktype==='extenal'){
            window.open(value.link,'_blank')
        }else{
            goto_view('i010?id='+value.link)
        }
    }
    $scope.goDetail=function(item){
        if(item.number>1){
            goto_view('i009?name='+item.name+'&classid='+$scope.classCurrent+'&id='+item.id)
        }else{
            goto_view('i010?id='+item.course_id)
        }

    }
    $scope.goSelect=function(){
        goto_view('i002?classCurrent='+$scope.classCurrent+'&subjectCurrent='+$scope.subjectCurrent)
    }
    $scope.getData=function(){
        ajax({
            obj:'user',
            act:'organizelist'
        },function (data) {
            let arr=[]
            data.info.forEach(function (item) {
                arr=arr.concat(item.datas)
            })
            $scope.classList=arr
            $scope.classCurrent=arr[0]._id
            ajax({
                obj:'user',
                act:'claprolist'
            },function (data) {
                $scope.subjectObj=data.info
                $scope.subjectObj.forEach(function (item) {
                    if(item._id===arr[0]._id){
                        $scope.subjectList=item.datas
                    }
                })
            })
            $scope.getClass()
        })
        ajax({
            obj:'user',
            act:'bannertitle',
            location:'pc'
        },function (data) {
            $scope.bannerList=data.info.banner
        })
    }
    setTimeout(function () {
        $scope.getData()
    },500)


})
