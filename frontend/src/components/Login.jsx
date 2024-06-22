import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, { phone, password });
      toast.success("Login successful",{icon:"👏"})
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!")
    }finally{
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />; 
  }
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
