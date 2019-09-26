//In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var all_locations = [];
var flightPath = null;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: {lat: -34.397, lng: 150.644},
  mapTypeId: 'terrain'
});
google.maps.event.addListener(map, "click", function(event) {
                // get lat/lon of click
                var clickLat = event.latLng.lat();
                var clickLon = event.latLng.lng();

                  var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(clickLat,clickLon),
                        map: map
                     });
                    var x = {
                        lat: clickLat,
                        lng: clickLon
                    }
                    markers.push(marker);
                    all_locations.push(x);

            });
// Adds a marker at the center of the map.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(pos);
    addMarker(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos){
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn’t support geolocation.');
infoWindow.open(map);

}


// Adds a marker to the map and push to the array.
function addMarker(location) {
var marker = new google.maps.Marker({
  position: location,
  map: map
});

markers.push(marker);
all_locations.push(location);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(map);
}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
setMapOnAll(null);
//polyline.setMap(null);
}
// Draw path for the markers from the map, but keeps them in the array.
function drawMarkers() {
    if(flightPath){
	flightPath.setMap(null);
}

flightPath = new google.maps.Polyline({
  path: all_locations,
  geodesic: true,
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 2
});

flightPath.setMap(map);

}


// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
clearMarkers();
markers = [];
all_locations = [];
flightPath.setMap(null);
}

function fetchMarkers() {
clearMarkers();
markers = [];
if(flightPath){
	flightPath.setMap(null);
}     

     var journey = prompt("Please enter your journey name", "My Journey");

    $.ajax({
        url: "/fetch/"+journey+".json",
        type: 'post',
        data: journey,
        contentType: false,
        timeout: 6000,
        processData: false,
        success: function(response){
            all_locations = response;
            var marker;

            for (var i = 0; i < all_locations.length; i++) {

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(all_locations[i].lat, all_locations[i].lng),
                    map: map
                });
                markers.push(marker)
            }

            drawMarkers()

        },
    });



}


function saveMarkers() {
var journey = prompt("Please enter your journey name", "My Journey");
if (journey == null || journey == "") {
  txt = "User cancelled the prompt.";
} else {
  txt = "Hello " + journey + "! How are you today?";
}

var xhttp = new XMLHttpRequest(),
    dataToSend = all_locations;

xhttp.onreadystatechange = function(data) {
    if(xhttp.readyState === 4 && xhttp.status === 200) {
     alert(this.responseText);
  }

};

dataToSend = JSON.stringify(dataToSend);
xhttp.open("POST", "/save/"+journey+".json", true)
xhttp.setRequestHeader("Content-type", "application/json")
xhttp.send(dataToSend);


}
