"use strict"

//Wait until the document is fully loaded before executing our JS code
// & first thing that happens is... we determine the user's location in order to
// display a map that is relevant to them.
window.onload = function(event){
	//geolocation API to determine the user's location
	navigator.geolocation.getCurrentPosition(function(position) {
		let myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude}
		main(myLatLng)
	},function(positionError) {
		//if we are unable to determine accurately the user's location, down below
		//is a default location
		let myLatLng = {lat: 45.2493312, lng: 5.822873599999999}
		main(myLatLng)
	})
}

