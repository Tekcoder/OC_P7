import React from 'react';
import './App.css';
import Nav from './components/Nav.js'
import Header from './components/Header.js' 
import Footer from './components/Footer.js' 
import Main from './components/Main.js' 


function App() {
  return (
    <div className="App">
		  <Nav />
		  <Header />
		  <Main />
		  <Footer />
    </div>
  );
}

export default App;
