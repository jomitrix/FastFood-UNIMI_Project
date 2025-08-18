'use client';
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import { Search, Meals, Login } from "@/components/icons/heroicons";
import { WaveClean } from "@/components/waves";
import { useAuth } from "@/contexts/AuthContext";
import HorizontalScroller from "@/components/app/search/HorizontalScroller";
import RestaurantCard from "@/components/app/search/RestaurantCard";
import DeliveryAddressesSection from "@/components/app/home/DeliveryAddressesSection";
import Categories from "@/components/app/home/Categories";
import { usePaginator } from '@/utils/paginator';
import { FeedService } from '@/services/feedService';
import { Spinner } from '@heroui/spinner';

export default function Home() {
  const router = useRouter();
  const { user, getUser } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.delivery[0]?._id || "");

  const restaurantsPaginator = usePaginator(useCallback(
    (page, _) => FeedService.getNearbyPreferredRestaurants(page, deliveryAddress)
      .then(data => data.status !== 'success' ? [] : data.restaurants), [deliveryAddress]),
    10
  );

  useEffect(() => {
    restaurantsPaginator.reset();
  }, [user]);

  const [addresses, setAddresses] = useState([]);

  const [addressQuery, setAddressQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});

  useEffect(() => {
    getUser()
  }, [getUser]);

  useEffect(() => {
    if (!user) return;
    setAddresses(user.delivery || []);
  }, [user]);

  const filtered = useMemo(
    () =>
      addressQuery
        ? addresses.filter((addr) =>
          addr.address.toLowerCase().includes(addressQuery.toLowerCase())
        )
        : addresses,
    [addressQuery, addresses]
  );

  // Funzione per gestire la selezione di un indirizzo
  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setAddressQuery(addr.address);
    localStorage.setItem('selectedAddressId', addr._id);
  };

  useEffect(() => {
    console.log("Home", selectedAddress);
  }, [selectedAddress]);


  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f5f3f5]">
      <div className="w-full bg-[#ff8844] flex items-center justify-center pb-2 md:pb-0">
        <div className="w-full flex flex-col md:flex-row text-center md:text-left items-center lg:w-3/5 p-5 lg:p-0 gap-10">
          <img src="/images/burger.png" alt="Burger" className="w-[50%] md:w-1/2" />
          <div className="flex flex-col w-[90%] md:w-1/2 -mt-8 md:mt-0 md:w-1/2 gap-2 md:gap-3 lg:gap-5 items-center md:items-start ">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Takeaway and delivery orders!
            </h1>
            <h3 className="text-xl md:text:3xl lg:text-4xl">
              Order now!
            </h3>
            {!user && (
              <Button
                variant="solid"
                startContent={<Login />}
                color="default"
                className="w-full bg-black text-white"
                size="lg"
                onPress={() => router.push("/auth/login")}
              >
                Login
              </Button>
            )}

            {user?.role === "user" && (
              <div className="w-full flex flex-col items-center md:items-start">
                <div className="w-full flex items-center relative">
                  <Autocomplete
                    inputValue={addressQuery}
                    selectorIcon={null}
                    defaultItems={addresses}
                    value={addressQuery}
                    onInputChange={value => {
                      setAddressQuery(value);
                      setSelectedAddress(""); // reset se si digita manualmente
                    }}
                    placeholder="Insert your address to search"
                    radius="lg"
                    size="md"
                    className="w-full"
                    selectorButtonProps={{ className: "hidden" }}
                    openOnFocus
                    inputProps={{
                      classNames: {
                        inputWrapper: "py-4 sm:py-7",
                        input: "mr-[1.5rem] sm:mr-[3rem]",
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
                        classNames={{ title: "font-semibold" }}
                        title="+ Add new Address"
                        onPress={() => { setIsModalOpen(true), setTimeout(() => setAddressQuery(""), 100); }}
                      />
                    </AutocompleteSection>
                  </Autocomplete>

                  <Button
                    variant="solid"
                    color="default"
                    className="bg-[#083d77] text-white font-medium -ml-[5.25rem] sm:-ml-[6.5rem] w-0 px-0 sm:w-[6rem] h-[2rem] sm:h-[2.5rem]"
                    startContent={<Search className="text-white flex-shrink-0 m-0" />}
                    radius="md"
                    // isDisabled={!isAddressValid}
                    onPress={() => router.push("/search")}
                  >
                    <span className="hidden sm:block">Search</span>
                  </Button>
                </div>
              </div>
            )}

            {user?.role === "restaurant" && (
              <Button
                placeholder="Search restaurants and dishes"
                variant="solid"
                color="default"
                className="w-full bg-black text-white"
                startContent={<Meals />}
                isClearable
                size="lg"
                onPress={() => router.push("/manager/menu")}
              >
                Manage your menu
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <WaveClean className="h-10 sm:h-20" />
      </div>

      {/* Sezione per i ristoranti consigliati in base ai gusti (da vedere solo in opt-in) 
      Li mostra in base alla vicinanza degli indirizzi inseriti, quando cliccato rimanda
      all'ordine con quell'indirizzo*/}
      {user?.role === "user" && user?.preferences.specialOffersFeed && restaurantsPaginator.items.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HorizontalScroller title="Based on your tastes">
            {restaurantsPaginator.isLoading ? (
              <Spinner
                className="w-100 h-100"
                variant="dots"
                classNames={{
                  dots: 'bg-[#083d77]',
                }}
              />
            ) : (
              restaurantsPaginator.items.map((r) => (
                <RestaurantCard
                  key={r._id}
                  restaurant={r}
                  className="w-72 shrink-0"
                />
              ))
            )}
          </HorizontalScroller>
        </div>
      )}

      <DeliveryAddressesSection
        addresses={addresses}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={(newAddresses) => {
          setAddresses(
            newAddresses.map((address, idx) => ({
              id: addresses[idx]?._id || Date.now() + idx,
              address,
            }))
          );
        }}
      />

      <Categories />
    </div>
  );
}
