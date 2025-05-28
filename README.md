# Node.js Authentication API with JWT and Refresh Tokens

A secure RESTful API built with Node.js, Express.js, and JSON Server, featuring JWT authentication with refresh tokens and automatic token refresh functionality.

## Features

- 🔐 JWT Authentication with Refresh Tokens
- 🔄 Automatic Token Refresh
- 👤 User Registration and Login
- 🔒 Protected Routes
- 📝 CRUD Operations for Users
- 🛡️ Password Hashing
- 🔄 JSON Server as Database
- 🚀 Express.js Backend
- 🔄 CORS Enabled

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# JSON Server Configuration
JSON_SERVER_PORT=3001
```

## Running the Application

Start both the main server and JSON Server:
```bash
npm run dev
```

This will start:
- Main API server on http://localhost:3000
- JSON Server on http://localhost:3001

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
    "refreshToken": "your_refresh_token"
}
```

### User Operations (Protected Routes)

#### Get All Users
```http
GET /api/users
Authorization: Bearer your_jwt_token
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer your_jwt_token
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "username": "updateduser",
    "email": "updated@example.com"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer your_jwt_token
```

## Project Structure

```
project/
├── server.js           # Main application
├── start.js           # Server startup script
├── package.json       # Project configuration
├── db.json           # Database file
├── routes/           # API routes
│   ├── auth.js      # Authentication routes
│   └── users.js     # User management routes
├── middleware/       # Middleware functions
│   └── auth.js      # Authentication middleware
└── utils/           # Utility functions
    └── apiClient.js # API client with token refresh
```

## Security Features

- JWT-based authentication
- Refresh token mechanism
- Password hashing with bcrypt
- Protected routes with middleware
- User can only modify their own data
- Automatic token refresh
- Request queue for concurrent requests during token refresh

## Error Handling

The API includes comprehensive error handling for:
- Invalid credentials
- Missing fields
- Duplicate users
- Invalid tokens
- Server errors
- Database errors

## Development

### Available Scripts

- `npm run dev`: Start both servers in development mode
- `npm start`: Start the main server
- `npm run json-server`: Start JSON Server

### Testing

Run the JWT test:
```bash
node test-jwt.js
```

## Best Practices

1. Never commit the `.env` file
2. Use strong, unique JWT secrets
3. Regularly rotate refresh tokens
4. Implement rate limiting in production
5. Use HTTPS in production
6. Keep dependencies updated

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.

## Author

Utsav Gandhi

## Acknowledgments

- Express.js
- JSON Server
- JWT
- bcryptjs
- axios 
