import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
  return (
      <Tilt 
        className="Tilt br2 shadow-2 w3" tiltMaxAngleX={55}
        style={{paddingTop: '5px'}}
      >
        <div className="Tilt Tilt-inner pa3">
          <img 
            src={brain}
            // style={{paddingTop: '5px'}}
          />
        </div>
      </Tilt>
  )
}

export default Logo;