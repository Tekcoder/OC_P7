"use strict"

//function to initialize the map within the div with an id of 'map'
//Takes the user loc as parameter to center the map around that loc
function initMap(myLatLng) {
	let mymap = new google.maps.Map(document.getElementById('map'))
	let initialLocation = new google.maps.LatLng(myLatLng.lat, myLatLng.lng)
	mymap.setCenter(initialLocation);
	mymap.setZoom(13);
	//Optional circle feature
	//SetRadius(mymap, myLatLng.lat, myLatLng.lng)
	let marker = new google.maps.Marker({
		position: myLatLng,
		map: mymap,
		title: 'This is my position',
		icon: {
			url: '../img/position-icon.png',
			scaledSize: new google.maps.Size(55, 55)
		},
		animation: google.maps.Animation.DROP
	})
	return mymap
}

// To set the radius, you need the map you initialized and the 
// latitude and longitude around which you want to center the radius
// this function is a bonus. It's currently not used.
function setRadius(mymap, latitude, longitude){
	//use of google maps Circle class to draw the radius
	let circle = new google.maps.Circle({
		map: mymap,
		center: new google.maps.LatLng(latitude, longitude),
		radius: 2000 //meters (so 2KM)
	})
}
