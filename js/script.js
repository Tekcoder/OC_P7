"use strict"
let clickedMarker = null;
	let panorama = null

function initMap(myLatLng) {
	let mymap = new google.maps.Map(document.getElementById('map'))
	let initialLocation = new google.maps.LatLng(myLatLng.lat, myLatLng.lng)
	mymap.setCenter(initialLocation);
	mymap.setZoom(13);
	setRadius(mymap, myLatLng.lat, myLatLng.lng)
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

//to be called within setInterval
function getFilterValue(){
	let element = document.getElementById('stars')
	let value = element.options[0].value
	return value
}

//function doesn't work yet
function filterTool(value, rating){
	if (rating < value){
		//remove it from menu
	}
}

function updateMenu(bounds, markers){
	let menu = document.getElementById("menu");
	menu.innerHTML = '<a id="menu-title" href="#">RESTAURANTS LIST:</a>'
	for (let marker of markers) {
		if(bounds.contains(marker.getPosition()) && marker.getVisible()){
			let newDiv = document.createElement('div')
			newDiv.innerHTML = marker.info.name
			menu.appendChild(newDiv);
			let reviewP = document.createElement('p')
			reviewP.innerHTML = "Avg rating: " + marker.info.avg
			newDiv.appendChild(reviewP)
		}
	}
	// let menu = document.getElementsByClassName('sidenav')
	// document.body.menu.removeChild('div')
}

function setMarkers(myLatLng, mymap) {
	const data = getJsonData()
	let allMarkers = new Array()
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
	let infowindow = new google.maps.InfoWindow();
	let streetViewService = new google.maps.StreetViewService();
	google.maps.event.addListener(marker, 'click', function() {
		clickedMarker = marker;
		panorama = new google.maps.StreetViewPanorama(streetview, {
			navigationControl: false,
			enableCloseButton: false,
			addressControl: false,
			linksControl: false,
			visible: true
		});
		streetViewService.getPanoramaByLocation(marker.getPosition(), 50, processSVData);
		infowindow.setContent(marker.title);
		infowindow.open(mymap, this);
	})
	let image = {
		url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
		// This marker is 20 pixels wide by 32 pixels high.
		size: new google.maps.Size(20, 32),
		// The origin for this image is (0, 0).
		origin: new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (0, 32).
		anchor: new google.maps.Point(0, 32)
	};
	// Shapes define the clickable region of the icon. The type defines an HTML
	// <area> element 'poly' which traces out a polygon as a series of X,Y points.
	// The final coordinate closes the poly by connecting to the first coordinate.
	let shape = {
		coords: [1, 1, 1, 20, 18, 20, 18, 1],
		type: 'poly'
	};
	for (let restaurant of data) {
		let marker = new google.maps.Marker({
			position: {lat: restaurant.lat, lng: restaurant.long},
			map: mymap,
			icon: image,
			shape: shape,
			info: {
				name: restaurant.name,
				avg: restaurant.ratings
			},
			animation: google.maps.Animation.DROP
		})
		allMarkers.push(marker)
	}
	//PLACE MORE RESTAURANTS WITH GOOGLE PLACES
	let request = {
		location: myLatLng,
		radius: '2000',
		type: ['restaurant']
	};
	let service = new google.maps.places.PlacesService(mymap);
	service.nearbySearch(request, callback);
	function createMarker(place) {
		let infowindow = new google.maps.InfoWindow();
		let marker = new google.maps.Marker({
			map: mymap,
			position: place.geometry.location,
			info: {
				name: place.name,
				avg: place.rating
			},
			animation: google.maps.Animation.DROP
		})
		allMarkers.push(marker)
		let content = document.createElement("div");
		let restaurantName = document.createElement("div");
		restaurantName.innerHTML = marker.info.name
		content.appendChild(restaurantName);
		let streetview = document.createElement("div");
		streetview.style.width = "200px";
		streetview.style.height = "200px";
		content.appendChild(streetview);
		let htmlContent = document.createElement("div");
		content.appendChild(htmlContent);
		google.maps.event.addListener(marker, 'click', function() {
			panorama = new google.maps.StreetViewPanorama(streetview, {
				navigationControl: false,
				enableCloseButton: false,
				addressControl: false,
				linksControl: false,
				visible: true
			});
			clickedMarker = marker;
			streetViewService.getPanoramaByLocation(marker.getPosition(), 50, processSVData);
			infowindow.setContent(content);
			infowindow.open(mymap, this);
		})
	}
	function callback(results, status) {
		// console.log(results)
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (let i = 0; i < results.length; i++) {
				createMarker(results[i])
			}
		}
	}
	console.log(allMarkers)
	return allMarkers
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

function main(myLatLng){
	let filter_value = getFilterValue()
	let mymap = initMap(myLatLng)
	let allMarkers = setMarkers(myLatLng, mymap)
	google.maps.event.addListener(mymap, 'bounds_changed', function() {
		updateMenu(mymap.getBounds(), allMarkers)
		filter_value = getFilterValue()
		console.log(filter_value)
	})
}
window.onload = function(event){
	navigator.geolocation.getCurrentPosition(function(position) {
		let myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude}
		main(myLatLng)
	},function(positionError) {
		let myLatLng = {lat: 45.2493312, lng: 5.822873599999999}
		main(myLatLng)
		// mymap.setCenter(new google.maps.LatLng(, ));
		// mymap.setZoom(5)
	})
}
