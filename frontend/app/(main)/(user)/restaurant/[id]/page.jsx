"use client";
import React, { useState, useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { ScrollShadow } from '@heroui/scroll-shadow';
import MealsList from '@/components/app/restaurant/MealsList';
import Navigation from '@/components/app/restaurant/Navigation';
import CartComponent from '@/components/app/restaurant/CartComponent';
import { Input } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { Search, Time, Info, Storefront, ForkKnife, Flag, Cart, X } from "@/components/icons/heroicons";

const mockRestaurant = {
    banner: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,w_1537,h_480/f_auto/q_auto/dpr_1.0/d_it:cuisines:pollo-6.jpg/v1/it/restaurants/282166.jpg",
    icon: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    address: "Via Cassanese 1, 20090 Segrate MI, Italy",
    phone: "+39 02 2131 1234",
    restaurantname: "KFC - Abruzzi",
    minDeliveryTime: 10,
    maxDeliveryTime: 20,
    courses: ["Fast Food", "Miscellaneous"],
    area: ["American"],
    isOpenNow: true,
    orderType: "both",
    times: {
        monday: { open: "10:00", close: "23:00" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "10:00", close: "23:00" },
        thursday: { open: "10:00", close: "23:00" },
        friday: { open: "10:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "23:00" }
    }
}

const mockMeals = [
    {
        id: "1",
        price: 6.50,
        currency: "€",
        name: "Classic Burger",
        category: "Fast Food",
        area: "American",
        allergens: ["Egg", "Wheat", "Sesame"],
        image: "https://www.mcdonalds.be/_webdata/product-images/double-royal-crispy-bacon_500x500px.png",
        ingredients: [
            "Beef Patty",
            "Lettuce",
            "Tomato",
            "Onion",
            "Pickles",
            "Burger Bun",
            "Ketchup",
            "Mustard",
            "Mayonnaise"
        ],
    },
    {
        id: "2",
        price: 7.20,
        currency: "€",
        name: "Chicken Wrap",
        category: "Fast Food",
        allergens: ["Egg", "Wheat"],
        area: "American",
        image: "https://mcdonalds.bg/wp-content/uploads/2023/01/BG_CSO_2054.png",
        ingredients: [
            "Chicken",
            "Lettuce",
            "Tomato",
            "Onion",
            "Tortilla",
            "Salsa",
            "Sour Cream"
        ],
    },
    {
        id: "3",
        price: 2.50,
        currency: "€",
        name: "Cola",
        category: "Miscellaneous",
        area: "American",
        image: "https://m.media-amazon.com/images/I/519hKzKgJML.jpg",
        ingredients: [
            "Carbonated Water",
            "Sugar",
            "Caffeine",
            "Caramel Color",
            "Phosphoric Acid",
            "Natural Flavors"
        ],
    },
    {
        id: "4",
        price: 3.00,
        currency: "€",
        name: "Fries",
        category: "Fast Food",
        area: "American",
        image: "https://www.toineskitchen.com/wp-content/uploads/2021/05/2021-05-23-14.57.03-Toines-Kitchen-CX0A1132-500x500.jpg",
        ingredients: [
            "Potatoes",
            "Vegetable Oil",
            "Salt"
        ],
    }
]

export default function RestaurantPage({ params }) {
    const router = useRouter();
    const id = params;
    const [activeCategory, setActiveCategory] = useState('All');
    const [filteredMeals, setFilteredMeals] = useState(mockMeals);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [productId, setProductId] = useState(null);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(2.50);
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState({
        min: mockRestaurant.minDeliveryTime,
        max: mockRestaurant.maxDeliveryTime
    });
  
    const categories = [...new Set(mockMeals.map(meal => meal.category))];
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);
        if (value === '') {
            setFilteredMeals(mockMeals);
        } else {
            setFilteredMeals(mockMeals.filter(meal =>
                meal.name.toLowerCase().includes(value) ||
                meal.ingredients.some(ingredient => ingredient.toLowerCase().includes(value))
            ));
        }
    };
  
    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredMeals(mockMeals);
        } else {
            setFilteredMeals(mockMeals.filter(meal => meal.category === activeCategory));
        }
    }, [activeCategory, mockMeals]);

    useEffect(() => {
        if (!productId) return;
        
        const foundProduct = mockMeals.find(meal => meal.id === productId);
        if (!foundProduct) return;
        
        setProduct(foundProduct);
        setIsModalOpen("product");
        setQuantity(1);
    }, [productId]);

    useEffect(() => {
        if (!searchValue) return;

        setActiveCategory('All');
    }, [searchValue]);

    // Funzione per aggiungere un prodotto al carrello
    const addToCart = (product, quantity) => {
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Se il prodotto esiste già nel carrello, aggiorna la quantità
            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity += quantity;
            setCartItems(updatedItems);
        } else {
            // Altrimenti aggiungi un nuovo elemento al carrello
            setCartItems([...cartItems, {
                ...product,
                quantity
            }]);
        }
        
        // Mostra il carrello su mobile quando si aggiunge un prodotto
        if (window.innerWidth < 768) {
            setIsCartOpen(true);
        }
    };

    // Funzione per rimuovere un prodotto dal carrello
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Funzione per aggiornare la quantità di un prodotto nel carrello
    const updateCartItemQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        const updatedItems = cartItems.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        
        setCartItems(updatedItems);
    };

    // Calcola il totale del carrello
    const cartTotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const handleCheckout = () => {
        // Logica per procedere all'ordine
        router.push('/checkout');
        console.log('Procedi all\'ordine', cartItems);
    };

    return (
        <div>
            <div className="relative bg-[#f5f3f5] min-h-screen">
                {/* Area principale con contenuto del ristorante */}
                <div className="pr-0 md:pr-[350px]"> {/* Aggiunto padding-right per fare spazio al carrello fisso */}
                    <div className="w-full 2xl:w-4/5 mx-auto px-4 flex flex-col gap-7 pb-20">
                        <div className='flex flex-col gap-2'>
                            <div className='relative h-[12rem] sm:h-[20rem] aspect-video w-full'>
                                <img src={mockRestaurant.banner} className='object-cover w-full h-full rounded-b-xl' />
                                <img 
                                    src={mockRestaurant.icon} 
                                    alt={`${mockRestaurant.restaurantname} logo`}
                                    className="absolute bottom-5 left-5 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white shadow-lg"
                                />
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <h1 className="font-bold text-3xl">{mockRestaurant.restaurantname}</h1>
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
                                    <span className='flex py-1 gap-1'>
                                        <Time className="inline-block h-4 w-4 mt-[3px]" />
                                        {mockRestaurant.minDeliveryTime} - {mockRestaurant.maxDeliveryTime} min
                                    </span>
                                    <span className='py-1'>•</span>
                                    <span className={`rounded-full px-2 py-1 ${mockRestaurant.isOpenNow ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {mockRestaurant.isOpenNow ? "Open Now" : "Closed"}
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
                            meals={filteredMeals}
                            setIsModalOpen={setIsModalOpen}
                            setProductId={setProductId}
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
                    {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold w-6 h-6 rounded-full text-xs flex items-center justify-center">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                    )}
                </button>

                {/* Carrello desktop fisso */}
                <div className="hidden md:block fixed top-0 right-0 w-[350px] h-screen border-l border-gray-200 bg-white shadow-lg">
                    <CartComponent 
                        isDesktop={true}
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        removeFromCart={removeFromCart}
                        updateCartItemQuantity={updateCartItemQuantity}
                        setIsCartOpen={setIsCartOpen}
                        onCheckout={handleCheckout}
                        deliveryFee={deliveryFee}
                        estimatedDeliveryTime={estimatedDeliveryTime}
                    />
                </div>

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
                            cartItems={cartItems}
                            cartTotal={cartTotal}
                            removeFromCart={removeFromCart}
                            updateCartItemQuantity={updateCartItemQuantity}
                            setIsCartOpen={setIsCartOpen}
                            onCheckout={handleCheckout}
                            deliveryFee={deliveryFee}
                            estimatedDeliveryTime={estimatedDeliveryTime}
                        />
                    </ModalContent>
                </Modal>

                {/* Modal per i dettagli del ristorante */}
                <Modal isOpen={isModalOpen === "restaurant"} onClose={() => setIsModalOpen(null)} size="lg">
                    <ModalContent className='rounded-b-none sm:rounded-lg m-0 sm:w-full'>
                        <ModalHeader className="text-center">
                            <h2 className="text-2xl font-semibold">{mockRestaurant.restaurantname}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col p-4 gap-3">
                                <h3 className='flex gap-2 items-center font-extrabold text-gray-700 text-xl'>
                                    <Storefront />
                                    Resturant Details
                                </h3>
                                <ul className='bg-gray-100 p-3 border-1 border-gray-500/25 rounded-lg flex flex-col gap-3'>
                                    <li className=''>
                                        { mockRestaurant.address.split(", ").map((part, index) => (
                                            <span key={index} className="block -my-0.5">{part}</span>
                                        ))}
                                    </li>
                                    <li>{mockRestaurant.phone}</li>
                                </ul>  
                            </div>
                            <div className="flex flex-col p-4 gap-3">
                                <h3 className='flex gap-2 items-center font-extrabold text-gray-700 text-xl'>
                                    <Time />
                                    Opening Hours
                                </h3>
                                <ul className='bg-gray-100 p-3 border-1 border-gray-500/25 rounded-lg'>
                                    {mockRestaurant.times && Object.entries(mockRestaurant.times).map(([day, times]) => {
                                        return (
                                            <li key={day} className="flex justify-between">
                                                <span className="capitalize font-medium">{day}</span>
                                                <span className={`${!times.open || !times.close ? "text-red-500" : "text-gray-700"}`}>
                                                    {!times.open || !times.close ? "Closed" : `${times.open} - ${times.close}`}
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
                            <div className='relative w-full h-48'>
                                <img
                                    src={product.image}
                                    className="w-full h-full object-cover"
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

                                    <div>
                                        <h3 className='font-bold text-lg text-gray-800'>Ingredients</h3>
                                        {product.ingredients && product.ingredients.length > 0 && (
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                                {product.ingredients.map((ingredient, i) => (
                                                    <li key={i} className="flex items-center text-gray-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2"></span>
                                                        {ingredient}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
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
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        removeFromCart={removeFromCart}
                        updateCartItemQuantity={updateCartItemQuantity}
                        setIsCartOpen={setIsCartOpen}
                        onCheckout={handleCheckout}
                        deliveryFee={deliveryFee}
                        estimatedDeliveryTime={estimatedDeliveryTime}
                    />
                    </div>
            </aside>
        </div>
    );
}