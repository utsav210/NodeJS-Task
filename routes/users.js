const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');

// Get all users (protected route)
router.get('/', verifyToken, async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/users');
        const users = response.data.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Get user by ID (protected route)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:3001/users/${req.params.id}`);
        const { password, ...userWithoutPassword } = response.data;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(404).json({ message: "User not found", error: error.message });
    }
});

// Update user (protected route)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow users to update their own profile
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "You can only update your own profile!" });
        }

        const { username, email } = req.body;
        const response = await axios.patch(`http://localhost:3001/users/${req.params.id}`, {
            username,
            email
        });
        const { password, ...userWithoutPassword } = response.data;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// Delete user (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Only allow users to delete their own account
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: "You can only delete your own account!" });
        }

        await axios.delete(`http://localhost:3001/users/${req.params.id}`);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

module.exports = router; 