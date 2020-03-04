import React from 'react'

class Header extends React.Component{
	constructor(){
		super()
		this.state = {
			title: ['Project 7', <br />, 'Restaurants Reviews and Maps API']
		}
	}
		render(){
				return (
				<nav className='header'>
					<p>{this.state.title}</p>
				</nav>
			);
		}
}

export default Header
