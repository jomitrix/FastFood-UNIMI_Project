"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
import MealCard from '@/components/app/search/MealCard';
import HorizontalScroller from '@/components/app/search/HorizontalScroller';
import DeliveryAddressesSection from '@/components/app/home/DeliveryAddressesSection';
import AddressOrderType from '@/components/app/search/AddressOrderType';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
import { FeedService } from '@/services/feedService';
import { usePaginator } from '@/utils/paginator';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@heroui/spinner';
import { useDebounce } from '@/utils/useDebounce';
import { useMedia } from 'react-use';

export default function Home() {
  const { user } = useAuth();

  const [orderType, setOrderType] = useState("takeaway");
  const [selectedAddress, setSelectedAddress] = useState({});
  const [addresses, setAddresses] = useState(user?.delivery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    isOpenNow: true,
    selectedAllergens: [],
    selectedCuisines: [],
    priceRange: { min: '', max: '' }
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("restaurant");

  const debouncedSearch = useDebounce(searchValue, 300);
  const scrollController = useRef(null);
  const isMobileView = useMedia('(max-width: 1023px)');

  const nearbyRestaurantsPaginator = usePaginator(useCallback(
    (page, _) => FeedService.getNearbyRestaurants(page, selectedAddress._id, orderType, selectedCategories, activeFilters.selectedCuisines, activeFilters.selectedAllergens, activeFilters.isOpenNow, debouncedSearch)
      .then(data => data.status !== 'success' ? [] : data.restaurants), [selectedAddress._id, orderType, selectedCategories, activeFilters, debouncedSearch]),
    10
  );

  const nearbyPreferredRestaurantsPaginator = usePaginator(useCallback(
    (page, _) => FeedService.getNearbyPreferredRestaurants(page, selectedAddress._id)
      .then(data => data.status !== 'success' ? [] : data.restaurants), [selectedAddress._id]),
    10
  );

  const nearbyMealsPaginator = usePaginator(useCallback(
    (page, _) => FeedService.getNearbyMeals(page, selectedAddress._id, orderType, selectedCategories, activeFilters.selectedCuisines, activeFilters.selectedAllergens, activeFilters.isOpenNow, debouncedSearch, activeFilters.priceRange.min, activeFilters.priceRange.max)
      .then(data => data.status !== 'success' ? [] : data.meals), [selectedAddress._id, orderType, selectedCategories, activeFilters, debouncedSearch]),
    10
  );

  const lastElementRef = useCallback(node => {
    let paginator = searchType === 'restaurant' ? nearbyRestaurantsPaginator : nearbyMealsPaginator;
    if (searchType === "restaurant" &&
      !searchValue &&
      selectedCategories.length === 0 &&
      activeFilters.selectedAllergens.length === 0 &&
      activeFilters.selectedCuisines.length === 0 &&
      activeFilters.priceRange.min === '' &&
      activeFilters.priceRange.max === '' &&
      activeFilters.isOpenNow === true) paginator = nearbyPreferredRestaurantsPaginator;
    if (paginator.isLoading) return;

    if (scrollController.current) scrollController.current.disconnect();

    scrollController.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && paginator.hasMore && !paginator.isLoading) {
        console.log("Observer triggered: loading next page.");
        paginator.loadNext();

        scrollController.current.disconnect();
      }
    }, {
      rootMargin: '300px',
    });

    if (node) {
      scrollController.current.observe(node);
    }
  }, [searchType, nearbyRestaurantsPaginator, nearbyMealsPaginator]);

  useEffect(() => {
    if (searchType === "restaurant" &&
      !searchValue &&
      selectedCategories.length === 0 &&
      activeFilters.selectedAllergens.length === 0 &&
      activeFilters.selectedCuisines.length === 0 &&
      activeFilters.priceRange.min === '' &&
      activeFilters.priceRange.max === '' &&
      activeFilters.isOpenNow === true) nearbyPreferredRestaurantsPaginator.reset();
    if (searchType === 'restaurant') {
      nearbyRestaurantsPaginator.reset();
    } else if (searchType === 'dishes') {
      nearbyMealsPaginator.reset();
    }
  }, [
    selectedAddress,
    orderType,
    selectedCategories,
    activeFilters,
    debouncedSearch,
    searchType
  ]);

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
      return updatedCategories;
    });
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchValue(query);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    if (address && address._id) {
      localStorage.setItem('selectedAddressId', address._id);
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
            setAddresses(newAddresses);
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
            isMobile={isMobileView}
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
                    setActiveFilters({
                      isOpenNow: true,
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

            {/* Mostra "Based on your tastes" solo se NON ci sono filtri attivi, nessuna ricerca e nessuna categoria selezionata */}
            {searchType === "restaurant" &&
              !searchValue &&
              selectedCategories.length === 0 &&
              activeFilters.selectedAllergens.length === 0 &&
              activeFilters.selectedCuisines.length === 0 &&
              activeFilters.priceRange.min === '' &&
              activeFilters.priceRange.max === '' &&
              activeFilters.isOpenNow === true && (
                <HorizontalScroller title="Based on your tastes">
                  {nearbyPreferredRestaurantsPaginator.isLoading ? (
                    <Spinner
                      className="w-100 h-100"
                      variant="dots"
                      classNames={{
                        dots: 'bg-[#083d77]',
                      }}
                    />
                  ) : (
                    nearbyPreferredRestaurantsPaginator.items.map((r) => (
                      <RestaurantCard
                        key={r._id}
                        className="w-72 shrink-0"
                        restaurant={r}
                        ref={nearbyPreferredRestaurantsPaginator.items.length - 1 === r ? lastElementRef : null}
                      />
                    ))
                  )}
                </HorizontalScroller>
              )}

            <h2 className="text-xl font-semibold mb-4">
              {searchType === "restaurant"
                ? `Order from the following restaurants`
                : `Choose from the following dishes`
              }
            </h2>

            {searchType === "restaurant" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {nearbyRestaurantsPaginator.isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-16">
                    <Spinner
                      className="w-100 h-100"
                      variant="dots"
                      classNames={{
                        dots: 'bg-[#083d77]',
                      }}
                    />
                  </div>
                ) : nearbyRestaurantsPaginator.items.length === 0 ? (
                  <div className="col-span-full flex justify-center items-center py-16 text-gray-500">
                    No restaurants found.
                  </div>
                ) : (
                  nearbyRestaurantsPaginator.items.map((r, idx) => (
                    <RestaurantCard
                      key={r._id}
                      className="w-full"
                      restaurant={r}
                    // ref={idx === nearbyRestaurantsPaginator.items.length - 1 ? lastElementRef : null}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {nearbyMealsPaginator.isLoading ? (
                  <div className="col-span-full flex justify-center items-center py-16">
                    <Spinner
                      className="w-100 h-100"
                      variant="dots"
                      classNames={{
                        dots: 'bg-[#083d77]',
                      }}
                    />
                  </div>
                ) : nearbyMealsPaginator.items.length === 0 ? (
                  <div className="col-span-full flex justify-center items-center py-16 text-gray-500">
                    No results found.
                  </div>
                ) : (
                  nearbyMealsPaginator.items.map((meal, idx) => (
                    <MealCard
                      key={meal.meal._id}
                      img={process.env.NEXT_PUBLIC_API_URL + meal.meal.image}
                      mealName={meal.meal.name}
                      price={meal.meal.price}
                      area={meal.meal.area}
                      category={meal.meal.category}
                      restaurant={meal.restaurantName}
                      className="w-full"
                      restaurantId={meal.restaurantId}
                      restaurantName={meal.restaurantName}
                      estimatedDeliveryTime={meal.estimatedDeliveryTime}
                      ref={idx === nearbyMealsPaginator.items.length - 1 ? lastElementRef : null}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}