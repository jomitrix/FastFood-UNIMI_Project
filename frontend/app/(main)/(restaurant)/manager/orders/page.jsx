'use client';
import { withAuth } from '@/utils/withAuth';
// import { notFound } from "next/navigation";
import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import Restaurant from "./Restaurant";
import { statuses } from "@/utils/lists";
import { usePaginator } from '@/utils/paginator';
import { RestaurantService } from '@/services/restaurantService';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';

function OrderPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [totalOrders, setTotalOrders] = useState(0);

  const ordersPaginator = usePaginator(useCallback(
    (page, _) => RestaurantService.getOrders(page)
      .then(data => {
        setTotalOrders(data.totalOrders);
        return data.status !== 'success' ? [] : data.orders
      }), [user?.restaurant._id]),
    10
  );

  // dati mock del ristorante
  const mockRestaurant = {
    name: "KFC",
    surname: "Manager",
    email: "kfc.manager@example.com",
    username: "KFC - Abruzzi",
    accountType: "restaurant",
    banner: "https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_thumb,w_1537,h_480/f_auto/q_auto/dpr_1.0/d_it:cuisines:pollo-6.jpg/v1/it/restaurants/282166.jpg",
    icon: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    address: "Via Cassanese 1, 20090 Segrate MI, Italy",
    phone: "+39 02 2131 1234",
    restaurantname: "KFC - Abruzzi",
    minDeliveryTime: 10,
    maxDeliveryTime: 20,
    minTakeawayTime: 5,
    maxTakeawayTime: 10,
    courses: ["Fast Food", "Miscellaneous"],
    area: ["American"],
    isOpenNow: true,
    orderType: "both"
  };

  // Unified and coherent mock orders per KFC
  const mockOrders = [
    {
      id: "ORD-4285",
      customer: "Marco Bianchi",
      type: "delivery",
      restaurant: "KFC - Abruzzi",
      status: "out",
      customerPhone: "+39 333 1234567",
      deliveryAddress: "Via Tiburtina 1361, Roma, 00131, Italy",
      customerNotes: "Suonare al campanello 4B",
      items: [
        {
          id: "1",
          name: "Original Recipe Bucket",
          ingredients: ["Pollo fritto", "Spezie originali"],
          quantity: 1,
          price: 15.99,
        },
        { id: "2", name: "Patatine Large", quantity: 2, price: 3.50 },
        { id: "3", name: "Pepsi", quantity: 2, price: 2.00 },
      ],
      deliveryFee: 2.50,
      subtotal: 26.99,
      total: 29.49,
      currency: "€",
      orderDate: "2023-06-15 18:23",
      estimatedDelivery: "2023-06-15 19:00",
      paymentMethod: "Card",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4284",
      customer: "Giulia Romano",
      type: "delivery",
      restaurant: "KFC - Abruzzi",
      status: "preparing",
      customerPhone: "+39 333 7654321",
      deliveryAddress: "Piazzale Loreto 9, Milano, 20131, Italy",
      customerNotes: "",
      items: [
        {
          id: "4",
          name: "Zinger Burger",
          ingredients: ["Pollo fritto piccante", "Lattuga", "Maionese", "Pane"],
          quantity: 2,
          price: 6.99,
        },
        { id: "5", name: "Twister Wrap", quantity: 1, price: 5.99 },
        { id: "2", name: "Patatine Large", quantity: 1, price: 3.50 },
        { id: "3", name: "Pepsi", quantity: 3, price: 2.00 },
      ],
      deliveryFee: 2.00,
      subtotal: 27.47,
      total: 29.47,
      currency: "€",
      orderDate: "2023-06-15 17:45",
      estimatedDelivery: "2023-06-15 18:15",
      paymentMethod: "PayPal",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4283",
      customer: "Luca Verdi",
      type: "takeaway",
      restaurant: "KFC - Abruzzi",
      status: "ordered",
      customerPhone: "+39 333 9876543",
      customerNotes: "Senza salse",
      items: [
        { id: "6", name: "Hot Wings", quantity: 2, price: 5.49 },
        { id: "7", name: "Popcorn Chicken", quantity: 1, price: 4.99 },
        { id: "8", name: "Acqua Naturale", quantity: 2, price: 1.50 },
      ],
      subtotal: 17.97,
      total: 17.97,
      currency: "€",
      orderDate: "2023-06-15 16:30",
      estimatedPickup: "2023-06-15 16:45",
      paymentMethod: "Cash",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4282",
      customer: "Sofia Esposito",
      type: "takeaway",
      restaurant: "KFC - Abruzzi",
      status: "completed",
      customerPhone: "+39 333 2468101",
      customerNotes: "",
      items: [
        { id: "9", name: "Double Krunch Sandwich", quantity: 2, price: 5.99 },
        { id: "10", name: "Corn on the Cob", quantity: 2, price: 2.99 },
      ],
      subtotal: 17.96,
      total: 17.96,
      currency: "€",
      orderDate: "2023-06-15 14:15",
      completedDate: "2023-06-15 14:35",
      estimatedPickup: "2023-06-15 14:30",
      paymentMethod: "Card",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4281",
      customer: "Marco Spacca",
      type: "takeaway",
      restaurant: "KFC - Abruzzi",
      status: "preparing",
      customerPhone: "+39 333 1357924",
      customerNotes: "Extra ketchup",
      items: [
        { id: "11", name: "Riceburger", quantity: 1, price: 6.49 },
        { id: "12", name: "Coleslaw", quantity: 1, price: 2.99 },
        { id: "13", name: "Fanta", quantity: 1, price: 2.00 },
      ],
      subtotal: 11.48,
      total: 11.48,
      currency: "€",
      orderDate: "2023-06-15 14:00",
      estimatedPickup: "2023-06-15 14:20",
      paymentMethod: "Cash",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4280",
      customer: "Anna Neri",
      type: "delivery",
      restaurant: "KFC - Abruzzi",
      status: "canceled",
      customerPhone: "+39 333 8642097",
      deliveryAddress: "Via Dante 20, Poggibonsi, 53036, Italy",
      customerNotes: "Chiamare prima di consegnare",
      items: [
        { id: "14", name: "Famous Bowl", quantity: 1, price: 7.99 },
        { id: "15", name: "Biscuit", quantity: 2, price: 1.49 },
        { id: "16", name: "7UP", quantity: 1, price: 2.00 },
      ],
      deliveryFee: 2.00,
      subtotal: 12.97,
      total: 14.97,
      currency: "€",
      orderDate: "2023-06-15 13:00",
      paymentMethod: "Card",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },
    {
      id: "ORD-4279",
      customer: "Francesca Gallo",
      type: "takeaway",
      restaurant: "KFC - Abruzzi",
      status: "out",
      customerPhone: "+39 333 9753108",
      deliveryAddress: "Via Tiburtina 1361, Roma, 00131, Italy",
      customerNotes: "",
      items: [
        { id: "17", name: "Chicken Tenders", quantity: 2, price: 6.49 },
        { id: "18", name: "Mashed Potato & Gravy", quantity: 1, price: 3.49 },
        { id: "19", name: "Birra", quantity: 2, price: 3.50 },
      ],
      deliveryFee: 2.00,
      subtotal: 23.47,
      total: 25.47,
      currency: "€",
      orderDate: "2023-06-15 12:30",
      estimatedDelivery: "2023-06-15 13:10",
      paymentMethod: "Card",
      thumbnail: "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        title={"Order Management"}
        subtitle={"Manage orders for your restaurant."}
      />

      {ordersPaginator.isLoading ?
        <Spinner className='w-100 h-100' variant="dots" classNames={{
          dots: 'bg-[#083d77]',
        }} />
        :
        <Restaurant
          orders={ordersPaginator.items}
          totalOrders={totalOrders}
          statuses={statuses}
          restaurant={mockRestaurant}
          loadPage={ordersPaginator.loadPage}
        />
      }
    </div>
  );
}

export default withAuth(OrderPage);