'use client';
import { withAuth } from '@/utils/withAuth';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from '@heroui/table';
import { Select, SelectItem } from '@heroui/select';
import { Tabs, Tab } from '@heroui/tabs';
import { Skeleton } from '@heroui/skeleton';
import AccountHeader from '@/components/app/account/AccountHeader';
import { statuses } from '@/utils/lists';
import { formatCurrency } from '@/utils/format';
import SkeletonChart from '@/components/app/manager/dashboard/SkeletonChart';
import Chart from 'chart.js/auto';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardService } from '@/services/dashboardService';
import { addToast } from "@heroui/toast";

function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [ordersData, setOrdersData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  // Stati di caricamento
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersHistoryLoading, setOrdersHistoryLoading] = useState(true);
  const [salesTrendLoading, setSalesTrendLoading] = useState(true);

  const [timeRange, setTimeRange] = useState((['month']));
  const [productTab, setProductTab] = useState('popular');
  const [chartLoaded, setChartLoaded] = useState(false);
  const [metric, setMetric] = useState('revenue');

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const currentRange = [...timeRange][0];

  const fetchOrdersData = async () => {
    setOrdersLoading(true);
    try {
      const data = await DashboardService.getOrdersStats();
      if (!data || data.status !== "success") {
        addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else {
        setOrdersData(data.orders);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load orders data", color: "danger", timeout: 4000 });
    } finally {
      setOrdersLoading(false);
    }
  }

  const fetchRevenueData = async () => {
    setRevenueLoading(true);
    try {
      const data = await DashboardService.getRevenueStats();
      if (!data || data.status !== "success") {
        addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else {
        setRevenueData(data.revenue);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load revenue data", color: "danger", timeout: 4000 });
    } finally {
      setRevenueLoading(false);
    }
  }

  const fetchProductsData = async (filter) => {
    setProductsLoading(true);
    try {
      const data = await DashboardService.getProductsStats(filter);
      if (!data || data.status !== "success") {
        addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else {
        setProductsData(data.meals);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load products data", color: "danger", timeout: 4000 });
    } finally {
      setProductsLoading(false);
    }
  }

  const fetchRecentOrders = async () => {
    setOrdersHistoryLoading(true);
    try {
      const data = await DashboardService.getRecentOrders();
      if (!data || data.status !== "success") {
        addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else {
        setRecentOrders(data.orders);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load recent orders", color: "danger", timeout: 4000 });
    } finally {
      setOrdersHistoryLoading(false);
    }
  }

  const fetchSalesTrend = async (period = 'month', type = 'revenue') => {
    setSalesTrendLoading(true);
    try {
      const data = await DashboardService.getSalesTrend(period, type);
      if (!data || data.status !== "success") {
        addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else {
        setSalesTrend(data.salesData);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load sales trend data", color: "danger", timeout: 4000 });
    } finally {
      setSalesTrendLoading(false);
    }
  }

  const calculatePercentChange = (current, previous) =>
    previous === 0 ? 100 : (((current - previous) / previous) * 100).toFixed(1);

  useEffect(() => {
    fetchOrdersData();
    fetchRevenueData();
    fetchSalesTrend();
    fetchProductsData(productTab);
    fetchRecentOrders();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstanceRef.current?.destroy();
    setChartLoaded(false);

    const baseData = salesTrend;

    const labels = baseData.map(s => s.label);

    const dataPoints = baseData.map(s =>
      metric === 'revenue' ? s.totalRevenue : s.totalOrders
    );

    const colors = {
      revenue: '#39a9dbB3',
      orders: '#e56399b3'
    };

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: metric === 'revenue' ? 'Revenue' : 'Orders',
          data: dataPoints,
          backgroundColor: colors[metric],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => setChartLoaded(true)
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => v }
          }
        }
      }
    });
  }, [salesTrend, metric, currentRange]);

  useEffect(() => {
    fetchSalesTrend(currentRange, metric);
  }, [currentRange, metric])

  useEffect(() => {
    if (!productTab) return
    setProductsData([]);
    fetchProductsData(productTab);
  }, [productTab]);

  const renderTrend = (trend) => {
    switch (trend) {
      case "up":
        return <Chip color="success" className="text-white">↑</Chip>;
      case "down":
        return <Chip color="danger" className="text-white">↓</Chip>;
      default:
        return <Chip color="default" className="text-black" classNames={{ content: "text-lg mb-0.5" }}>–</Chip>;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType="restaurant"
        title="Dashboard"
        subtitle={user.restaurant.name}
      />

      <div className="w-full 2xl:w-2/3 xl:w-3/4 lg:w-4/5 flex flex-col justify-center items-center p-4 pb-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Orders</h3>
                {ordersLoading ? (
                  <Skeleton className="ml-2 h-6 w-24 rounded-md" />
                ) : (
                  <Chip color="blue" className="text-sm">Today: {ordersData.today}</Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {ordersLoading ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-8 w-20 mb-1 rounded-md" />
                      <Skeleton className="h-4 w-16 mb-1 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                    <div className="border-l pl-4">
                      <Skeleton className="h-6 w-16 mb-1 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-3">
                    <Skeleton className="h-4 w-40 mb-1 rounded-md" />
                    <Skeleton className="h-4 w-36 rounded-md" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{ordersData.month}</p>
                      <p className="text-sm text-gray-500">This month</p>
                      <p
                        className={
                          "text-xs " +
                          (calculatePercentChange(ordersData.month, ordersData.previousMonth) >= 0
                            ? "text-green-500"
                            : "text-red-500")
                        }
                      >
                        {calculatePercentChange(ordersData.month, ordersData.previousMonth)}% vs prev. month
                      </p>
                    </div>
                    <div className="border-l pl-4">
                      <p className="text-xl font-semibold">{ordersData.total}</p>
                      <p className="text-sm text-gray-500">Total orders</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t pt-2">
                    <p className="text-sm">This week: <span className="font-semibold">{ordersData.week}</span>
                      <span
                        className={
                          calculatePercentChange(ordersData.week, ordersData.previousWeek) >= 0
                            ? "text-green-500 ml-2"
                            : "text-red-500 ml-2"
                        }
                      >
                        ({calculatePercentChange(ordersData.week, ordersData.previousWeek)}%)
                      </span>
                    </p>
                    <p className="text-sm">Monthly order average: <span className="font-semibold">{ordersData.monthlyAverage}</span></p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Revenue</h3>
                {revenueLoading ? (
                  <Skeleton className="ml-2 h-6 w-24 rounded-md" />
                ) : (
                  <Chip color="green" className="text-sm">Today: {formatCurrency(revenueData.today)}</Chip>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {revenueLoading ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-8 w-20 mb-1 rounded-md" />
                      <Skeleton className="h-4 w-16 mb-1 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                    <div className="border-l pl-4">
                      <Skeleton className="h-6 w-16 mb-1 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-3">
                    <Skeleton className="h-4 w-40 mb-1 rounded-md" />
                    <Skeleton className="h-4 w-36 rounded-md" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{formatCurrency(revenueData.month)}</p>
                      <p className="text-sm text-gray-500">This month</p>
                      <p
                        className={
                          "text-xs " +
                          (calculatePercentChange(revenueData.month, revenueData.previousMonth) >= 0
                            ? "text-green-500"
                            : "text-red-500")
                        }
                      >
                        {calculatePercentChange(revenueData.month, revenueData.previousMonth)}% vs prev. month
                      </p>
                    </div>
                    <div className="border-l pl-4">
                      <p className="text-xl font-semibold">{formatCurrency(revenueData.total)}</p>
                      <p className="text-sm text-gray-500">Total revenue</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t pt-2">
                    <p className="text-sm">This week: <span className="font-semibold">{formatCurrency(revenueData.week)}</span>
                      <span
                        className={
                          calculatePercentChange(revenueData.week, revenueData.previousWeek) >= 0
                            ? "text-green-500 ml-1"
                            : "text-red-500 ml-1"
                        }
                      >
                        ({calculatePercentChange(revenueData.week, revenueData.previousWeek)}%)
                      </span>
                    </p>
                    <p className="text-sm">Average ticket: <span className="font-semibold">{formatCurrency(revenueData.averageTotalPrice)}</span></p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="w-full mb-6">
          <CardHeader className='pb-1'>
            <div className="w-full flex flex-col justify-between flex-wrap gap-3">
              <h3 className="text-lg font-semibold">Sales Trend</h3>
              <div className="flex gap-2">
                <Select
                  disallowEmptySelection
                  size="sm"
                  className='w-32'
                  selectedKeys={timeRange}
                  onSelectionChange={setTimeRange}
                  isDisabled={salesTrendLoading}
                >
                  <SelectItem key="day">Day</SelectItem>
                  <SelectItem key="week">Week</SelectItem>
                  <SelectItem key="month">Month</SelectItem>
                </Select>
                <Select
                  disallowEmptySelection
                  size="sm"
                  className='w-32'
                  selectedKeys={new Set([metric])}
                  onSelectionChange={(keys) => setMetric([...keys][0])}
                  isDisabled={salesTrendLoading}
                >
                  <SelectItem key="revenue">Revenue</SelectItem>
                  <SelectItem key="orders">Orders</SelectItem>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody className="w-full pt-1">
            <div className="w-full flex justify-center items-end min-h-40 md:h-60 lg:h-80 relative overflow-x-hidden">
              <canvas
                ref={chartRef}
                className="w-full h-full"
                style={{ visibility: chartLoaded ? 'visible' : 'hidden' }}
              />
              {(!chartLoaded || salesTrendLoading) && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <SkeletonChart className="w-full" />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="w-full mb-6">
          <CardHeader className="pb-1">
            <div className="w-full flex flex-col items-between sm:items-start gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-lg font-semibold">Product Popularity</h3>
                <Button size="sm" onPress={() => router.push("/manager/menu")} className="bg-trasparent" variant="flat">Manage Meals</Button>
              </div>
              <Tabs selectedKey={productTab} onSelectionChange={setProductTab} isDisabled={productsLoading}>
                <Tab key="popular" title="Best Sellers" />
                <Tab key="least" title="Least Sold" />
              </Tabs>
            </div>
          </CardHeader>
          <CardBody className="pt-1">
            <Table
              classNames={{ wrapper: "min-h-[18rem] sm:min-h-full overflow-y-auto" }}
              aria-label={productTab === "popular" ? "Most popular products" : "Least sold products"}>
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Revenue</TableColumn>
                <TableColumn>% of Revenue</TableColumn>
                <TableColumn>Trend</TableColumn>
              </TableHeader>
              <TableBody 
                items={productsData}
                loadingState={productsLoading ? "loading" : "idle"}
                loadingContent={
                  <div className="p-3 flex flex-col mt-12 gap-5 w-full">
                    {Array(4).fill(0).map((_, index) => (
                      <div key={index} className="w-full flex mx-0 items-center justify-between">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                    ))}
                  </div>
                }
                emptyContent={"No products found"}
              >
                {(dish) => (
                  <TableRow key={dish._id}>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{dish.totalSold}</TableCell>
                    <TableCell>{formatCurrency(dish.totalRevenue)}</TableCell>
                    <TableCell>{dish.revenuePercent}%</TableCell>
                    <TableCell>{renderTrend(dish.trend)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-col items-start pb-1">
            <div className="w-full flex items-center sm:justify-start justify-between gap-3 flex-wrap">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Button size="sm" onPress={() => router.push("/manager/orders")} className="bg-trasparent" variant="flat">View all</Button>
            </div>
          </CardHeader>
          <CardBody className="pt-1">
            <Table aria-label="Recent orders">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Payment</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody 
                items={recentOrders}
                loadingState={ordersHistoryLoading ? "loading" : "idle"}
                loadingContent={
                  <div className="p-3 flex flex-col mt-12 gap-5 w-full">
                    {Array(4).fill(0).map((_, index) => (
                      <div key={index} className="w-full flex items-center justify-between">
                        <Skeleton className="h-4 w-16 rounded-md" />
                        <Skeleton className="h-4 w-28 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-28 rounded-md" />
                      </div>
                    ))}
                  </div>
                }
                emptyContent={"No orders found"}
              >
                {(order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id.substr(-6).toUpperCase()}</TableCell>
                    <TableCell>{order.user.name} {order.user.surname}</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>{order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        classNames={{ content: "font-semibold" }}
                        className={`text-xs ${statuses[order.status].bgColor} text-white`}
                      >
                        {statuses[order.status].display}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("it", { 
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                      }) + " - " + new Date(order.createdAt).toLocaleTimeString("it", {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                      })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export default withAuth(DashboardPage);