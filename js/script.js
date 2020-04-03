"use strict"

function initMap() {
	let mymap = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
	return mymap;
}

function getUserPosition(data, mymap){
	let position = new Array()
	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	function success(pos) {
		let crd = pos.coords;
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);
		position.push(crd.latitude)
		position.push(crd.longitude)
		// mymap.setView([position[0], position[1]], 9);
		// L.control.scale().addTo(mymap);
		// buildMenu(mymap, data)
		// console.log(menu)
		setInterval(function(){
			// reset center of map when it changes
			// mymap.setView([position[0], position[1]]);
			// removeMenu()
			// buildMenu(mymap, data)
			setTimeout(function(){
				// mymap.setView([position[0], position[1]]);
			}, 2000);
		}, 4000);
		var myLatLng = {lat: position[0], lng: position[1]};
		let marker = new google.maps.Marker({
          position: myLatLng,
          map: mymap,
          title: 'This is my position'
        });
	}
	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}
	navigator.geolocation.getCurrentPosition(success, error, options);
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
	getUserPosition(data, mymap)
	// getStreetView()
}
