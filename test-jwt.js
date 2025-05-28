require('dotenv').config();
const jwt = require('jsonwebtoken');

// Test JWT token generation and verification
function testJWT() {
    console.log('\n=== Testing JWT Functionality ===');

    // Test data
    const testUser = {
        id: 1,
        email: 'test@example.com'
    };

    try {
        // Generate access token
        const accessToken = jwt.sign(
            testUser,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        console.log('✓ Access token generated successfully');

        // Generate refresh token
        const refreshToken = jwt.sign(
            { id: testUser.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
        console.log('✓ Refresh token generated successfully');

        // Verify access token
        const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log('✓ Access token verified successfully');
        console.log('  Decoded access token:', decodedAccess);

        // Verify refresh token
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('✓ Refresh token verified successfully');
        console.log('  Decoded refresh token:', decodedRefresh);

        // Test token expiration
        const expiredToken = jwt.sign(
            testUser,
            process.env.JWT_SECRET,
            { expiresIn: '1s' }
        );
        console.log('✓ Expired token generated successfully');

        // Wait for token to expire
        setTimeout(() => {
            try {
                jwt.verify(expiredToken, process.env.JWT_SECRET);
                console.log('✗ Expired token verification should have failed');
            } catch (error) {
                console.log('✓ Expired token verification failed as expected');
            }
        }, 2000);

    } catch (error) {
        console.error('✗ JWT Test Failed:', error.message);
    }
}

// Run the test
testJWT(); 