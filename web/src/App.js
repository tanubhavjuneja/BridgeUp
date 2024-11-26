import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Events from './pages/Events';
import Sponsors from './pages/Sponsors';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare,
  faCoffee,
  faHeart,
  faCircleCheck,
  faCircleXmark,
  faCaretDown,
  faUser,
  faAngleDown,
  faEnvelope,
  faPhone,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  fab,
  faCheckSquare,
  faCoffee,
  faHeart,
  faCircleCheck,
  faCircleXmark,
  faCaretDown,
  faUser,
  faAngleDown,
  faEnvelope,
  faPhone,
  faArrowRight
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </Router>
  );
};

export default App;
