// Based on AngularJS 1.4.2

var IWEB_ACCOUNT    = "test2";
var TOOLBOX_ACCOUNT = "test1";

var iweb = angular.module('iweb', ['ngRoute']);

iweb.config(['$routeProvider',
  	function($routeProvider) {

    		$routeProvider.
      		when('/i000', {
    			templateUrl: 'i000.html',
    			controller: 'i000'
      		}).
      		when('/i072', {
    			templateUrl: 'i072.html',
    			controller: 'i072'
      		}).
      		when('/i001', {
    			templateUrl: 'i003.html',
    			controller: 'i003'
      		}).
      		when('/main', {
    			templateUrl: 'main.html',
    			controller: 'main'
      		}).
			when('/i002', {
				templateUrl: 'i002.html',
				controller: 'i002'
			}).
            when('/i003', {
                templateUrl: 'i003.html',
                controller: 'i003'
            }).
            when('/i004', {
                templateUrl: 'i004.html',
                controller: 'i004'
            }).
      		otherwise({
    			redirectTo: '/main'
      		});
}]);

// save a handle to the $rootScope obj
var rootScope;
var callBackFn={}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function goto_view(v) {
  	var baseUrl = window.location.href;
	baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
	window.location.href = baseUrl + "#/" + v;
}

function logout() {
	sessionStorage.setItem("login_name", "");
	sessionStorage.setItem("login_passwd", "");
	apiconn.logout();
}

var apiconn = new APIConnection();
window.ajax=function(params,cb){
	if(cb){
		callBackFn[params.obj+'_'+params.act]=cb
	}
    apiconn.send_obj(params)
}
apiconn.client_info.clienttype = "web";

apiconn.state_changed_handler = function() {
	rootScope.$apply(function() {

		console.log("state: "+apiconn.from_state+" => "+apiconn.conn_state);


		if (apiconn.conn_state == "IN_SESSION") {

			sessionStorage.setItem("login_name", apiconn.login_name);
			sessionStorage.setItem("login_passwd", apiconn.login_passwd);



		} else if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {

			// auto re login after page refresh

			if (apiconn.login_name == "" && apiconn.credential_data == null) {

				var login_name = sessionStorage.getItem("login_name");
	            		var login_passwd = sessionStorage.getItem("login_passwd");

				var cred = sessionStorage.getItem("credential_data");
				var cred_obj = null;
				if (cred !== "") cred_obj = JSON.parse(cred);

				// reset stored cred to prevent infinite loop in case of failure
				sessionStorage.setItem("login_name", "");
				sessionStorage.setItem("login_passwd", "");
				sessionStorage.setItem("credential_data", "");

				if (login_name != "" && login_name != null) {
	                		apiconn.login(login_name, login_passwd);

				} else if (cred_obj != null) {
	                		apiconn.loginx(cred_obj);

				} else {
				}
			}

		}

		rootScope.$broadcast("STATE_CHANGED_HANDLER", {});
	});
};

apiconn.response_received_handler = function(jo) {
    if(callBackFn[jo.obj+'_'+jo.act]){
        callBackFn[jo.obj+'_'+jo.act](jo)
	}
	rootScope.$apply(function() {

		if (jo.ustr != null && jo.ustr != "" && jo.uerr != "ERR_CONNECTION_EXCEPTION") alert(jo.ustr);

		if (jo.obj == "person" && jo.act == "login" && jo.user_info && jo.server_info) {
			// goto_view("i001");
		}
		if (jo.obj == "person" && jo.act == "logout") {
			goto_view("main");
			return;
		}

		// $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {}
		if (jo.obj == "sdk" && jo.act == "switchreq") {
			return goto_view(jo.ixxx);
		}

		rootScope.$broadcast("RESPONSE_RECEIVED_HANDLER", jo);
	});
};

apiconn.wsUri = "ws://39.108.219.7:51717/znyx";
setTimeout(()=>{
    window.ajax({obj:"user",act:"getcode",phone:"17326103988",type:"login"},function (data) {
        apiconn.loginx({"login_name":"17326103988","code":"123456","ctype":"h5"})
    })
},3000)

iweb.run(['$rootScope', function ($rootScope) {
	$rootScope.$on("$routeChangeSuccess", function(angularEvent, current, previous) { //
		if(current.controller=="main"){
			$rootScope.showMenu = false;
		}else{
			$rootScope.showMenu = true;
		}
	 });

	rootScope = $rootScope;
	apiconn.connect();

}]);


