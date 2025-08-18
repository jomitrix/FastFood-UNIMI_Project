"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { ScrollShadow } from '@heroui/scroll-shadow';
import MealsList from '@/components/app/restaurant/MealsList';
import Navigation from '@/components/app/restaurant/Navigation';
import CartComponent from '@/components/app/restaurant/CartComponent';
import { Input } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { Search, Time, Info, Storefront, ForkKnife, Flag, Cart, X } from "@/components/icons/heroicons";
import { Skeleton } from '@heroui/skeleton';
import { usePaginator } from '@/utils/paginator';
import { FeedService } from '@/services/feedService';
import { RestaurantService } from '@/services/restaurantService';
import { useDebounce } from '@/utils/useDebounce';
import { useCart } from '@/contexts/CartContext';
import { getRouteDistance } from '@/utils/getRouteDistance';
import { useAuth } from '@/contexts/AuthContext';
import { addToast } from "@heroui/toast";

export default function RestaurantPage({ params }) {
    const router = useRouter();
    const id = React.use(params);
    const { cart, setCart } = useCart();
    const { user } = useAuth();

    const [restaurant, setRestaurant] = useState({});
    const [isOpenNow, setIsOpenNow] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [productId, setProductId] = useState(null);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState({
        min: 0,
        max: 0
    });
    const [isBannerLoaded, setIsBannerLoaded] = useState(false);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const [isProductImageLoaded, setIsProductImageLoaded] = useState(false);

    const [categories, setCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const scrollController = useRef(null);
    const debouncedSearch = useDebounce(searchValue, 300);

    const mealsPaginator = usePaginator(useCallback(
        (page, _) => RestaurantService.getMenu(id.id, page, debouncedSearch, activeCategory === 'All' ? null : activeCategory)
            .then(data => data.status !== 'success' ? [] : data.meals), [id.id, debouncedSearch, activeCategory]),
        10
    );

    const lastElementRef = (node) => {
        if (mealsPaginator.isLoading) return;
        if (scrollController.current) scrollController.current.disconnect();
        scrollController.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && mealsPaginator.hasMore) {
                mealsPaginator.loadNext();
            }
        });
        if (node) scrollController.current.observe(node);
    };

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const data = await FeedService.getRestaurantById(id.id);
            if (data.status === 'success') {
                setRestaurant(data.restaurant);
                setCategories(data.restaurant.categories);
            } else {
                console.error("Error fetching restaurant:", data.error);
            }
        } catch (error) {
            console.error("Error fetching restaurant:", error);
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);
    };

    useEffect(() => {
        if (restaurant && restaurant._id) {
            if (cart.restaurant && cart.restaurant._id !== restaurant._id) {
                setCart(prev => ({
                    ...prev,
                    restaurant: {
                        _id: restaurant._id,
                        name: restaurant.name,
                        banner: restaurant.banner,
                        logo: restaurant.logo,
                        position: restaurant.position,
                    },
                    items: [] 
                }));
            }
        }
    }, [restaurant, cart.restaurant, setCart]);

    useEffect(() => {
        mealsPaginator.reset();
    }, [debouncedSearch]);

    useEffect(() => {
        mealsPaginator.reset();
    }, [activeCategory]);

    useEffect(() => {
        if (!productId) return;

        const foundProduct = mealsPaginator.items.find(meal => meal._id === productId);
        if (!foundProduct) return;

        setProduct(foundProduct);
        setIsProductImageLoaded(false); 
        setIsModalOpen("product");
        setQuantity(1);
    }, [productId]);

    const getFee = async (addr) => {
        if (!cart.restaurant) return;
        const data = await RestaurantService.getFee(cart.restaurant._id, addr?._id);
        if (!data || data.status !== "success") {
            return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
        }
        setDeliveryFee(data.fee);
    };

    const addToCart = (product, quantity) => {
        setCart(prev => {
            // Se non c'è ancora un ristorante, lo imposto
            const rest = prev.restaurant || {
                _id: restaurant._id,
                name: restaurant.name,
                banner: restaurant.banner,
                logo: restaurant.logo,
                position: restaurant.position,
            };

            // Trovo se il prodotto esiste già
            const idx = prev.items.findIndex(i => i._id === product._id);

            let newItems;
            if (idx !== -1) {
                // aggiorno solo la quantità
                newItems = prev.items.map((item, i) =>
                    i === idx
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // lo aggiungo con la quantità iniziale
                newItems = [
                    ...prev.items,
                    { ...product, quantity }
                ];
            }

            return { restaurant: rest, items: newItems };
        });

        if (window.innerWidth < 768) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (id) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => item._id !== id)
        }));
    };

    const updateCartItemQuantity = (id, newQuantity) => {
        setCart(prev => {
            if (newQuantity <= 0) {
                return {
                    ...prev,
                    items: prev.items.filter(item => item._id !== id)
                };
            }
            return {
                ...prev,
                items: prev.items.map(item =>
                    item._id === id ? { ...item, quantity: newQuantity } : item
                )
            };
        });
    };

    const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        setCart(prev => ({
            ...prev,
            orderType: localStorage.getItem('orderType'),
            deliveryAddress: user.delivery.find(addr => addr._id === localStorage.getItem('selectedAddressId'))
        }));
        router.push('/checkout/');
    };

    async function calculateDeliveryTime(addr) {
        const time = await getRouteDistance({ lng: restaurant.position.geopoint.coordinates[0], lat: restaurant.position.geopoint.coordinates[1] }, addr);
        const deliveryDistance = Math.ceil(time / 60);
        setEstimatedDeliveryTime({
            min: deliveryDistance >= 20 ? deliveryDistance - 10 : deliveryDistance,
            max: deliveryDistance + 10
        });
    }

    useEffect(() => {
        if (!restaurant.position || !user.delivery[0]) return;

        function valuateIsOpenNow() {
            if (!restaurant.openingHours) return;

            const now = new Date();
            const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            console.log(dayName);
            const slot = restaurant.openingHours[dayName];
            console.log(slot);

            if (!slot || slot.closed) {
                setIsOpenNow(false);
                return;
            }

            const [oh, om] = slot.open.split(':').map(Number);
            const [ch, cm] = slot.close.split(':').map(Number);

            const openTime = new Date(now);
            openTime.setHours(oh, om, 0, 0);

            const closeTime = new Date(now);
            closeTime.setHours(ch, cm, 0, 0);

            setIsOpenNow(now >= openTime && now <= closeTime);
        }

        valuateIsOpenNow();
    }, [restaurant.position,
    restaurant.minDeliveryTime,
    restaurant.maxDeliveryTime,
    restaurant.openingHours]);

    return (
        <div>
            <div className="relative bg-[#f5f3f5] min-h-screen">
                <div className="pr-0 md:pr-[350px]">
                    <div className="w-full 2xl:w-4/5 mx-auto px-4 flex flex-col gap-7 pb-20">
                        <div className='flex flex-col gap-2'>
                            <div className='relative h-[12rem] sm:h-[20rem] aspect-video w-full bg-gray-200 rounded-b-xl'>
                                {!isBannerLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full rounded-b-xl" />}
                                <img
                                    src={process.env.NEXT_PUBLIC_API_URL + restaurant.banner}
                                    alt={`${restaurant.name} banner`}
                                    className={`object-cover w-full h-full rounded-b-xl transition-opacity duration-300 ${isBannerLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setIsBannerLoaded(true)}
                                />
                                <div className="absolute bottom-5 left-5 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                                    {!isIconLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
                                    <img
                                        src={process.env.NEXT_PUBLIC_API_URL + restaurant.logo}
                                        alt={`${restaurant.name} logo`}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${isIconLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setIsIconLoaded(true)}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <h1 className="font-bold text-3xl">{restaurant.name}</h1>
                                <button
                                    className="hover:text-gray-500 transition duration-200"
                                    aria-label="More info"
                                    title="More info"
                                    onClick={() => setIsModalOpen("restaurant")}
                                >
                                    <Info />
                                </button>
                            </div>
                            <div className="flex">
                                <p className="flex gap-1 text-sm text-gray-700">
                                    {estimatedDeliveryTime.min !== 0 && estimatedDeliveryTime.max !== 0 && isOpenNow && (
                                        <>
                                            <span className='flex py-1 gap-1'>
                                                <Time className="inline-block h-4 w-4 mt-[3px]" />
                                                {estimatedDeliveryTime.min} - {estimatedDeliveryTime.max} min
                                            </span>
                                            <span className='py-1'>•</span>
                                        </>
                                    )}
                                    <span className={`rounded-full px-2 py-1 ${isOpenNow ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {isOpenNow ? "Open Now" : "Closed"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <Input
                            type="search"
                            placeholder={`Type here to search dishes and ingredients...`}
                            size="lg"
                            startContent={<Search className="text-[#083d77]" />}
                            classNames={{
                                inputWrapper: "bg-gray-200",
                                label: "text-sm mb-4",
                                input: "text-sm sm:text-lg",
                            }}
                            variant="solid"
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="w-full"
                        />

                        <Navigation
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />

                        <MealsList
                            title={activeCategory}
                            meals={mealsPaginator.items}
                            setIsModalOpen={setIsModalOpen}
                            setProductId={setProductId}
                            lastElementRef={lastElementRef}
                            isLoadingMore={mealsPaginator.isLoadingMore}
                        />
                    </div>
                </div>

                {/* Pulsante carrello mobile */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="md:hidden fixed bottom-6 left-6 bg-[#083d77] text-white p-3 rounded-full shadow-lg z-30 flex items-center justify-center shadow-md"
                >
                    <Cart className="w-6 h-6" />
                    <p className='pl-3 pr-2 font-semibold'>Cart</p>
                    {cart.items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold w-6 h-6 rounded-full text-xs flex items-center justify-center">
                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    )}
                </button>



                {/* Modal per il carrello su mobile */}
                <Modal
                    isOpen={isCartOpen && window.innerWidth < 768}
                    onClose={() => setIsCartOpen(false)}
                    size="full"
                    placement="bottom"
                    className="md:hidden"
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    duration: 0.3,
                                    ease: "easeOut"
                                }
                            },

                        },
                        initial: { y: "100%" }
                    }}
                >
                    <ModalContent className="h-[90vh] m-0 p-0 rounded-t-xl">
                        <CartComponent
                            isDesktop={false}
                            cartItems={cart.items}
                            cartTotal={cartTotal}
                            removeFromCart={removeFromCart}
                            updateCartItemQuantity={updateCartItemQuantity}
                            setIsCartOpen={setIsCartOpen}
                            onCheckout={handleCheckout}
                            deliveryFee={deliveryFee}
                            getFee={getFee}
                            estimatedDeliveryTime={estimatedDeliveryTime}
                            calculateDeliveryTime={calculateDeliveryTime}
                            restaurantOrderType={restaurant.serviceMode || "all"}
                            isRestaurantOpen={isOpenNow}
                        />
                    </ModalContent>
                </Modal>

                {/* Modal per i dettagli del ristorante */}
                <Modal isOpen={isModalOpen === "restaurant"} onClose={() => setIsModalOpen(null)} size="lg">
                    <ModalContent className='rounded-b-none sm:rounded-lg m-0 sm:w-full'>
                        <ModalHeader className="text-center">
                            <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col p-4 gap-3">
                                <h3 className='flex gap-2 items-center font-extrabold text-gray-700 text-xl'>
                                    <Storefront />
                                    Resturant Details
                                </h3>
                                <ul className='bg-gray-100 p-3 border-1 border-gray-500/25 rounded-lg flex flex-col gap-3'>
                                    <li className=''>
                                        {restaurant.position?.address?.split(", ").map((part, index) => (
                                            <span key={index} className="block -my-0.5">{part}</span>
                                        ))}
                                    </li>
                                    <li>{restaurant.phoneNumber}</li>
                                </ul>
                            </div>
                            <div className="flex flex-col p-4 gap-3">
                                <h3 className='flex gap-2 items-center font-extrabold text-gray-700 text-xl'>
                                    <Time />
                                    Opening Hours
                                </h3>
                                <ul className="bg-gray-100 p-3 border border-gray-300 rounded-lg">
                                    {[
                                        "monday", "tuesday", "wednesday",
                                        "thursday", "friday", "saturday", "sunday"
                                    ].map(day => {
                                        if (!restaurant.openingHours) return;
                                        const { open, close, closed } = restaurant.openingHours[day] || {};
                                        return (
                                            <li key={day} className="flex justify-between py-1">
                                                <span className="capitalize font-medium">{day}</span>
                                                <span className={closed ? "text-red-500" : "text-gray-700"}>
                                                    {closed || !open || !close
                                                        ? "Closed"
                                                        : `${open} - ${close}`}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Modal per i dettagli del prodotto */}
                <Modal isOpen={isModalOpen === "product"} onClose={() => {
                    setIsModalOpen(null);
                    setProductId(null);
                }} size="lg">
                    {product && (
                        <ModalContent className='rounded-b-none sm:rounded-lg m-0 shadow-lg overflow-hidden w-full'>
                            <ModalHeader className="absolute top-0 right-0 z-10 p-2 flex justify-end">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(null);
                                        setProductId(null);
                                    }}
                                    className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                    aria-label="Close"
                                >
                                    <X />
                                </button>
                            </ModalHeader>
                            <div className='relative w-full h-48 bg-gray-200'>
                                {!isProductImageLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
                                <img
                                    src={process.env.NEXT_PUBLIC_API_URL + product.image}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isProductImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setIsProductImageLoaded(true)}
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
                                <div className='absolute bottom-4 left-4 right-4'>
                                    <h2 className="text-3xl font-bold text-white drop-shadow-md">{product.name}</h2>
                                    <p className="text-2xl font-bold text-white drop-shadow-md mt-1">
                                        {product.price.toFixed(2)}{product.currency}
                                    </p>
                                </div>
                            </div>
                            <ModalBody as={ScrollShadow} className='pt-6 max-h-[24rem] overflow-y-auto'>
                                <div className='flex flex-wrap gap-2'>
                                    <Chip
                                        color="warning"
                                        className="pl-2"
                                        classNames={{
                                            base: "border border-amber-200",
                                            content: "font-medium"
                                        }}
                                        startContent={<ForkKnife size={16} className="mr-1" />}
                                        variant="flat"
                                        size="md"
                                    >
                                        {product.category}
                                    </Chip>
                                    <Chip
                                        color="primary"
                                        className="pl-2"
                                        classNames={{
                                            base: "border border-blue-200",
                                            content: "font-medium"
                                        }}
                                        startContent={<Flag size={16} className="mr-1" />}
                                        variant="flat"
                                        size="md"
                                    >
                                        {product.area}
                                    </Chip>
                                </div>

                                {product.allergens && product.allergens.length > 0 && (
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-800 mb-2'>Allergens</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {product.allergens.map((allergen, i) => (
                                                <Chip
                                                    key={i}
                                                    color="danger"
                                                    variant="flat"
                                                    size="sm"
                                                    classNames={{
                                                        base: "bg-red-50 text-red-700"
                                                    }}
                                                >
                                                    {allergen}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.ingredients && product.ingredients.length > 0 && (
                                    <div>
                                        <h3 className='font-bold text-lg text-gray-800'>Ingredients</h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                            {product.ingredients.map((ingredient, i) => (
                                                <li key={i} className="flex items-center text-gray-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2"></span>
                                                    {ingredient}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </ModalBody>
                            <ModalFooter className="flex justify-between border-t pt-4">
                                <div className="flex items-center border rounded-xl w-32 h-[50px] overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                                        disabled={quantity <= 1}
                                        className={`flex-1 h-full flex items-center justify-center text-gray-700 ${quantity <= 1 ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                    >
                                        -
                                    </button>
                                    <div className="w-10 text-center flex items-center justify-center font-medium">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(prev => Math.min(prev + 1, 10))}
                                        disabled={quantity >= 10}
                                        className={`flex-1 h-full flex items-center justify-center text-gray-700 ${quantity >= 10 ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="bg-[#083d77] text-white px-6 py-3 rounded-xl hover:bg-[#062f5c] transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                                    onClick={() => {
                                        addToCart(product, quantity);
                                        setIsModalOpen(null);
                                        setProductId(null);
                                    }}
                                >
                                    <Cart />
                                    {(product.price * quantity).toFixed(2)}{product.currency}
                                </button>
                            </ModalFooter>
                        </ModalContent>
                    )}
                </Modal>
            </div>
            <aside>
                {/* Cart a destra */}
                <div className="hidden md:block fixed top-0 right-0 w-[350px] h-screen bg-white shadow-lg">
                    <CartComponent
                        isDesktop={true}
                        cartItems={cart.items}
                        cartTotal={cartTotal}
                        removeFromCart={removeFromCart}
                        updateCartItemQuantity={updateCartItemQuantity}
                        setIsCartOpen={setIsCartOpen}
                        onCheckout={handleCheckout}
                        deliveryFee={deliveryFee}
                        getFee={getFee}
                        estimatedDeliveryTime={estimatedDeliveryTime}
                        calculateDeliveryTime={calculateDeliveryTime}
                        restaurantOrderType={restaurant.serviceMode || "all"}
                        isRestaurantOpen={isOpenNow}
                    />
                </div>
            </aside>
        </div>
    );
}