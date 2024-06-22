import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileUpdate = () => {
  const [user, setUser] = useState({});
  const [photo, setPhoto] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('pastExperience', user.pastExperience);
    formData.append('skillSets', user.skillSets);
    formData.append('education', user.education);
    if (photo) formData.append('photo', photo);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      toast.success("Profile updated successfully",{icon:"🙂"})
     navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!")
    }
  };

  return (
    <div className="profile-update-container">
      <form onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        {user.photo ? (
        
          <img src={`data:image/jpeg;base64,${user.photo}`} alt="Profile" />):(
          <img src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg" alt="Default Profile" />
      
     )}
        <input type="text" placeholder="Name" value={user.name || ''} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        <textarea placeholder="Past Experience" value={user.pastExperience || ''} onChange={(e) => setUser({ ...user, pastExperience: e.target.value })}></textarea>
        <input type="text" placeholder="Skill Sets" value={user.skillSets || ''} onChange={(e) => setUser({ ...user, skillSets: e.target.value })} />
        <input type="text" placeholder="Education" value={user.education || ''} onChange={(e) => setUser({ ...user, education: e.target.value })} />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <button type="submit">Update</button>
      </form>
  
    </div>
  );
};

export default ProfileUpdate;
