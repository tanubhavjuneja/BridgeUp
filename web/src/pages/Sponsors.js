import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'; 
import './style.css';
import './sponsors.css';
const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [city, setCity] = useState('Delhi');
  const [domain, setDomain] = useState('fashion');
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
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setCity(value);
    } else if (name === 'domain') {
      setDomain(value);
    }
  };
  const fetchFilteredSponsors = (city, domain) => {
    fetch(`/list_sponsors?city=${city}&domain=${domain}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSponsors(data))
      .catch((error) => console.error('Error fetching filtered sponsors:', error));
  };
  const [savedSponsors, setSavedSponsors] = useState([]); 
  useEffect(() => {
    const savedSponsorsFromStorage = localStorage.getItem('savedSponsors');
    if (savedSponsorsFromStorage) {
      const parsedSponsors = JSON.parse(savedSponsorsFromStorage);
      if (Array.isArray(parsedSponsors)) {
        setSavedSponsors(parsedSponsors); 
      }
    }
  }, []); 
  useEffect(() => {
    if (savedSponsors.length > 0) {
      localStorage.setItem('savedSponsors', JSON.stringify(savedSponsors));
    } else {
      localStorage.removeItem('savedSponsors');
    }
  }, [savedSponsors]); 
  const handleSaveSponsor = (sponsorId) => {
    if (savedSponsors.includes(sponsorId)) {
      setSavedSponsors(savedSponsors.filter((id) => id !== sponsorId)); 
      console.log('removed: ', sponsorId);
    } else {
      console.log('saved: ', sponsorId);
      setSavedSponsors([...savedSponsors, sponsorId]); 
    }
  };
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredSponsors(city, domain);
  };
  return (
    <div id="sponsor-page" style={{ width: '100%' }}>
      <div id="navbar">
        <div id="logo">
          <Link to="/">
          </Link>
          <h2>BridgeUp</h2>
        </div>
      </div>
      <div id="filter-search">
        <form id="filter" onSubmit={handleFilterSubmit}>
          <div className="filters" id="city">
            <h1 className="filtername">CITY OR AREA ⌵</h1>
            <input
              className="filters-res"
              type="text"
              name="city"
              id="city"
              value={city}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filters" id="footfall">
            <h1 className="filtername">DOMAIN ⌵</h1>
            <select
              className="filters-res"
              id="domain"
              name="domain"
              value={domain}
              onChange={handleFilterChange}
            >
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="games">Games</option>
            </select>
          </div>
          <button type="submit">SEARCH</button>
        </form>
        <h2 id="result">
          <span>{sponsors.length}</span> Sponsors in <span>{city}</span>
        </h2>
      </div>
      <div id="blue-color"></div>

      <div className="main-content">
        <div id="sponsors-container">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="sponsor-card"
            >
              <div id="sponsor-image">
                <img src={sponsor.logo} alt="" />
              </div>
              <h3 id="sponsor-name">{sponsor.company_name}</h3>
              <h3 id="sponsor-loc">{sponsor.location}</h3>
              <p className="size-11" id="desc-details">
                {sponsor.description}
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
                onClick={() => handleSaveSponsor(sponsor.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Sponsors;