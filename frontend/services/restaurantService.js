import { ApiService } from '@/services/apiService';

export const RestaurantService = {
    editRestaurant(name, phoneNumber, address, vat) {
        return ApiService.patch('/restaurant/edit', {
            body: { name, phoneNumber, address, vat }
        });
    },

    getMenu(restaurantId, page = 1) {
        return ApiService.get(`/restaurant/${restaurantId}/menu/meals/get?page=${page}`);
    },

    addMeal(restaurantId, name, category, area, allergens, ingredients, price, mealImage) {
        return ApiService.multipartPost(`/restaurant/${restaurantId}/menu/meals/add`, {
            fields: { name, category, area, allergens, ingredients, price },
            files: [mealImage],
            filesFieldName: 'mealImage'
        });
    },

    editMeal(restaurantId, mealId, name, category, area, allergens, ingredients, price, mealImage) {
        return ApiService.multipartPatch(`/restaurant/${restaurantId}/menu/meals/${mealId}/edit`, {
            fields: { name, category, area, allergens, ingredients, price },
            files: [mealImage],
            filesFieldName: 'mealImage'
        });
    },
};