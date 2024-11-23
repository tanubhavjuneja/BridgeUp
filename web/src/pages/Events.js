import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Solid heart icon
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'; // Regular heart icon
import './events.css';
import './style.css';

import Navbar from '../components/Navbar';
const Events = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    organiser: '',
    college: '',
    budget: '',
    date: '',
    crowd: '',
  });
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddEvent = async () => {
    try {
      console.log(JSON.stringify(newEvent));
      const response = await fetch('/add_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newEvent),
      });
      setIsPopupOpen(false);
      if (response.status === 401) {
        alert('You are not logged in. Redirecting to the home page.');
        navigate('/');
        return;
      }
      const list_response = await fetch('/list_events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await list_response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const [isRed, setIsRed] = useState(false);
  const [isSolid, setIsSolid] = useState(false);

  // const handleClick = (e) => {
  //   setIsRed(!isRed); // Toggle the color state on click
  //   setIsSolid(!isSolid);
  // };
  const today = new Date().toISOString().split('T')[0];
  const handleDate = (e) => {
    e.target.showPicker(); // Opens the date picker
  };

  //for saving an event
  // const [selectedEventId, setSelectedEventId] = useState(null); // To store the selected event ID

  // const handleClick = (eventId) => {
  //   setSelectedEventId(eventId); // Store the ID of the clicked event
  // };
  const [savedEvents, setSavedEvents] = useState([]); // Store the saved event IDs

  // Load saved events from localStorage when the component mounts
  useEffect(() => {
    const savedEventsFromStorage = localStorage.getItem('savedEvents');

    // Check if there's anything in localStorage and if it's a valid array
    if (savedEventsFromStorage) {
      const parsedEvents = JSON.parse(savedEventsFromStorage);
      if (Array.isArray(parsedEvents)) {
        setSavedEvents(parsedEvents); // Only set saved events if they are in array format
      }
    }
  }, []); // Ensures this runs only once when the component mounts

  // Save the updated list of saved events to localStorage whenever it changes
  useEffect(() => {
    if (savedEvents.length > 0) {
      localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    } else {
      // If no events are saved, ensure savedEvents is cleared in localStorage
      localStorage.removeItem('savedEvents');
    }
  }, [savedEvents]); // Ensures saved events are updated, and cleared when there are none.

  const handleSaveEvent = (eventId) => {
    // If event is already saved, remove it, else add it to saved list
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter((id) => id !== eventId)); // Remove event
      console.log('removed: ', eventId);
    } else {
      console.log('saved: ', eventId);
      setSavedEvents([...savedEvents, eventId]); // Add event
    }
  };

  //our final page
  return (
    <div id="event-page" style={{ width: '100%' }}>
      <Navbar />
      {/* <div className="logo-container">
            <Link to="/">
            <img src="assets/logo.png" alt="Organization Logo" className="logo" />
          </Link>
          <h2>Organization Name</h2>
        </div>
        <nav className="navbar">
            <Link to="/events">Events</Link>
            <Link to="/sponsors">Sponsors</Link>
            <Link to="/contact-us">Contact us</Link>
        </nav>
        <button className="popup-button" onClick={() => handlePopupToggle()}>Add New Event</button> */}
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
            <h1 className="filtername">FOOTFALL ⌵</h1>
            <input
              className="filters-res"
              type="text"
              name="search-footfall"
              id="search-footfall"
              defaultValue="1000"
            />
          </div>
          <div className="filters" id="eventDate">
            <h1 className="filtername">EVENT DATE ⌵</h1>
            <input
              className="filters-res"
              type="date"
              name="event-date"
              id="event-date"
              onFocus={handleDate}
              defaultValue={today}
            />
          </div>
          <div className="filters" id="cost">
            <h1 className="filtername">COST ⌵</h1>
            <input
              className="filters-res"
              type="number"
              name="cost"
              id="cost"
              defaultValue="2000"
            />
          </div>

          <button type="submit">SEARCH</button>
        </div>
        {/* <p>Search Result</p> */}
        <h2 id="result">
          <span>40</span> Events in <span>Delhi</span>
        </h2>
      </div>
      <div id="blue-color"></div>
      <div className="main-content">
        {/* <h1>Upcoming Events</h1>
        <button
          className="main-content button"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Event
        </button> */}
        <div id="events-container">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              // onClick={() => handleEventClick(event.id)}
            >
              <div id="part-1">
                <div id="event-pic">
                  <img src="web\src\pages\assets\img1.jpg" alt="" />
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
                  11am onwards
                </p>
                <div id="bf">
                  <div className="details" id="budget">
                    <p>Budget: </p>
                    <p className="size-11 op">{event.budget_requirement}</p>
                    <p className="size-11 op">/-</p>
                  </div>
                  <div className="details" id="footfall">
                    <p>Footfall: </p>
                    <p className="size-11 op">{event.expected_crowd}</p>
                  </div>
                </div>
                <p className="size-11">AVAILABLE:</p>
                <div id="selected-tags"></div>
              </div>
              <div id="part-3">
                <h1 id="description">Description</h1>
                <p className="size-11" id="desc-details">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                  consequuntur quasi quam fugiat impedit expedita culpa vel
                  ipsum voluptatibus exercitationem magni nesciunt itaque,
                  deleniti sed quae vitae eaque illum adipisci?
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
                  onClick={() => handleSaveEvent(event.id)} // Toggle save/remove event
                />
              </div>

              {/* <h3>{event.event_name}</h3>
              <p>
                <strong>Organizer:</strong> {event.event_organizer}
              </p>
              <p>
                <strong>College:</strong> {event.college}
              </p>
              <p>
                <strong>Budget:</strong> {event.budget_requirement}
              </p>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>
                <strong>Crowd:</strong> {event.expected_crowd}
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
            <h2>Add New Event</h2>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="organiser"
              placeholder="Event Organiser"
              value={newEvent.organiser}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="college"
              placeholder="College"
              value={newEvent.college}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="budget"
              placeholder="Budget Requirement"
              value={newEvent.budget}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="crowd"
              placeholder="Expected Crowd"
              value={newEvent.crowd}
              onChange={handleInputChange}
            />
            <button onClick={handleAddEvent}>Add Event</button>
          </div>
        </div>
      )} */}
    </div>
  );
};
export default Events;
