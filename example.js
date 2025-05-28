const apiClient = require('./utils/apiClient');

async function example() {
    try {
        // Register a new user
        const registerResponse = await apiClient.register({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Registration successful:', registerResponse);

        // Login
        const loginResponse = await apiClient.login({
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Login successful:', loginResponse);

        // Get all users (this will automatically handle token refresh if needed)
        const users = await apiClient.getUsers();
        console.log('Users:', users.data);

        // Get specific user
        const user = await apiClient.getUser(1);
        console.log('User:', user.data);

        // Update user
        const updatedUser = await apiClient.updateUser(1, {
            username: 'updateduser',
            email: 'updated@example.com'
        });
        console.log('Updated user:', updatedUser.data);

        // Delete user
        const deleteResponse = await apiClient.deleteUser(1);
        console.log('Delete response:', deleteResponse.data);

        // Logout
        apiClient.logout();
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Run the example
example(); 