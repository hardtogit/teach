iweb.controller('i101',function($scope){
	$(function() {
			var player = new TcPlayer('i101-video', {
				"rtmp": "rtmp://58.200.131.2:1935/livetv/hunantv",
				"m3u8": "http://2157.liveplay.myqcloud.com/2157_358535a.m3u8",
				"flv": "http://2157.liveplay.myqcloud.com/live/2157_358535a.flv", //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
				"autoplay": true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
				"poster": "http://www.test.com/myimage.jpg",
				"height": '930' //视频的显示高度，请尽量使用视频分辨率高度
			});
			$.playBar.Stop();
			$.playBar.addBar($('#i101-progress'), 1000 * (player.duration()?player.duration():0)); //第一个参数是需要显示播放器的容器，第二个参数为时间，单位毫秒
			$.playBar.changeBarColor("#72dfff"); //设置进度条颜色
			$("#i101-qp").click(function() {
				player.fullscreen(true)
			})
			$("#i101-play").click(function(){
				if(player.playing()){
					$.playBar.Stop();
					/*$(this).removeClass("glyphicon-play")
					$(this).addClass("glyphicon-stop");*/
					
				}else{
					$.playBar.Begin();
					/*$(this).removeClass("glyphicon-stop")
					$(this).addClass("glyphicon-play");*/
				}
				player.togglePlay()
			});
			
		})
})
