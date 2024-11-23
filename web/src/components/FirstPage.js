import React, { useState } from 'react';
import './components-style.css';
import DateRangePicker from './DateRangePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FirstPage() {
  // Array of tabs with unique content for each tab
  const tabs = [
    {
      id: 'event',
      label: 'Want sponsors for your event?',
      content: (
        <div id="event-details">
          <div className="info-container" onClick={() => handleClick(0)}>
            <h2 className="details"> About Your Company/College</h2>
            {/* <input
              className="input-tags"
              type="text"
              id="register-organization"
              placeholder="Organization"
              required
            /> */}
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(1)}>
            <h2 className="details">About Your Event</h2>
            {/* <input
              className="input-tags"
              type="text"
              id="event-name"
              placeholder="Event Name"
              required
            /> */}
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(2)}>
            <h2 className="details">Images</h2>
            {/* <DateRangePicker /> */}
            {/* 
            <input className="input-tags" type="date" name="Date" id="date" /> */}
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
        </div>
      ),
    },
    {
      id: 'sponsors',
      label: 'Want to sponsor an event?',
      content: (
        <div id="sponsor-details">
          <div className="info-container" onClick={() => handleClick(3)}>
            <h2 className="details">Your Company Name</h2>
            {/* <input
              className="input-tags"
              type="text"
              id="register-organization"
              placeholder="Organization"
              required
            /> */}
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(4)}>
            <h2 className="details">
              Your Instagram (or any other social profiles)
            </h2>
            {/* <input
              className="input-tags"
              type="text"
              id="event-name"
              placeholder="Event Name"
              required
            /> */}
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(5)}>
            <h2 className="details">Images</h2>
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
        </div>
      ),
    },
  ];

  // State to track the active tab's ID and its content
  const [activeTabId, setActiveTabId] = useState('event');

  // Find content for the active tab
  const activeContent = tabs.find((tab) => tab.id === activeTabId)?.content;

  let infoCont = document.getElementsByClassName('info-container');
  let formCont = document.getElementsByClassName('form-container');
  //let overlay = document.getElementById('overlay2');

  const [visibleDivIndex, setVisibleDivIndex] = useState(8);

  // Handler to display the corresponding "b" div when an "a" div is clicked
  const handleClick = (index) => {
    setVisibleDivIndex(index); // Set the index of the clicked "a" div
    //overlay.style.zIndex = '99';
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submission
    setVisibleDivIndex(null); // Hide the visible "b" div after form submission
    //overlay.style.zIndex = '2';
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setVisibleDivIndex(null);
    //overlay.style.zIndex = '2';
  };

  return (
    <>
      <div id="upper-one">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`sponsor-event-box ${
              activeTabId === tab.id ? 'active' : 'inactive'
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content display area */}
      <div id="bottom-one" className="hero-divs">
        {activeContent}
      </div>

      <div
        className="form-container"
        id="form1"
        style={{ display: visibleDivIndex === 0 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 0)}>
          <div class="form-field">
            <input
              type="text"
              id="college_name"
              name="college_name"
              required
              placeholder=" "
            />
            <label for="name">Company/College Name</label>
          </div>

          <div class="form-field">
            <input
              type="text"
              id="Location"
              name="location"
              required
              placeholder=" "
            />
            <label for="location">Location</label>
          </div>

          <div class="form-field">
            <input
              type="text"
              id="soc_name"
              name="soc_name"
              required
              placeholder=" "
            />
            <label for="soc_name">Society/Organizer Name</label>
          </div>

          {/* <div class="form-field">
            <textarea
              id="message"
              name="Description"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="message">Message</label>
          </div> */}

          <button type="submit" class="submit-btn">
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
          </button>
        </form>
      </div>

      <div
        className="form-container"
        id="form2"
        style={{ display: visibleDivIndex === 1 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 1)}>
          <div class="form-field">
            <input
              type="text"
              id="event_name"
              name="event_name"
              required
              placeholder=" "
            />
            <label for="event_name">Event Name</label>
          </div>

          <div class="form-field">
            <input type="date" id="Date" name="Date" required placeholder=" " />
            <label for="Date">Date</label>
          </div>

          <div class="form-field">
            <input type="time" id="Time" name="Time" required placeholder=" " />
            <label for="Time">Time</label>
          </div>

          <div class="form-field">
            <input
              type="number"
              id="Budget"
              name="Budget"
              required
              placeholder=" "
            />
            <label for="Budget">Budget</label>
          </div>

          <div class="form-field">
            <input
              type="number"
              id="Footfall"
              name="Footfall"
              required
              placeholder=" "
            />
            <label for="Footfall">Footfall</label>
          </div>

          {/* <div class="form-field">
            <textarea
              id="message"
              name="Description"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="message">Message</label>
          </div> */}

          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>

      <div
        className="form-container"
        id="form3"
        style={{ display: visibleDivIndex === 2 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 2)}>
          <div class="form-field">
            <textarea
              id="Description"
              name="Description"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="Description">Description</label>
          </div>

          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>

      {/* For sponsors */}

      <div
        className="form-container"
        id="form1"
        style={{ display: visibleDivIndex === 3 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 3)}>
          <div class="form-field">
            <input
              type="text"
              id="company_name"
              name="company_name"
              required
              placeholder=" "
            />
            <label for="company_name">Company Name</label>
          </div>
          <div class="form-field">
            <input
              type="text"
              id="Location-Address"
              name="Location-Address"
              required
              placeholder=" "
            />
            <label for="Location-Address">Location/Address</label>
          </div>
          <div class="form-field">
            <input
              type="number"
              id="contact-no"
              name="contact-no"
              required
              placeholder=" "
            />
            <label for="contact-no">Contact no(for whatsapp)</label>
          </div>
          <div class="form-field">
            <input
              type="number"
              id="budget"
              name="budget"
              required
              placeholder=" "
            />
            <label for="budget">Budget (in Rs.)</label>
          </div>
          <div class="form-field">
            <input
              type="text"
              id="domain"
              name="domain"
              required
              placeholder=" "
            />
            <label for="domain">Domain</label>
          </div>

          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>

      <div
        className="form-container"
        id="form2"
        style={{ display: visibleDivIndex === 4 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 4)}>
          <div class="form-field">
            <input
              type="text"
              id="insta"
              name="insta"
              required
              placeholder=" "
            />
            <label for="insta">Instagram Handle</label>
          </div>
          <div class="form-field">
            <input type="text" id="twitter" name="twitter" placeholder=" " />
            <label for="twitter">Twitter Handle</label>
          </div>
          <div class="form-field">
            <input type="text" id="other" name="other" placeholder=" " />
            <label for="other">Others</label>
          </div>

          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>

      <div
        className="form-container"
        id="form3"
        style={{ display: visibleDivIndex === 5 ? 'block' : 'none' }}
      >
        <button className="close-popup" onClick={handleClosePopup}>
          X
        </button>
        <FontAwesomeIcon
          icon="fa-solid fa-circle-xmark"
          onClick={handleClosePopup}
          className="close-circle"
        />
        <form onSubmit={(e) => handleSubmit(e, 5)}>
          <div class="form-field">
            <textarea
              id="logo"
              name="logo"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="logo">Logo</label>
          </div>

          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
