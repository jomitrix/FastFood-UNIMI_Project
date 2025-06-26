'use client';
import { useState, useMemo, } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Takeaway, Delivery } from "@/components/icons/heroicons";
import OrderList from "@/components/app/orders/OrderList";

export default function OrderUser({orders, statuses}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderModalId, setOrderModalId] = useState(null);
  const [order, setOrder] = useState(null);

  useMemo(() => {
    if (orderModalId) {
      const orderData = orders.find(order => order.id === orderModalId);
      setOrder(orderData);
    }
  }, [orderModalId]);

  return (
    <>
      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center items-center p-4 pb-12">
        <OrderList
          orders={orders}
          statuses={statuses}
          setIsModalOpen={setIsModalOpen}
          setOrderModalId={setOrderModalId}
        />
      </div>

      {isModalOpen && order && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false) && setOrderModalId(null)}
          scrollBehavior="inside"
          className="m-0 w-full"
          classNames={{
            closeButton: "text-xl text-white hover:bg-white/10 active:!text-black",
            
          }}
        >
          <ModalContent className="rounded-t-xl rounded-b-none sm:rounded-b-xl overflow-hidden w-full sm:w-none">
            <div className="bg-[#1d1d1d] text-white rounded-b-xl">
              <ModalHeader className="flex flex-col items-center justify-center pb-4">
                <div className="flex flex-col gap-2">
                  <h1 className="w-full flex gap-3 justify-center text-3xl font-bold underline">
                    { order.type === "delivery" ?
                      <Delivery size={36} className="text-white" />
                      :
                      <Takeaway size={36} className="text-white" />
                    }
                    <span className="">{`Order #${order.id}`}</span>
                  </h1>
                  <h3 className="w-full text- text-xl">
                    {order.restaurant}
                  </h3>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                  <Divider className="w-[90%] flex bg-white/10 my-3" />
                </div>

                <div className="flex flex-col w-[90%] mx-auto gap-4">
                <h1 className={`text-2xl text-center font-bold ${statuses[order.status].darkColor}`}>
                  {statuses[order.status].alternative || statuses[order.status].display}
                </h1>
                
                {!["completed", "canceled"].includes(order.status) && (
                  <Progress
                    classNames={{
                      indicator: `${statuses[order.status].darkBgColor}`,
                      track: "bg-gray-300 h-4",
                      root: "bg-gray-200 h-4",
                    }}
                    size="md"
                    value={
                      order.status === "preparing" ? 40 :
                      order.status === "out" ? 70 :
                      order.status === "ready" ? 70 : 0
                    }
                    isIndeterminate={!["preparing", "out", "ready"].includes(order.status)}
                  />
                )}
              </div>
              </ModalHeader>
            </div>
            
            <ModalBody className="mt-4 bg-[#efefef] mx-2 rounded-xl">
              <div>
                <h1 className="text-2xl font-bold">
                  Your Order
                </h1>
                <div className="flex flex-col gap-2 mt-4">
                  {order.items.map((item, index) => (
                    <div className="flex flex-row gap-4" key={index}>
                      <div className="text-lg text-gray-500 min-w-[40px]">
                        {item.quantity}x
                      </div>
                      <div className="flex-1">
                        <div className="text-lg flex justify-between font-medium">
                          <span>{item.name}</span>
                          <span>{item.price.toFixed(2)}{order.currency}</span>
                        </div>
                        {item.ingredients && item.ingredients.length > 0 && (
                          <ul className="text-sm text-gray-700 mt-0 ml-3">
                            {item.ingredients.map((ingredient, i) => (
                              <li key={i} className="list-disc">
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="w-full">
              <div className="w-full pb-2">
                  <div className="flex justify-between items-center pt-0">
                    <span className="text-xl font-bold pt-0">Total</span>
                    <span className={`text-xl font-bold ${order.status === "canceled" ? "line-through text-danger" : ""}`}>
                      {order.total.toFixed(2)}{order.currency}
                    </span>
                  </div>
                  {order.deliveryFee && (
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Delivery fee included</span>
                      <span>{order.deliveryFee.toFixed(2)}{order.currency}</span>
                    </div>
                  )}
                </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
