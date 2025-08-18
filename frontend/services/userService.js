import { ApiService } from '@/services/apiService';

export const UserService = {
    editAccount(username, name, surname, newPassword, password) {
        return ApiService.patch('/user/account/edit', {
            body: { username, name, surname, newPassword, password }
        });
    },

    editPreferences(allergens, preferredFoodTypes, preferredCuisines, specialOffersFeed) {
        return ApiService.patch('/user/preferences/edit', {
            body: { allergens, preferredFoodTypes, preferredCuisines, specialOffersFeed }
        });
    },

    editBilling(billingAddress) {
        return ApiService.patch('/user/billing/edit', {
            body: { billingAddress }
        });
    },

    editDelivery(address) {
        return ApiService.patch('/user/delivery/edit', {
            body: { address }
        });
    },

    deleteDelivery(deliveryId) {
        return ApiService.delete(`/user/delivery/${deliveryId}/delete`);
    },

    editCards(name, holder, number, expiry, cvv) {
        return ApiService.patch('/user/cards/edit', {
            body: { name, holder, number, expiry, cvv }
        });
    },

    deleteCard(cardId) {
        return ApiService.delete(`/user/cards/${cardId}/delete`);
    },

    deleteAccount() {
        return ApiService.delete('/user/account/delete');
    },

    getOrders(page = 1, hidePast = false) {
        return ApiService.get('/user/orders/get', {
            params: { page, hidePast }
        });
    },

    completeOrder(orderId, code) {
        return ApiService.patch(`/user/orders/${orderId}/complete`, {
            body: { code }
        });
    }
};