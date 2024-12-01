import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './style.css';
import FirstPage from '../components/FirstPage';
import BottomNavbar from '../components/BottomNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      const scale = window.outerWidth / window.innerWidth; 
      document.body.style.transform = `scale(${1 / scale})`; 
      document.body.style.transformOrigin = '0 0';
      document.body.style.width = `${100 * scale}%`; 
    }
    window.addEventListener('resize', adjustScale); 
    adjustScale();
    return () => {
      window.removeEventListener('resize', adjustScale); 
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
  const handleRegister = async (name, mobile, email, username, password) => {
    try {
      console.log(name, mobile, email, username, password);
      await register(name, mobile, email, username, password);
      console.log(name, mobile, email, username, password);
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
  const containers = document.querySelectorAll('.sponsor-event-box');
  const sponsorDetails = document.getElementById('sponser-details');
  const eventDetails = document.getElementById('event-details');
  containers.forEach((container) => {
    container.addEventListener('click', () => {
      containers.forEach((cont) => cont.classList.remove('active'));
      container.classList.add('active');
    });
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const isLoginEnabled = username.length > 0 && password.length >= 8;
  function checkFormCompletion() {
    const fields = [
      document.getElementById('register-name').value,
      document.getElementById('register-mobile').value,
      document.getElementById('register-email').value,
      document.getElementById('register-username').value,
      document.getElementById('register-password').value,
    ];
    let allFieldsFilled = false;
    allFieldsFilled = fields.every((field) => field.trim() !== '');
    console.log(allFieldsFilled);
    document.getElementById('register-button').disabled = !allFieldsFilled;
  }
  const handleRegisterSubmit = () => {
    const form0 = JSON.parse(localStorage.getItem('form_0')) || {};
    const form1 = JSON.parse(localStorage.getItem('form_1')) || {};
    const form2 = JSON.parse(localStorage.getItem('form_2')) || {};
    const isForm0Complete = form0.college_name && form0.location && form0.organization_name;
    const isForm1Complete = form1.event_name && form1.date && form1.time && form1.budget && form1.footfall;
    const isForm2Complete = form2.description;
    if (isForm0Complete && isForm1Complete && isForm2Complete) {
      submiteventForms(form0, form1, form2);
      localStorage.removeItem('form_0');
      localStorage.removeItem('form_1');
      localStorage.removeItem('form_2');
      return;
    }
    const form3 = JSON.parse(localStorage.getItem('form_3')) || {};
    const form4 = JSON.parse(localStorage.getItem('form_4')) || {};
    const form5 = JSON.parse(localStorage.getItem('form_5')) || {};
    console.log(form3,form4,form5);
    const isForm3Complete = form3.company_name && form3.location && form3.contact && form3.budget && form3.domain;
    const isForm4Complete = form4.insta && form4.twitter && form4.other;
    const isForm5Complete = form5.description;
    if (isForm3Complete && isForm4Complete && isForm5Complete) {
      submitsponsorForms(form3, form4, form5);
      localStorage.removeItem('form_3');
      localStorage.removeItem('form_4');
      localStorage.removeItem('form_5');
      return;
    }
    console.log(isForm0Complete,isForm1Complete,isForm2Complete,isForm3Complete,isForm4Complete,isForm5Complete);
    alert("Forms are incomplete. Please complete all required forms.");
  };
  const submiteventForms = (form0,form1,form2) => {
    console.log(form0,form2,form1);
    const token = localStorage.getItem("token");
    const { college_name, location, organization_name } = form0; 
    const { event_name, date, time, budget, footfall } = form1;           
    const { description } = form2;
    const image=localStorage.getItem("logo");
    console.log(image);
    const formData = [
      college_name,
      location,
      organization_name,
      event_name,
      date,
      time,
      budget,
      footfall,
      description,
      image
  ];
  console.log('Form Data List:', formData);
    fetch("/add_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ formData }), 
    })
      .then((response) => {
        if (response.ok) {
          window.location.href='/sponsors';
          alert("Event submitted successfully!");
        } else {
          alert("Failed to submit event. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the event.");
      });
  };
  const submitsponsorForms = (form3,form4,form5) => {
    console.log(form3,form4,form5);
    const token = localStorage.getItem("token");
    const { company_name, location, contact, budget, domain } = form3; 
    const { insta,twitter,other } = form4;           
    const { description } = form5;
    const logo=localStorage.getItem("logo");
    const formData = [company_name, location, contact, budget, domain,insta,twitter,other,description,logo ];
    console.log(formData);
  console.log('Form Data List:', formData);
    fetch("/add_sponsor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ formData }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href='/events';
          alert("Sponsorship submitted successfully!");
        } else {
          alert("Failed to submit event. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the event.");
      });
  };
  return (
    <>
      <section id="overlay1">
        <header>
          <h2>BridgeUp</h2>
          <nav className="navbar">
            {isAuthenticated ? (
              <>
                <div
                  id="profile"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <button className="profile-button">
                    {userDetails?.name?.[0] || '?'}
                  </button>
                  <p>Hey {userDetails?.name || 'Guest'}</p>
                  <FontAwesomeIcon icon=" fa-angle-down" id="angle-down" />
                </div>
                {profileMenuOpen && userDetails && (
                  <div
                    className="profile-menu"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <p style={{ fontSize: '10px', color: '#007bff' }}>
                      You are viewing your personal profile
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon="fa-solid fa-user"
                        id="profile-icon"
                      />
                      {userDetails.name}
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-solid fa-envelope" />
                      {userDetails.email}
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-solid fa-phone" />
                      {userDetails.mobile}
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="button-grad"
                id="login-but1"
                onClick={() => handlePopupToggle('login')}
              >
                Login or Create Account
                <FontAwesomeIcon
                  icon="fa-solid fa-caret-down"
                  className="caret-down"
                />
              </button>
            )}
          </nav>
        </header>
        <div id="overlay2"></div>
        <FirstPage />
        <button className="button-grad bt2" onClick={handleRegisterSubmit}>
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
                  onInput={checkFormCompletion}
                />
                <h2>Mobile Number</h2>
                <input
                  className="login-fields"
                  type="number"
                  id="register-mobile"
                  placeholder="Contact No"
                  required
                  onInput={checkFormCompletion}
                />
                <h2>Email</h2>
                <input
                  className="login-fields"
                  type="email"
                  id="register-email"
                  placeholder="Email"
                  required
                  onInput={checkFormCompletion}
                />
                <h2>Username</h2>
                <input
                  className="login-fields"
                  type="text"
                  id="register-username"
                  placeholder="Username"
                  required
                  onInput={checkFormCompletion}
                />
                <h2>Password</h2>
                <input
                  className="login-fields"
                  type="password"
                  id="register-password"
                  placeholder="Password"
                  required
                  onInput={checkFormCompletion}
                />
                <button
                  className="switch-button"
                  id="register-button"
                  onClick={() =>
                    handleRegister(
                      document.getElementById('register-name').value,
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
    </>
  );
};
export default LandingPage;