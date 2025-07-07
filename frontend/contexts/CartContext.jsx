import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const initialOrderType = typeof window !== 'undefined' 
        ? localStorage.getItem('orderType') 
        : null;
        
    const [cart, setCart] = useState({
        restaurant: null,
        items: [],
        orderType: initialOrderType,
        deliveryAddress: null,
    });

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);