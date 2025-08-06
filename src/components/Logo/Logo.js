import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
  return (
      <Tilt className="Tilt br2 shadow-2 w3" tiltMaxAngleX={55}>
        <div className="Tilt Tilt-inner">
          <img src={brain}/>
        </div>
      </Tilt>
  )
}

export default Logo;