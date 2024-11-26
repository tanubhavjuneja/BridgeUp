import React, { useState } from 'react';
import './components-style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function FirstPage() {
  const tabs = [
    {
      id: 'event',
      label: 'Want sponsors for your event?',
      content: (
        <div id="event-details">
          <div className="info-container" onClick={() => handleClick(0)}>
            <h2 className="details"> About Your Company/College</h2>
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(1)}>
            <h2 className="details">About Your Event</h2>
            <FontAwesomeIcon
              icon="fa-solid fa-circle-check fa-3x"
              className="circle-check target"
            />
            <p className="target">Click to enter details</p>
          </div>
          <div className="info-container" onClick={() => handleClick(2)}>
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
    {
      id: 'sponsors',
      label: 'Want to sponsor an event?',
      content: (
        <div id="sponsor-details">
          <div className="info-container" onClick={() => handleClick(3)}>
            <h2 className="details">Your Company Name</h2>
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
  const [activeTabId, setActiveTabId] = useState('event');
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await fetch("/upload_image", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        if (result.file_path) {
          localStorage.setItem("logo", result.file_path);
          console.log(localStorage.getItem("logo"));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };  
  const [visibleDivIndex, setVisibleDivIndex] = useState(8);
  const clearForms = () => {
    setVisibleDivIndex(null);
    const formKeys = Object.keys(localStorage).filter((key) => key.startsWith('form_'));
    formKeys.forEach((key) => localStorage.removeItem(key));
    const forms = document.querySelectorAll('.form-field input, .form-field textarea');
    forms.forEach((field) => {
      field.value = '';
    });
  };
  const handleClick = (index) => {
    setVisibleDivIndex(index); 
  };
  const handleSubmit = (e, formIndex) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    localStorage.setItem(`form_${formIndex}`, JSON.stringify(formObject));
    setVisibleDivIndex(null);
  };
  const handleClosePopup = () => {
    setVisibleDivIndex(null);
  };
  return (
    <>
      <div id="upper-one">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              clearForms();
              setActiveTabId(tab.id);
            }}
            className={`sponsor-event-box ${activeTabId === tab.id ? 'active' : 'inactive'}`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div id="bottom-one" className="hero-divs">
        {tabs.find((tab) => tab.id === activeTabId)?.content}
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
              id="organization_name"
              name="organization_name"
              required
              placeholder=" "
            />
            <label for="soc_name">Society/Organizer Name</label>
          </div>
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
            <input type="date" id="date" name="date" required placeholder=" " />
            <label for="date">Date</label>
          </div>
          <div class="form-field">
            <input type="time" id="time" name="time" required placeholder=" " />
            <label for="time">Time</label>
          </div>
          <div class="form-field">
            <input
              type="text"
              id="budget"
              name="budget"
              required
              placeholder=" "
            />
            <label for="budget">Budget</label>
          </div>
          <div class="form-field">
            <input
              type="text"
              id="footfall"
              name="footfall"
              required
              placeholder=" "
            />
            <label for="footfall">Footfall</label>
          </div>
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
              id="description"
              name="description"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="Description">Description</label>
            <input type="file"
              id="image"
              name="image"
              rows="4"
              onChange={handleImageChange}
              required
            ></input>
            <label for="image">Image</label>
          </div>
          <button type="submit" class="submit-btn">
            Submit
          </button>
        </form>
      </div>
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
              id="location"
              name="location"
              required
              placeholder=" "
            />
            <label for="Location-Address">Location/Address</label>
          </div>
          <div class="form-field">
            <input
              type="text"
              id="contact"
              name="contact"
              required
              placeholder=" "
            />
            <label for="contact_no">Contact no(for whatsapp)</label>
          </div>
          <div class="form-field">
            <input
              type="text"
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
              id="description"
              name="description"
              rows="4"
              required
              placeholder=" "
            ></textarea>
            <label for="description">Description</label>
            <input type="file"
              id="logo"
              name="logo"
              rows="4"
              onChange={handleImageChange}
              required
            ></input>
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