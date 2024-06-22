import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProfileUpdate from './components/ProfileUpdate';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Toaster position="top-center" reverseOrder={false} /> 
        <Routes>
          <Route exact path="/login" element={<Login/>} />
          <Route path="/" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/profile-update" element={<ProfileUpdate/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
