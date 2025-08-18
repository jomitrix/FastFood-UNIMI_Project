'use client';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ChevronRight, Orders } from "@/components/icons/heroicons";
import { Skeleton } from "@heroui/skeleton";
import { Checkbox } from "@heroui/checkbox";

export default function OrderList({ hidePastOrders, setHidePastOrders, orders, statuses, setIsModalOpen, setOrderModalId, lastElementRef, isLoadingMore }) {
    return (
        <div className="w-full mt-4 sm:mt-6 flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-3xl flex flex-col gap-3">
                { orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-gray-200">
                        <Orders size={40} className="text-gray-300 mb-3" />
                        <h3 className="text-xl font-medium text-gray-700">No orders yet</h3>
                        <p className="text-gray-500 mt-1">Start ordering from your favorite restaurants!</p>
                    </div>
                ) : (
                    <>
                        <div className="w-full flex-row items-right mb-2">
                            <Checkbox
                                isSelected={hidePastOrders}
                                onValueChange={setHidePastOrders}
                            >
                                Hide past orders
                            </Checkbox>
                        </div>
                        {orders.map(order => (
                            <Card 
                                isPressable
                                key={order._id}
                                className="w-full flex flex-row items-center p-5 gap-4 cursor-pointer"
                                onPress={() => {setIsModalOpen(true), setOrderModalId(order._id)}}
                                ref={order.status === 'completed' || order.status === 'canceled' ? null : lastElementRef}
                            >
                                <CardBody className="flex-1 flex flex-row items-center p-0">
                                    <div className="relative mr-4 flex-shrink-0">
                                        <Skeleton className="rounded-xl w-16 h-16 object-cover" />
                                        <img 
                                            src={process.env.NEXT_PUBLIC_API_URL + order.restaurant.logo} 
                                            className="rounded-xl bg-white w-16 h-16 object-cover absolute top-0 left-0"
                                        />
                                    </div>
                                    <div className="p-0">
                                        <CardHeader className="p-0">
                                            <h2 className="text-lg text-black font-semibold">{order.restaurant.name}</h2>
                                        </CardHeader>
                                        <p className={`pb-[0.375rem] ${statuses[order.status].color}`}>{statuses[order.status].display}</p>
                                        <p className="text-gray-500">{order.totalPrice.toFixed(2)}€ • {new Date(order.createdAt).toLocaleDateString("it", { 
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </CardBody>

                                <ChevronRight className="m-1 text-[#083d77] flex flex-shrink-0" size={24}/>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </div>
    );

}