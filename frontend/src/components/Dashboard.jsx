import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="profile">
        {/* <img src={`data:image/jpeg;base64,${user.photo}`} alt="Profile" /> */}
        {user.photo ? (
        <img src={`data:image/jpeg;base64,${user.photo}`} alt="Profile" />
      ) : (
        <img src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg" alt="Default Profile" />
      )}
        <p>Name: {user.name || ""}</p>
        <p>Email: {user.email || ""}</p>
        <p>Phone: {user.phone || ""}</p>
        <p>Past Experience: {user.pastExperience || ""}</p>
        <p>Skill Sets: {user.skillSets && user.skillSets.join(', ') || ""}</p>
        <p>Education: {user.education || ""}</p>
      </div>
      <button onClick={() => navigate('/profile-update')}>Update Profile</button>
    </div>
  );
};

export default Dashboard;
