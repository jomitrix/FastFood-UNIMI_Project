'use client';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ChevronRight } from "@/components/icons/heroicons";

export default function OrderList({ orders, statuses, setIsModalOpen, setOrderModalId }) {
    return (
        <div className="w-full mt-4 sm:mt-6 flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-3xl flex flex-col gap-3">
                {orders.map(order => (
                    <Card 
                        isPressable
                        key={order.id}
                        className="w-full flex flex-row items-center p-5 gap-4 cursor-pointer"
                        onPress={() => {setIsModalOpen(true), setOrderModalId(order.id)}}
                    >
                        <CardBody className="flex-1 flex flex-row items-center p-0">
                            <img 
                                src={order.thumbnail} 
                                alt={order.restaurant} 
                                className="rounded-xl mr-4 w-16 h-16 object-cover flex-shrink-0"
                            />
                            <div className="p-0">
                                <CardHeader className="p-0">
                                    <h2 className="text-lg text-black font-semibold">{order.restaurant}</h2>
                                </CardHeader>
                                <p className={`pb-[0.375rem] ${statuses[order.status].color}`}>{statuses[order.status].display}</p>
                                <p className="text-gray-500">{order.total.toFixed(2)}{order.currency} • {new Date(order.orderDate).toLocaleDateString("it", { 
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </CardBody>

                        <ChevronRight className="m-1 text-[#003c6e] flex flex-shrink-0" size={24}/>
                    </Card>
                ))}
            </div>
        </div>
    );

}