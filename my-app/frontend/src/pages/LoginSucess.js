import React, { useEffect, useState } from 'react';
import './LoginSuccess.css';

const LoginSuccess = ({ username = "User" }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="login-success-container">
      <div className="login-success-card">
        {loading ? (
          <div className="login-loader">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        ) : (
          <>
            <div className="success-icon">
              <div className="success-icon-circle">
                <div className="success-icon-check"></div>
              </div>
            </div>
            <h1 className="success-title">Login Successful!</h1>
            <p className="success-message">Welcome back, {username}</p>
            <p className="success-description">You have successfully logged into your account.</p>
            

            <div className="sparkles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`sparkle sparkle-${i}`}></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSuccess;