import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Solid heart icon
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'; // Regular heart icon
import './style.css';
import './sponsors.css';
const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    organization_name: '',
    sponsorship_budget: '',
    college_tier_requirement: '',
    crowd_requirements: '',
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetch('/list_sponsors', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSponsors(data))
      .catch((error) => console.error('Error fetching sponsors:', error));
  }, []);
  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSponsor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddSponsor = async () => {
    try {
      console.log(JSON.stringify(newSponsor));
      const response = await fetch('/add_sponsor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newSponsor),
      });
      setIsPopupOpen(false);
      if (response.status === 401) {
        alert('You are not logged in. Redirecting to the home page.');
        navigate('/'); // Redirect to '/'
        return; // Exit the function
      }
      const list_response = await fetch('/list_sponsors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await list_response.json();
      setSponsors(data);
    } catch (error) {
      console.error('Error adding sponsor:', error);
    }
  };
  // const handleSponsorClick = (sponsorId) => {
  //   navigate(`/sponsors/${sponsorId}`);
  // };

  const [savedSponsors, setSavedSponsors] = useState([]); // Store the saved sponsor IDs

  // Load saved sponsors from localStorage when the component mounts
  useEffect(() => {
    const savedSponsorsFromStorage = localStorage.getItem('savedSponsors');

    // Check if there's anything in localStorage and if it's a valid array
    if (savedSponsorsFromStorage) {
      const parsedSponsors = JSON.parse(savedSponsorsFromStorage);
      if (Array.isArray(parsedSponsors)) {
        setSavedSponsors(parsedSponsors); // Only set saved sponsors if they are in array format
      }
    }
  }, []); // Ensures this runs only once when the component mounts

  // Save the updated list of saved sponsors to localStorage whenever it changes
  useEffect(() => {
    if (savedSponsors.length > 0) {
      localStorage.setItem('savedSponsors', JSON.stringify(savedSponsors));
    } else {
      // If no sponsors are saved, ensure savedSponsors is cleared in localStorage
      localStorage.removeItem('savedSponsors');
    }
  }, [savedSponsors]); // Ensures saved sponsors are updated, and cleared when there are none.

  const handleSaveSponsor = (sponsorId) => {
    // If sponsor is already saved, remove it, else add it to saved list
    if (savedSponsors.includes(sponsorId)) {
      setSavedSponsors(savedSponsors.filter((id) => id !== sponsorId)); // Remove sponsor
      console.log('removed: ', sponsorId);
    } else {
      console.log('saved: ', sponsorId);
      setSavedSponsors([...savedSponsors, sponsorId]); // Add sponsor
    }
  };
  return (
    <div id="sponsor-page" style={{ width: '100%' }}>
      <div id="navbar">
        <div id="logo">
          <Link to="/">
            {/* <img src="assets/logo.png" alt="Organization Logo" className="logo" /> */}
          </Link>
          <h2>BridgeUp</h2>
        </div>
      </div>
      {/* <header>
        <div className="logo-container">
          <Link to="/">
            <img
              src="assets/logo.png"
              alt="Organization Logo"
              className="logo"
            />
          </Link>
          <h2>Organization Name</h2>
        </div>
        <nav className="navbar">
          <Link to="/sponsors">Sponsors</Link>
          <Link to="/sponsors">Sponsors</Link>
          <Link to="/contact-us">Contact us</Link>
        </nav>
        <button className="popup-button" onClick={() => handlePopupToggle()}>
          Add New Sponsor
        </button>
      </header> */}

      <div id="filter-search">
        <div id="filter">
          <div className="filters" id="city">
            <h1 className="filtername">CITY OR AREA ⌵</h1>
            <input
              className="filters-res"
              type="text"
              name="city"
              id="city"
              defaultValue="Delhi"
            />
          </div>
          <div className="filters" id="footfall">
            <h1 className="filtername">DOMAIN ⌵</h1>
            {/* <input
              className="filters-res"
              type="text"
              name="domain"
              id="domain"
              defaultValue="Food"
            /> */}
            <select className="filters-res" id="domain" name="domain">
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="games">Games</option>
            </select>
          </div>

          <button type="submit">SEARCH</button>
        </div>
        {/* <p>Search Result</p> */}
        <h2 id="result">
          <span>40</span> Sponsors in <span>Delhi</span>
        </h2>
      </div>
      <div id="blue-color"></div>

      <div className="main-content">
        {/* <h1>Sponsors</h1>
        <button
          className="main-content button"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Sponsor
        </button> */}
        <div id="sponsors-container">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="sponsor-card"
              // onClick={() => handleSponsorClick(sponsor.id)}
            >
              <div id="sponsor-image">
                <img src="web\src\pages\assets\img1.jpg" alt="" />
              </div>
              <h3 id="sponsor-name">{sponsor.organization_name}</h3>
              <h3 id="sponsor-loc">Delhi</h3>
              <p className="size-11" id="desc-details">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                consequuntur quasi quam fugiat impedit expedita culpa vel ipsum
                voluptatibus exercitationem magni nesciunt itaque, deleniti sed
                quae vitae eaque illum adipisci?
              </p>
              <FontAwesomeIcon
                className={`sponsor-heart-icon ${
                  savedSponsors.includes(sponsor.id) ? 'red' : 'default'
                }`}
                icon={
                  savedSponsors.includes(sponsor.id)
                    ? faHeartSolid
                    : faHeartRegular
                }
                size="xl"
                onClick={() => handleSaveSponsor(sponsor.id)} // Toggle save/remove sponsor
              />
              {/* <p>
                <strong>Sponsorship Budget:</strong>{' '}
                {sponsor.sponsorship_budget}
              </p>
              <p>
                <strong>College Tier Requirement:</strong>{' '}
                {sponsor.college_tier_requirement}
              </p>
              <p>
                <strong>Crowd Requirements:</strong>{' '}
                {sponsor.crowd_requirements}
              </p> */}
            </div>
          ))}
        </div>
      </div>
      {/* {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <button
              className="close-popup"
              onClick={() => setIsPopupOpen(false)}
            >
              X
            </button>
            <h2>Add New Sponsor</h2>
            <input
              type="text"
              name="organization_name"
              placeholder="Organization Name"
              value={newSponsor.organization_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="sponsorship_budget"
              placeholder="Sponsorship Budget"
              value={newSponsor.sponsorship_budget}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="college_tier_requirement"
              placeholder="College Tier Requirement"
              value={newSponsor.college_tier_requirement}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="crowd_requirements"
              placeholder="Crowd Requirements"
              value={newSponsor.crowd_requirements}
              onChange={handleInputChange}
            />
            <button onClick={handleAddSponsor}>Add Sponsor</button>
          </div>
        </div>
      )} */}
    </div>
  );
};
export default Sponsors;
