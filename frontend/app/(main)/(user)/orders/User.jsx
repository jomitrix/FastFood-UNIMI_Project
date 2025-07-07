'use client';
import { useState, useMemo, } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Takeaway, Delivery, ChevronRight } from "@/components/icons/heroicons";
import OrderList from "@/components/app/orders/OrderList";
import { InputOtp } from "@heroui/input-otp"
import { Button } from "@heroui/button";
import { UserService } from "@/services/userService";
import { addToast } from "@heroui/toast";

export default function OrderUser({orders, statuses, lastElementRef, isLoadingMore, hidePastOrders, setHidePastOrders, resetPaginator}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderModalId, setOrderModalId] = useState(null);
  const [order, setOrder] = useState(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  // Filtra gli ordini in base alla checkbox
  const filteredOrders = useMemo(() => {
    if (!hidePastOrders) return orders;
    return orders.filter(
      o => o.status !== "canceled" && o.status !== "completed"
    );
  }, [orders, hidePastOrders]);

  useMemo(() => {
    if (orderModalId) {
      const orderData = orders.find(order => order._id === orderModalId);
      setOrder(orderData);
    }
  }, [orderModalId, orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await UserService.completeOrder(order._id, code);
    if (!data || data.status !== "success") {
      setCodeError(true);
      addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
      return;
    }

    addToast({ title: "Success", description: "Order completed successfully", color: "success", timeout: 4000 });

    setIsModalOpen(false);
    resetPaginator();
    return;
  };

  return (
    <>
      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center items-center p-4 pb-12">
        <OrderList
          hidePastOrders={hidePastOrders}
          setHidePastOrders={setHidePastOrders}
          orders={orders}
          statuses={statuses}
          setIsModalOpen={setIsModalOpen}
          setOrderModalId={setOrderModalId}
          lastElementRef={lastElementRef}
          isLoadingMore={isLoadingMore}
        />
      </div>

      {isModalOpen && order && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false) && setOrderModalId(null)}
          scrollBehavior="inside"
          className="m-0 w-full md:max-h-[90vh] md:h-auto"
          classNames={{
            closeButton: "text-xl text-white hover:bg-white/10 active:!text-black",
            
          }}
        >
          <ModalContent className="rounded-t-xl rounded-b-none sm:rounded-b-xl overflow-hidden w-full sm:w-none md:h-[80vh] md:max-h-[800px]">
            <div className="bg-[#1d1d1d] text-white rounded-b-xl">
              <ModalHeader className="flex flex-col items-center justify-center pb-4">
                <div className="flex flex-col">
                  <h1 className="w-full flex gap-3 justify-center text-3xl font-bold underline">
                    { order.type === "delivery" ?
                      <Delivery size={36} className="text-white" />
                      :
                      <Takeaway size={36} className="text-white" />
                    }
                    <span className="">{`Order #${order._id.substr(-6).toUpperCase()}`}</span>
                  </h1>
                  <h3 className="w-full text-xl mt-2 text-center">
                    {order.restaurant.name}
                  </h3>
                  <p className="text-xs text-center text-gray-300 text-medium">
                    {"Ordered: " + new Date(order.createdAt).toLocaleDateString("it", { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) + " - " + new Date(order.createdAt).toLocaleTimeString("it", {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                  </p>
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                  <Divider className="w-[90%] flex bg-white/10 my-3" />
                </div>

                <div className="flex flex-col w-[90%] mx-auto">
                <h1 className={`text-2xl text-center font-bold ${statuses[order.status].darkColor}`}>
                  {statuses[order.status].alternative || statuses[order.status].display}
                </h1>
                { order.status === "completed" && (
                  <p className="text-lg text-center text-medium">
                    {new Date(order.updatedAt).toLocaleDateString("it", { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) + " - " + new Date(order.updatedAt).toLocaleTimeString("it", {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                  </p>
                )}
                { order.status === "canceled" && (
                  <p className="text-lg text-center text-medium">
                    If you have any questions, please contact the restaurant.
                  </p>
                )}
                
                { ["out", "ready"].includes(order.status) && (
                  <form
                    className="w-full flex -mb-2 items-center justify-center gap-1"
                    onSubmit={handleSubmit}
                  >
                    <InputOtp
                      length={3}
                      type="number"
                      size="sm"
                      value={code}

                      isInvalid={codeError}
                      validationBehavior={false}
                      radius="lg"
                      placeholder="Codice dal ristorante"
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (codeError) {
                          setCodeError(false);
                        }
                      }}
                      classNames={{
                        base: "text-black",
                        errorMessage: "hidden",
                        helperWrapper: "hidden"
                      }}
                    />

                    <Button
                      type="submit"
                      isIconOnly
                      size="sm"
                      className="h-8 w-8 min-w-8 rounded-lg bg-purple-400 hover:bg-purple-500 active:scale-[.97]"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </form>
                )}
                {!["completed", "canceled"].includes(order.status) && (
                  <Progress
                    className="mt-4"
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
            
            
              <ModalBody 
                className="mt-4 bg-[#efefef] mx-2 rounded-xl"
              >
                <ScrollShadow
                  size={30}
                  hideScrollBar
                >
                  <div>
                  <h1 className="text-2xl font-bold">
                    Your Order
                  </h1>
                  <div className="flex flex-col gap-[0.375rem] mt-4">
                    {order.meals.map((item, index) => (
                      <div className="flex flex-row gap-4" key={index}>
                        <div className="text-lg text-gray-500 min-w-[40px]">
                          {item.quantity}x
                        </div>
                        <div className="flex-1">
                          <div className="text-lg flex justify-between font-medium">
                            <span>{item.meal.name}</span>
                            <span>{item.meal.price.toFixed(2)}€</span>
                          </div>
                          {item.meal.ingredients && item.meal.ingredients.length > 0 && (
                            <ul className="text-sm text-gray-700 mt-0 ml-3">
                              {item.meal.ingredients.map((ingredient, i) => (
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
                </ScrollShadow>
              </ModalBody>
            
            <ModalFooter className="w-full">
              <div className="w-full pb-2">
                  <div className="flex justify-between items-center pt-0">
                    <span className="text-xl font-bold pt-0">Total</span>
                    <span className={`text-xl font-bold ${order.status === "canceled" ? "line-through text-danger" : ""}`}>
                      {order.totalPrice.toFixed(2)}€
                    </span>
                  </div>
                  {order.serviceType === "delivery" && (
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Delivery fee included</span>
                      <span>{order.deliveryFee.toFixed(2)}€</span>
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
