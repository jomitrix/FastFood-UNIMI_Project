import { ApiService } from '@/services/apiService';

export const FeedService = {
    getRestaurants(page = 1) {
        return ApiService.get(`/feed/get?page=${page}`);
    },

    getRestaurantById(id) {
        return ApiService.get(`/feed/restaurants/${id}/get`);
    },

    getNearbyRestaurants(page = 1, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow) {
        return ApiService.get(`/feed/restaurants/nearby`, {
            params: { page, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow }
        });
    },
    
    getNearbyPreferredRestaurants(page = 1, address) {
        return ApiService.get(`/feed/restaurants/nearby/preferred`, {
            params: { page, address }
        });
    }
};