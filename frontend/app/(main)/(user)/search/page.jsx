"use client";
import CategoryNav from '@/components/app/search/CategoryNav';
import FilterSidebar from '@/components/app/search/FilterSidebar';
import RestaurantCard from '@/components/app/search/RestaurantCard';
import HorizontalScroller from '@/components/app/search/HorizontalScroller';

const sample = [
  { img: '/sushi.jpg', name: 'Sushi Feltre', rating: 4.4, time: '10-25 min', badge: '-15% • minimo 20 €' },
  { img: '/pizza.jpg', name: 'Pizzeria Monfalcone', rating: 4.5, time: '25-40 min', badge: 'Consegna gratuita' },
  { img: '/kebab.jpg', name: 'Molise Turkish Kebap', rating: 5.0, time: '20-40 min' },
];

export default function Home() {
  return (
    <>
      {/* Header fisso */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="font-bold text-sm sm:text-base">
            Via Riccardo Pitteri, 56, 20134 Milano
          </h1>
          {/* Qui potresti mettere il toggle Consegna/Ritiro */}
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
    </>
  );
}
