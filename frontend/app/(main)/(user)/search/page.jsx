"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
import MealCard from '@/components/app/search/MealCard';
import HorizontalScroller from '@/components/app/search/HorizontalScroller';
import DeliveryAddressesSection from '@/components/app/home/DeliveryAddressesSection';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@heroui/tabs';
import { Button } from '@heroui/button';
import { MapPin, Takeaway, Delivery, Search, Funnel } from '@/components/icons/heroicons';
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import { Input } from "@heroui/input";
import { allergens } from "@/utils/lists";
import { Select, SelectItem } from '@heroui/select';

const mockAddresses = [
    {
      id: 1,
      address: "Via Tiburtina 1361, Roma, 00131, Italy"
    },
    {
      id: 2,
      address: "Piazzale Loreto 9, Milano, 20131, Italy"
    },
    {
      id: 3,
      address: "Via Dante 20, Poggibonsi, 53036, Italy"
    },
  ];


  const mockTastesRest = [
    {
      img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_144,w_287/f_auto/q_auto/dpr_1.0/d_it:cuisines:sushi-5.jpg/v1/it/restaurants/288525.jpg",
      restaurantname: "Sushi Feltre",
      minDeliveryTime: 10,
      maxDeliveryTime: 20,
      courses: ["Fish", "Starter", "Main Course", "First Course"],
      area: ["Japanese", "Chinese", "Asian"],
      allergens: ["Milk", "Egg", "Peanut"],
      rating: 4.5,
      isOpenNow: true,
      orderType: "both",
    },
    {
      img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_240/f_auto/q_auto/dpr_1.0/d_it:cuisines:pizza-2.jpg/v1/it/restaurants/225192.jpg",
      restaurantname: "Pizzeria da Mario",
      minDeliveryTime: 20,
      maxDeliveryTime: 40,
      courses: ["Pizza", "Italian"],
      area: ["Italian"],
      allergens: ["Gluten", "Milk"],
      rating: 4.8,
      isOpenNow: false,
      orderType: "delivery",
    }
  ];
// filtro richiesto dal prof (i ristoranti devono essere mostrati per vicinanza dall'indirizzo selezionato
// già filtrati per delivery, takeaway e entrambi
const mockRestaurants = [
  {
    img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_144,w_287/f_auto/q_auto/dpr_1.0/d_it:cuisines:sushi-5.jpg/v1/it/restaurants/288525.jpg",
    restaurantname: "Sushi Feltre",
    minDeliveryTime: 10,
    maxDeliveryTime: 20,
    courses: ["Fish", "Starter", "Main Course", "First Course"],
    area: ["Japanese", "Chinese", "Asian"],
    allergens: ["Milk", "Egg", "Peanut"],
    rating: 4.5,
    isOpenNow: true,
    orderType: "both",
  },
  {
    img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_240/f_auto/q_auto/dpr_1.0/d_it:cuisines:pizza-2.jpg/v1/it/restaurants/225192.jpg",
    restaurantname: "Pizzeria da Mario",
    minDeliveryTime: 20,
    maxDeliveryTime: 40,
    courses: ["Pizza", "Italian"],
    area: ["Italian"],
    allergens: ["Gluten", "Milk"],
    rating: 4.8,
    isOpenNow: false,
    orderType: "delivery",
  },
  {
    img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_144,w_287/f_auto/q_auto/dpr_1.0/d_it:cuisines:pollo-6.jpg/v1/it/restaurants/282166.jpg",
    restaurantname: "KFC - Abruzzi",
    minDeliveryTime: 15,
    maxDeliveryTime: 35,
    courses: ["Chicken", "Fast Food"],
    area: ["American"],
    allergens: ["Gluten"],
    rating: 4.1,
    isOpenNow: true,
    orderType: "takeaway",
  },
  {
    img: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,h_144,w_287/f_auto/q_auto/dpr_1.0/d_it:cuisines:hamburger-9.jpg/v1/it/restaurants/270039.jpg",
    restaurantname: "Burger King",
    minDeliveryTime: 25,
    maxDeliveryTime: 45,
    courses: ["Burgers", "Fast Food"],
    area: ["American"],
    allergens: ["Gluten", "Milk", "Sesame"],
    rating: 4.3,
    isOpenNow: true,
    orderType: "both",
  },
];

