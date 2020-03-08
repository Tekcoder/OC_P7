"use strict"

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

function customizeMap(mymap){
	let marker = L.marker([51.5, -0.09]).addTo(mymap);
	marker.bindPopup("<b>You are here!</b><br/> Are you lost ?").openPopup();
	let circle = L.circle([51.508, -0.11], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(mymap);
	let polygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	]).addTo(mymap);
}

function get_json_data(){
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

// window.onload = function(event){
	const mymap = getMap()
	// customizeMap(mymap)
	const data = get_json_data()
	console.log(data)
	let markers = new Array();
	let i = 0;
	for (let r of data) {
		markers[i] = L.marker([r.lat, r.long]).addTo(mymap);
		markers[i].bindPopup(r.name)
		console.log(mymap.getBounds().contains(markers[i].getLatLng()) == true)
		i = i + 1;
	}
// }
