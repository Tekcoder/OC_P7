import React from 'react'

class Header extends React.Component{
		render(){
			const title = ['Project 7', <br />, 'Restaurants Reviews and Maps API']
		return (
				<nav className='header'>
					<p>{title}</p>
				</nav>
		);
	}
}

export default Header
