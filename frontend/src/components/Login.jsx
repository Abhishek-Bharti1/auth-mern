import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from './Loader';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, { phone:"+91"+phone, password });
      toast.success("Login successful", { icon: "👏" });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      // Prepend +91 to the phone number
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/request-otp`, { phone: "+91" + phone });
      toast.success("OTP sent successfully", { icon: "📧" });
      setOtpRequested(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/verify-otp`, { phone:"+91"+phone , otp });
      toast.success("Login successful", { icon: "👏" });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP or something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login-container">
      {!otpRequested ? (
        <form onSubmit={handlePasswordLogin}>
          <h2>Login with Password</h2>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <button type="button" onClick={handleRequestOtp}>Login with OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpLogin}>
          <h2>Login with OTP</h2>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            readOnly
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
          <button type="button" onClick={() => setOtpRequested(false)}>Back to Password Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
