"use strict"


function initMap(myLatLng) {
	let mymap = new google.maps.Map(document.getElementById('map'))
	let initialLocation = new google.maps.LatLng(myLatLng.lat, myLatLng.lng)
	mymap.setCenter(initialLocation);
	mymap.setZoom(13);
	//DEFINE SEARCH RADIUS
	setRadius(mymap, myLatLng.lat, myLatLng.lng)
	//in case there's an error with position services
	return mymap
}

function setRadius(mymap, latitude, longitude){
	let circle = new google.maps.Circle({
		map: mymap,
		center: new google.maps.LatLng(latitude, longitude),
		radius: 2000
	})
}

function getJsonData(){
	let data = null;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(xhttp.responseText)
		}
	}
	xhttp.open("GET", "./js/restaurants.json", false);
	xhttp.send();
	return data
}

//to be called within setInterval
function getFilterValue(){
	let element = document.getElementById('stars')
	let value = element.options[0].value
	return value
}

//function doesn't work yet
function filterTool(value){
	//empty	
	//empty	
	//switch(value)
}

function updateMenu(data){
	let menu = document.getElementsByClassName("sidenav")[0];
	for (let restaurant of data) {
		let newDiv = document.createElement('div')
		newDiv.innerHTML = restaurant.name;
		menu.appendChild(newDiv);
		let reviewP = document.createElement('p')
		reviewP.innerHTML = "Stars " + restaurant.ratings
		newDiv.appendChild(reviewP)
	}
}

function setMarkers(myLatLng, mymap, data) {
	let allMarkers = new Array()
	let marker = new google.maps.Marker({
		position: myLatLng,
		map: mymap,
		title: 'This is my position',
		icon: {
			url: '../img/position-icon.png',
			scaledSize: new google.maps.Size(55, 55)
		}
	})
	let infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(mymap, this);
	})
	let image = {
		url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
		// This marker is 20 pixels wide by 32 pixels high.
		size: new google.maps.Size(20, 32),
		// The origin for this image is (0, 0).
		origin: new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (0, 32).
		anchor: new google.maps.Point(0, 32)
	};
	// Shapes define the clickable region of the icon. The type defines an HTML
	// <area> element 'poly' which traces out a polygon as a series of X,Y points.
	// The final coordinate closes the poly by connecting to the first coordinate.
	let shape = {
		coords: [1, 1, 1, 20, 18, 20, 18, 1],
		type: 'poly'
	};
	for (let restaurant of data) {
		let marker = new google.maps.Marker({
			position: {lat: restaurant.lat, lng: restaurant.long},
			map: mymap,
			icon: image,
			shape: shape
		})
	}
	//PLACE MORE RESTAURANTS WITH GOOGLE PLACES
	let request = {
		location: myLatLng,
		radius: '2000',
		type: ['restaurant']
	};
	let service = new google.maps.places.PlacesService(mymap);
	service.nearbySearch(request, callback);
	function createMarker(place) {
		let infowindow = new google.maps.InfoWindow();
		let marker = new google.maps.Marker({
			map: mymap,
			position: place.geometry.location
		})
		//Defining streetview info-window
		let streetViewService = new google.maps.StreetViewService();
		// Create the shared infowindow with three DIV placeholders
		// One for a text string, oned for the html content from the xml
		// and one for the StreetView panorama.
		let content = document.createElement("div");
		let restaurantName = document.createElement("div");
		content.appendChild(restaurantName);
		let streetview = document.createElement("div");
		streetview.style.width = "200px";
		streetview.style.height = "200px";
		content.appendChild(streetview);
		let htmlContent = document.createElement("div");
		content.appendChild(htmlContent);
		google.maps.event.addListener(marker, 'click', function() {
			// infowindow.setContent(place.name);
			infowindow.setContent(content);
			infowindow.open(mymap, this);
		})
	}
	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (let i = 0; i < results.length; i++) {
				createMarker(results[i])
			}
		}
		console.log(results)
	}
}

// called in setInterval in getUserPosition()
function removeMenu(){
	let menu = document.getElementsByClassName('sidenav')
	console.log(menu)
	document.body.menu.removeChild('div')
	console.log('ok')
}

function main(myLatLng){
	const data = getJsonData()
	let filter_value = getFilterValue()
	let mymap = initMap(myLatLng)
	updateMenu(data)
	setMarkers(myLatLng, mymap, data)
	google.maps.event.addListener(mymap, 'bounds_changed', function() {
		// 3 seconds after the center of the map has changed, pan back to the
		// marker.
		console.log('bounds changed')
		window.setTimeout(function() {
			// mymap.panTo(marker.getPosition());
		}, 3000);
	})
	// getStreetView()
}
window.onload = function(event){
	navigator.geolocation.getCurrentPosition(function(position) {
		let myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude}
		main(myLatLng)
		// console.log(`Latitude : ${position.coords.latitude}`)
		// console.log(`Longitude: ${position.coords.longitude}`)
		// console.log(`More or less ${position.coords.accuracy} meters.`)
	},function(positionError) {
		let myLatLng = {lat: 45.2493312, lng: 5.822873599999999}
		main(myLatLng)
		// mymap.setCenter(new google.maps.LatLng(, ));
		// mymap.setZoom(5)
	})
}
