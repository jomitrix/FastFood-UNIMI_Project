'use client';
// import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/app/account/AccountHeader";
import Restaurant from "./Restaurant";
import { statuses } from "@/utils/lists";

export default function OrderPage() {
  const router = useRouter();

  // dati mock
  const mockRestaurant = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "La Pizzeria di Mario",
    accountType: "restaurant"
  };

  // Mock restaurant data
  const mock = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "La Pizzeria di Mario",
    accountType: "restaurant"
  };

  // Unified and coherent mock orders
  const mockOrders = [
    {
      id: "ORD-1265",
      customer: "Mario Rossi",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "out",
      items: [
        {
          name: "Pizza Margherita",
          ingredients: ["Pomodoro", "Mozzarella", "Basilico"],
          quantity: 2,
          price: 7.5,
        },
        { name: "Coca-Cola", quantity: 1, price: 2.0 },
      ],
      deliveryFee: 2.5,
      total: 19.5,
      currency: "€",
      orderDate: "2023-05-15 18:23",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1264",
      customer: "Giulia Bianchi",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "preparing",
      items: [
        {
          name: "Pizza Diavola",
          ingredients: ["Pomodoro", "Mozzarella", "Salame piccante"],
          quantity: 1,
          price: 8.0,
        },
        { name: "Fanta", quantity: 1, price: 1.5 },
      ],
      deliveryFee: 2.0,
      total: 11.5,
      currency: "€",
      orderDate: "2023-05-15 17:45",
      paymentMethod: "PayPal",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1263",
      customer: "Luca Verdi",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "completed",
      items: [
        { name: "Pizza Quattro Stagioni", quantity: 1, price: 9.0 },
        { name: "Acqua", quantity: 2, price: 1.0 },
      ],
      total: 11.0,
      currency: "€",
      orderDate: "2023-05-15 16:30",
      completedDate: "2023-05-15 16:50",
      paymentMethod: "Cash",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1262",
      customer: "Sofia Esposito",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "completed",
      items: [
        { name: "Pizza Marinara", quantity: 1, price: 6.5 },
      ],
      total: 6.5,
      currency: "€",
      orderDate: "2023-05-15 14:15",
      completedDate: "2023-05-15 14:30",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1261",
      customer: "Marco Spacca",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "ordered",
      items: [
        { name: "Pizza Capricciosa", quantity: 1, price: 9.5 },
      ],
      total: 9.5,
      currency: "€",
      orderDate: "2023-05-15 14:15",
      paymentMethod: "Cash",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1260",
      customer: "Anna Neri",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "canceled",
      items: [
        { name: "Pizza Vegetariana", quantity: 1, price: 8.5 },
        { name: "Sprite", quantity: 1, price: 1.5 },
      ],
      deliveryFee: 2.0,
      total: 12.0,
      currency: "€",
      orderDate: "2023-05-15 13:00",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1259",
      customer: "Francesca Gallo",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "preparing",
      items: [
        { name: "Pizza Bufalina", quantity: 1, price: 10.0 },
        { name: "Birra", quantity: 2, price: 3.0 },
      ],
      deliveryFee: 2.0,
      total: 18.0, // 10.0 + 3.0*2 + 2.0
      currency: "€",
      orderDate: "2023-05-15 12:30",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1258",
      customer: "Davide Russo",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "ordered",
      items: [
        { name: "Pizza Prosciutto e Funghi", quantity: 1, price: 8.5 },
        { name: "Acqua", quantity: 1, price: 1.0 },
      ],
      total: 9.5,
      currency: "€",
      orderDate: "2023-05-15 12:00",
      paymentMethod: "Cash",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1257",
      customer: "Elena Ferri",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "out",
      items: [
        { name: "Pizza Napoli", quantity: 2, price: 8.0 },
        { name: "Fanta", quantity: 2, price: 1.5 },
      ],
      deliveryFee: 2.5,
      total: 21.5, // 8.0*2 + 1.5*2 + 2.5
      currency: "€",
      orderDate: "2023-05-15 11:45",
      paymentMethod: "PayPal",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1256",
      customer: "Simone Bassi",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "completed",
      items: [
        { name: "Pizza Tonno e Cipolla", quantity: 1, price: 8.0 },
      ],
      total: 8.0,
      currency: "€",
      orderDate: "2023-05-15 11:00",
      completedDate: "2023-05-15 11:20",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1255",
      customer: "Chiara De Luca",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "ordered",
      items: [
        { name: "Pizza Quattro Formaggi", quantity: 1, price: 9.0 },
        { name: "Coca-Cola", quantity: 1, price: 2.0 },
      ],
      deliveryFee: 2.0,
      total: 13.0, // 9.0 + 2.0 + 2.0
      currency: "€",
      orderDate: "2023-05-15 10:30",
      paymentMethod: "Cash",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1254",
      customer: "Paolo Neri",
      type: "takeaway",
      restaurant: "La Pizzeria di Mario",
      status: "canceled",
      items: [
        { name: "Pizza Bianca", quantity: 1, price: 7.0 },
      ],
      total: 7.0,
      currency: "€",
      orderDate: "2023-05-15 09:45",
      paymentMethod: "Card",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
    {
      id: "ORD-1253",
      customer: "Martina Costa",
      type: "delivery",
      restaurant: "La Pizzeria di Mario",
      status: "completed",
      items: [
        { name: "Pizza Salsiccia e Friarielli", quantity: 1, price: 10.0 },
        { name: "Sprite", quantity: 1, price: 1.5 },
      ],
      deliveryFee: 2.0,
      total: 13.5, // 10.0 + 1.5 + 2.0
      currency: "€",
      orderDate: "2023-05-15 09:00",
      completedDate: "2023-05-15 09:30",
      paymentMethod: "PayPal",
      thumbnail:
        "https://static.vecteezy.com/ti/vettori-gratis/p1/6294382-distintivo-vintage-retro-per-spatola-pizza-pizzeria-logo-emblema-design-simbolo-vettoriale.jpg",
    },
  ];

  useEffect(() => {
    // Controllo se l'utente è autenticato
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");

    if (/*!*/token) {
      router.push("/auth/login");
    }
  }, [router]);

  /*if (mock.accountType !== "user") {
    notFound();
  }*/

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        title={"Order Management"}
        subtitle={"Manage orders for your restaurant."}
      />

      <Restaurant
        orders={mockOrders}
        statuses={statuses}
      />
    </div>
  );
}
