iweb.controller('i101',function($scope){
	$scope.live = true;
	$scope.talk_id ="";
	$scope.header_id = "o15598664532377779483";
	$scope.messages = [];
	$scope.params = getParams();
	$scope.userInfo = {};
	$scope.send = function(){
		ajax({
			obj: "message",
			act: "group_send",
			header_id : $scope.params.gid,
			mtype : "text",
			content : $(".i101-input").text()
		},function(data){
			$scope.messages.push({
				mtype: "text",
				content : $(".i101-input").text(),
				from_name : $scope.userInfo.display_name
			})
			$(".i101-input").html("");
			//$(".i101-talk-content").scrollTop($('.i101-talk-content')[0].scrollHeight);
		})
	}
	
	var player;
	$scope.player = function(){
		if($scope.live){
				player = new TcPlayer('i101-video', {
				"rtmp": $scope.params.u,
				 //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
				"autoplay": true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
				"poster": "http://www.test.com/myimage.jpg",
				"height": '930' //视频的显示高度，请尽量使用视频分辨率高度
				});
			}else{
				player = new TcPlayer('i101-video', {
				"mp4": $scope.params.u,
				"autoplay": true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
				"poster": "http://www.test.com/myimage.jpg",
				"height": '930' //视频的显示高度，请尽量使用视频分辨率高度
				});
			}
			
			$.playBar.Stop();
			$.playBar.addBar($('#i101-progress'), 1000 * (player.duration()?player.duration():0)); //第一个参数是需要显示播放器的容器，第二个参数为时间，单位毫秒
			$.playBar.changeBarColor("#72dfff"); 
	}
	$scope.player()
	
	$scope.getData=function () {
		
        if(apiconn.conn_state==='IN_SESSION'){
        	ajax({
                obj:'user',
                act:'readmyinfo',
           },function (data) {
                $scope.userInfo=data.info
                $scope.download_domain = apiconn.server_info.download_path
                $scope.regionData={
                    areaprovince:data.info.areaprovince,
                    areacity:data.info.areacity,
                    areacounty:data.info.areacounty
                }
            });
            getMessages();
        }
      }
	$scope.getData()
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData()
        }
    })
	$scope.$on("RESPONSE_RECEIVED_HANDLER",function(event,jo){
		
		
		if(jo.obj == "push" && jo.act == "message_group" ){
   			var msg ={
   				mtype : jo.mtype,
   				content : jo.content,
   				from_name : jo.from_name,
   				from_avatar : from_avatar
   			}
			$scope.messages.push(msg);
		}
	});
    function getParams(){
    	var hash = location.hash+"";
    	var arr = hash.split("&");
    	var params = {};
    	for (var i = 0; i < arr.length; i++) {
    		var temp = arr[i];
    		
    		if(i==0){
    			temp = temp.split("?")[1];
    		}
    		
    		var arr2 = temp.split("=")
    		params[arr2[0]] = arr2[1];
    	}
    	$scope.live = params.s?eval(params.s):false;
    	params.u = decodeURI(params.u);
    	return params;
    }
    function getMessages(){
    		ajax({
            	obj:'message',
            	act:'group_get',
            	header_id:$scope.params.gid
           },function(data){
            	if (data.info.entries.length > 0){
            		$scope.messages.push.apply($scope.messages,data.info.entries);
            	}
            })
    }
    function getMessage(){
    	ajax({
            	obj:'message',
            	act:'group_get',
            	block_id:$scope.header_id
            },function(data){
            	if (data.info.entries.length > 0){
            		$scope.messages.push.apply($scope.messages,data.info.entries);
            	}
            	
            	$scope.header_id = $scope.messages[$scope.messages.length-1].block_id
            	//getMessage();
            })
    }
    

	$(function() {
			//设置进度条颜色
			$("#i101-qp").click(function() {
				player.fullscreen(true)
			})
			$("#i101-play").click(function(){
				if(player.playing()){
					$.playBar.Stop();
					$(this).find("i").html("&#xe62a;");
				}else{
					$.playBar.Begin();
					$(this).find("i").html("&#xe650;");
				}
				player.togglePlay()
			});
			
		})
})
