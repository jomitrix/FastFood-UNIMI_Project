"use client";
import { Time } from '@/components/icons/heroicons';
import { useRouter } from 'next/navigation';
import { Card } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { useState, useEffect } from 'react';

export default function RestaurantCard({ restaurant, className }) {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState({
    min: 0,
    max: 0
  });

  const handleCardPress = () => {
    const existingOrderType = localStorage.getItem("orderType");

    if (!existingOrderType && restaurant.serviceMode) {
      restaurant.serviceMode === "delivery"
        ? localStorage.setItem("orderType", "delivery")
        : localStorage.setItem("orderType", "takeaway"); // se è all lascia takeaway
    }

    router.push(`/restaurant/${restaurant._id}`);
  };

  useEffect(() => {
    if (!restaurant.estimatedDeliveryTime) return;
    async function calculateDeliveryTime() {
      const time = restaurant.estimatedDeliveryTime;
      setEstimatedDeliveryTime({
        min: time >= 20 ? time - 10 : time,
        max: time + 10
      });
    }

    calculateDeliveryTime();
  }, [restaurant.estimatedDeliveryTime]);

  return (
    <Card
      className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition ${className}`}
      isPressable
      onPress={handleCardPress}
    >
      <div className="relative aspect-video bg-gray-200">
        {!isImageLoaded && <Skeleton className="absolute top-0 left-0 w-full h-full" />}
        <img
          src={process.env.NEXT_PUBLIC_API_URL + restaurant.banner}
          alt={restaurant.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{restaurant.name}</h3>
        </div>
        <p className="flex gap-1 text-sm text-gray-600">
          <Time className="inline-block mt-[1.5px] h-4 w-4 text-gray-500" />
          {estimatedDeliveryTime.min} - {estimatedDeliveryTime.max} min
        </p>
        <p className="flex text-sm text-gray-500 justify-start truncate">
          {restaurant.area?.join(' • ')}
        </p>
      </div>
    </Card>
  );
}
