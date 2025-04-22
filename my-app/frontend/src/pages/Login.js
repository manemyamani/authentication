import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
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
                navigate('/LoginSuccess');

            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert(error.response.data.message);
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
        <div className="login-page">
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                    className="input-white"
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                    className="input-white"
                />
                 <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required className="input-white" />
                <button type="submit">Login</button>
            </form>
            <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
            <span>Don't have an account? <a href="/signin">Sign Up</a></span>
        </div>
        </div>
    );
}

export default Login;