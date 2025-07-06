"use client"; 
import { Time } from '@/components/icons/heroicons';
import { useRouter } from 'next/navigation';
import { Card } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { useState } from 'react';

export default function RestaurantCard({
  id,
  img,
  restaurantname,
  minDeliveryTime,
  maxDeliveryTime,
  area,
  className,
}) {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card
      className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition ${className}`}
      isPressable
      onPress={() => router.push(`/restaurant/${id}`)}
    >
      <div className="relative aspect-video bg-gray-200">
        {!isImageLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
        <img
          src={img}
          alt={restaurantname}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{restaurantname}</h3>
        </div>
        <p className="flex gap-1 text-sm text-gray-600">
          <Time className="inline-block mt-[1.5px] h-4 w-4 text-gray-500" />
          {minDeliveryTime} - {maxDeliveryTime} min
        </p>
        <p className="flex text-sm text-gray-500 justify-start truncate">
          {area?.join(' • ')}
        </p>
      </div>
    </Card>
  );
}
