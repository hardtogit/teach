iweb.controller('i101',function($scope,$routeParams){
    $scope.ctrlScope = $scope
	$scope.live = ($routeParams.live=='true')?true:false;
	$scope.talk_id ="";
	$scope.header_id = "o15598664532377779483";
	$scope.messages = [];
	$scope.message=''
	$scope.userInfo = {};
	$scope.send = function(){
		ajax({
			obj: "message",
			act: "group_send",
			header_id : $scope.header_id,
			mtype : "text",
			content : $scope.message
		},function(data){
			$scope.messages.push({
				mtype: "text",
				content : $scope.message,
				from_name : $scope.userInfo.display_name
			})
            setTimeout(function(){
                $(".i101-talk-content").scrollTop(100000000);
            },100)
            $scope.message=''
			//$(".i101-talk-content").scrollTop($('.i101-talk-content')[0].scrollHeight);
		})
	}

    $scope.initPlayer=function () {
        function getPathParams() {
            var path = location.pathname.split('/');
            if (path[1] == 'vod-player') {
                return {
                    'path': location.origin + path.slice(0, 4).join('/'),
                    'appid': path[2],
                    'fileid': path[3]
                }
            } else {
                return null;
            }
        }

        var rtmp = $routeParams.rtmp,
            flv = $routeParams.flv,
            m3u8 = $routeParams.m3u8,
            mp4 =  $routeParams.mp4,
            live = ($routeParams.live=='true')?true:false ,
            coverpic = $routeParams.coverpic,
            // width = getParams('width') $routeParams,
            // height = getParams('height') $routeParams,
            // volume = getParams('volume') $routeParams,
            // flash = (getParams('flash') == 'true' ? true : false),
            // x5_player = (getParams('x5_player') == 'false' ? false : true),
            // h5_flv = (getParams('h5_flv') == 'true' ? true : false),
            autoplay = ($routeParams.autoplay=='true')?true:false,
            flashUrl = (function () {
                var params = getPathParams();
                if (params) {
                    return params.path + '/player/release/QCPlayer.swf';
                }
                return '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf'
            })()
            // log = getParams('log');

        console.log(live,'aaaaaaaaaaaaaaaaaaaaaaaa')
        /**
         * 视频类型播放优先级
         * mobile ：m3u8>mp4
         * PC ：RTMP>flv>m3u8>mp4
         */

        var options = {
            // rtmp:'rtmp://dev.pull.live.121tongbu.com/live/LNqsiWkiKS6epPd1lt',
            m3u8:'http://dev.pull.live.121tongbu.com/live/LNqsiWkiKS6epPd1lt.m3u8',
            // m3u8: m3u8 || 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/cc9f922c5285890781386012275/v.f220.m3u8',
            // mp4: mp4 || 'https://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4',
            autoplay: true,
            live: true,
            width:  '860',
            height:  '572',
            volume:  0.5,
            // flash:true,
            // flash: flash,
            // flashUrl: '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf',
            // x5_player: x5_player,
            // h5_flv: h5_flv,
            wording: {
                2032: '请求视频失败，请检查网络',
                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
            },
            listener: function (msg) {

            }
        };
        window.tcplayer = new TcPlayer('video-container', options);
    }
    $scope.initPlayer()
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
                $scope.getMessages()
            });
            // getMessages();
        }
      }
      setTimeout(function () {
          $scope.getData()
      },500)

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
    $scope.getMessages=function(){
    		ajax({
            	obj:'message',
            	act:'group_get',
            	header_id:$scope.header_id
           },function(data){
            	if (data.info.entries.length > 0){
            		$scope.messages=data.info.entries;
            		setTimeout(function(){
                        $(".i101-talk-content").scrollTop(100000000);
                    },100)
            	}
            })
    }
})
