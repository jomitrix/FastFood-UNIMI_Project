'use client';
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
import AccountHeader from '@/components/app/account/AccountHeader';
import { statuses } from '@/utils/lists';
import { formatCurrency } from '@/utils/format';
import SkeletonChart from '@/components/app/manager/dashboard/SkeletonChart';
import Chart from 'chart.js/auto';

export default function DashboardPage() {
  const router = useRouter();

  const [timeRange, setTimeRange] = useState((['month']));
  const [productTab, setProductTab] = useState('popular');
  const [chartLoaded, setChartLoaded] = useState(false);
  const [metric, setMetric] = useState('revenue');

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const currentRange = [...timeRange][0];

  const dashboardData = useMemo(() => ({
    totalOrders: 258,
    dailyOrders: 8,
    weeklyOrders: 28,
    monthlyOrders: 42,
    previousMonthOrders: 38,
    previousWeekOrders: 25,
    totalRevenue: 5842.50,
    dailyRevenue: 182.50,
    weeklyRevenue: 620.30,
    monthlyRevenue: 1245.80,
    previousMonthRevenue: 1089.30,
    previousWeekRevenue: 580.20,
    avgOrderValue: 22.65,
    monthlyOrderAverage: 36,
    popularDishes: [
      { name: "Pizza Margherita", count: 89, revenue: 980.00, percentOfRevenue: 16.8, trend: "up" },
      { name: "Pasta Carbonara", count: 64, revenue: 832.00, percentOfRevenue: 14.2, trend: "stable" },
      { name: "Tiramisu", count: 52, revenue: 364.00, percentOfRevenue: 6.2, trend: "up" },
      { name: "Caprese Salad", count: 37, revenue: 333.00, percentOfRevenue: 5.7, trend: "down" }
    ],
    leastPopularDishes: [
      { name: "Mixed Salad", count: 12, revenue: 96.00, percentOfRevenue: 1.6, trend: "down" },
      { name: "Bruschetta", count: 15, revenue: 105.00, percentOfRevenue: 1.8, trend: "down" },
      { name: "Focaccia", count: 18, revenue: 126.00, percentOfRevenue: 2.2, trend: "stable" },
      { name: "Pasta all'assassina", count: 19, revenue: 127.00, percentOfRevenue: 2.2, trend: "stable" }
    ],
    recentOrders: [
      { id: "ORD-1265", customer: "Mario Rossi", items: 3, total: 28.50, status: "out", date: "2023-05-15 18:23", paymentMethod: "Card" },
      { id: "ORD-1264", customer: "Giulia Bianchi", items: 2, total: 18.90, status: "preparing", date: "2023-05-15 17:45", paymentMethod: "PayPal" },
      { id: "ORD-1263", customer: "Luca Verdi", items: 4, total: 35.20, status: "completed", date: "2023-05-15 16:30", paymentMethod: "Cash" },
      { id: "ORD-1262", customer: "Sofia Esposito", items: 1, total: 12.90, status: "completed", date: "2023-05-15 14:15", paymentMethod: "Card" },
      { id: "ORD-1261", customer: "Marco Spacca", items: 1, total: 69.69, status: "ordered", date: "2023-05-15 14:15", paymentMethod: "Cash" }
    ],
    monthlyStats: [
      { month: "Jan", orders: 32, revenue: 899.20 },
      { month: "Feb", orders: 35, revenue: 952.70 },
      { month: "Mar", orders: 31, revenue: 872.50 },
      { month: "Apr", orders: 38, revenue: 1089.30 },
      { month: "May", orders: 42, revenue: 1245.80 }
    ],
    weeklyStats: [
      { week: "Week 1", orders: 10, revenue: 250.00 },
      { week: "Week 2", orders: 8, revenue: 200.00 },
      { week: "Week 3", orders: 6, revenue: 150.00 },
      { week: "Week 4", orders: 12, revenue: 300.00 }
    ],
    dailyStats: [
      { day: "Mon", orders: 5, revenue: 120.50 },
      { day: "Tue", orders: 7, revenue: 168.20 },
      { day: "Wed", orders: 6, revenue: 142.40 },
      { day: "Thu", orders: 8, revenue: 182.50 },
      { day: "Fri", orders: 9, revenue: 203.80 },
      { day: "Sat", orders: 12, revenue: 285.40 },
      { day: "Sun", orders: 10, revenue: 230.20 }
    ],
    name: "Luca",
    surname: "Toni",
    email: "luca.toni@esempio.it",
    username: "La Pizzeria di Luca",
    accountType: "restaurant"
  }), []);

  const calculatePercentChange = (current, previous) =>
    previous === 0 ? 100 : (((current - previous) / previous) * 100).toFixed(1);

  const chartData = useMemo(() => {
    const base =
      currentRange === 'day'
        ? dashboardData.dailyStats
        : currentRange === 'week'
        ? dashboardData.weeklyStats
        : dashboardData.monthlyStats;

    return base.map((stat) =>
      stat.channels
        ? { ...stat, revenue: stat.channels.website, orders: stat.channels.website }
        : stat
    );
  }, [currentRange]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstanceRef.current?.destroy();
    setChartLoaded(false); // reset per ogni re-render del range

    // scegli labels e dati
    let baseData;
    if (currentRange === 'day')      baseData = dashboardData.dailyStats;
    else if (currentRange === 'week') baseData = dashboardData.weeklyStats;
    else                              baseData = dashboardData.monthlyStats;

    // labels: usa la chiave corretta in base al range
    const labels = baseData.map(s => s.day || s.week || s.month);
    const data   = baseData.map(s => metric === 'revenue' ? s.revenue : s.orders);

    // colori distinti per le due metriche
    const colors = {
      revenue: '#39a9dbB3',
      orders:  '#e56399b3'
    };

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '',
          data,
          backgroundColor: colors[metric],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { onComplete: () => setChartLoaded(true) },
        plugins: {
          legend: { display: false },    // toglie la legenda
          
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => v }
          }
        }
      }
    });
  }, [currentRange, metric, dashboardData]); 

  const renderTrend = (trend) => {
    switch(trend) {
      case "up":
        return <Chip color="success" className="text-white">↓</Chip>;
      case "down":
        return <Chip color="danger" className="text-white">↑</Chip>;
      default:
        return <Chip color="default" className="text-black" classNames={{content: "text-lg mb-0.5"}}>–</Chip>;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = !localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType="restaurant"
        title="Dashboard"
        subtitle={dashboardData.username}
      />

      <div className="w-full 2xl:w-2/3 xl:w-3/4 lg:w-4/5 flex flex-col justify-center items-center p-4 pb-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Orders</h3>
                <Chip color="blue" className="text-sm">Today: {dashboardData.dailyOrders}</Chip>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{dashboardData.monthlyOrders}</p>
                  <p className="text-sm text-gray-500">This month</p>
                  <p className="text-xs text-green-500">
                    {calculatePercentChange(dashboardData.monthlyOrders, dashboardData.previousMonthOrders)}% vs prev. month
                  </p>
                </div>
                <div className="border-l pl-4">
                  <p className="text-xl font-semibold">{dashboardData.totalOrders}</p>
                  <p className="text-sm text-gray-500">Total orders</p>
                </div>
              </div>
              <div className="mt-3 border-t pt-2">
                <p className="text-sm">This week: <span className="font-semibold">{dashboardData.weeklyOrders}</span>
                  <span className={calculatePercentChange(dashboardData.weeklyOrders, dashboardData.previousWeekOrders) >= 0 ? 
                    "text-green-500 ml-2" : "text-red-500 ml-2"}>
                    ({calculatePercentChange(dashboardData.weeklyOrders, dashboardData.previousWeekOrders)}%)
                  </span>
                </p>
                <p className="text-sm">Monthly order average: <span className="font-semibold">{dashboardData.monthlyOrderAverage}</span></p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Revenue</h3>
                <Chip color="green" className="text-sm">Today: {formatCurrency(dashboardData.dailyRevenue)}</Chip>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(dashboardData.monthlyRevenue)}</p>
                  <p className="text-sm text-gray-500">This month</p>
                  <p className="text-xs text-green-500">
                    {calculatePercentChange(dashboardData.monthlyRevenue, dashboardData.previousMonthRevenue)}% vs prev. month
                  </p>
                </div>
                <div className="border-l pl-4">
                  <p className="text-xl font-semibold">{formatCurrency(dashboardData.totalRevenue)}</p>
                  <p className="text-sm text-gray-500">Total revenue</p>
                </div>
              </div>
              <div className="mt-3 border-t pt-2">
                <p className="text-sm">This week: <span className="font-semibold">{formatCurrency(dashboardData.weeklyRevenue)}</span>
                  <span className={calculatePercentChange(dashboardData.weeklyRevenue, dashboardData.previousWeekRevenue) >= 0 ? 
                    "text-green-500 ml-1" : "text-red-500 ml-1"}>
                    ({calculatePercentChange(dashboardData.weeklyRevenue, dashboardData.previousWeekRevenue)}%)
                  </span>
                </p>
                <p className="text-sm">Average ticket: <span className="font-semibold">{formatCurrency(dashboardData.avgOrderValue)}</span></p>
              </div>
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
                  >
                    <SelectItem key="day">Day</SelectItem>
                    <SelectItem key="week">Week</SelectItem>
                    <SelectItem key="month">Month</SelectItem>
                  </Select>
                  {/* metric selector */}
                  <Select
                    disallowEmptySelection
                    size="sm"
                    className='w-32'
                    selectedKeys={new Set([metric])}
                    onSelectionChange={(keys) => setMetric([...keys][0])}
                  >
                    <SelectItem key="revenue">Revenue</SelectItem>
                    <SelectItem key="orders">Orders</SelectItem>
                  </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody className="w-full pt-1">
            <div className="w-full flex justify-center items-end min-h-40 md:h-60 lg:h-80 relative overflow-x-hidden">
              {/* 1) Canvas sempre montato */}
              <canvas
                ref={chartRef}
                className="w-full h-full"
                style={{ visibility: chartLoaded ? 'visible' : 'hidden' }}
              />

              {/* 2) Skeleton sopra, invisibile quando chartLoaded */}
              {!chartLoaded && (
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
                <Button size="sm" onPress={() => router.push("/manager/menu")} variant="flat">Manage Meals</Button>
              </div>
              <Tabs selectedKey={productTab} onSelectionChange={setProductTab}>
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
              <TableBody items={productTab === "popular" ? dashboardData.popularDishes : dashboardData.leastPopularDishes}>
                {(dish) => (
                  <TableRow key={dish.name}>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{dish.count}</TableCell>
                    <TableCell>{formatCurrency(dish.revenue)}</TableCell>
                    <TableCell>{dish.percentOfRevenue}%</TableCell>
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
              <Button size="sm" onPress={() => router.push("/manager/orders")} variant="flat">View all</Button>
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
              <TableBody items={dashboardData.recentOrders}>
                {(order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className="flex w-full bg-">
                      <Chip 
                        size="sm"
                        classNames={{ content: "font-semibold", }}
                        className={`text-xs ${statuses[order.status].bgColor} text-white`}
                      >
                        {statuses[order.status].display}
                      </Chip>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
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