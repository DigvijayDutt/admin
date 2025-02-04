import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dash from './pages/Dash';
import Learning from './pages/learning'; // Import Learning Page
import EditLearningArea from './pages/EditLearningArea'; // Corrected import name
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/learning" element={<Learning />} /> 
        <Route path="/editlearning" element={<EditLearningArea />} />
      </Routes>
    </Router>
  );
}

export default App;
