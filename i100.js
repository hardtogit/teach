iweb.controller('i100', function($scope) {
	$scope.userInfo={}
	$scope.download_domain = '';
	$scope.items=[];
	var isWeek = true;
	var date = new Date();
	var week_text = ["周日","周一","周二","周三","周四","周五","周六"];
	var today = {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day : date.getDate(),
		week: week_text[date.getDay()]
	}
	var daytem = JSON.parse(JSON.stringify(today));
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
            var daylist = next_week();
            showCalendarAndItems(daylist,today);
        }
      }
	$(function(){
		panelRightCalendar();
	})
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
    $scope.goSelectClass=function(){
	 	goto_view('i002')
	}
	$("#i100-menu-list p").click(function(){
		$("#i100-menu-list p").removeClass("i100-menu-active");
		$(this).addClass("i100-menu-active");
	})
	$(".i100-calendar-content").on("click",".i100-date-item",function(){
		//加载数据
		var daytime = {
			year : $(this).data("year"),
			month: $(this).data("month"),
			day : $(this).data("day")
		}
		getICourseItems(daytime);
		daytem = daytime;
		daytem.week = week_text[new Date(daytem.year,daytem.month,daytem.day).getDay()];
		panelRightCalendar();

		$(".i100-date-item").find(".i100-date").removeClass("i100-select-day");
		$(this).find(".i100-date").addClass("i100-select-day");
	});
	//周还是月 默认是周
	$(".i100-show-week").click(function(){
		var month_list = [];
		if(isWeek){
			//展开
			$(this).text("收起");
			isWeek = false;
			month_list = getMonthList(next_month());
			$(".i100-days-day").addClass("i100-show-days");
			$(".i100-days-day-week").addClass("i100-show-days-week");
			$(".i100-days").addClass("i100-show-week-days");
		}else{
			//展开状态，关闭
			isWeek = true;
			$(this).text("展开");
			month_list = next_week();
			$(".i100-days-day").removeClass("i100-show-days");
			$(".i100-days-day-week").removeClass("i100-show-days-week");
			$(".i100-days").removeClass("i100-show-week-days");
		}

		showCalendarAndItems(month_list,daytem);

	});


	function showCalendarAndItems(daylist,date){
		var days = []
            for (var i = 0; i < daylist.length; i++) {
            	if(daylist[i].day){
	            	days.push(new Date(daylist[i].year,daylist[i].month-1,daylist[i].day).getTime()/1000);
            	}
            }
            ajax({
            	obj:'pc',
            	act:'coursetable',
            	dates:days,
            	day:new Date(date.year,date.month-1,date.day).getTime()/1000
            },function(data){
            	showCalendar(daylist,data.info.dates)
            	var items = data.info.day;
	        	if(items.length >0){
	        		$(".i100-unselect").addClass("i100-curs-hide");
					$(".i100-course-list").removeClass("i100-curs-hide");
	        		$scope.items = items;
	        	}else{
	        		$(".i100-course-list").addClass("i100-curs-hide");
					$(".i100-unselect").removeClass("i100-curs-hide");
	        	}
            })
	}
	function getICourseItems(date){
		//获取课表
        ajax({
        	obj:'pc',
        	act:'coursetable',
        	dates:[],
        	day:new Date(date.year,date.month-1,date.day).getTime()/1000
        },function(data){
        	var items = data.info.day;
        	if(items.length >0){
        		$(".i100-unselect").addClass("i100-curs-hide");
				$(".i100-course-list").removeClass("i100-curs-hide");
        		$scope.items = items;
        	}else{
        		$(".i100-course-list").addClass("i100-curs-hide");
				$(".i100-unselect").removeClass("i100-curs-hide");
        	}
        })
	}
	$(".i100-course-list").on("click",".i100-notstart",function(){
		alert("课程未开始")
	});
	$scope.getData()
    $scope.$on("STATE_CHANGED_HANDLER", function() {
        if(apiconn.conn_state==='IN_SESSION'){
            $scope.getData()
        }
    })
	$scope.pre = function (){
		var month_list = [];
		if(isWeek){
			month_list = prev();
		}else{
			month_list = getMonthList(prev());
		}
		showCalendarAndItems(month_list,daytem);

		panelRightCalendar();


	}
	$scope.nxt = function(){
		var month_list = [];
		if(isWeek){
			month_list = next();
		}else{
			month_list = getMonthList(next());
		}
		panelRightCalendar();
		showCalendarAndItems(month_list,daytem);
	}
	function getMonthList(res){
		var month_list = (new Array(res.firstweek-1)).fill({});
		for (var i = 1; i <= res.total; i++) {
			month_list.push({
				year : res.year,
				month: res.month,
				day : i,
				select : res.select == i
			});
		}
		return month_list;
	}
	function panelRightCalendar(){
		$scope.daytem = daytem;
		$scope.daytem.day = daytem.day>9?daytem.day:"0"+parseInt(daytem.day)
	}
	function showCalendar(list,markObj){
		$(".i100-calendar-content").html("");
		//发起请求获取当前月或当前7天有课程的标记
		for (var i = 0; i < list.length; i++) {
			var item = $("<div class='i100-date-item'><div>");
			var day = list[i];
			if(day.day){
				var data;
				if(today.day == day.day && day.month == today.month && day.year == today.year){
					data = $("<div class='i100-date'>今</div>")
				}else{
					if(day.day < 10){
						data = $("<div class='i100-date'>0"+day.day+"</div>")
					}else{
						data = $("<div class='i100-date'>"+day.day+"</div>")
					}
				}
				var timestamp = new Date(day.year,day.month-1,day.day).getTime()/1000;
				if(markObj && markObj[timestamp] === "true"){
					$(data).addClass("i100-is-mark");
					$(data).data("isMark",true);
				}

				if(day.select){
					$(data).addClass("i100-select-day");
				}
				$(item).data("month",day.month);
				$(item).data("year",day.year);
				$(item).data("day",day.day);

				$(item).append($(data));
			}

			$(".i100-calendar-content").append($(item));
		}

	}

	function prev() {
		if(isWeek) {
			for(var i = 0; i < 7; i++) {
				if(daytem.day == 1) {
					if(daytem.month == 1) {
						daytem.year--;
						daytem.month = 12;
					} else {
						daytem.month--;
					}
					daytem.day = new Date(daytem.year, daytem.month, 0).getDate();
				} else {
					daytem.day--;
				}
			}
			return next_week(daytem);
		} else {
			if(daytem.month == 1) {
				daytem.year--;
				daytem.month = 12;
			} else {
				daytem.month--;
			}
			return next_month(daytem);
		}

	}

	function next() {
		if(isWeek) {
			for(var i = 0; i < 7; i++) {
				if(daytem.day == 1) {
					if(daytem.month = 12) {
						daytem.year--;
						daytem.month == 1;
					} else {
						daytem.month--;
					}
					daytem.day = new Date(daytem.year, daytem.month, 0).getDate();
				} else {
					daytem.day--;
				}
			}
			return next_week(daytem);
		} else {
			if(daytem.month == 1) {
				daytem.year--;
				daytem.month = 12;
			} else {
				daytem.month--;
			}
			return next_month(daytem);
		}
	}

	function next() {
		if(isWeek) {
			for(var i = 0; i < 7; i++) {
				if(daytem.day == new Date(daytem.year, daytem.month, 0).getDate()) {
					if(daytem.month == 12) {
						daytem.year++;
						daytem.month = 1;
					} else {
						daytem.month++;
					}
					daytem.day = 1;
				} else {
					daytem.day++;
				}
			}
			return next_week(daytem);
		} else {
			if(daytem.month == 12) {
				daytem.year++;
				daytem.month = 1;
			} else {
				daytem.month++;
			}
			return next_month(daytem);
		}
	}

	function next_week(option) {
		var d = new Date();
		var opt = {
			//当前月
			month: d.getMonth() + 1,
			//当前年
			year: d.getFullYear(),
			//当前日
			day: d.getDate(),
			select: true
		}
		opt = $.extend(opt, option);

		opt.week = new Date(opt.year + "-" + opt.month + "-" + opt.day).getDay();

		var right = 0;
		if(opt.week != 0) {
			right = 7 - d.getDay();
		}

		var left = 7 - right - 1;
		var days = [opt];
		var left_day = opt.day;
		var left_month = opt.month;
		var left_year = opt.year;
		var right_day = opt.day;
		var right_month = opt.month;
		var right_year = opt.year;
		for(var i = left; i >= 1; i--) {
			if(left_day == 1) {
				if(left_month == 1) {
					left_year--;
					left_month = 12;
				} else {
					left_month--;
				}
				left_day = new Date(left_year, left_month, 0).getDate();
			} else {
				left_day--;
			}
			//判断当前日是否到了1号,到了1号前一天月份减1 天数改为前一个月的最后一天
			//判断当前月份是否是1月如果是1月,前一天的月份改成12月
			var week_day = {
				year: left_year,
				month: left_month,
				day: left_day,
				week: i
			}
			days.splice(0, 0, week_day);
		}
		var day_week = opt.week + 1;
		for(var i = 0; i < right; i++) {
			if(right_day == new Date(right_year, right_month, 0).getDate()) {
				if(right_month == 12) {
					right_year++;
					right_month = 1;
				} else {
					right_month++;
				}
				right_day = 1
			} else {
				right_day++;
			}

			var week_day = {
				year: right_year,
				month: right_month,
				day: right_day,
				week: day_week++
			}
			days.push(week_day)
		}
		return days;
	}
	//当前年月日
	function next_month(option) {
		var d = new Date();
		var opt = {
			//当前月
			month: d.getMonth() + 1,
			//当前年
			year: d.getFullYear()
		}
		opt = $.extend(opt, option);
		var result = {};

		result.year = opt.year;
		result.month = opt.month;

		result.total = new Date(opt.year, opt.month, 0).getDate();
		result.firstweek = new Date(opt.year, opt.month - 1, 1).getDay() == 0 ? 7 : new Date(opt.year, opt.month - 1, 1).getDay();
		result.select = daytem.day;

		return result;
	}
})
iweb.filter('showAsHtml',function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
})