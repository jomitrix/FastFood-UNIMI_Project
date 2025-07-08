import { ApiService } from '@/services/apiService';

export const RestaurantService = {
    editRestaurant(name, phoneNumber, address, vat) {
        return ApiService.patch('/restaurant/edit', {
            body: { name, phoneNumber, address, vat }
        });
    },

    getMenu(restaurantId, page = 1, query = null, category = null) {
        return ApiService.get(`/restaurant/${restaurantId}/menu/meals/get`, {
            params: {
                page,
                query,
                category
            }
        });
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

    deleteMeal(restaurantId, mealId) {
        return ApiService.delete(`/restaurant/${restaurantId}/menu/meals/${mealId}/delete`);
    },

    editLogo(logo) {
        return ApiService.multipartPatch('/restaurant/images/logo/edit', {
            files: [logo],
            filesFieldName: 'logo'
        });
    },

    editBanner(banner) {
        return ApiService.multipartPatch('/restaurant/images/banner/edit', {
            files: [banner],
            filesFieldName: 'banner'
        });
    },

    editOpenings(monday, tuesday, wednesday, thursday, friday, saturday, sunday, serviceMode) {
        return ApiService.patch('/restaurant/openings/edit', {
            body: { monday, tuesday, wednesday, thursday, friday, saturday, sunday, serviceMode }
        });
    },

    checkout(restaurantId, orderType, meals, deliveryAddress, paymentMethod, specialInstructions, phoneNumber) {
        return ApiService.post(`/restaurant/${restaurantId}/checkout`, {
            body: {
                orderType,
                meals,
                deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
                paymentMethod,
                specialInstructions,
                phoneNumber
            }
        });
    },

    getOrders(page = 1, query = null, status = "ordered,preparing,out,ready,completed,canceled") {
        return ApiService.get('/restaurant/orders/get', {
            params: { page, query, status }
        });
    },

    updateOrderStatus(orderId, status) {
        return ApiService.patch(`/restaurant/orders/${orderId}/status/edit`, {
            body: { status }
        });
    },

    getFee(restaurantId, address) {
        return ApiService.get(`/restaurant/${restaurantId}/fee/get`, {
            params: { address }
        });
    },

    getQueue(restaurantId) {
        return ApiService.get(`/restaurant/${restaurantId}/queue/get`);
    }
};