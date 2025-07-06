import { ApiService } from '@/services/apiService';

export const FeedService = {
    getRestaurants(page = 1) {
        return ApiService.get(`/feed/get?page=${page}`);
    },

    getRestaurantById(id) {
        return ApiService.get(`/feed/restaurants/${id}/get`);
    }
};