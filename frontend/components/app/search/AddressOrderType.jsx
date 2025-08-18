"use client";
import { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@heroui/tabs';
import { MapPin, Takeaway, Delivery } from '@/components/icons/heroicons';
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import DeliveryAddressesSection from '@/components/app/home/DeliveryAddressesSection';
import { useCart } from '@/contexts/CartContext';

const AddressOrderType = ({ 
  addresses, 
  onAddressSelect, 
  onOrderTypeChange, 
  initialOrderType,
  isModalOpen,
  setIsModalOpen,
  isCartComponent = false,
  restaurantOrderType = "all",
  onAddressesSave
}) => {
  const { cart, setCart } = useCart();

  // Inizializza l'orderType leggendo dal localStorage o usando il default
  const [orderType, setOrderType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('orderType') || initialOrderType;
    }
    return initialOrderType;
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressQuery, setAddressQuery] = useState("");

  useEffect(() => {
    // Se il ristorante accetta solo un tipo di ordine specifico, forza quell'opzione
    if (restaurantOrderType === "delivery" && orderType !== "delivery") {
      setOrderType("delivery");
      onOrderTypeChange("delivery");
    } else if (restaurantOrderType === "takeaway" && orderType !== "takeaway") {
      setOrderType("takeaway");
      onOrderTypeChange("takeaway");
    } 
    // Altrimenti sincronizza con initialOrderType se è diverso dallo stato attuale
    else if (initialOrderType !== orderType) {
      setOrderType(initialOrderType);
    }
  }, [initialOrderType, restaurantOrderType]);

  const filtered = useMemo(
    () =>
      addressQuery
        ? addresses.filter((addr) =>
            addr.address.toLowerCase().includes(addressQuery.toLowerCase())
          )
        : addresses,
    [addressQuery, addresses]
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && addresses.length > 0) {
      const savedAddressId = localStorage.getItem('selectedAddressId');
      if (savedAddressId) {
        const foundAddress = addresses.find(addr => addr._id === savedAddressId);
        if (foundAddress) {
          setSelectedAddress(foundAddress);
          setAddressQuery(foundAddress.address);
          onAddressSelect(foundAddress);
        }
      }
    }
  }, [addresses, onAddressSelect]);

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setAddressQuery(addr.address);
    onAddressSelect(addr);
    localStorage.setItem('selectedAddressId', addr._id);
  };

  const handleOrderTypeChange = (key) => {
    const newType = String(key);
    setOrderType(newType);
    onOrderTypeChange(newType);
    localStorage.setItem('orderType', newType);
  };

  useEffect(() => {
    setCart(prevCart => ({
      ...prevCart,
      orderType: orderType,
      deliveryAddress: orderType === 'delivery' ? selectedAddress : null,
    }));
  }, [orderType]);

  const showAddressField = !isCartComponent || (isCartComponent && orderType === 'delivery');
  const showDelivery = restaurantOrderType === "all" || restaurantOrderType === "delivery";
  const showTakeaway = restaurantOrderType === "all" || restaurantOrderType === "takeaway";

  return (
    <>
      <div className={`w-full py-3 px-4 gap-3 flex ${isCartComponent ? 'flex-col' : 'flex-wrap sm:flex-nowrap'} items-center justify-center`}>
        {/* Tabs sopra nel caso del carrello */}
        {isCartComponent && (
          <Tabs
            color="white"
            radius="full"
            size='md'
            className="h-10 w-full"
            classNames={{
              tabList: "bg-[#ECEAE7] w-full h-10",
              tabContent: "text-black h-full flex items-center",
              tab: "data-[selected=true]:font-bold h-full"
            }}
            selectedKey={orderType}
            onSelectionChange={handleOrderTypeChange}
          >
            {showTakeaway && (
              <Tab key="takeaway" title={
                <div className='flex justify-center items-center gap-2'>
                  <Takeaway size={16} className="text-[#083d77]" />
                  <span>Takeaway</span>
                </div>}
              />
            )}
            {showDelivery && (
              <Tab key="delivery" title={
                <div className='flex justify-center items-center gap-2'>
                  <Delivery size={16} className="text-[#083d77]" />
                  <span>Delivery</span>
                </div>}
              />
            )}
          </Tabs>
        )}
        
        {/* Mostra il campo indirizzo solo quando necessario */}
        {showAddressField && (
          <Autocomplete
            inputValue={addressQuery}
            selectorIcon={null}
            defaultItems={addresses}
            value={addressQuery}
            onInputChange={value => {
              setAddressQuery(value);
              if (!value) {
                setSelectedAddress(null);
                onAddressSelect(null);
                localStorage.removeItem('selectedAddressId');
              }
            }}
            placeholder="Select an address"
            radius="full"
            size="md"
            className={`w-full ${!isCartComponent ? 'sm:w-1/2' : ''}`}
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
                  key={addr._id}
                  value={addr.address}
                  textValue={addr.address}
                  onPress={() => handleSelect(addr)}
                  className={selectedAddress?._id === addr._id ? "bg-[#ffe0c2]" : ""}
                >
                  {addr.address}
                </AutocompleteItem>
              ))}
              <AutocompleteItem
                key="add-new"
                className="text-[#083d77] mt-1"
                classNames={{title: "font-semibold"}}
                title="+ Add new Address"
                onPress={() => { 
                  setIsModalOpen(true);
                  setTimeout(() => setAddressQuery(""), 100); 
                }}
              />
            </AutocompleteSection>
          </Autocomplete>
        )}

        {/* Tabs in fondo se non è nel carrello */}
        {!isCartComponent && (
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
            onSelectionChange={handleOrderTypeChange}
          >
            {showTakeaway && (
              <Tab key="takeaway" title={
                <div className='flex justify-center items-center gap-2'>
                  <Takeaway size={16} className="text-[#083d77]" />
                  <span>Takeaway</span>
                </div>}
              />
            )}
            {showDelivery && (
              <Tab key="delivery" title={
                <div className='flex justify-center items-center gap-2'>
                  <Delivery size={16} className="text-[#083d77]" />
                  <span>Delivery</span>
                </div>}
              />
            )}
          </Tabs>
        )}
      </div>
      
      <DeliveryAddressesSection
        addresses={addresses}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={onAddressesSave}
      />
    </>
  );
};

export default AddressOrderType;
