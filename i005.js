iweb.controller('i005', function($scope,$routeParams) {
    $scope.tabIndex=1
    $scope.subject={}
    $scope.changeTab=function (tabIndex) {
        this.tabIndex=tabIndex
    }
    $scope.toLive =function(url,talk,status,live,entity){
        if(status==='false'){
            if(live){
                layer.msg('开课前10分钟开放课堂',{icon:0})
            }else{
                layer.msg('视频未上传',{icon:0})
            }
            return
        }
        if (live){
            url=url.replace('rtmp://','http://')
            url=url.split('?')[0]+'.m3u8&'+url.split('?')[1]

            window.open('#/i101?m3u8='+url+'&talk='+talk+'&live=true&courseid='+entity.courseid+'&watchid='+entity.watchid,'_blank');
        }else{
            window.open('#/i101?mp4='+url+'&talk='+talk+'&live=false','_blank');
        }
        // var liveUrl = "#/i101?gid=o15598664532377779483&u=rtmp://dev.pull.live.121tongbu.com/live/XtbjfRaUg49D2kWcR2&s=true";
        // window.open(liveUrl,'_blank');
    }
    $scope.toExam=function (item) {
        if(item.watchexam==='false'){
            layer.msg('练习未布置',{icon:0})
            return
        }
        goto_view('i008?id='+item.watchexamid)
    }

    if(apiconn.conn_state==='IN_SESSION'){
        ajax({obj:'user',act:'mycoursedetail',course_id:$routeParams.id},function (data) {
            $scope.subject=data.info
        })
    }
    setTimeout(function () {
        ajax({obj:'user',act:'mycoursedetail',course_id:$routeParams.id},function (data) {
            $scope.subject=data.info
        })
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            ajax({obj:'user',act:'mycoursedetail',course_id:$routeParams.id},function (data) {
                $scope.subject=data.info
            })


        }
    })

})