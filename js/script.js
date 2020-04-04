"use strict"

function initMap() {
	let mymap = new google.maps.Map(document.getElementById('map'));
	navigator.geolocation.getCurrentPosition(function(position) {
		// Center on user's current location if geolocation prompt allowed
		let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		mymap.setCenter(initialLocation);
		mymap.setZoom(12);
		let myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
		console.log(`Latitude : ${position.coords.latitude}`);
		console.log(`Longitude: ${position.coords.longitude}`);
		console.log(`More or less ${position.coords.accuracy} meters.`);
		let marker = new google.maps.Marker({
			position: myLatLng,
			map: mymap,
			title: 'This is my position'
		});
		setRadius(mymap, position.coords.latitude, position.coords.longitude)
	}, function(positionError) {
		// User denied geolocation prompt 
		mymap.setCenter(new google.maps.LatLng(45.2493312, 5.822873599999999));
		mymap.setZoom(5);
	});

	return mymap
}

function setRadius(mymap, latitude, longitude){
	let circle = new google.maps.Circle({
		map: mymap,
		center: new google.maps.LatLng(latitude, longitude),
		radius: 5000
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

//function doesn't work yet
function getFilterValue(){
	let element = document.getElementById('elementid')
	let value = element.options[element.selectedIndex].value
	let text = element.options[element.selectedIndex].text
	return value
}

//function doesn't work yet
function filterTool(value){
	//empty	
	//empty	
}

// called in setInterval in getUserPosition()
function buildMenu(data){
	let menu = document.getElementsByClassName("sidenav")[0];
	let i = 0
	for (let restaurant of data) {
		let newDiv = document.createElement('div')
		// let reviewP = document.createElement('p')
		menu.appendChild(newDiv);
		// newDiv.appendChild(reviewP);
		newDiv.innerHTML = restaurant.name;
		// for (let j = 0; j < data[i].ratings.length; j++){
		// 	reviewP.innerHTML = data[i].name + " stars " + data[i].ratings[j].stars
		// }
		console.log('restaurant nb ' + i)
		i = i + 1;
	}
}

function setMarkers(mymap, data) {
	// let beaches = [
	// ['Bondi Beach', -33.890542, 151.274856, 4],
	// ['Coogee Beach', -33.923036, 151.259052, 5],
	// ['Cronulla Beach', -34.028249, 151.157507, 3],
	// ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
	// ['Maroubra Beach', -33.950198, 151.259302, 1]
	// ];
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
	let i = 0;
	let rest_markers = new Array()
	console.log(data)
	for (let restaurant of data) {
		console.log(restaurant.lat)
		console.log(restaurant.long)
		console.log('marker nb ' + i)
		let marker = new google.maps.Marker({
			position: {lat: restaurant.lat, lng: restaurant.long},
			map: mymap,
			icon: image,
			shape: shape
		})
		// title: beach[0],
		// zIndex: beach[3]
		i = i + 1;
	}
}

// called in setInterval in getUserPosition()
function removeMenu(){
	let menu = document.getElementsByClassName('sidenav')
	console.log(menu)
	document.body.menu.removeChild('p')
	console.log('ok')
}

function getStreetView(){
	let panorama;
	panorama = new google.maps.StreetViewService(
		document.getElementById('street-view'),
		{
			position: {lat: 37.869260, lng: -122.254811},
			pov: {heading: 165, pitch: 0},
			zoom: 1
		});
}

// setInterval(function(){
// reset center of map when it changes
// mymap.setView([position[0], position[1]]);
// removeMenu()
// buildMenu(mymap, data)
// setTimeout(function(){
// mymap.setView([position[0], position[1]]);
// }, 2000);
// }, 4000);

window.onload = function(event){
	const mymap = initMap()
	const data = getJsonData()
	buildMenu(data, mymap)
	setMarkers(mymap, data)
	// getStreetView()
}
