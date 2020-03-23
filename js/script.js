"use strict"

// (google api key)
// AIzaSyDTe4m2xCSxBAGbh1EOcrzpjBC5_eiY-L0 

function getMap(){
	let mymap = L.map('map').setView([48.8737815, 2.3501649], 10);
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

function getUserPosition(mymap){
	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	function success(pos) {
		let crd = pos.coords;
		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);
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

function listRestaurants(restaurantName, review){
	let menu = document.getElementsByClassName("sidenav")[0];
	let newDiv = document.createElement('div')
	let reviewP = document.createElement('p')
	newDiv.innerHTML = restaurantName;
	reviewP.innerHTML = review;
	menu.appendChild(newDiv);
	newDiv.appendChild(reviewP);
}

function searchBox(mymap){
	mymap.zoomControl.setPosition('topright');
	mymap.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{attribution:'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'}
	));

	var searchboxControl = createSearchboxControl();
	var control = new searchboxControl({
		sidebarTitleText: 'Header',
		sidebarMenuItems: {
			Items: [
				{ type: "link", name: "Link 1 (github.com)", href: "http://github.com", icon: "icon-local-carwash" },
				{ type: "link", name: "Link 2 (google.com)", href: "http://google.com", icon: "icon-cloudy" },
				{ type: "button", name: "Button 1", onclick: "alert('button 1 clicked !')", icon: "icon-potrait" },
				{ type: "button", name: "Button 2", onclick: "button2_click();", icon: "icon-local-dining" },
				{ type: "link", name: "Link 3 (stackoverflow.com)", href: 'http://stackoverflow.com', icon: "icon-bike" },
			]
		}
	});
	control._searchfunctionCallBack = function (searchkeywords){
		if (!searchkeywords) {
			searchkeywords = "The search call back is clicked !!"
		}
		alert(searchkeywords)
	}
	mymap.addControl(control);
	function button2_click(){
		alert('button 2 clicked !!!');
	}
}

function placeRestaurants(mymap, data){
	let markers = new Array();
	let i = 0;
	for (let restaurant of data) {
		markers[i] = L.marker([restaurant.lat, restaurant.long]).addTo(mymap);
		markers[i].bindPopup(restaurant.name)
		i = i + 1;
	}
}

function buildMenu(data){
	for (let i in data){
		console.log(data[i].name)
		listRestaurants(data[i].name)
		for (let j = 0; j < data[i].ratings.length; j++){
			console.log(data[i].ratings[j].stars)
			listRestaurants(data[i].name, data[i].ratings[j].stars)
		}
	}
}

window.onload = function(event){
	const mymap = getMap()
	const data = getJsonData()
	searchBox(mymap)
	getUserPosition(mymap)
	placeRestaurants(mymap, data)
	buildMenu(data)
	// mymap.getBounds().contains(markers[i].getLatLng()) == true
}
