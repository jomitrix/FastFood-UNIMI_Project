import { ApiService } from '@/services/apiService';

export const FeedService = {
    getRestaurants(page = 1) {
        return ApiService.get(`/feed/get?page=${page}`);
    },

    getRestaurantById(id) {
        return ApiService.get(`/feed/restaurants/${id}/get`);
    },

    getNearbyRestaurants(page = 1, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow, query) {
        return ApiService.get(`/feed/restaurants/nearby`, {
            params: { page, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow, query }
        });
    },
    
    getNearbyPreferredRestaurants(page = 1, address) {
        return ApiService.get(`/feed/restaurants/nearby/preferred`, {
            params: { page, address }
        });
    },

    getNearbyMeals(page = 1, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow, query, minPrice, maxPrice) {
        return ApiService.get(`/feed/restaurants/nearby/meals`, {
            params: { page, address, serviceMode, categories, preferredCuisines, avoidAllergens, openNow, query, minPrice, maxPrice }
        });
    }
};