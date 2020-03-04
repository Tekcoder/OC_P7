import React, { Component } from 'react'
import L from '../../node_modules/leaflet'
import { Map, TileLayer, Marker, Popup } from '../../node_modules/react-leaflet'
import restaurants from './restaurants.json'

export default class MapContainer extends Component {
	constructor(props){
		super(props)
		this.state = {
			lat: 48.774,
			lng: 2.135,
			zoom: 10,
		}
	}

	render() {

		const myrestaurants = restaurants;
		console.log(myrestaurants);

		const position = [this.state.lat, this.state.lng]
		return (
			<Map className='map' center={position} zoom={this.state.zoom}>
			<TileLayer
			attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={position}>
			<Popup>
			A pretty CSS3 popup. <br /> Easily customizable.
			</Popup>
			</Marker>
			</Map>
		)}
}
