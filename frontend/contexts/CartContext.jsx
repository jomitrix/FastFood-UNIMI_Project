import { createContext, useContext, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }) {
    const [cart, setCart] = useState({
        restaurant: null,
        items: [],
        orderType: "",
        deliveryAddress: null,
    });
    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
}
export const useCart = () => useContext(CartContext);