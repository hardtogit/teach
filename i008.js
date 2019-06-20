iweb.controller('i008', function($scope,$routeParams) {
    $scope.question={}
    $scope.history={}
    $scope.doing=false
    $scope.showAnswer=false
    $scope.flag=false
    $scope.name=''
    $scope.number=''
    $scope.answer={
        A:false,
        B:false,
        C:false,
        D:false,
        // E:false
    }
    $scope.choice=function(answer){
        $scope.answer={
            A:false,
            B:false,
            C:false,
            D:false,
            // E:true
        }
        if(answer==='不会'){
            $scope.answer={
                A:false,
                B:false,
                C:false,
                D:false,
                // E:true
            }
        }else{
            $scope.answer[answer]=!$scope.answer[answer]
            // $scope.answer.E=false
        }
    }
    $scope.submit=function(){
        var an=$scope.answer.A?'A':$scope.answer.B?'B':$scope.answer.C?'C':$scope.answer.D?'D':''
        ajax({
            obj:'user',
            act:'examdo',
            exam_id:$routeParams.id,
            exams_id:$scope.number,
            exams_answer:an

        },function (data) {
            $scope.showAnswer=true
            $scope.flag=$scope.question.answer===an
            if(data.info.exam_next===0){
                $scope.number=data.info.exam_next
                // layer.msg('题已全部答完',{icon:2})
                // goto_view('i015')
            }else{
                $scope.number=data.info.exam_next
            }

            console.log(data,'aaaaaaaaaaaaaaaaaaaa')
        })
    }
    $scope.startAnswer=function(){
        $scope.doing=true
        $scope.getQuestion()


    }
    $scope.getQuestion=function(){
        $(window).scrollTop(0);
        $scope.showAnswer=false
        $scope.answer={
            A:false,
            B:false,
            C:false,
            D:false,
            // E:false
        }
        if($scope.number===0){
            window.location.reload()
            return
        }
        ajax({
            obj:'user',
            act:'examread',
            exam_id:$routeParams.id,
            number:$scope.number
        },function (res) {
            $scope.question=res.info
        })
    }
    $scope.getData=function () {
        // user examstatus
        ajax({
            obj:'user',
            act:'examstatus',
            exam_id:$routeParams.id

        },function (data) {
            $scope.name=data.info.content_name
            $scope.number=data.info.exam_next
            $scope.history=data.info
        })

    }
    setTimeout(function () {
        $scope.getData()
    },500)
    $scope.$on("STATE_CHANGED_HANDLER", function () {
        if (apiconn.conn_state === 'IN_SESSION') {
            $scope.getData()
        }
    })
})
iweb.filter('showAsHtml',function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
})