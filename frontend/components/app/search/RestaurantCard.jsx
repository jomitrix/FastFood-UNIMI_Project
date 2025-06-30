"use client"; 
import { StarIcon } from '@heroicons/react/24/solid';

export default function RestaurantCard({ img, name, rating, time, badge }) {
  return (
    <div className="w-72 shrink-0 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative h-40">
        <img src={img} alt={name} fill className="object-cover" />
        {badge && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold truncate">{name}</h3>
        <p className="flex items-center text-sm text-gray-600">
          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
          {rating} • {time}
        </p>
      </div>
    </div>
  );
}
