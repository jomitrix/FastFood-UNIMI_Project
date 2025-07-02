import { ApiService } from '@/services/apiService';

export const RestaurantService = {
    editRestaurant(name, phoneNumber, address, vat) {
        return ApiService.patch('/restaurant/edit', {
            body: { name, phoneNumber, address, vat }
        });
    },
};