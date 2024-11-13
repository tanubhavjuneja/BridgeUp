import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`/event/${id}`, { 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.json())
    .then(data => setEvent(data))
    .catch(error => console.error('Error fetching event details:', error));
  }, [id]);

  if (!event) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <header>
        <div className="logo-container">
          <img src="/assets/logo.png" alt="Organization Logo" className="logo" />
          <h2>Organization Name</h2>
        </div>
      </header>
      <div className="main-content">
        <h1>{event.event_name}</h1>
        <p><strong>Organizer:</strong> {event.event_organizer}</p>
        <p><strong>College:</strong> {event.college}</p>
        <p><strong>Budget Requirement:</strong> {event.budget_requirement}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Expected Crowd:</strong> {event.expected_crowd}</p>
        {event.whatsapp_number && (
          <a
            href={`https://wa.me/${event.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            Chat on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
