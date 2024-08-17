// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('./mailer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.post('/api/signup', async (req, res) => {
    const { name, email, phoneNumber, companyName, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, phoneNumber, companyName, password: hashedPassword });
        await newUser.save();
        await sendEmail(email, 'Welcome to Our Service', `You have successfully signed up. Your password is: ${password}`);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, companyName } = req.body;

    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Standardize the comparison
        const normalizedCompanyName = companyName.trim().toLowerCase();
        const normalizedUserCompanyName = user.companyName.trim().toLowerCase();

        if (normalizedUserCompanyName !== normalizedCompanyName) {
            console.log('Company name does not match:', {
                expected: normalizedUserCompanyName,
                received: normalizedCompanyName
            });
            return res.status(401).json({ message: 'Invalid company name' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
        console.log (otp)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        await user.save();

        await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        console.log('Received email:', email);
        console.log('Received OTP:', otp);

        const user = await User.findOne({ email, otp });
        if (!user) {
            console.error('Invalid email or OTP');
            return res.status(400).json({ message: 'Invalid email or OTP' });
        }

        if (user.otpExpires < Date.now()) {
            console.error('OTP expired');
            return res.status(400).json({ message: 'Expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
});
app.post('/api/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
