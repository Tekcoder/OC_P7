"use strict"

// let restaurant = {
//	name: null,
//	reviews: [{
//		name: null,
//		rating: null,
//		comment: null
//	}],
//	loc: {
//		lat: null,
//		lng: null
//	}
// }

class Restaurant {
	constructor(name, reviews, loc){
		this.name = name
		this.reviews = reviews
		this.loc = loc
	}

	rating(){
		let sum = 0
		for(let review of this.reviews){
			sum += review.rating
		}
		return sum / this.reviews.length
	}

	addReview(name, rating, comment){
		this.reviews.push({
			name: name,
			rating: rating,
			comment: comment
		})
	}
}

function initMap(myLatLng) {
	let mymap = new google.maps.Map(document.getElementById('map'))
	let initialLocation = new google.maps.LatLng(myLatLng.lat, myLatLng.lng)
	mymap.setCenter(initialLocation);
	mymap.setZoom(13);
	setRadius(mymap, myLatLng.lat, myLatLng.lng)
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

function getFilterValue(){
	return {
		min : document.getElementById('stars_min').value,
		max : document.getElementById('stars_max').value
	}
}

function reviewPrompt(env, i){
	let name = prompt("name")
	let rating = parseInt(prompt("rating"))
	let comment = prompt("comment")
	env.restaurants[i].addReview(name, rating, comment)
	updateMenu(env.map.getBounds(), env)
}

function updateMenu(bounds, env){
	let menu = document.getElementById("menu");
	menu.innerHTML = '<a id="menu-title" href="#">RESTAURANTS LIST:</a>'
	let filter = getFilterValue()
	for (let i = 0; i < env.markers.length; i++) {
		if(bounds.contains(env.markers[i].getPosition()) && env.markers[i].getVisible()){
			let avgRating = env.restaurants[i].rating()
			if(filter.min <= avgRating && avgRating <= filter.max){
				let restaurant = document.createElement('div')
				let title = document.createElement('p')
				menu.appendChild(restaurant);
				let button = document.createElement('button')
				button.innerHTML = " + "
				title.innerHTML = env.restaurants[i].name + " (" + avgRating + ")" 
				title.appendChild(button)
				button.addEventListener("click", function(){
					reviewPrompt(env, i)
				})
				restaurant.appendChild(title)
				if(env.restaurants[i].reviews.length > 0){
					let reviews  = document.createElement('div')
					for(let review of env.restaurants[i].reviews){
						let comment = document.createElement('p')
						comment.innerHTML = review.name + " (" + review.rating + "): " + review.comment
						reviews.appendChild(comment)
					}
					restaurant.appendChild(reviews)
				}
			}
		}
	}
}

async function getRestaurants(env){
	const data = getJsonData()
	let restaurants = new Array()
	for (let restaurant of data){
		restaurants.push(new Restaurant(
			restaurant.name,
			restaurant.reviews,
			restaurant.loc
		))
	}
	let request = {
		location: env.userLoc,
		radius: '2000',
		type: ['restaurant']
	};
	let service = new google.maps.places.PlacesService(env.map);

	function nearbySearchSync(query) {
		return new Promise((resolve, reject) => {
			service.nearbySearch(query,(successResponse) => {
				resolve(successResponse);
			});
		});
	}

	function callback(results, status) {}

	try {
		let results = await nearbySearchSync(request, callback);
		for (let i = 0; i < results.length; i++) {
			// createMarker(results[i])
			restaurants.push(new Restaurant(
				results[i].name,
				[{
					name: "The google hero", // person who left review
					rating: results[i].rating,
					comment: ""
					}],
					{
						lat: results[i].geometry.location.lat(),
						lng: results[i].geometry.location.lng()
					}
				))
			}
	} catch (error) {
		console.log("fatal error");
	}

	return restaurants
}

function getPanorama(){
	return new google.maps.StreetViewPanorama(streetview, {
		navigationControl: false,
		enableCloseButton: false,
		addressControl: false,
		linksControl: false,
		visible: true
	});
}

// function placeMarkers(env){
//	let infowindow = new google.maps.InfoWindow();
//	let streetViewService = new google.maps.StreetViewService();
//	google.maps.event.addListener(marker, 'click', function() {
//		clickedMarker = marker;
//		streetViewService.getPanoramaByLocation(marker.getPosition(), 50, processSVData);
//		infowindow.setContent(marker.title);
//		infowindow.open(mymap, this);
//	})
//	let infowindow = new google.maps.InfoWindow();
//	for (let marker of env.markers){
//		let marker = new google.maps.Marker({
//			map: env.map,
//			position: place.geometry.location,
//			info: {
//				name: place.name,
//				avg: place.rating
//			},
//			animation: google.maps.Animation.DROP
//		})
//	}
//	allMarkers.push(marker)
//	let content = document.createElement("div");
//	let restaurantName = document.createElement("div");
//	restaurantName.innerHTML = marker.info.name
//	content.appendChild(restaurantName);
//	let streetview = document.createElement("div");
//	streetview.style.width = "200px";
//	streetview.style.height = "200px";
//	content.appendChild(streetview);
//	let htmlContent = document.createElement("div");
//	content.appendChild(htmlContent);
//	google.maps.event.addListener(marker, 'click', function() {
//		panorama = new google.maps.StreetViewPanorama(streetview, {
//			navigationControl: false,
//			enableCloseButton: false,
//			addressControl: false,
//			linksControl: false,
//			visible: true
//		});
//		clickedMarker = marker;
//		streetViewService.getPanoramaByLocation(marker.getPosition(), 50, processSVData);
//		infowindow.setContent(content);
//		infowindow.open(mymap, this);
//	})
// }

function createMarkers(env) {
	let markers = new Array()
	for (let i = 0; i < env.restaurants.length; i++) {
		let marker = new google.maps.Marker({
			position: env.restaurants[i].loc,
			map: env.map,
			animation: google.maps.Animation.DROP
		})
		markers.push(marker)
	}
	return markers
}

function processSVData(data, status) {
	if (status == google.maps.StreetViewStatus.OK) {
		let marker = clickedMarker;
		// openInfoWindow(clickedMarker);
		if (!!panorama && !!panorama.setPano) {
			panorama.setPano(data.location.pano);
			panorama.setPov({
				heading: 270,
				pitch: 0,
				zoom: 1
			});
			panorama.setVisible(true);
			google.maps.event.addListener(marker, 'click', function() {
				let markerPanoID = data.location.pano;
				// Set the Pano to use the passed panoID
				panorama.setPano(markerPanoID);
				panorama.setPov({
					heading: 270,
					pitch: 0,
					zoom: 1
				});
				panorama.setVisible(true);
			});
		}
	} else {
		// openInfoWindow(clickedMarker);
		// title.innerHTML = clickedMarker.getTitle() + "<br>Street View data not found for this location";
		// htmlContent.innerHTML = clickedMarker.myHtml;
		panorama.setVisible(false);
		// alert("Street View data not found for this location.");
	}
}

async function main(myLatLng){
	try {
		let env = {
			clickedMarker: null,
			panorama: null,
			map: initMap(myLatLng),
			userLoc: myLatLng,
			restaurants: new Array(),
			markers: new Array()
		} 
		env.restaurants = await getRestaurants(env)
		env.markers = createMarkers(env)
		updateMenu(env.map.getBounds(), env)
		// placeMarkers(env)
		google.maps.event.addListener(env.map, 'bounds_changed', function() {
			updateMenu(env.map.getBounds(), env)
		})
		google.maps.event.addListener(env.map, "dblclick", function(event){
			let marker = new google.maps.Marker({
				position: event.latLng,
				map: env.map,
				animation: google.maps.Animation.DROP
			})
			let restaurantName = prompt("Name of the restaurant: ")
			let person = prompt("What's your name: ")
			let rating = parseInt(prompt("Rate us with a nb"))
			let comment = prompt("Leave us a comment: ")
			env.markers.push(marker)
			env.restaurants.push(new Restaurant(
				restaurantName,
				[{
					name: person, // name of person who left review
					rating: rating,
					comment: comment
				}],
				{
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
				}
			))
		})
	} catch(error){
		console.log(error)
	}
}

window.onload = function(event){
	navigator.geolocation.getCurrentPosition(function(position) {
		let myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude}
		main(myLatLng)
	},function(positionError) {
		let myLatLng = {lat: 45.2493312, lng: 5.822873599999999}
		main(myLatLng)
	})
}
