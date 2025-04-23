// src/pages/ForgotPassword.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleContinue = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/forgot-password`,
                { email}
              );
            alert('OTP sent to your email');
            navigate(`/otp-verification?email=${email}`);
        } catch (error) {
            console.error('Error sending OTP', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        < div className="forgot-password-page">
          <div  className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleContinue}>
                <h2>Forgot Password</h2>
                <input
                    type="email"
                    name="email"
                    value={email}
                    readOnly
                />
                <button type="submit">Continue</button>
            </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
