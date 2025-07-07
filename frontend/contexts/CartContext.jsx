import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        let savedOrderType = null;
        if (typeof window !== 'undefined') {
            savedOrderType = localStorage.getItem('orderType')
        }
        return {
            restaurant: null,
            items: [],
            orderType: savedOrderType,
            deliveryAddress: null,
        };
    });

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);