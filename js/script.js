"use strict"

// (google api key)
// AIzaSyDTe4m2xCSxBAGbh1EOcrzpjBC5_eiY-L0 

function getMap(){
	// let mymap = L.map('map').setView([48.8737815, 2.3501649], 9);
	let mymap = L.map('map')
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,\
					   <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,\
					   Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom     : 18,
		id          : 'mapbox/streets-v11',
		tileSize    : 512,
		zoomOffset  : -1,
		accessToken : 'pk.eyJ1Ijoic29pbXVlbjExIiwiYSI6ImNrNzM0Y2RvcjA4YnMzaG1uaWVyZGxidjcifQ.Ed1yaeFJ8-4ntjFgWIjLAg'
	}).addTo(mymap);
	return mymap;
}

function getUserPosition(data, mymap){
	let position = new Array()
	const greenIcon = L.icon({
		iconUrl: '../img/leaf-green.png',
		// size of the icon
		iconSize:     [38, 95], 
		// size of the shadow
		shadowSize:   [50, 64],
		// point of the icon which will correspond to marker's location
		iconAnchor:   [22, 94], 
		// the same for the shadow
		shadowAnchor: [4, 62],  
		// point from which the popup should open relative to the iconAnchor
		popupAnchor:  [-3, -76] 
	});
	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	function success(pos) {
		let crd = pos.coords;
		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		position.push(crd.latitude)
		console.log(`Longitude: ${crd.longitude}`);
		position.push(crd.longitude)
		console.log(`More or less ${crd.accuracy} meters.`);
		mymap.setView([position[0], position[1]], 9);
		L.control.scale().addTo(mymap);
		setInterval(function(){
			//the map is centered around the user's position
			mymap.setView([position[0], position[1]]);
			setTimeout(function(){
				mymap.setView([position[0], position[1]]);
				placeRestaurants(mymap, data)
				//re-centered every 2 sec
			}, 2000);
		}, 4000);
		L.marker([position[0], position[1]], {icon: greenIcon}).addTo(mymap).bindPopup('This is the user\'s position');
	}
	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}
	navigator.geolocation.getCurrentPosition(success, error, options);
	return position
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

function searchBox(){
}

function placeRestaurants(mymap, data){
	let markers = new Array();
	let i = 0;
	for (let restaurant of data) {
		markers[i] = L.marker([restaurant.lat, restaurant.long]).addTo(mymap);
		markers[i].bindPopup(restaurant.name)
		// console.log(restaurant)
		// if restaurant appears on map, display it on the menu
		if (mymap.getBounds().contains(markers[i].getLatLng()) === true){
			buildMenu(data, i)
		}
		i = i + 1;
	}
}

function listRestaurants(menu, newDiv, reviewP, restaurantName, review){
	// console.log('here')
	newDiv.innerHTML = restaurantName;
	reviewP.innerHTML = review;
	menu.appendChild(newDiv);
	newDiv.appendChild(reviewP);
	// console.log('now I am working')
}

// I should call this function within setInterval in getUserPosition
function buildMenu(data, index){
	// console.log("here1")
	let menu = document.getElementsByClassName("sidenav")[0];
	let newDiv = document.createElement('div')
	let reviewP = document.createElement('p')
	// console.log("here2")
	// listRestaurants(data[index].name)
	for (let j = 0; j < data[index].ratings.length; j++){
		listRestaurants(menu, newDiv, reviewP, data[index].name, "stars " + data[index].ratings[j].stars)
		// if (menu !== undefined){
		// 	removeMenuItems(menu, newDiv, reviewP)
		// }
	}
}

function getStreetView(){
	let panorama;
	panorama = new google.maps.StreetViewPanorama(
		document.getElementById('street-view'),
		{
			position: {lat: 37.869260, lng: -122.254811},
			pov: {heading: 165, pitch: 0},
			zoom: 1
		});
}


window.onload = function(event){
	const data = getJsonData()
	const mymap = getMap()
	getUserPosition(data, mymap)
	getStreetView()
	// searchBox(mymap)
}
