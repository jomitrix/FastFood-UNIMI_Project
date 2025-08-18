import { ApiService } from '@/services/apiService';

export const DashboardService = {
    getOrdersStats() {
        return ApiService.get('/restaurant/dashboard/orders/get');
    },

    getRevenueStats() {
        return ApiService.get('/restaurant/dashboard/revenue/get');
    },

    getProductsStats(filter) {
        return ApiService.get('/restaurant/dashboard/products/get', {
            params: { filter }
        });
    },

    getRecentOrders() {
        return ApiService.get('/restaurant/dashboard/orders/recent/get');
    },

    getSalesTrend(period = 'month', type = 'revenue') {
        return ApiService.get('/restaurant/dashboard/salestrend/get', {
            params: { period, type }
        });
    }
};