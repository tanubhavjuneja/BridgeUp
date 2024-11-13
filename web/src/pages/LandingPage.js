import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './style.css';
import { Link } from 'react-router-dom';
import FirstPage from '../components/FirstPage';
import BottomNavbar from '../components/BottomNavbar';
const LandingPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('login');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const { isAuthenticated, login, register, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUserDetails(data);
        })
        .catch((error) => console.error('Error fetching user details:', error));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function adjustScale() {
      const scale = window.outerWidth / window.innerWidth; // Calculate zoom level
      document.body.style.transform = `scale(${1 / scale})`; // Apply inverse scale
      document.body.style.transformOrigin = '0 0'; // Start scaling from the top left
      document.body.style.width = `${100 * scale}%`; // Adjust width to prevent content overflow
    }

    window.addEventListener('resize', adjustScale); // Adjust scale on window resize
    adjustScale(); // Initial call on mount

    return () => {
      window.removeEventListener('resize', adjustScale); // Cleanup event listener on unmount
    };
  }, []);

  const handlePopupToggle = (type) => {
    const content = document.getElementById('popup-content');
    if (isPopupOpen) {
      if (type == 'register') {
        content.style.height = '90%';
      } else {
        content.style.height = '70%';
      }
      setPopupType(type);
    } else {
      setPopupType(type);
      setIsPopupOpen(true);
    }
  };
  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const handleRegister = async (
    name,
    mobile,
    email,
    username,
    password
  ) => {
    try {
      await register(name, mobile, email, username, password);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      setUserDetails(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Select all elements with the 'container' class
  const containers = document.querySelectorAll('.sponsor-event-box');
  const sponsorDetails = document.getElementById('sponser-details');
  const eventDetails = document.getElementById('event-details');

  // Add click event listener to each container
  containers.forEach((container) => {
    container.addEventListener('click', () => {
      // Remove 'active' class from all containers
      containers.forEach((cont) => cont.classList.remove('active'));

      // Add 'active' class to the clicked container
      container.classList.add('active');
    });
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle changes in username input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Function to handle changes in password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Check if the Login button should be enabled
  const isLoginEnabled = username.length > 0 && password.length >= 6;

  return (
    <>
      <section id="overlay1">
        <header>
          <h2>BridgeUp</h2>
          <nav className="navbar">
            {/* <Link to="/events">Events</Link>
            <Link to="/sponsors">Sponsors</Link> */}

            {isAuthenticated ? (
              <>
                <div id="profile">
                  <button
                    className="profile-button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    {/* {userDetails.name[0]} */}
                  </button>
                  { <p>Hey {userDetails.name},</p> }
                </div>
                {profileMenuOpen && userDetails && (
                  <div className="profile-menu">
                    <button
                      className="close-popup"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                      X
                    </button>
                    <p>
                      <strong>Name:</strong> {userDetails.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userDetails.email}
                    </p>
                    <p>
                      <strong>Contact No:</strong> {userDetails.mobile}
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="button-grad"
                onClick={() => handlePopupToggle('login')}
              >
                Login or Create Account ⌵
              </button>
            )}

            {/* <button
              className="button-grad"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              Login or Create Account ⌵
            </button> */}
          </nav>
          {/* {isAuthenticated ? (
          <>
            <button className="profile-button" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              Profile
            </button>
            {profileMenuOpen && userDetails && (
              <div className="profile-menu">
                <button className="close-popup" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>X</button>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Organization:</strong> {userDetails.organization}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Contact No:</strong> {userDetails.mobile}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => handlePopupToggle('login')}>Login / Register</button>
        )} */}
        </header>
        <div id="overlay2"></div>

        <FirstPage />

        <button className="button-grad bt2">
          REGISTER YOURSELF FOR VERIFICATION
        </button>
      </section>

      <div id="sec2">
        <h1 className="sec-heading">For Sponsors</h1>
        <p className="sec-subheading">how sponsors can use the app?</p>
      </div>

      <div id="sec3">
        <h1 className="sec-heading">For Event managers</h1>
        <p className="sec-subheading">how event managers can use the app?</p>
      </div>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content" id="popup-content">
            <button
              className="close-popup"
              onClick={() => setIsPopupOpen(false)}
            >
              X
            </button>
            <div className="lr-buttons">
              <button
                className={`switch-button ${
                  popupType === 'login' ? 'active' : ''
                }`}
                onClick={() => handlePopupToggle('login')}
              >
                LOGIN
              </button>
              <button
                className={`switch-button ${
                  popupType === 'register' ? 'active' : ''
                }`}
                onClick={() => handlePopupToggle('register')}
              >
                REGISTER
              </button>
            </div>
            {popupType === 'login' && (
              <div id="login-form">
                <h2>Username</h2>
                <input
                  className="login-fields"
                  value={username}
                  onChange={handleUsernameChange}
                  type="text"
                  id="login-username"
                  placeholder="Username"
                  required
                />
                <h2>Password</h2>
                <input
                  className="login-fields"
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  id="login-password"
                  placeholder="Password"
                  required
                />
                <button
                  className={`switch-button ${isLoginEnabled ? 'enabled' : ''}`}
                  id="loginFormPageButton"
                  disabled={!isLoginEnabled}
                  onClick={() =>
                    handleLogin(
                      document.getElementById('login-username').value,
                      document.getElementById('login-password').value
                    )
                  }
                >
                  Login
                </button>
                <div id="horizontal-line">
                  <hr />
                  <h2>Or Login/Signup With </h2>
                  <hr />
                </div>
                <p>
                  By proceeding, you agree to BridgeUp's{' '}
                  <a href="http://">Privacy Policy</a>,{' '}
                  <a href="http://">User Agreement</a> and{' '}
                  <a href="http://">T&Cs</a>{' '}
                </p>
              </div>
            )}
            {popupType === 'register' && (
              <div id="register-form">
                <h2>Name</h2>
                <input
                  className="login-fields"
                  type="text"
                  id="register-name"
                  placeholder="Name"
                  required
                />
                {/* <input
                  className="login-fields"
                  type="text"
                  id="register-organization"
                  placeholder="Organization"
                  required
                />
                <input
                  className="login-fields"
                  type="text"
                  id="event-name"
                  placeholder="Event Name"
                  required
                /> */}
                <h2>Mobile Number</h2>
                <input
                  className="login-fields"
                  type="text"
                  id="register-mobile"
                  placeholder="Contact No"
                  required
                />
                <h2>Email</h2>
                <input
                  className="login-fields"
                  type="email"
                  id="register-email"
                  placeholder="Email"
                  required
                />
                <h2>Username</h2>
                <input
                  className="login-fields"
                  type="text"
                  id="register-username"
                  placeholder="Username"
                  required
                />
                <h2>Password</h2>
                <input
                  className="login-fields"
                  type="password"
                  id="register-password"
                  placeholder="Password"
                  required
                />
                <button
                  className="switch-button"
                  onClick={() =>
                    handleRegister(
                      document.getElementById('register-name').value,
                      document.getElementById('event-name').value,

                      document.getElementById('register-organization').value,
                      document.getElementById('register-mobile').value,
                      document.getElementById('register-email').value,
                      document.getElementById('register-username').value,
                      document.getElementById('register-password').value
                    )
                  }
                >
                  Register
                </button>
                <p>
                  By proceeding, you agree to BridgeUp's{' '}
                  <a href="http://">Privacy Policy</a>,{' '}
                  <a href="http://">User Agreement</a> and{' '}
                  <a href="http://">T&Cs</a>{' '}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* <BottomNavbar /> */}
    </>
  );
};
export default LandingPage;
