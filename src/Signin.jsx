import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '/SigninPage.css';
const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const validUsername = import.meta.env.VITE_ADMIN_USERNAME ;
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD ;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.username !== validUsername || formData.password !== validPassword) {
      toast.error('Invalid username or password');
      return;
    }

    toast.success('Login successful! Redirecting...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>TEDxFisat Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;