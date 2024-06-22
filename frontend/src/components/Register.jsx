import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
      return alert('Passwords do not match');
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { phone, email, name, password });
      Navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Re-type Password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
