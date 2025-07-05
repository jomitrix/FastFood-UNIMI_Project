"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
import MealCard from '@/components/app/search/MealCard';
import HorizontalScroller from '@/components/app/search/HorizontalScroller';
import DeliveryAddressesSection from '@/components/app/home/DeliveryAddressesSection';
import AddressOrderType from '@/components/app/search/AddressOrderType';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@heroui/button';
import { Search, Funnel } from '@/components/icons/heroicons';
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
      id: 1,
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
      addressReference: {id: 1}
    },
    {
      id: 2,
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
      addressReference: {id: 2}
    }
  ];
// filtro richiesto dal prof (i ristoranti devono essere mostrati per vicinanza dall'indirizzo selezionato
// già filtrati per delivery, takeaway e entrambi
// inoltre al caricamento della pagina mettere già tra i filtri di esclusione gli allergeni onboarding
const mockRestaurants = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    },
    ingredients: [
              "Chicken Thighs",
              "Lime",
              "Spring Onions",
              "Ginger",
              "Garlic",
              "Onion",
              "Red Chilli",
              "Thyme",
              "Lime",
              "Soy Sauce",
              "Vegetable Oil",
              "Brown Sugar",
              "Allspice",
              "Basmati Rice",
              "Coconut Milk",
              "Spring Onions",
              "Thyme",
              "Garlic",
              "Allspice",
              "Kidney Beans"
          ],
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
    },
    ingredients: [
      "Beef",
      "Salt",
      "Black Pepper",
      "Garlic",
      "Onion",
      "Paprika",
      "Allspice",
      "Turmeric",
      "Flour",
      "Butter",
      "Water"
    ]
  },
];

export default function Home() {
  const [orderType, setOrderType] = useState("takeaway");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    isOpenNow: false,
    selectedAllergens: [],
    selectedCuisines: [],
    priceRange: { min: '', max: '' }
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("restaurant");
  
  useEffect(() => {
    const courseFromStorage = localStorage.getItem('course');
    if (courseFromStorage) {
      setSelectedCategories(prev => {
        const newCategories = new Set(prev);
        newCategories.add(courseFromStorage);
        return Array.from(newCategories);
      });
      localStorage.removeItem('course');
    }
  }, []);

  const handleCategoriesChange = (categoryName) => {
    setSelectedCategories(prev => {
      const newCategories = new Set(prev);
      if (newCategories.has(categoryName)) {
        newCategories.delete(categoryName);
      } else {
        newCategories.add(categoryName);
      }
      const updatedCategories = Array.from(newCategories);
      console.log("Categorie filtrate:", updatedCategories);
      return updatedCategories;
    });
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

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    if (address && address.id) {
      localStorage.setItem('selectedAddressId', address.id);
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.isOpenNow) count++;
    if (activeFilters.selectedAllergens.length > 0) count++;
    if (activeFilters.selectedCuisines.length > 0) count++;
    if (searchType === 'dishes' && (activeFilters.priceRange.min || activeFilters.priceRange.max)) count++;
    return count;
  }, [activeFilters, searchType]);

  // Aggiungi questa funzione per filtrare i risultati
  const getFilteredResults = useMemo(() => {
    let results;

    if (searchType === "restaurant") {
      // Per ora, i filtri si applicano solo ai piatti.
      // Aggiungere qui la logica per i filtri dei ristoranti se necessario.
      results = mockRestaurants;
    } else { // searchType === 'dishes'
      results = mockMeals.filter(meal => {
        const { priceRange } = activeFilters;
        const minPrice = priceRange.min !== '' ? parseFloat(priceRange.min) : -Infinity;
        const maxPrice = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;

        if (meal.price < minPrice || meal.price > maxPrice) {
          return false;
        }
        return true;
      });
    }

    if (!searchValue) {
      return results;
    }
    
    const query = searchValue.toLowerCase();
    
    if (searchType === "restaurant") {
      return results.filter(restaurant => 
        restaurant.restaurantname.toLowerCase().includes(query) ||
        restaurant.area.some(area => area.toLowerCase().includes(query))
      );
    } else { // searchType === 'dishes'
      // Filtra ulteriormente i risultati già filtrati per prezzo
      return results.filter(meal => {
        // Controlla il nome del piatto
        if (meal.name.toLowerCase().includes(query)) {
          return true;
        }
        
        // Controlla gli ingredienti
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          return meal.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(query)
          );
        }
        
        return false;
      });
    }
  }, [searchValue, searchType, activeFilters]);

  return (
    <div className='bg-[#f5f3f5] w-full flex flex-col min-h-screen overflow-x-hidden'>
      {/* Header fisso */}
      <header className="fixed w-full top-16 z-40 bg-[#ff8844] shadow-sm">
        <AddressOrderType 
          addresses={addresses}
          onAddressSelect={handleAddressSelect}
          onOrderTypeChange={setOrderType}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onAddressesSave={(newAddresses) => {
            setAddresses(
              newAddresses.map((address, idx) => ({
                id: addresses[idx]?.id || Date.now() + idx,
                address,
              }))
            );
          }}
          initialOrderType={orderType}
        />
        <CategoryNav onCategoriesChange={handleCategoriesChange} selectedCategories={selectedCategories} />
      </header>

      {/* Contenuto - aumentato padding-top per evitare sovrapposizioni */}
      <div className="pt-[13rem] sm:pt-[12.5rem] w-full">
        <main className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 w-full overflow-hidden">
          <FilterSidebar 
            onFiltersChange={handleFiltersChange}
            isDrawerOpen={isFilterDrawerOpen}
            setIsDrawerOpen={setIsFilterDrawerOpen}
            searchType={searchType}
            activeFilters={activeFilters}
          />
  
          <div className="flex-1 pt-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-8">
              <Input
                type="search"
                placeholder={`Type here to search ${searchType === "restaurant" ? "restaurants" : "dishes or ingredients"}...`}
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
                className="w-full lg:flex-1"
              />
              
              <div className="flex items-center gap-3">
                <Select
                  disallowEmptySelection
                  selectedKeys={[searchType]}
                  onSelectionChange={(keys) => {
                    const newSearchType = Array.from(keys)[0];
                    setSearchType(newSearchType);
                    // Reset all filters when switching between restaurant and dishes
                    setActiveFilters({
                      isOpenNow: false,
                      selectedAllergens: [],
                      selectedCuisines: [],
                      priceRange: { min: '', max: '' }
                    });
                    setSelectedCategories([]);
                    console.log(`Switched to ${newSearchType} search, filters reset`);
                  }}
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
                  className="lg:hidden flex items-center overflow-auto justify-center gap-2 border rounded-lg px-3 py-2 bg-gray-200 shrink-0 relative"
                  size="lg"
                >
                  <Funnel className="h-5 w-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#083d77] overflow text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                {getFilteredResults.map((restaurant, i) => (
                  <RestaurantCard
                    key={`${restaurant.restaurantname}-${i}`}
                    {...restaurant}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {getFilteredResults.map((meal) => (
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
      </div>
  
      <FilterSidebar 
        onFiltersChange={handleFiltersChange}
        isDrawerOpen={isFilterDrawerOpen}
        setIsDrawerOpen={setIsFilterDrawerOpen}
        isMobile={true}
        searchType={searchType}
        activeFilters={activeFilters}
      />
    </div>
  );
}