require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { json } = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Verify environment variables
console.log('\n=== Environment Variables Check ===');
console.log('JWT Configuration:', {
    secret: process.env.JWT_SECRET ? '✓ Set' : '✗ Not Set',
    refreshSecret: process.env.JWT_REFRESH_SECRET ? '✓ Set' : '✗ Not Set',
    expiresIn: process.env.JWT_EXPIRES_IN || '✗ Not Set',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '✗ Not Set'
});
console.log('Server Configuration:', {
    port: process.env.PORT || '✗ Not Set',
    nodeEnv: process.env.NODE_ENV || '✗ Not Set'
});
console.log('JSON Server Configuration:', {
    port: process.env.JSON_SERVER_PORT || '✗ Not Set'
});
console.log('================================\n');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 