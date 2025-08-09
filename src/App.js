import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import './App.css'

function App() {
  return (
    <div className="App">
      <>
        <div>...</div>
        <ParticlesBg type="square" bg={true} />
      </>
      <Navigation /> 
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*<Facerecognition /> */}
    </div>
  );
}

export default App;
