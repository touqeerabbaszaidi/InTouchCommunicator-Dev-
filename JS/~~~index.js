function initPushwoosh()
{
    //alert("Init-push");
	var pushNotification = window.plugins.pushNotification;
	pushNotification.onDeviceReady();

	document.addEventListener('push-notification', function(event) {
   	                            var title = event.notification.title;
   	                            var userData = event.notification.userdata;

   	                            if(typeof(userData) != "undefined") {
   									console.warn('user data: ' + JSON.stringify(userData));
   								}
								//alert("Title: " + title);
   								navigator.notification.alert(title);
   								var splitted = title.split("~");
   								//alert("Index Js Type: " + splitted[0]);
   								//alert("Index Js SchoolId: " + splitted[2]);
								window.location.href = "index.html?type="+splitted[0]+"&schoolId="+splitted[2]+"";
   								pushNotification.stopGeoPushes();
   							  });
}

function registerPushwoosh(email)
{
//alert("email: "+email);
	var pushNotification = window.plugins.pushNotification;
	//alert("pushNotification: "+pushNotification);
	//projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
	pushNotification.registerDevice({ projectid: "301388285624", appid: "3913D-FBE0C" },
									function(token) {
										//alert("RegistrationID: "+token);
										InsertPushToken(email,token);
										//alert("Inserted Successfully.");
										onPushwooshInitialized(token);
									},
									function(status) {
										alert("failed to register: " +  status);
									    console.warn(JSON.stringify(['failed to register ', status]));
									});
}

function unregisterPushwoosh()
{
	var pushNotification = window.plugins.pushNotification;
	pushNotification.unregisterDevice(function(token) {
										alert("unregistered, old token " + token);
									},
									function(status) {
										alert("failed to unregister: " +  status);
									    console.warn(JSON.stringify(['failed to unregister ', status]));
									});
}

function InsertPushToken(email,token) {
            //alert("Email: " + email);
            //alert("Token: " + token);
            $.ajax({
                url: 'http://projectxmobile.2bvision.com/WebService.asmx/InsertPushTokenAndroid',
                //url: 'WebService.asmx/InsertPushTokenAndroid',
                type: 'POST',
                data: "{'PushToken': '" + token + "','Email': '" + email + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    //alert("Details Updated Successfully!");
                },
                failure: function (errMsg) {
                    alert("Something Went Wrong!");
                }
            });
        }

//set the settings for Pushwoosh or set tags, this must be called only after successful registration
function onPushwooshInitialized(pushToken)
{
	//output the token to the console
	console.warn('push token: ' + pushToken);

	var pushNotification = window.plugins.pushNotification;
	
	pushNotification.getTags(function(tags) {
							console.warn('tags for the device: ' + JSON.stringify(tags));
						 },
						 function(error) {
							console.warn('get tags error: ' + JSON.stringify(error));
						 });
	 

	//set multi notificaiton mode
	//pushNotification.setMultiNotificationMode();
	
	//set single notification mode
	//pushNotification.setSingleNotificationMode();
	
	//disable sound and vibration
	//pushNotification.setSoundType(1);
	//pushNotification.setVibrateType(1);
	
	pushNotification.setLightScreenOnNotification(false);
	
	//goal with count
	//pushNotification.sendGoalAchieved({goal:'purchase', count:3});
	
	//goal with no count
	//pushNotification.sendGoalAchieved({goal:'registration'});

	//setting list tags
	//pushNotification.setTags({"MyTag":["hello", "world"]});
	
	//settings tags
	pushNotification.setTags({deviceName:"hello", deviceId:10},
									function(status) {
										console.warn('setTags success');
									},
									function(status) {
										console.warn('setTags failed');
									});
		
	function geolocationSuccess(position) {
		pushNotification.sendLocation({lat:position.coords.latitude, lon:position.coords.longitude},
								 function(status) {
									  console.warn('sendLocation success');
								 },
								 function(status) {
									  console.warn('sendLocation failed');
								 });
	};
		
	// onError Callback receives a PositionError object
	//
	function geolocationError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}
	
	function getCurrentPosition() {
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
	}
	
	//greedy method to get user position every 3 second. works well for demo.
//	setInterval(getCurrentPosition, 3000);
		
	//this method just gives the position once
//	navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
		
	//this method should track the user position as per Phonegap docs.
//	navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });

	//Pushwoosh Android specific method that cares for the battery
	pushNotification.startGeoPushes();
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    alert("DEvice is ready");
        //var uuid=device.uuid;
        //alert(" DEvice ID: " +uuid);
        initPushwoosh();
        app.receivedEvent('deviceready');
        
        //optional: create local notification alert
        //var pushNotification = window.plugins.pushNotification;
	//pushNotification.clearLocalNotification();
	//pushNotification.createLocalNotification({"msg":"message", "seconds":30, "userData":"optional"});

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
