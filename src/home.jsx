import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styleloginpage.css';




const Home = () => {
  const navigate = useNavigate();
  const  navigateTo = (path) => {navigate(path)};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      console.log("response:", response.data);

      if (response.data.token && response.data.user) {
        setSuccess("Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirection après login
        navigate("/pagetache");
      } else {
        setError("Invalid login response. Please try again");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Login failed. Please try again");
      } else {
        setError("Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-body'>
      <div className='login-container'>
      <h2>Welcome</h2>
      <form onSubmit={handleSubmit} className='form_home'>
        <div className='form-group'>
          <label htmlFor="email" className='label-login'>Email:</label>
          <input
            type="email"
            id="email"
            placeholder='Enter your email'
            value={email}
            className='input-login'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="password" className='label-login'>Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            className='input-login'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

         <button type="submit" className='button-login' disabled={loading}>
    {loading ? "Logging in..." : "Login"}
  </button>

  {/* Bouton Sign Up sous Login */}
  <a
    onClick={() => navigateTo('/registre')}
    className='signup-button'
  >
    Sign Up
  </a>

      </form>

      {error && <div className='alert-error'>{error}</div>}
      {success && <div className='alert-success'>{success}</div>}
    </div>
    </div>
  );
};

export default Home;