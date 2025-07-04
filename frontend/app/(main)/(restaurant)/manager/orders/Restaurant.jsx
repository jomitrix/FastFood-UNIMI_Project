'use client';
import { useState, useMemo, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Input } from "@heroui/input";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Search, ChevronRight, Points, Funnel } from "@/components/icons/heroicons";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";

import { formatCurrency } from "@/utils/format";
import { statuses } from "@/utils/lists";

export default function OrderRestaurant({ orders, restaurant }) {
  const statusOptions = useMemo(
    () => Object.keys(statuses).map(uid => ({ uid, name: statuses[uid].display })),
    []
  );

  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    () => new Set(statusOptions.map(opt => opt.uid))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // unisco i filtri alla ricerca
  const filteredOrders = useMemo(() => {
    let items = [...orders];

    if (filterValue.trim()) {
      items = items.filter(o =>
        o.customer.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter.size && statusFilter.size !== statusOptions.length) {
      items = items.filter(o => statusFilter.has(o.status));
    }

    return items;
  }, [orders, filterValue, statusFilter, statusOptions.length]);

  // reset pagina al cambio dei filtri
  useEffect(() => {
    setPage(1);
  }, [filterValue, statusFilter]);

  // order id
  const findOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const handleOpenModal = (orderId) => {
    const order = findOrderById(orderId);
    setSelectedOrder(order);
    setNewStatus("");
    setIsModalOpen(true);
  };

  // aggiorno stato ordine
  const handleStatusUpdate = () => {
    if (!newStatus || newStatus === selectedOrder.status) return;
    
    // chiamata api
    console.log(`Updating order ${selectedOrder.id} status from ${selectedOrder.status} to ${newStatus}`);

    setSelectedOrder(prev => ({ ...prev, status: newStatus })); // idea capire
  };

  // ritorno lo stato in base a quello attuale e al tipo
  const getAvailableStatuses = (order) => {
    const currentStatus = order.status;
    const orderType = order.type;
    
    if (currentStatus === "ordered") {
      return ["preparing", "canceled"];
    } 
    else if (currentStatus === "preparing") {
      const nextStatuses = [];
      if (orderType === "delivery") {
        nextStatuses.push("out");
      } else {
        nextStatuses.push("ready");
      }
      nextStatuses.push("canceled");
      return nextStatuses;
    }
    
    return [];
  };

  const getDeliveryCode = (orderId) => {
    
    // codice mock prendo gli ultimi 3 caratteri dell'id ordine
    const id = orderId.replace(/\D/g, '');
    return id.substring(id.length - 3);
  };

  // colore pulsante
  const getStatusButtonColor = (status) => {
    switch(status) {
      case 'preparing': return 'primary';
      case 'out': 
      case 'ready': return 'secondary';
      case 'completed': return 'success';
      case 'canceled': return 'danger';
      default: return 'primary';
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page]);

  return (
    <div className="w-full 2xl:w-2/3 xl:w-3/4 lg:w-4/5 flex flex-col p-4 pb-10">
      <div className="flex flex-col gap-4 w-full mb-4">
        <div className="flex justify-between items-end gap-3">
          {/* Search */}
          <Input
            isClearable
            variant="faded"
            className="w-full sm:max-w-[44%]"
            placeholder="Search by customer…"
            startContent={<Search />}
            value={filterValue}
            onValueChange={setFilterValue}
            onClear={() => setFilterValue("")}
          />

          {/* Filter */}
          <Dropdown
            placement="bottom-end"
          >
            <DropdownTrigger className="flex">
              <Button variant="faded" startContent={<Funnel size={22} />} endContent={<ChevronRight size={18} className="rotate-[90deg]" />}>
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={statusFilter}
              onSelectionChange={setStatusFilter}
              aria-label="Filter by status"
            >
              {statusOptions.map(opt => (
                <DropdownItem key={opt.uid} className="capitalize">
                  {opt.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Tabella */}
      <Table
        key={page}
        isHeaderSticky
        bottomContentPlacement="outside"
        classNames={{
          wrapper: `min-h-[40rem] overflow-y-auto`,
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Payment</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn className="w-[4%]">Action</TableColumn>
        </TableHeader>

        <TableBody items={paginatedOrders}>
          {order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  classNames={{ content: "font-semibold" }}
                  className={`text-xs ${statuses[order.status].bgColor} text-white`}
                >
                  {statuses[order.status].display}
                </Chip>
              </TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>
                <Dropdown
                  placement="bottom-end"
                  className="-mt-8"
                >
                  <DropdownTrigger className="flex">
                    <Button 
                      isIconOnly
                      variant="flat"
                      className="bg-transparent"
                    >
                      <Points size={28} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    closeOnSelect={true}
                  >
                    <DropdownItem
                      className="flex items-center gap-2"
                      onPress={() => handleOpenModal(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span>Manage Order</span>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination + Numero Ordini */}
      <div className="mt-4 flex justify-center w-full relative">
        <div className="absolute left-0 top-2 w-full">
          <span className="absolute left-0 text-default-400 text-small">
            Total orders {filteredOrders.length}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
      
      {/* Modale Gestione */}
      <Modal 
        size="3xl"
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        classNames={{
          base: "max-h-[90vh]",
          body: "p-0"
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {selectedOrder && (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Manage Order</h2>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.id} - {selectedOrder.customer}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    classNames={{ content: "font-semibold" }}
                    className={`text-xs ${statuses[selectedOrder.status].bgColor} text-white`}
                  >
                    {statuses[selectedOrder.status].display}
                  </Chip>
                </div>
              </ModalHeader>
              
              <ScrollShadow className="max-h-[calc(90vh-170px)]">
                <ModalBody className="px-6">
                  <div className="grid grid-cols-1 gap-4 py-4">
                    {/* Gestione stato */}
                    { selectedOrder.status !== "completed" && selectedOrder.status !== "canceled" && (
                      <Card shadow="sm" className="border border-neutral-200">
                        <CardBody className="p-4">
                          <h3 className="text-lg font-semibold mb-3">Manage Order</h3>
                          
                          {getAvailableStatuses(selectedOrder).length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {getAvailableStatuses(selectedOrder).map(status => (
                                  <Button 
                                    key={status} 
                                    size="md" 
                                    color={getStatusButtonColor(status)}
                                    variant={newStatus === status ? "solid" : "flat"}
                                    onPress={() => setNewStatus(status)}
                                    className="flex-grow"
                                  >
                                    {status === "preparing" && "Start Preparing"}
                                    {status === "out" && "Send for Delivery"}
                                    {status === "ready" && "Ready for Pickup"}
                                    {status === "canceled" && "Cancel Order"}
                                  </Button>
                                ))}
                              </div>
                              
                              {newStatus && newStatus !== selectedOrder.status && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mt-3">
                                  <p className="text-sm">
                                    Changing status from <span className="font-semibold">{statuses[selectedOrder.status].display}</span> to <span className="font-semibold">{statuses[newStatus].display}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            // mostro codice se out o ready
                            (selectedOrder.status === "out" || selectedOrder.status === "ready") && (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm font-medium mb-2">{selectedOrder.type === "takeaway" ? "Pickup" : "Delivery"} Verification Code</p>
                                <div className="flex items-center justify-center">
                                  <p className="text-3xl font-bold tracking-widest bg-white py-2 px-4 rounded-md border border-gray-300 shadow-sm">
                                    {getDeliveryCode(selectedOrder.id)}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                  {selectedOrder.type === "delivery" 
                                    ? "Provide this code to the delivery person for order completion"
                                    : "Provide this code to the customer for order completion"
                                  }
                                </p>
                              </div>
                            )
                          )}
                        </CardBody>
                      </Card>
                    )}
                    {/* Info ord */}
                    <Card shadow="sm" className="border border-neutral-200">
                      <CardBody className="p-4">
                        <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-gray-500">Order Type</p>
                            <p className="text-sm font-medium capitalize">{selectedOrder.type}</p>
                          </div>
                          <div className="p-2 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-gray-500">Payment Method</p>
                            <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                          </div>
                          <div className="p-2 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-gray-500">Order Date</p>
                            <p className="text-sm font-medium">{selectedOrder.orderDate}</p>
                          </div>
                          {selectedOrder.estimatedDelivery && (
                            <div className="p-2 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-gray-500">Est. Delivery</p>
                              <p className="text-sm font-medium">{selectedOrder.estimatedDelivery}</p>
                            </div>
                          )}
                          {selectedOrder.estimatedPickup && (
                            <div className="p-2 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-gray-500">Est. Pickup</p>
                              <p className="text-sm font-medium">{selectedOrder.estimatedPickup}</p>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Cliente */}
                    <Card shadow="sm" className="border border-neutral-200">
                      <CardBody className="p-4">
                        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                        <div className="space-y-3">
                          <div className="p-2 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm font-medium">{selectedOrder.customer}</p>
                          </div>
                          <div className="p-2 bg-neutral-50 rounded-lg">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium">{selectedOrder.customerPhone}</p>
                          </div>
                          {selectedOrder.deliveryAddress && (
                            <div className="p-2 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-gray-500">Delivery Address</p>
                              <p className="text-sm font-medium">{selectedOrder.deliveryAddress}</p>
                            </div>
                          )}
                          {selectedOrder.customerNotes && (
                            <div className="p-2 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-gray-500">Notes</p>
                              <p className="text-sm font-medium">{selectedOrder.customerNotes}</p>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Prodotti Ordinati */}
                    <Card shadow="sm" className="border border-neutral-200">
                      <CardBody className="p-4">
                        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 border-b border-neutral-200 last:border-b-0">
                              <div className="flex-grow">
                                <p className="text-sm font-semibold"><span className="px-2 py-1 mr-3 bg-neutral-100 rounded-md">{item.quantity}x</span>{item.name}</p>
                                {item.ingredients && (
                                  <p className="text-xs text-gray-500">{item.ingredients.join(", ")}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{formatCurrency(item.quantity * item.price)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-neutral-200">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-sm">{formatCurrency(selectedOrder.subtotal)}</span>
                          </div>
                          {selectedOrder.deliveryFee && (
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-600">Delivery Fee</span>
                              <span className="text-sm">{formatCurrency(selectedOrder.deliveryFee)}</span>
                            </div>
                          )}
                          <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-neutral-200">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">{formatCurrency(selectedOrder.total)}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </ModalBody>
              </ScrollShadow>

              <ModalFooter className="border-t">
                <Button variant="flat" onPress={() => setIsModalOpen(false)}>
                  Close
                </Button>
                {getAvailableStatuses(selectedOrder).length > 0 && newStatus && (
                  <Button 
                    color="primary" 
                    onPress={handleStatusUpdate}
                  >
                    Update Order
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
