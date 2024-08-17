import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create this file for styling

import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);
            if (response.status === 200) {
                alert('Login successful!');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert(error.response.data.message); // Display the error message in an alert
                } else {
                    alert('An error occurred during login. Please try again.');
                }
            } else {
                console.error('Error logging in', error);
                alert('An error occurred during login. Please try again.');
            }
        }
    };
    const handleForgotPassword = () => {
        navigate(`/forgot-password?email=${formData.email}`);
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
           
            <a href="/signin">Sign Up</a>
        </div>
    );
}

export default Login;
