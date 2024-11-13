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
          <div className="info-container">
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
          <div className="info-container">
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
          <div className="info-container">
            <h2 className="details">Sponsorship Details</h2>
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
          <div className="info-container">
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
          <div className="info-container">
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
          <div className="info-container">
            <h2 className="details">How do you want to sponsor?</h2>
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
    </>
  );
}
