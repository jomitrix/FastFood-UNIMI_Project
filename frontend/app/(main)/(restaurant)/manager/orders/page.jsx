'use client';
import { withAuth } from '@/utils/withAuth';
// import { notFound } from "next/navigation";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import Restaurant from "./Restaurant";
import { statuses } from "@/utils/lists";
import { usePaginator } from '@/utils/paginator';
import { RestaurantService } from '@/services/restaurantService';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/utils/useDebounce';

function OrderPage() {
  const router = useRouter();
  const { user } = useAuth();

  const statusOptions = useMemo(
    () => Object.keys(statuses).map(uid => ({ uid, name: statuses[uid].display })),
    []
  );

  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    () => new Set(statusOptions.map(opt => opt.uid))
  );
  const debouncedSearch = useDebounce(filterValue, 300);

  const ordersPaginator = usePaginator(useCallback(
    (page, _) => RestaurantService.getOrders(page, debouncedSearch, Array.from(statusFilter).join(","))
      .then(data => {
        setTotalOrders(data.totalOrders);
        return data.status !== 'success' ? [] : data.orders
      }), [debouncedSearch, statusFilter]),
    10
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    ordersPaginator.loadPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
    ordersPaginator.reset();
  }, [debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
    ordersPaginator.reset();
  }, [statusFilter]);

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        title={"Order Management"}
        subtitle={"Manage orders for your restaurant."}
      />

      <Restaurant
        orders={ordersPaginator.items}
        totalOrders={totalOrders}
        statuses={statuses}
        loadPage={handlePageChange}
        currentPage={currentPage}
        isLoading={ordersPaginator.isLoading}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        debouncedSearch={debouncedSearch}
      />
    </div>
  );
}

export default withAuth(OrderPage);