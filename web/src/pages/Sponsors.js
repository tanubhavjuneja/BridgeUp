import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './style.css';
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
  const handleSponsorClick = (sponsorId) => {
    navigate(`/sponsors/${sponsorId}`);
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
          <Link to="/events">Events</Link>
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
            <p className="filters-res">Delhi</p>
          </div>
          <div className="filters" id="footfall">
            <h1 className="filtername">FOOTFALL ⌵</h1>
            <p className="filters-res">500-800</p>
          </div>
          <div className="filters" id="eventDate">
            <h1 className="filtername">EVENT DATE ⌵</h1>
            <p className="filters-res">Fri, 1 Nov 2024</p>
          </div>
          <div className="filters" id="cost">
            <h1 className="filtername">COST ⌵</h1>
            <p className="filters-res">Below 2000</p>
          </div>

          <button type="submit">SEARCH</button>
        </div>
        {/* <p>Search Result</p> */}
        <h2 id="result">400 Events in Delhi</h2>
      </div>

      <div className="main-content">
        <h1>Sponsors</h1>
        <button
          className="main-content button"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Sponsor
        </button>
        <div id="sponsors-container">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="sponsor-card"
              onClick={() => handleSponsorClick(sponsor.id)}
            >
              <h3>{sponsor.organization_name}</h3>
              <p>
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
              </p>
            </div>
          ))}
        </div>
      </div>
      {isPopupOpen && (
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
      )}
    </div>
  );
};
export default Sponsors;
