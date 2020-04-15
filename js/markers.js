"use strict"

// Initialized an array of markers to store all markers
// that may later appear on the map. There will be as many
// markers as there are restaurants.
function createMarkers(env) {
	let markers = new Array()
	//env.restaurants.length being our list of restaurants
	for (let i = 0; i < env.restaurants.length; i++) {
		let marker = makeMarker(env, i)
		markers.push(marker)
	}
	return markers
}

//time to display all restaurants on the map
function makeMarker(env, i){
	let marker = new google.maps.Marker({
		position: env.restaurants[i].loc,
		map: env.map,
		animation: google.maps.Animation.DROP
	})
	let infowindow = new google.maps.InfoWindow();
	let content = document.createElement("div");
	let restaurantName = document.createElement("div");
	restaurantName.innerHTML = env.restaurants[i].name
	content.appendChild(restaurantName);
	// if there is a picture to display, it'll be shown.
	// Otherwise the user will only be able to see the name of the
	// restaurant within the infowindow / popup
	if (env.restaurants[i].picture !== null){
		let streetview = document.createElement("div");
		let picture = document.createElement('img')
		picture.src = env.restaurants[i].picture
		streetview.style.width = "200px";
		streetview.style.height = "200px";
		picture.style.width = "200px"
		picture.style.height = "200px"
		streetview.appendChild(picture)
		content.appendChild(streetview);
	}
	infowindow.setContent(content);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(env.map, this);
	})
	return marker
}
