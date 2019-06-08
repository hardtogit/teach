iweb.controller('i200', function($scope) {

    // $scope.loginAction=function (id){
    //     goto_view("index_home?id="+id);
    // }
    // $scope.getData=function (login_name,login_pwd) {
    //     if(apiconn.conn_state==='IN_SESSION'){
    //         ajax({
    //             obj:'user',
    //             act:'login',
    //             type:'login',
    //             ctype:'h5',
    //             login_name:login_name,
    //             code:login_pwd
    //         },function (data) {
    //             $scope.subjectList=data.info
    //             PageObject({appendId:'i004page',currNum:1,pageCount:3,callback:function (current) {
    //                     $scope.openPage(current-1)
    //                 }})
    //         })
    //     }
    // }
    // $scope.openPage=function(current){
    //     ajax({
    //         obj:'user',
    //         act:'mycourselist',
    //         content:$scope.tabIndex,
    //         page_num:current,
    //         page_size:2
    //     },function (data) {
    //         $scope.subjectList=data.info
    //     })
    // }
    // $scope.loginAction(id:'index_home')
    // $scope.$on("STATE_CHANGED_HANDLER", function() {
    //     $scope.getData('17326103988',,login_pwd:'123456')
    // })

})
