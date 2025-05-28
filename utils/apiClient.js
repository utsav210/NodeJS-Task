const axios = require('axios');

class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = null;
        this.refreshToken = null;
        this.isRefreshing = false;
        this.failedQueue = [];

        // Create axios instance
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor
        this.api.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If error is not 401 or request has already been retried, reject
                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                if (this.isRefreshing) {
                    // If token refresh is in progress, add request to queue
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.api(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                this.isRefreshing = true;

                try {
                    // Attempt to refresh token
                    const response = await this.refreshTokenRequest();
                    const { token, refreshToken } = response.data;

                    // Update tokens
                    this.setTokens(token, refreshToken);

                    // Retry all queued requests
                    this.failedQueue.forEach((prom) => {
                        prom.resolve(token);
                    });

                    // Clear queue
                    this.failedQueue = [];

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return this.api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, reject all queued requests
                    this.failedQueue.forEach((prom) => {
                        prom.reject(refreshError);
                    });
                    this.failedQueue = [];

                    // Clear tokens and redirect to login
                    this.clearTokens();
                    return Promise.reject(refreshError);
                } finally {
                    this.isRefreshing = false;
                }
            }
        );
    }

    // Set tokens
    setTokens(token, refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
        // Store tokens in localStorage or secure storage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Clear tokens
    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    // Load tokens from storage
    loadTokens() {
        this.token = localStorage.getItem('token');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // Refresh token request
    async refreshTokenRequest() {
        return axios.post(`${this.baseURL}/auth/refresh-token`, {
            refreshToken: this.refreshToken
        });
    }

    // Auth methods
    async register(userData) {
        const response = await this.api.post('/auth/register', userData);
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
    }

    async login(credentials) {
        const response = await this.api.post('/auth/login', credentials);
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
    }

    async logout() {
        this.clearTokens();
    }

    // User methods
    async getUsers() {
        return this.api.get('/users');
    }

    async getUser(id) {
        return this.api.get(`/users/${id}`);
    }

    async updateUser(id, userData) {
        return this.api.put(`/users/${id}`, userData);
    }

    async deleteUser(id) {
        return this.api.delete(`/users/${id}`);
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
module.exports = apiClient; 