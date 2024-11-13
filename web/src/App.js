import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Events from './pages/Events';
import Sponsors from './pages/Sponsors';
import EventDetail from './pages/EventDetail';
import SponsorDetail from './pages/SponsorDetail'; // Import the SponsorDetail component
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare,
  faCoffee,
  faHeart,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

library.add(fab, faCheckSquare, faCoffee, faHeart, faCircleCheck);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/sponsors/:id" // Add the route for SponsorDetail
          element={<SponsorDetail />}
        />
      </Routes>
    </Router>
  );
};

export default App;
