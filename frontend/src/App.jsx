import React, { Suspense, lazy } from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader'; 
import './styles.css';
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProfileUpdate = lazy(() => import('./components/ProfileUpdate'));

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Toaster position="top-center" reverseOrder={false} /> 
      <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile-update" element={<ProfileUpdate />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
