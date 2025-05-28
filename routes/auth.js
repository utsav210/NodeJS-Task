const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required",
                received: { username, email, password: password ? 'provided' : 'missing' }
            });
        }

        // Check if user already exists
        try {
            const response = await axios.get(`http://localhost:3001/users?email=${email}`);
            if (response.data.length > 0) {
                return res.status(400).json({ message: "User already exists!" });
            }
        } catch (error) {
            console.error('Error checking existing user:', error.message);
            return res.status(500).json({ 
                message: "Error checking existing user",
                error: error.message
            });
        }

        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            console.error('Error hashing password:', error.message);
            return res.status(500).json({ 
                message: "Error processing password",
                error: error.message
            });
        }

        // Create new user
        const newUser = {
            username,
            email,
            password: hashedPassword
        };

        // Save user to JSON Server
        let savedUser;
        try {
            savedUser = await axios.post('http://localhost:3001/users', newUser);
        } catch (error) {
            console.error('Error saving user:', error.message);
            return res.status(500).json({ 
                message: "Error saving user to database",
                error: error.message
            });
        }

        // Generate tokens
        let token, refreshToken;
        try {
            token = jwt.sign(
                { id: savedUser.data.id, email: savedUser.data.email },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            refreshToken = jwt.sign(
                { id: savedUser.data.id },
                process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
                { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
            );
        } catch (error) {
            console.error('Error generating tokens:', error.message);
            return res.status(500).json({ 
                message: "Error generating authentication tokens",
                error: error.message
            });
        }

        res.status(201).json({
            message: "User registered successfully",
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Unexpected error in register route:', error);
        res.status(500).json({ 
            message: "Unexpected error during registration",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const response = await axios.get(`http://localhost:3001/users?email=${email}`);
        const user = response.data[0];

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        // Generate tokens
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        res.json({
            message: "Login successful",
            token,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(403).json({ message: "No refresh token provided!" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Generate new tokens
        const newToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid refresh token!" });
    }
});

module.exports = router; 