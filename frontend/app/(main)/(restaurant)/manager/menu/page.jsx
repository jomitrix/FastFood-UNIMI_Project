'use client';
import { withAuth } from '@/utils/withAuth';
import { notFound } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import MealsList from "@/components/app/manager/menu/MealsList";
import meals from "@/utils/meals.json";
import { useAuth } from '@/contexts/AuthContext';
import { usePaginator } from '@/utils/paginator';
import { RestaurantService } from '@/services/restaurantService';
import { Spinner } from '@heroui/spinner';

function MealsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const mealsPaginator = usePaginator(useCallback(
    (page, _) => RestaurantService.getMenu(user?.restaurant._id, page)
      .then(data => data.status !== 'success' ? [] : data.meals), [user?.restaurant._id]),
    10
  );

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType='restaurant'
        title="Menu Management"
        subtitle="Manage your restaurant's menu"
      />

      <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-4 pb-12">
        {mealsPaginator.isLoading ?
          <Spinner className='w-100 h-100' variant="dots" classNames={{
            dots: 'bg-[#083d77]',
          }} />
          :
          <MealsList
            searchMeals={meals}
            meals={mealsPaginator.items}
            restaurantId={user?.restaurant._id}
          />
        }
      </div>
    </div>
  );
}

export default withAuth(MealsPage);