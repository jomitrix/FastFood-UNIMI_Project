// services/authService.js
import { ApiService } from './apiService';

export const AuthService = {
    login(email, password) {
        return ApiService.post('/auth/login', { body: { email, password } });
    },

    register(username, email, password, name, surname) {
        return ApiService.post('/auth/register', {
            body: {
                username,
                email,
                password,
                name,
                surname
            }
        });
    },

    getUser() {
        return ApiService.get('/user/get');
    },

    logout() {
        // qui semplicemente eliminiamo il token
        ApiService.deleteToken();
        return Promise.resolve();
    },

    storeToken(token) {
        return ApiService.saveToken(token);
    },

    getToken() {
        return ApiService.getToken();
    },
};
