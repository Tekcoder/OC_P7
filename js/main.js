"use strict"

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
