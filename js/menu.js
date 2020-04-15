"use strict"

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
