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
