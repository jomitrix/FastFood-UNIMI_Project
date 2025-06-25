'use client';
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";


export default function OrderList() {
    const router = useRouter();
    
    // dati iniziali mock
    const mockOrders = [
        {
            id: '1',
            restaurant: 'KFC Roma Tiburtina',
            status: 'delivered',
            total: 14.68,
            currency: '€',
            orderDate: '2024-07-01',
            thumbnail: 'https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png',
        },
        {
            id: '2',
            restaurant: 'Burger King Milano Centrale',
            status: 'delivered',
            total: 12.69,
            currency: '€',
            orderDate: '2023-12-30',
            thumbnail: 'https://duckduckgo.com/i/7aaaa534203b7db6.png',
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="w-full max-w-3xl flex flex-col gap-3">
                {mockOrders.map(order => (
                    <Card key={order.id}>
                        <CardBody className="flex flex-row items-center p-4">
                            <img 
                                src={order.thumbnail} 
                                alt={order.restaurant} 
                                width={64}
                                height={64}
                                className="rounded mr-4"
                            />
                            <div className="flex-grow">
                                <CardHeader className="p-0 pb-2">
                                    <h2 className="text-lg font-semibold">{order.restaurant}</h2>
                                </CardHeader>
                                <p className="text-gray-500">{order.status}</p>
                                <p>{order.currency}{order.total.toFixed(2)} • {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );

}