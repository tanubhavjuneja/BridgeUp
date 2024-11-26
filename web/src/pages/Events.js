import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; 
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'; 
import './events.css';
import './style.css';
import Navbar from '../components/Navbar';
const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchParams, setSearchParams] = useState({
    city: 'New Delhi',
    footfall: '1000-10000',
    eventDate: new Date().toISOString().split('T')[0],
    cost: '2000-50000'
  });
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
  useEffect(() => {
    fetch('/list_events', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const fetchFilteredEvents = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString(); 
      const response = await fetch(`/list_events?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching filtered events:', error);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault(); 
    fetchFilteredEvents();
  };
  const [savedEvents, setSavedEvents] = useState([]);
  useEffect(() => {
    const savedEventsFromStorage = localStorage.getItem('savedEvents');
    if (savedEventsFromStorage) {
      const parsedEvents = JSON.parse(savedEventsFromStorage);
      if (Array.isArray(parsedEvents)) {
        setSavedEvents(parsedEvents); 
      }
    }
  }, []);
  useEffect(() => {
    if (savedEvents.length > 0) {
      localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    } else {
      localStorage.removeItem('savedEvents');
    }
  }, [savedEvents]); 
  const handleSaveEvent = (eventId) => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter((id) => id !== eventId)); 
      console.log('removed: ', eventId);
    } else {
      console.log('saved: ', eventId);
      setSavedEvents([...savedEvents, eventId]); 
    }
  };
  return (
    <div id="event-page" style={{ width: '100%' }}>
      <Navbar />
      <div id="filter-search">
        <form onSubmit={handleSearch}>
          <div id="filter">
            <div className="filters" id="city">
              <h1 className="filtername">CITY OR AREA ⌵</h1>
              <input
                className="filters-res"
                type="text"
                name="city"
                id="city"
                value={searchParams.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filters" id="footfall">
              <h1 className="filtername">FOOTFALL ⌵</h1>
              <input
                className="filters-res"
                type="text"
                name="footfall"
                id="search-footfall"
                value={searchParams.footfall}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filters" id="eventDate">
              <h1 className="filtername">EVENT DATE ⌵</h1>
              <input
                className="filters-res"
                type="date"
                name="eventDate"
                id="event-date"
                value={searchParams.eventDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filters" id="cost">
              <h1 className="filtername">COST ⌵</h1>
              <input
                className="filters-res"
                type="text"
                name="cost"
                id="cost"
                value={searchParams.cost}
                onChange={handleFilterChange}
              />
            </div>
            <button type="submit">SEARCH</button>
          </div>
        </form>
        <h2 id="result">
          <span>{events.length}</span> Events in <span>{searchParams.city}</span>
        </h2>
      </div>
      <div id="blue-color"></div>
      <div className="main-content">
        <div id="events-container">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
            >
              <div id="part-1">
                <div id="event-pic">
                  <img src={event.image} alt="" />
                </div>
              </div>
              <div id="part-2">
                <h1>{event.event_name}</h1>
                <div id="location">
                  <div className="details" id="soc-name">
                    {event.event_organizer}
                  </div>
                  <div className="details" id="clg-name">
                    {event.college}
                  </div>
                </div>
                <p id="date">
                  <span>On</span> {event.date}
                </p>
                <p id="time" className="size-11">
                 { event.time }
                </p>
                <div id="bf">
                  <div className="details" id="budget">
                    <p>Budget: </p>
                    <p className="size-11 op">{event.budget}</p>
                    <p className="size-11 op">/-</p>
                  </div>
                  <div className="details" id="footfall">
                    <p>Footfall: </p>
                    <p className="size-11 op">{event.footfall}</p>
                  </div>
                </div>
                <p className="size-11">AVAILABLE</p>
                <div id="selected-tags"></div>
              </div>
              <div id="part-3">
                <h1 id="description">Description</h1>
                <p className="size-11" id="desc-details">
                  {event.description}
                </p>
                <FontAwesomeIcon
                  className={`heart-icon ${
                    savedEvents.includes(event.id) ? 'red' : 'default'
                  }`}
                  icon={
                    savedEvents.includes(event.id)
                      ? faHeartSolid
                      : faHeartRegular
                  }
                  size="xl"
                  onClick={() => handleSaveEvent(event.id)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Events;