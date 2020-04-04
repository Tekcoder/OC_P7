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

// setInterval(function(){
// reset center of map when it changes
// mymap.setView([position[0], position[1]]);
// removeMenu()
// buildMenu(mymap, data)
// setTimeout(function(){
// mymap.setView([position[0], position[1]]);
// }, 2000);
// }, 4000);

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
function buildMenu(mymap, data){
	let menu = document.getElementsByClassName("sidenav")[0];
	let newDiv = document.createElement('div')
	let reviewP = document.createElement('p')
	placeRestaurants(data, mymap)
	menu.appendChild(newDiv);
	newDiv.appendChild(reviewP);

	function placeRestaurants(data, mymap){
		let markers = new Array();
		let i = 0;
		for (let restaurant of data) {
			markers[i] = L.marker([restaurant.lat, restaurant.long]).addTo(mymap);
			markers[i].bindPopup(restaurant.name)
			newDiv.innerHTML = restaurant.name;
			if (mymap.getBounds().contains(markers[i].getLatLng()) === true){
				for (let j = 0; j < data[i].ratings.length; j++){
					reviewP.innerHTML = data[i].name + " stars " + data[i].ratings[j].stars
				}
				console.log('hello ' + i)
				i = i + 1;
			}
		}
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

window.onload = function(event){
	const mymap = initMap()
	const data = getJsonData()
	// getStreetView()
}
