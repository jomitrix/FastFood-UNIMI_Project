import { ApiService } from '@/services/apiService';

export const AuthService = {
    login(email, password) {
        return ApiService.post('/auth/login', { body: { email, password } });
    },

    register(username, email, password, name, surname, role = 'user') {
        return ApiService.post('/auth/register', {
            body: {
                username,
                email,
                password,
                name,
                surname,
                role,
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

    async storeToken(token) {
        return await ApiService.saveToken(token);
    },

    getToken() {
        return ApiService.getToken();
    },
};
