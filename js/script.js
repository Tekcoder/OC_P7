"use strict"

// a new instance of that class will be created 
// whenever a new restaurant is created 
class Restaurant {
	constructor(name, reviews, loc, picture){
		this.name = name
		this.reviews = reviews
		this.loc = loc
		this.picture = picture
	}
// Only 2 methods, one to calculate the average review
// and a second to add a review into the list of
// reviews (this.reviews)
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

//function to initialize the map within the div with an id of 'map'
//Takes the user loc as parameter to center the map around that loc
function initMap(myLatLng) {
	let mymap = new google.maps.Map(document.getElementById('map'))
	let initialLocation = new google.maps.LatLng(myLatLng.lat, myLatLng.lng)
	mymap.setCenter(initialLocation);
	mymap.setZoom(13);
	//Optional circle feature
	//SetRadius(mymap, myLatLng.lat, myLatLng.lng)
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

// To set the radius, you need the map you initialized and the 
// latitude and longitude around which you want to center the radius
// this function is a bonus. It's currently not used.
function setRadius(mymap, latitude, longitude){
	//use of google maps Circle class to draw the radius
	let circle = new google.maps.Circle({
		map: mymap,
		center: new google.maps.LatLng(latitude, longitude),
		radius: 2000 //meters (so 2KM)
	})
}

// all the data from our JSON is stored within 
// our data variable. it is empty at the start and
// contains the JSON data after the request
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

//the only job of this function is to get the value
//from our min and max filters. it returns it in the form 
//of an object
function getFilterValue(){
	return {
		min : document.getElementById('stars_min').value,
		max : document.getElementById('stars_max').value
	}
}

//reviewPrompt needs the env (short for environment) object
//and the index of the restaurant it is currently handling.
function reviewPrompt(env, i){
	let name = prompt("What's your name ?")
	let rating = parseInt(prompt("Rating ?")) //could be parseFloat
	// console.log(typeof rating)
	let comment = prompt("Leave us a comment ?")
	env.restaurants[i].addReview(name, rating, comment)
	updateMenu(env.map.getBounds(), env)
}

// function in charge of building the menu depending
// on the changes appearing on the map. It should change
// when the filter or the bounds of the map are updated 
function updateMenu(bounds, env){
	let menu = document.getElementById("menu");
	menu.innerHTML = '<a id="menu-title" href="#">RESTAURANTS LIST:</a>'
	//time to get the value of the filter
	let filter = getFilterValue()
	for (let i = 0; i < env.markers.length; i++) {
		// changing the menu depending on the bounds of the map
		if(bounds.contains(env.markers[i].getPosition()) && env.markers[i].getVisible()){
			//saving the average rating of restaurants in a variable
			let avgRating = env.restaurants[i].rating()
			// updating menu according to filter values (min & max)
			if(filter.min <= avgRating && avgRating <= filter.max){
				//this is where the actual building of the menu takes place 
				//with the creation of html elements
				let restaurant = document.createElement('div')
				let title = document.createElement('p')
				menu.appendChild(restaurant);
				//giving the possibility to add reviews to existing restaurants
				//with a + button
				let button = document.createElement('button')
				button.innerHTML = " + "
				title.innerHTML = env.restaurants[i].name + " (" + avgRating + ")" 
				title.appendChild(button)
				// added the event on our button in order to add reviews
				button.addEventListener("click", function(){
					// calling appropriate function to add a review
					// on an existing restaurant
					reviewPrompt(env, i)
				})
				restaurant.appendChild(title)
				// creating reviews for our restaurants
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

// first asynchronous function in our codebase. This is where
// we load the JSON data and make our NearbySearch with Google 
// Places
async function getRestaurants(env){
	const data = getJsonData()
	let restaurants = new Array()
	for (let restaurant of data){
		restaurants.push(new Restaurant(
			restaurant.name,
			restaurant.reviews,
			restaurant.loc,
			null
		))
	}
	// I requested establisments in a 2KM radius (or 2000m)
	// around the user and with the type "restaurants"
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
			let picture = null
			try {
				picture = results[i].photos[0].getUrl()
			} catch(error){
				picture = null
			}
			//pushing a new instance of the class restaurant
			//(so a new restaurant) into the list of restaurants 
			//that we have
			restaurants.push(new Restaurant(
				results[i].name,
				[{
					name: "The google hero", // person who left review
					rating: results[i].rating, // average rating supplied by google
					comment: "" //no comment supplied by google
				}],
				{
					lat: results[i].geometry.location.lat(),
					lng: results[i].geometry.location.lng()
				},
				picture //last but no least, the image displayed in our popup
			))
		}
	} catch (error) {
		console.log(error);
	}
	return restaurants
}

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

// second and last asynchronous of the program
// where we call the most important functions
// like getRestaurants(), makeMarkers(), updateMenu()...
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
		let updateMenuCallBack = function() {
			updateMenu(env.map.getBounds(), env)
		}
		google.maps.event.addListener(env.map, 'bounds_changed', updateMenuCallBack)
		let filter_min = document.getElementById("stars_min")
		let filter_max = document.getElementById("stars_max")
		filter_min.addEventListener("change", updateMenuCallBack)
		filter_max.addEventListener("change", updateMenuCallBack)
		google.maps.event.addListener(env.map, "dblclick", function(event){
			let restaurantName = prompt("Name of the restaurant: ")
			let person = prompt("What's your name: ")
			let rating = parseInt(prompt("Rate us with a nb"))
			let comment = prompt("Leave us a comment: ")
			let picture = null
			try {
				picture = results[i].photos[0].getUrl()
			} catch(error){
				picture = null
			}
			env.restaurants.push(new Restaurant(
				restaurantName,
				[{
					// name of person who left review
					name: person, 
					rating: rating,
					comment: comment
				}],
				{
					lat: event.latLng.lat(),
					lng: event.latLng.lng()
				},
				picture
			))
			let marker = makeMarker(env, env.restaurants.length - 1)
			env.markers.push(marker)
		})
	} catch(error){
		console.log(error)
	}
}

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
