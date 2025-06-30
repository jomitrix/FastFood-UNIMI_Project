'use client';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import { Search, Meals } from "@/components/icons/heroicons";
import { WaveClean } from "@/components/waves";
import { useAuth } from "@/contexts/AuthContext";
import DeliveryAddressesSection from "../../components/app/home/DeliveryAddressesSection";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // Gli indirizzi ora sono gestiti nello stato del componente
  const [addresses, setAddresses] = useState([
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
  ]);
  const [addressQuery, setAddressQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  // Memoizzazione del filtro per performance migliori
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
  };

  // Il bottone è abilitato solo se l'indirizzo selezionato è valido
  const isAddressValid = !!selectedAddress;

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f5f3f5]">
      <div className="w-full bg-[#ff8844] flex items-center justify-center pb-5 md:pb-0 lg:pb-10">
        <div className="w-full flex flex-col md:flex-row text-center md:text-left items-center lg:w-3/5 p-5 lg:p-0 gap-10">
          <img src="/images/burger.png" alt="Burger" className="w-[50%] md:w-1/2" />
          <div className="flex flex-col w-[90%] md:w-1/2 -mt-8 md:mt-0 md:w-1/2 gap-2 md:gap-3 lg:gap-5 items-center md:items-start ">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Takeaway and delivery orders!
            </h1>
            <h3 className="text-xl md:text:3xl lg:text-4xl">
              {user?.role !== "restaurant" ? "Order now!" : "Set up your menu now!"}
            </h3>
            { user?.role !== "restaurant" ? (
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
                    placeholder="Insert delivery address"
                    radius="lg"
                    size="md"
                    className="w-full"
                    selectorButtonProps={ { className: "hidden" }}
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

                  <Button
                    variant="solid"
                    color="default"
                    className="bg-[#083d77] text-white font-medium -ml-[5.25rem] sm:-ml-[6.5rem] w-0 px-0 sm:w-[6rem] h-[2rem] sm:h-[2.5rem]"
                    startContent={<Search className="text-white flex-shrink-0 m-0" />}
                    radius="md"
                    isDisabled={!isAddressValid}
                    onPress={() => router.push(`/search?addressId=${selectedAddress.id}`)}
                  >
                    <span className="hidden sm:block">Search</span>
                  </Button>
                </div>
              </div>
            ) : (
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
        <WaveClean className="h-10 sm:h-20"/>
      </div>
      <DeliveryAddressesSection
        addresses={addresses.map(a => a.address)} // passa solo le stringhe degli indirizzi
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={(newAddresses) => {
          // Ricostruisci la lista con id univoci
          setAddresses(
            newAddresses.map((address, idx) => ({
              id: addresses[idx]?.id || Date.now() + idx, // mantieni id se esiste, altrimenti genera
              address,
            }))
          );
        }}
      />
    </div>
  );
}
