iweb.controller('subjectSide', function($scope,$route) {
   $scope.path=$route.current.$$route.originalPath
        $scope.objInfo={}
        $scope.loginName=''
        $scope.code=''
        $scope.loginFlag=false
        $scope.time='发送验证码'
        $scope.getData=function () {
            if(apiconn.conn_state==='IN_SESSION'){
                ajax({
                    obj:'user',
                    act:'readmyinfo',
                })
            }
        }
        $scope.showLogin=function(){
           $scope.loginFlag=true
        }
        $scope.hiddenLogin=function(){
           $scope.loginFlag=false
        }
        $scope.count=function(){
            if($('#sendCode').html()!=='发送验证码'){
                return
            }
            console.log('s')
            var time=60
            var sub=function () {
                if(time>0){
                    setTimeout(function(){
                        time=time-1
                        $('#sendCode').html(time+'s')
                        sub()
                    },1000)

                }else{
                    $('#sendCode').html('发送验证码')
                }
            }
            sub()
        }

        $scope.sendCode=function(){
            window.ajax({obj:"user",act:"getcode",phone:$('#loginName').val(),type:"login"},function (data) {
                    layer.msg('发送成功')
                    $scope.count()
            })
        }
        $scope.login=function(){
            apiconn.loginx({"login_name":$('#loginName').val(),"code":$('#code').val(),"ctype":"h5"})
        }
        $scope.logOut=function(){
                sessionStorage.removeItem("login_name");
                sessionStorage.removeItem("login_passwd");
                sessionStorage.removeItem("credential_data");
                apiconn.logout();
        }
    $scope.setClass=function(class_id){
       $scope.userInfo.class_id=class_id
    }
        $scope.getData()
        $scope.$on("STATE_CHANGED_HANDLER", function() {
            if(apiconn.conn_state==='IN_SESSION'){
                $scope.loginFlag=false
                $scope.getData()
            }
        })
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
        if (jo.obj == "user" && jo.act == "readmyinfo" && !jo.ustr) {
            // setTimeout(function () {
                $scope.objInfo=jo.info
            // },2000)

        }
    });
})