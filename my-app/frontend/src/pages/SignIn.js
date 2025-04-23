import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isGmailAccount = (email) => {
        return email.endsWith('@gmail.com');
    };
    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
        return passwordRegex.test(password);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let formIsValid = true;
       
        if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid Gmail address.';
            formIsValid = false;
        }
        if (!isGmailAccount(formData.email)) {
            newErrors.email = 'Please enter a valid Gmail address.';
            formIsValid = false;
        }
        if (!isValidPassword(formData.password)) {
            newErrors.password = 'Password must be at least 9 characters long, include one uppercase letter, one number, and one special character.';
            formIsValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            formIsValid = false;
        }
        setErrors(newErrors);
        if (!formIsValid) {
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, formData);           
            if(response.status===201){
             alert('Sign-up successful! Check your email for confirmation.');
             navigate('/login');}
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('already signed up with this mail')
                
            } else {
                console.error('Sign-up error:', error);
                alert('An error occurred during sign-up. Please try again.');
            }
            
            
        }
    };

    return (
        <div className="signin-container">
            <div className="welcome-section">
                <div className="circles">
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
                <div className="welcome-content">
                    <h1 className="welcome-title">Welcome Back!</h1>
                    <p className="welcome-subtitle">Let's create something extraordinary together. Your journey with us continues here.</p>
                    <div className="welcome-features">
                        <div className="feature-item">
                            <div className="feature-icon">🤝</div>
                            <span>Join our thriving community of innovators</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💡</div>
                            <span>Access exclusive collaboration tools</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🚀</div>
                            <span>Transform ideas into reality</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-section">
            <form className="signin-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-white"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-white"
                />
               
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="input-white"
                />
                <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="input-white"
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-white"
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input-white"
                />
                
                <button type="submit">Sign Up</button>
                <div className="login-option">
                <span>Already have an account? <a href="/login">Login here</a></span>
            </div>

            </form>
            </div>
           
        </div>
    );
};

export default SignIn;