import React from 'react';
import './components-style.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  return (
    <div id="navbar">
      <div id="logo">
        <Link to="/">
          {/* <img src="assets/logo.png" alt="Organization Logo" className="logo" /> */}
        </Link>
        <h2>BridgeUp</h2>
      </div>
    </div>
  );
};

export default Navbar;
