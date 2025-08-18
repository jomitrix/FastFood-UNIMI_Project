"use client"; 
import { useRouter } from 'next/navigation';
import { Time } from '@/components/icons/heroicons';
import { useState, forwardRef } from 'react';
import { Skeleton } from '@heroui/skeleton';
import { Card } from '@heroui/card';

const MealCard = forwardRef(({
  img,
  mealName,
  price,
  area,
  category,
  restaurantId,
  restaurantName,
  estimatedDeliveryTime,
  className,
}, ref) => {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card 
      className={`overflow-hidden ${className}`}
      isPressable
      onPress={() => router.push(`/restaurant/${restaurantId}`)}
      ref={ref}
    >
        <div className="relative aspect-video bg-gray-200">
          {!isImageLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
          <img
            src={img}
            alt={mealName}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-semibold">
            €{price}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold truncate">{mealName}</h3>
          </div>
          {area && category && (
            <p className="text-xs text-left text-gray-400 truncate">
              {`${area} • ${category}`}
            </p>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-medium">{restaurantName}</span>
            {estimatedDeliveryTime && (
              <>
                <span>•</span>
                <Time className="inline-block h-3 w-3" />
                <span>{estimatedDeliveryTime.min} - {estimatedDeliveryTime.max} min</span>
              </>
            )}
          </div>
        </div>
    </Card>
  );
})

export default MealCard;