const mockMeals = [
  {
    id: "1",
    price: 12.99,
    currency: "€",
    name: "Jerk chicken with rice & peas",
    category: "Chicken",
    area: "Jamaican",
    image: "https://www.themealdb.com/images/media/meals/tytyxu1515363282.jpg",
    restaurant: {
      ...mockRestaurants[3]
    }
  },
  {
    id: "2",
    price: 12.99,
    currency: "€",
    name: "Jamaican Beef Patties",
    category: "Beef",
    area: "Jamaican",
    image: "https://www.themealdb.com/images/media/meals/wsqqsw1515364068.jpg",
    restaurant: {
      ...mockRestaurants[2]
    }
  },
];

export default function Home() {
  const [orderType, setOrderType] = useState("takeaway");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [addressQuery, setAddressQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    isOpenNow: false,
    selectedAllergens: [],
    selectedCuisines: []
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("restaurant");
  
  const filtered = useMemo(
    () =>
      addressQuery
        ? addresses.filter((addr) =>
            addr.address.toLowerCase().includes(addressQuery.toLowerCase())
          )
        : addresses,
    [addressQuery, addresses]
  );

  const getQueryParam = (param) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(param);
      
      if (paramValue) {
        const foundAddress = addresses.find(addr => addr.id === Number(paramValue));
        if (foundAddress) {
          setSelectedAddress(foundAddress);
          setAddressQuery(foundAddress.address);
        }
      }
      
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  useEffect(() => {
    getQueryParam('addressId');
  }, []);

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setAddressQuery(addr.address);
  };

  const handleCategoriesChange = (categories) => {
    setSelectedCategories(categories);
    console.log("Categorie filtrate:", categories);
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    console.log("Filtri applicati:", filters);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchValue(query);
    console.log("Search query:", query);
  }

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.isOpenNow) count++;
    if (activeFilters.selectedAllergens.length > 0) count++;
    if (activeFilters.selectedCuisines.length > 0) count++;
    return count;
  }, [activeFilters]);

  return (
    <div className='bg-[#f5f3f5] w-full flex flex-col min-h-screen'>
      {/* Header fisso */}
      <header className="sticky w-full top-16 z-50 bg-[#ff8844] shadow-sm">
        <div className="w-full py-3 px-4 gap-3 flex flex-wrap sm:flex-nowrap items-center justify-center">
          <Autocomplete
            inputValue={addressQuery}
            selectorIcon={null}
            defaultItems={addresses}
            value={addressQuery}
            onInputChange={value => {
              setAddressQuery(value);
              if (!value) setSelectedAddress(null);
            }}
            placeholder="Select an address"
            radius="full"
            size="md"
            className="w-full sm:w-1/2"
            selectorButtonProps={{ className: "hidden" }}
            startContent={<MapPin size={20} className="text-[#083d77]" />}
            openOnFocus
            inputProps={{
              classNames: {
                inputWrapper: "bg-[#ECEAE7] h-10",
                input: "text-sm font-semibold",
              }
            }}
          >
            <AutocompleteSection title="Your Addresses">
              {filtered.map(addr => (
                <AutocompleteItem
                  key={addr.id}
                  value={addr.address}
                  textValue={addr.address}
                  onPress={() => handleSelect(addr)}
                  className={selectedAddress?.id === addr.id ? "bg-[#ffe0c2]" : ""}
                >
                  {addr.address}
                </AutocompleteItem>
              ))}
              <AutocompleteItem
                key="add-new"
                className="text-[#083d77] mt-1"
                classNames={{title: "font-semibold"}}
                title="+ Add new Address"
                onPress={() => { setIsModalOpen(true), setTimeout(() => setAddressQuery(""), 100); }}
              />
            </AutocompleteSection>
          </Autocomplete>

          <Tabs
            color="white"
            radius="full"
            size='md'
            className="h-10 w-full sm:w-auto"
            classNames={{
                tabList: "bg-[#ECEAE7] w-full h-10",
                tabContent: "text-black h-full flex items-center",
                tab: "data-[selected=true]:font-bold h-full"
            }}
            selectedKey={orderType}
            onSelectionChange={(key) => setOrderType(String(key))}
          >
              <Tab key="takeaway" title={
                <div className='flex justify-center items-center gap-2'>
                  <Takeaway size={16} className="text-[#083d77]" />
                  <span>Takeaway</span>
                </div>}
              />
              <Tab key="delivery" title={
                <div className='flex justify-center items-center gap-2'>
                  <Delivery size={16} className="text-[#083d77]" />
                  <span>Delivery</span>
                </div>}
              />
          </Tabs>
        </div>
        <CategoryNav onCategoriesChange={handleCategoriesChange} />
      </header>

      {/* Contenuto */}
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4">
        <FilterSidebar 
          onFiltersChange={handleFiltersChange}
          isDrawerOpen={isFilterDrawerOpen}
          setIsDrawerOpen={setIsFilterDrawerOpen}
          isMobile={false}
        />

        <div className="flex-1 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-8">
            <Input
              type="search"
              placeholder="Type here to search..."
              size="lg"
              startContent={<Search className="text-[#083d77]" />}
              classNames={{
                inputWrapper: "bg-gray-200",
                label: "text-sm mb-4",
                input: "text-lg",
              }}
              variant="solid"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full lg:flex-1"
            />
            
            <div className="flex items-center gap-3">
              <Select
                disallowEmptySelection
                selectedKeys={[searchType]}
                onSelectionChange={(keys) => setSearchType(Array.from(keys)[0])}
                aria-label="Search type"
                size="lg"
                className="flex-1 lg:w-48 lg:shrink-0"
                classNames={{
                  trigger: "bg-gray-200",
                }}
              >
                <SelectItem key="restaurant" value="restaurant">Restaurant</SelectItem>
                <SelectItem key="dishes" value="dishes">Dishes</SelectItem>
              </Select>
              
              <Button 
                onPress={() => setIsFilterDrawerOpen(true)} 
                className="lg:hidden flex items-center justify-center gap-2 border rounded-lg px-3 py-2 bg-gray-200 shrink-0 relative"
                size="lg"
              >
                <Funnel className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff8844] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          { !searchValue && searchType === "restaurant" && (
            <HorizontalScroller title="Based on your tastes">
              {mockTastesRest.map((r) => (
                <RestaurantCard
                  key={r.restaurantname}
                  {...r}
                  className="w-72 shrink-0"
                />
              ))}
            </HorizontalScroller>
          ) }

          <h2 className="text-xl font-semibold mb-4">
            {searchType === "restaurant" 
              ? `Order from ${mockRestaurants.length} restaurants`
              : `Choose from ${mockMeals.length} dishes`
            }
          </h2>
          
          {searchType === "restaurant" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {mockRestaurants.map((restaurant, i) => (
                <RestaurantCard
                  key={`${restaurant.restaurantname}-${i}`}
                  {...restaurant}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {mockMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  img={meal.image}
                  mealName={meal.name}
                  price={meal.price}
                  description={meal.area}
                  restaurant={meal.restaurant}
                  className="w-full"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <DeliveryAddressesSection
        addresses={addresses.map(a => a.address)}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={(newAddresses) => {
          setAddresses(
            newAddresses.map((address, idx) => ({
              id: addresses[idx]?.id || Date.now() + idx,
              address,
            }))
          );
        }}
      />
      
      <FilterSidebar 
        onFiltersChange={handleFiltersChange}
        isDrawerOpen={isFilterDrawerOpen}
        setIsDrawerOpen={setIsFilterDrawerOpen}
        isMobile={true}
      />
    </div>
  );
}