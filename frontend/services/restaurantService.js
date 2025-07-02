import { ApiService } from '@/services/apiService';

export const RestaurantService = {
    editRestaurant(name, phoneNumber, address, vat) {
        return ApiService.patch('/restaurant/edit', {
            body: { name, phoneNumber, address, vat }
        });
    },

    addMeal(restaurantId, name, category, area, allergens, ingredients, price, mealImage) {
        return ApiService.multipartPost(`/restaurant/${restaurantId}/menu/meals/add`, {
            fields: { name, category, area, allergens, ingredients, price },
            files: [mealImage],
            filesFieldName: 'mealImage'
        });
    }
};