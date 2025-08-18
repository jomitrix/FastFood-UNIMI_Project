'use client';
// import { notFound } from "next/navigation";
import { withAuth } from '@/utils/withAuth';
import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import User from "./User"
import { usePaginator } from '@/utils/paginator';
import { UserService } from '@/services/userService';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';

function OrderPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [hidePastOrders, setHidePastOrders] = useState(false);

  const scrollController = useRef(null);
  const ordersPaginator = usePaginator(useCallback(
    (page, _) => UserService.getOrders(page, hidePastOrders)
      .then(data => data.status !== 'success' ? [] : data.orders), [user?._id, hidePastOrders]),
    10
  );

  const lastElementRef = (node) => {
    if (ordersPaginator.isLoading) return;
    if (scrollController.current) scrollController.current.disconnect();
    scrollController.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && ordersPaginator.hasMore) {
        ordersPaginator.loadNext();
      }
    });
    if (node) scrollController.current.observe(node);
  };

  useEffect(() => {
    ordersPaginator.reset();
  }, [hidePastOrders]);

  const statuses = {
    "ordered": {
      display: "Ordered",
      alternative: "Waiting for confirmation",
      color: "text-yellow-700",
      darkBgColor: "bg-yellow-500",
      darkColor: "text-yellow-500",
    },
    "preparing": {
      display: "In preparation",
      alternative: "Preparing your order",
      color: "text-blue-500",
      darkBgColor: "bg-blue-400",
      darkColor: "text-blue-400",
    },
    "out": {
      display: "Out for delivery",
      color: "text-purple-500",
      darkBgColor: "bg-purple-400",
      darkColor: "text-purple-400",
    },
    "ready": {
      display: "Ready for pickup",
      color: "text-purple-500",
      darkBgColor: "bg-purple-400",
      darkColor: "text-purple-400",
    },
    "completed": {
      display: "Completed",
      alternative: "Order Completed",
      color: "text-gray-500",
      darkBgColor: "bg-success",
      darkColor: "text-success",
    },
    "canceled": {
      display: "Canceled",
      alternative: "Order Canceled",
      color: "text-gray-500",
      darkBgColor: "bg-danger",
      darkColor: "text-danger",
    }
  }

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType={"user"}
        title="Order History"
        subtitle="View your past orders"
      />

      {ordersPaginator.isLoading ?
        <Spinner className='w-100 h-100' variant="dots" classNames={{
          dots: 'bg-[#083d77]',
        }} />
        :
        <User
          orders={ordersPaginator.items}
          statuses={statuses}
          lastElementRef={lastElementRef}
          isLoadingMore={ordersPaginator.isLoadingMore}
          hidePastOrders={hidePastOrders}
          setHidePastOrders={setHidePastOrders}
          resetPaginator={ordersPaginator.reset}
        />
      }
    </div>
  );
}

export default withAuth(OrderPage);