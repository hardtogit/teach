iweb.controller('subjectSide', function($scope,$rootScope,$route,$routeParams) {
   $scope.path=$route.current.$$route.originalPath
        $scope.objInfo={}
        $scope.loginName=''
        $scope.code=''
        $scope.searchKey=$routeParams.searchKey
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
        $scope.goStudy=function(){
         $rootScope.validateLogin(function () {
             goto_view("i100")
         })
        }
        $scope.goSearch=function(e){
            if(e.charCode===13){
                goto_view('i016?searchKey='+$scope.searchKey)
            }
        }
        $rootScope.showLogin=function(){
           $scope.loginFlag=true
        }

        $rootScope.hiddenLogin=function(){
           $scope.loginFlag=false
        }
        $rootScope.validateLogin=function(callBack){
            if(apiconn.conn_state==='IN_SESSION'){
                callBack()
            }else{
                $rootScope.showLogin()
            }
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
    $(function () {
        $('#heardDown').popover({
            trigger:'hover',
            content:'<div><div style="display: inline-block;margin-right: 20px"><img src="./qr.png" width="77px" height="77px"/><div class="text-center">安卓下载</div></div><div style="display: inline-block;"><img src="./qr.png" width="77px" height="77px"/><div class="text-center">IOS下载</div></div></div>',
            html:true,
            placement:'bottom'
        })
    })
})