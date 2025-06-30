"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
import HorizontalScroller from '@/components/app/search/HorizontalScroller';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { MapPin, Takeaway, Delivery } from '@/components/icons/heroicons';

const sample = [
  { img: '/sushi.jpg', name: 'Sushi Feltre', rating: 4.4, time: '10-25 min', badge: '-15% • minimo 20 €' },
  { img: '/pizza.jpg', name: 'Pizzeria Monfalcone', rating: 4.5, time: '25-40 min', badge: 'Consegna gratuita' },
  { img: '/kebab.jpg', name: 'Molise Turkish Kebap', rating: 5.0, time: '20-40 min' },
];

export default function Home() {
  const [orderType, setOrderType] = useState("takeaway");

  return (
    <div className='bg-[#f5f3f5]'>
      {/* Header fisso */}
      <header className="sticky w-full top-16 z-50 bg-[#ff8844] shadow-sm">
        <div className="w-full pt-5 sm:pt-0 px-4 gap-3 sm:h-9 flex flex-wrap sm:flex-nowrap items-center justify-center">
          <div className='w-full sm:w-1/3 flex justify-center h-8 sm:h-9 items-center gap-2 sm:gap-4'>
            <Button 
              startContent={<MapPin size={20} className="text-[#083d77]" />}
              className="font-semibold bg-[#ECEAE7] h-full w-full rounded-full p-t text-sm">
              Via Roma 56, 20134, Milano
            </Button>
          </div>

          <div className='w-full sm:w-1/6 h-8 sm:h-auto'>
            <Tabs
              color="white"
              radius="full"
              size='sm'
              className="h-full flex justify-center items-center w-full"
              classNames={{
                  tabList: "bg-[#ECEAE7] w-full",
                  tabContent: "text-black",
                  tab: "data-[selected=true]:font-bold"
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
        </div>
        <CategoryNav />
      </header>

      {/* Contenuto */}
      <main className="max-w-7xl mx-auto flex px-4">
        <FilterSidebar />

        <div className="flex-1 pt-6">
          {/* Ricerca + ordinamento */}
          <div className="flex items-center gap-4 mb-8">
            <input
              placeholder="Cerchi un locale?"
              className="w-full border rounded-lg px-4 py-2"
            />
            <select className="border rounded-lg px-3 py-2">
              <option>Risultato migliore</option>
              <option>Tempo di consegna</option>
              <option>Voto</option>
            </select>
          </div>

          {/* Sezioni orizzontali */}
          <HorizontalScroller title="Il meglio della tua zona">
            {sample.map((r) => (
              <RestaurantCard key={r.name} {...r} />
            ))}
          </HorizontalScroller>

          <HorizontalScroller title="I brand più amati">
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
          <h2 className="text-xl font-semibold mb-4">Ordina da 587 locali</h2>
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
    </div>
  );
}
