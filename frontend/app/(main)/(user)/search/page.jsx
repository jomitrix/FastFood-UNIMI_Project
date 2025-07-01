"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
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

const sample = [
  { img: '/sushi.jpg', name: 'Sushi Feltre', rating: 4.4, time: '10-25 min', badge: '-15% • minimo 20 €' },
  { img: '/pizza.jpg', name: 'Pizzeria Monfalcone', rating: 4.5, time: '25-40 min', badge: 'Consegna gratuita' },
  { img: '/kebab.jpg', name: 'Molise Turkish Kebap', rating: 5.0, time: '20-40 min' },
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
  
  // Filtra gli indirizzi in base alla query
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
      
      // Rimuovi i parametri dall'URL se necessario
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  useEffect(() => {
    getQueryParam('addressId');
  }, []);

  // Gestisci la selezione dell'indirizzo
  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setAddressQuery(addr.address);
  };

  // Gestisce le categorie filtrate ricevute dal componente CategoryNav
  const handleCategoriesChange = (categories) => {
    setSelectedCategories(categories);
    console.log("Categorie filtrate:", categories);
    // Qui puoi aggiungere logica per filtrare i ristoranti in base alle categorie
  };

  // Gestisce i filtri ricevuti dal componente FilterSidebar
  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    console.log("Filtri applicati:", filters);
    // Qui puoi aggiungere logica per filtrare i ristoranti in base ai filtri
  };

  // Conta i filtri attivi per mostrare il badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.isOpenNow) count++;
    if (activeFilters.selectedAllergens.length > 0) count++;
    if (activeFilters.selectedCuisines.length > 0) count++;
    return count;
  }, [activeFilters]);

  return (
    <div className='bg-[#f5f3f5]'>
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
        {/* Filtri Desktop (visibili solo su lg) */}
        <FilterSidebar 
          onFiltersChange={handleFiltersChange}
          isDrawerOpen={isFilterDrawerOpen}
          setIsDrawerOpen={setIsFilterDrawerOpen}
          isMobile={false}
        />

        <div className="flex-1 pt-6">
          {/* Ricerca + ordinamento + pulsante filtri mobile */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 mb-8">
            <div className="relative w-full md:flex-1">
              <input
                placeholder="Looking for a restaurant?"
                className="w-full border rounded-lg pl-10 pr-4 py-2"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className='flex w-full gap-2 sm:w-auto'>
                <select className="border rounded-lg px-3 py-2 w-1/2 md:w-auto">
              <option>Best results</option>
              <option>Delivery time</option>
              <option>Rating</option>
            </select>
            
            {/* Pulsante filtri per mobile */}
            <Button 
              onPress={() => setIsFilterDrawerOpen(true)} 
              className="lg:hidden flex items-center justify-center gap-2 border rounded-lg px-3 py-2 bg-gray-200 w-1/2 md:w-auto relative"
            >
              <Funnel className="h-5 w-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff8844] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            </div>
          </div>

          {/* Sezioni orizzontali */}
          <HorizontalScroller title="Best in your area">
            {sample.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </HorizontalScroller>

          <HorizontalScroller title="Most loved brands">
            {['/alice.jpg', '/carrefour.jpg', '/romantica.jpg'].map((img, i) => (
              <RestaurantCard
                key={i}
                img={img}
                name={['Alice Pizza', 'Carrefour Market', "Rom'Antica"][i]}
                rating={4.3}
                time="15-35 min"
              />
            ))}
          </HorizontalScroller>

          {/* Lista verticale */}
          <h2 className="text-xl font-semibold mb-4">Order from 587 restaurants</h2>
          <div className="space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCard
                key={i}
                img="/kfc.jpg"
                name="KFC – Abruzzi"
                rating={4.1}
                time="15-35 min"
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modal per l'aggiunta di nuovi indirizzi */}
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
      
      {/* Filtri Mobile (drawer) */}
      <FilterSidebar 
        onFiltersChange={handleFiltersChange}
        isDrawerOpen={isFilterDrawerOpen}
        setIsDrawerOpen={setIsFilterDrawerOpen}
        isMobile={true}
      />
    </div>
  );
}
