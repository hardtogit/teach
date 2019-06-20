iweb.controller('i101', function ($scope, $routeParams) {

    $scope.ctrlScope = $scope
    $scope.live = ($routeParams.live == 'true') ? true : false;
    $scope.talk_id = "";
    $scope.header_id = "o15598664532377779483";
    $scope.messages = [];
    $scope.message = ''
    $scope.userInfo = {};

    window.visibilitychangeCall = function () {
        var state = document.visibilityState;
        if (state == "hidden") {
            //离开选项卡
            updateZhuanzhu("不专注");
        } else if (state == "visible") {
            //返回选项卡
            updateZhuanzhu("专注");
        }
        console.log("切换", document.visibilityState);
    }
    if ($scope.live) {
        function updateZhuanzhu(type) {
            if (location.hash.match("/i101?")) {
                //专注度接口  user updatestatus 数据采集 # 38 直播数据采集 TOP↑
                ajax({
                    obj: 'user',
                    act: 'updatestatus',
                    courseid: $routeParams.courseid, //课程id   p_user_coursetable 的 courseid
                    watchid: $routeParams.watchid, //子课程id  p_user_coursetable的 watchid
                    time: parseInt(Date.now() / 1000), //unix时间戳
                    status: type, //专注，不专注，离线
                }, function (data) {

                });
            }
        }
        if (!window.isjiantong) {
            window.isjiantong = true;
            document.addEventListener("visibilitychange", window.visibilitychangeCall, false);
        }
    }


    $scope.send = function () {
        ajax({
            obj: "message",
            act: "group_send",
            header_id: $routeParams.talk,
            mtype: "text",
            content: $scope.message
        }, function (data) {
            $scope.messages.push({
                mtype: "text",
                content: $scope.message,
                from_name: $scope.userInfo.display_name
            })
            setTimeout(function () {
                $(".i101-talk-content").scrollTop(100000000);
            }, 100)
            $scope.message = ''
            //$(".i101-talk-content").scrollTop($('.i101-talk-content')[0].scrollHeight);
        })
    }

    $scope.initPlayer = function () {
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
            m3u8 = $routeParams.m3u8 + '?txSecret=' + $routeParams.txSecret + '&txTime=' + $routeParams.txTime,
            mp4 = $routeParams.mp4,
            live = ($routeParams.live == 'true') ? true : false,
            coverpic = $routeParams.coverpic,
            // width = getParams('width') $routeParams,
            // height = getParams('height') $routeParams,
            // volume = getParams('volume') $routeParams,
            // flash = (getParams('flash') == 'true' ? true : false),
            // x5_player = (getParams('x5_player') == 'false' ? false : true),
            // h5_flv = (getParams('h5_flv') == 'true' ? true : false),
            autoplay = ($routeParams.autoplay == 'true') ? true : false,
            flashUrl = (function () {
                var params = getPathParams();
                if (params) {
                    return params.path + '/player/release/QCPlayer.swf';
                }
                return '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf'
            })()
        // log = getParams('log');

        console.log(m3u8, 'aaaaaaaaaaaaaaaaaaaaaaaa')
        /**
         * 视频类型播放优先级
         * mobile ：m3u8>mp4
         * PC ：RTMP>flv>m3u8>mp4
         */

        var options = {
            // rtmp:'rtmp://play.live.121tongbu.com/live/EkDZ8JiUrx80YjGVeW',
            // m3u8:m3u8 ||'http://play.live.121tongbu.com/live/EkDZ8JiUrx80YjGVeW.m3u8',
            m3u8: m3u8,
            mp4: mp4,
            autoplay: true,
            live: $scope.live,
            width: '860',
            height: '572',
            volume: 0.5,
            // flash:true,
            // flash: flash,
            // flashUrl: '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf',
            // x5_player: x5_player,
            // h5_flv: h5_flv,
            wording: {
                2032: '请求视频失败，请检查网络',
                2048: '请求m3u8文件失败，可能是网络错误或者跨域问题',
                2: '直播还未开始，稍后刷新试试'
            },
            listener: function (msg) {

            }
        };
        window.tcplayer = new TcPlayer('video-container', options);
    }
    $scope.initPlayer()
    $scope.getData = function () {

        if (apiconn.conn_state === 'IN_SESSION') {
            ajax({
                obj: 'user',
                act: 'readmyinfo',
            }, function (data) {
                $scope.userInfo = data.info
                $scope.download_domain = apiconn.server_info.download_path
                $scope.regionData = {
                    areaprovince: data.info.areaprovince,
                    areacity: data.info.areacity,
                    areacounty: data.info.areacounty
                }
                $scope.getMessages()
            });
            // getMessages();
        }
    }
    setTimeout(function () {
        $scope.getData()
    }, 500)

    $scope.$on("STATE_CHANGED_HANDLER", function () {
        if (apiconn.conn_state === 'IN_SESSION') {
            $scope.getData()
        }
    })
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {


        if (jo.obj == "push" && jo.act == "message_group") {
            var msg = {
                mtype: jo.mtype,
                content: jo.content,
                from_name: jo.from_name,
                from_avatar: from_avatar
            }
            $scope.messages.push(msg);
        }
    });
    $scope.getMessages = function () {
        ajax({
            obj: 'message',
            act: 'group_get',
            header_id: $routeParams.talk
        }, function (data) {
            if (data.info.entries.length > 0) {
                $scope.messages = data.info.entries;
                setTimeout(function () {
                    $(".i101-talk-content").scrollTop(100000000);
                }, 100)
            }
        })
    }
})
