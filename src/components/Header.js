import React from 'react'

class Header extends React.Component {
		constructor(){
				super()
				this.state = {
						isLoggedIn: true,
				}
		}
		render() {
				let wordDisplay;
				if (this.state.isLoggedIn === true){
						wordDisplay = "in"
				}else {
						wordDisplay= "out"
				}
				return (
						<header className="header">
								<p>Hello World I am a Header Component!</p>
								<p>You are logged {wordDisplay}</p>
						</header>
				);
		}
}

export default Header
