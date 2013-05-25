//get_location = function () {
//    if (navigator.geolocation) {
//        var timeoutVal = 10 * 1000 * 1000;
//        navigator.geolocation.watchPosition(
//            displayPosition(),
//            displayError(),
//            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
//        );
//    }
//    else {
//        alert("Geolocation is not supported by this browser");
//    }
//};
//function displayPosition(position) {
//    alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
//}
//
//setPosition = function (position) {
//    Session.set("location", {"latitude": position.coords.latitude, "longitude": position.coords.longitude});
//};
//displayError = function () {
//    var errors = {
//        1: 'Permission denied',
//        2: 'Position unavailable',
//        3: 'Request timeout'
//    };
//    alert("Error: " + errors[error.code]);
//};