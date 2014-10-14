
function initPushwoosh() {
    //alert("Init-push");
    var pushNotification = window.plugins.pushNotification;
    pushNotification.onDeviceReady();

    document.addEventListener('push-notification', function (event) {
        var title = event.notification;
       // alert(title.aps.alert);
        pushNotification.setApplicationIconBadgeNumber(+1);
       
        //if (typeof (userData) != "undefined") {
        //    console.warn('user data: ' + JSON.stringify(userData));
        //}
        //alert("Title: " + title);
        //navigator.notification.alert(title);
        var splitted = title.aps.alert.split("~");
        //alert("Index Js Type: " + splitted[0]);
       // alert("Index Js SchoolId: " + splitted[2]);
        window.location.href = "index.html?type=" + splitted[0] + "&schoolId=" + splitted[2] + "";
        pushNotification.stopGeoPushes();
    });
}


function registerPushwooshIOS(email) {
    var pushNotification = window.plugins.pushNotification;

    //push notifications handler
    document.addEventListener('push-notification', function (event) {
        var notification = event.notification;
      //  navigator.notification.alert(notification.aps.alert);

        //to view full push payload
        //navigator.notification.alert(JSON.stringify(notification));

        //reset badges on icon
        pushNotification.setApplicationIconBadgeNumber(+1);
    });

    pushNotification.registerDevice({ alert: true, badge: true, sound: true, pw_appid: "11479-94DE7", appname: "ITC Dev" },
									function (status) {
									    var deviceToken = status['deviceToken'];
									    //alert('registerDevice: ' + deviceToken);
									    InsertPushToken(email, deviceToken);
									    onPushwooshiOSInitialized(deviceToken);
									},
									function (status) {
									    console.warn('failed to register : ' + JSON.stringify(status));
									    navigator.notification.alert(JSON.stringify(['failed to register ', status]));
									});

    //reset badges on start
    pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken) {
    var pushNotification = window.plugins.pushNotification;
    //retrieve the tags for the device
    pushNotification.getTags(function (tags) {
        console.warn('tags for the device: ' + JSON.stringify(tags));
    },
							 function (error) {
							     console.warn('get tags error: ' + JSON.stringify(error));
							 });

    //start geo tracking. PWTrackSignificantLocationChanges - Uses GPS in foreground, Cell Triangulation in background. 
   // pushNotification.startLocationTracking('PWTrackSignificantLocationChanges',
	//								function () {
	//								    console.warn('Location Tracking Started');
	//								});
}


function InsertPushToken(email, deviceToken) {
    //alert("Email: " + email);
    //alert("Token: " + token);
    $.ajax({
        url: 'http://dev.mobile.intouchcommunicator.com/WebService.asmx/InsertPushTokenAndroid',
        //url: 'WebService.asmx/InsertPushTokenAndroid',
        type: 'POST',
        data: "{'PushToken': '" + deviceToken + "','Email': '" + email + "'}",
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



//function initPushwoosh() {
//   // alert("initpushwoosh");
//    var pushNotification = window.plugins.pushNotification;
//    //if (device.platform == "Android") {
//    //    registerPushwooshAndroid();
//    //    pushNotification.onDeviceReady();
//    //}

//    if (device.platform == "iPhone" || device.platform == "iOS") {
//        registerPushwooshIOS(email);
//        pushNotification.onDeviceReady();
//       // alert("initPW success");
//    }
//}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        initPushwoosh();
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};