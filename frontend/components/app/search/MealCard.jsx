"use client"; 
import { Time } from '@/components/icons/heroicons';

export default function MealCard({
  img,
  mealName,
  price,
  description,
  restaurant,
  className,
}) {
  return (
    <div className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition ${className}`}>
      <div className="relative aspect-video bg-gray-200">
        <img src={img} alt={mealName} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-semibold">
          €{price}
        </div>
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{mealName}</h3>
        </div>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span className="font-medium">{restaurant?.restaurantname}</span>
          {restaurant?.minDeliveryTime && restaurant?.maxDeliveryTime && (
            <>
              <span>•</span>
              <Time className="inline-block h-3 w-3" />
              <span>{restaurant.minDeliveryTime} - {restaurant.maxDeliveryTime} min</span>
            </>
          )}
        </div>
        {restaurant?.area && (
          <p className="text-xs text-gray-400 truncate">
            {restaurant.area.join(' • ')}
          </p>
        )}
      </div>
    </div>
  );
}
