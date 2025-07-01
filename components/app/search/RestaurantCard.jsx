"use client"; 
import { Star } from '@/components/icons/heroicons';

export default function RestaurantCard({
  img,
  restaurantname,
  minDeliveryTime,
  maxDeliveryTime,
  area,
  rating,
  orderType,
  className,
}) {
  return (
    <div className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition ${className}`}>
      <div className="relative h-40 bg-gray-200">
        <img src={img} alt={restaurantname} className="w-full h-full object-cover" />
        {/* Puoi aggiungere un badge basato su orderType se necessario */}
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{restaurantname}</h3>
          <p className="flex items-center text-sm text-gray-600 shrink-0 ml-2">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {rating}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          {minDeliveryTime} - {maxDeliveryTime} min
        </p>
        <p className="text-sm text-gray-500 truncate">
          {area?.join(' • ')}
        </p>
      </div>
    </div>
  );
}
