import React from 'react';
import MapContainer from './MapContainer.js';

class Main extends React.Component {
	render() {
		return (
			<main>
				<div id='map-areas'>
					<MapContainer />
				</div>
			</main>
		);
	}
}

export default Main
