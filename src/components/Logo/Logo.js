import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => (
  <div className="logo-container">
    <Tilt className="Tilt br2 shadow-2" tiltMaxAngleX={20} tiltMaxAngleY={20} perspective={1000} scale={1.05}>
      <div className="Tilt-inner">
        <img src={brain} alt="Brain Logo" className="logo-image"/>
      </div>
    </Tilt>
  </div>
);

export default Logo;
