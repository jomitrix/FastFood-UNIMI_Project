'use client';
// import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import User from "./User"

export default function OrderPage() {
  const router = useRouter();

  // dati mock
  const mockUser = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "MarioRossi",
    accountType: "user"
  };

  // dati iniziali mock
  const mockOrders = [
    // -------- Ordered --------
    {
      id: "1",
      type: "delivery",
      restaurant: "KFC Roma Tiburtina",
      status: "ordered",
      items: [
        {
          name: "Chicken Bucket",
          ingredients: [
            "Original Recipe Chicken",
            "Hot Wings",
            "Popcorn Chicken",
          ],
          quantity: 1,
          price: 9.99,
        },
        { name: "French Fries", quantity: 1, price: 2.49 },
        { name: "Coca-Cola", quantity: 1, price: 1.99 },
      ],
      deliveryFee: 2.5,
      total: 16.97,          // 9.99 + 2.49 + 1.99 + 2.50
      currency: "€",
      orderDate: "2025-06-26",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
    },

    // -------- Preparing --------
    {
      id: "2",
      type: "delivery",
      restaurant: "Pizzeria Napoli Centro",
      status: "preparing",
      items: [
        {
          name: "Pizza Margherita",
          ingredients: ["Pomodoro", "Mozzarella", "Basilico"],
          quantity: 1,
          price: 7.5,
        },
        { name: "Fanta", quantity: 1, price: 1.5 },
      ],
      deliveryFee: 2.0,
      total: 11.0,            // 7.50 + 1.50 + 2.00
      currency: "€",
      orderDate: "2025-06-26",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },

    // -------- Out for delivery --------
    {
      id: "3",
      type: "delivery",
      restaurant: "Sushi King Torino",
      status: "out",
      items: [
        { name: "California Roll", quantity: 1, price: 6.99 },
        { name: "Miso Soup", quantity: 1, price: 2.5 },
        { name: "Green Tea", quantity: 1, price: 1.5 },
      ],
      deliveryFee: 2.5,
      total: 13.49,           // 6.99 + 2.50 + 1.50 + 2.50
      currency: "€",
      orderDate: "2025-06-26",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X6wrwU5MShIAYK-if9QNQo_hEmRcJrN_qg&s",
    },

    // -------- Ready for pickup --------
    {
      id: "4",
      type: "takeaway",
      restaurant: "Burger King Milano Centrale",
      status: "ready",
      items: [
        {
          name: "Whopper",
          ingredients: [
            "Beef Patty",
            "Lettuce",
            "Tomato",
            "Onion",
            "Pickles",
            "Ketchup",
            "Mayonnaise",
          ],
          quantity: 1,
          price: 6.99,
        },
        {
          name: "Whopper",
          ingredients: [
            "Beef Patty",
            "Lettuce",
            "Tomato",
            "Onion",
            "Pickles",
            "Ketchup",
            "Mayonnaise",
          ],
          quantity: 1,
          price: 6.99,
        },
        { name: "Onion Rings", quantity: 2, price: 2.99 },
        { name: "Sprite", quantity: 2, price: 1.99 },
        { name: "Milkshake", quantity: 99, price: 1.99 },
      ],
      total: 213.96,
      currency: "€",
      orderDate: "2025-06-25",
      thumbnail:
        "https://duckduckgo.com/i/7aaaa534203b7db6.png",
    },

    // -------- Completed --------
    {
      id: "5",
      type: "takeaway",
      restaurant: "McDonald's Firenze Centro",
      status: "completed",
      items: [
        { name: "Big Mac", quantity: 1, price: 5.99 },
        { name: "French Fries", quantity: 1, price: 2.49 },
        { name: "Coca-Cola", quantity: 1, price: 1.99 },
      ],
      total: 10.47,           // 5.99 + 2.49 + 1.99
      currency: "€",
      orderDate: "2025-06-24",
      completedDate: "2025-06-24",
      thumbnail:
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/20/93/9e/6c/photos-logo.jpg",
    },

    // -------- Canceled --------
    {
      id: "6",
      type: "takeaway",
      restaurant: "McDonald's Firenze Centro",
      status: "canceled",
      items: [
        { name: "Big Mac", quantity: 1, price: 5.99 },
        { name: "French Fries", quantity: 1, price: 2.49 },
        { name: "Coca-Cola", quantity: 1, price: 1.99 },
      ],
      total: 10.47,           // 5.99 + 2.49 + 1.99
      currency: "€",
      orderDate: "2025-06-24",
      thumbnail:
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/20/93/9e/6c/photos-logo.jpg",
    },
  ];

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

  useEffect(() => {
    // Controllo se l'utente è autenticato
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");

    if (/*!*/token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType={mockUser.accountType}
        title="Order History"
        subtitle="View your past orders"
      />

      <User
        orders={mockOrders}
        statuses={statuses}
      />
    </div>
  );
}
