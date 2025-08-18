import { ScrollShadow } from '@heroui/scroll-shadow';
import { Cart, Trash, Cash } from "@/components/icons/heroicons";
import { useState, useEffect } from 'react';
import AddressOrderType from '@/components/app/search/AddressOrderType';
import { Button } from '@heroui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { get } from 'js-cookie';
import { RestaurantService } from '@/services/restaurantService';

export default function CartComponent({
  isDesktop = false,
  cartItems,
  cartTotal,
  removeFromCart,
  updateCartItemQuantity,
  isRestaurantOpen,
  setIsCartOpen,
  onCheckout,
  deliveryFee,
  getFee,
  estimatedDeliveryTime,
  calculateDeliveryTime,
  restaurantOrderType = "all"
}) {
  const { user } = useAuth();
  const { cart, setCart } = useCart();

  const [orderType, setOrderType] = useState(() => {
    if (typeof window !== 'undefined') {
      // Se il ristorante accetta solo un tipo di ordine seleziona quello
      if (restaurantOrderType === "delivery") return "delivery";
      if (restaurantOrderType === "takeaway") return "takeaway";

      // Altrimenti usiamo quello memorizzato
      return localStorage.getItem('orderType');
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState(user.delivery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && addresses.length > 0) {
      const savedAddressId = localStorage.getItem('selectedAddressId');
      if (savedAddressId) {
        const foundAddress = addresses.find(addr => addr._id === savedAddressId);
        if (foundAddress) {
          setSelectedAddress(foundAddress);
        }
      }
    }
  }, [addresses]);

  const getQueueTime = async () => {
    const data = await RestaurantService.getQueue(cart.restaurant._id);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }
    
    const time = Math.ceil(data.queueCount / 60) || 0;
    console.log("Queue time:", time);
    setQueueTime(time);
  };

  useEffect(() => {
    if (!cart.restaurant) return;
    getQueueTime();
  }, [cart.restaurant]);

  useEffect(() => {
    if (restaurantOrderType === "delivery" && orderType !== "delivery") {
      setOrderType("delivery");
      localStorage.setItem('orderType', "delivery");
    } else if (restaurantOrderType === "takeaway" && orderType !== "takeaway") {
      setOrderType("takeaway");
      localStorage.setItem('orderType', "takeaway");
    }
  }, [restaurantOrderType, orderType]);

  const handleOrderTypeChange = (newType) => {
    setOrderType(newType);
    localStorage.setItem('orderType', newType);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    if (address && address._id) {
      localStorage.setItem('selectedAddressId', address._id);
    } else if (address === null) {
      localStorage.removeItem('selectedAddressId');
    }
  };

  useEffect(() => {
    setCart(prevCart => ({
      ...prevCart,
      orderType: orderType,
      deliveryAddress: orderType === 'delivery' ? selectedAddress : null,
    }));
  }, [orderType, selectedAddress, setCart]);

  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true);
  const [checkoutDisabledReason, setCheckoutDisabledReason] = useState("");

  useEffect(() => {
    if (isRestaurantOpen === false) {
      setIsCheckoutDisabled(true);
      setCheckoutDisabledReason("Restaurant is closed");
      return;
    }

    if (orderType === 'delivery') {
      if (!selectedAddress) {
        setIsCheckoutDisabled(true);
        setCheckoutDisabledReason("Select an address");
        return;
      }
      if ((estimatedDeliveryTime.max - 10) > 60) {
        setIsCheckoutDisabled(true);
        setCheckoutDisabledReason("Delivery is over 60 minutes");
        return;
      }
    }

    calculateDeliveryTime(selectedAddress);
    getFee(selectedAddress);
    setIsCheckoutDisabled(false);
    setCheckoutDisabledReason("Pay");
  }, [orderType, selectedAddress, isRestaurantOpen]);

  return (
    <div className={`bg-white flex flex-col ${isDesktop ? 'h-screen border-l border-gray-200' : 'h-full'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Cart />
          Your cart
        </h2>
        {!isDesktop && (
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
          </button>
        )}
      </div>

      <AddressOrderType
        addresses={addresses}
        onAddressSelect={handleAddressSelect}
        onOrderTypeChange={handleOrderTypeChange}
        initialOrderType={orderType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isCartComponent={true}
        restaurantOrderType={restaurantOrderType}
        onAddressesSave={(newAddresses) => {
          setAddresses(newAddresses);
        }}
      />

      {cartItems.length > 0 ? (
        <ScrollShadow className="flex-1 overflow-y-auto">
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item._id} className="p-4 flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img src={process.env.NEXT_PUBLIC_API_URL + item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 p-1 hover:bg-red-50 rounded-full flex-shrink-0"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600">{item.price.toFixed(2)}{item.currency}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex border rounded-lg">
                      <button
                        onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                        className={`px-2 py-1 ${item.quantity <= 1 ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item._id, Math.min(item.quantity + 1, 10))}
                        className={`px-2 py-1 ${item.quantity >= 10 ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        disabled={item.quantity >= 10}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}{item.currency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollShadow>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <Cart className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">Your cart is empty</p>
          <p>Add something from the menu to start your order</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="border-t p-4">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>

            <>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span>{deliveryFee.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{orderType === 'delivery' ? 'Estimated delivery time' : 'Estimated tekeaway time'}</span>
                <span>{orderType === 'delivery' ? `${estimatedDeliveryTime.min}-${estimatedDeliveryTime.max} min` : queueTime > 0 ? `${queueTime} min` : `ASAP`}</span>
              </div>
            </>

            <div className="flex justify-between pt-2 border-t mt-1">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">
                {(cartTotal + (orderType === 'delivery' ? deliveryFee : 0)).toFixed(2)}€
              </span>
            </div>
          </div>
          <Button
            className="w-full bg-[#083d77] text-white py-3 rounded-xl font-medium hover:bg-[#062f5c] disabled:bg-gray-300 disabled:cursor-not-allowed"
            onPress={onCheckout}
            size='lg'
            disabled={isCheckoutDisabled}
          >
            <Cash />
            {checkoutDisabledReason}
          </Button>
        </div>
      )}
    </div>
  );
};
