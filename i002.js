/**
 * Created by sangcixiang on 16/8/20.
 */
iweb.controller('i002', function($scope,$routeParams) {
    $scope.classData=[]
    $scope.classList=[]
    $scope.subjectList=[]
    $scope.seasonList=[]
    $scope.timeList=['周一','周二','周三','周四','周五','周六','周日']
    $scope.durList=['上午','下午','晚上']
    $scope.classCurrent=''
    $scope.subjectCurrent=$routeParams.subjectCurrent?$routeParams.subjectCurrent:'全部'
    $scope.seasonCurrent='全部'
    $scope.timeCurrent='全部'
    $scope.durCurrent='全部'

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
    $scope.selectSeason=function(id){
        $scope.seasonCurrent=id
        $scope.getClass()
    }
    $scope.selectTime=function(id){
        $scope.timeCurrent=id
        $scope.getClass()
    }
    $scope.selectDur=function(id){
        $scope.durCurrent=id
        $scope.getClass()
    }
    $scope.goDetail=function(item){
        if(item.number>1){
            goto_view('i009?name='+item.name+'&classid='+$scope.classCurrent+'&id='+item.id)
        }else{
            goto_view('i010?id='+item.course_id)
        }

    }


    $scope.getClass=function(){
        ajax({
            obj:'pc',
            act:'select',
            classid:$scope.classCurrent,
            id:$scope.subjectCurrent==='全部'?'':$scope.subjectCurrent,
            seasonid:$scope.seasonCurrent==='全部'?'':$scope.seasonCurrent,
            week:$scope.timeCurrent==='全部'?'':$scope.timeCurrent,
            when:$scope.durCurrent==='全部'?'':$scope.durCurrent,
            page_num:0,
            page_size:12
        },function (data) {
            $scope.classData=data.info
        })
    }
    $scope.getData=function () {
        ajax({
            obj:'user',
            act:'organizelist'
        },function (data) {
            let arr=[]
            data.info.forEach(function (item) {
                arr=arr.concat(item.datas)
            })
            $scope.classList=arr
            $scope.classCurrent=$routeParams.classCurrent?$routeParams.classCurrent:arr[0]._id
            ajax({
                obj:'user',
                act:'claprolist'
            },function (data) {
                $scope.subjectObj=data.info
                $scope.subjectObj.forEach(function (item) {
                    if(item._id===$scope.classCurrent){
                        $scope.subjectList=item.datas
                    }
                })
            })
            $scope.getClass()
        })
        ajax({
            obj:'pc',
            act:'seasonlist'
        },function (data) {
            $scope.seasonList=data.info
        })

    }
    setTimeout(function () {
        $scope.getData()
    },500)

});
