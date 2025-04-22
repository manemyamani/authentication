import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './OtpVerification.css';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // 10 minutes countdown timer
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }

        // Countdown timer logic
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    alert('OTP has expired. Please request a new one.');
                    navigate('/forgot-password');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
            if (response.status === 200) {
                alert('OTP verified');
                navigate(`/reset-password?email=${email}`);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error verifying OTP', error.response.data);
                alert(`Error: ${error.response.data.message}`);
            } else {
                console.error('Error verifying OTP', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="otp-verification-container">
            <form className="otp-verification-form" onSubmit={handleSubmit}>
                <h2>OTP Verification</h2>
                <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify OTP</button>
                <p>Time left: {formatTime(timeLeft)}</p>
            </form>
        </div>
    );
};

export default OtpVerification;
