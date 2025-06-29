'use client';
import { useState, useMemo, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Input } from "@heroui/input";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Search, ChevronRight } from "@/components/icons/heroicons";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";

import { formatCurrency } from "@/utils/format";
import { statuses } from "@/utils/lists";

export default function OrderRestaurant({ orders }) {
  const statusOptions = useMemo(
    () => Object.keys(statuses).map(uid => ({ uid, name: statuses[uid].display })),
    []
  );

  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    // tutti gli status selezionati inizialmente
    () => new Set(statusOptions.map(opt => opt.uid))
  );
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

  // reset pagina al cmabio dei filtri
  useEffect(() => {
    setPage(1);
  }, [filterValue, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page]);

  return (
    <div className="w-full 2xl:w-2/3 xl:w-3/4 lg:w-4/5 flex flex-col p-4 pb-10">
      {/* Search + Filters */}
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
            <DropdownTrigger className="hidden sm:flex">
              <Button variant="faded" endContent={<ChevronRight size={18} className="rotate-[90deg]" />}>
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
      <Table key={page} isHeaderSticky bottomContentPlacement="outside">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Payment</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn className="w-1/12">Action</TableColumn>
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
                <Button 
                  className="bg-[#083d77] text-white hover:bg-[#083d77]/90"
                  onPress={() => alert(`Mock: Manage order ${order.id}`)}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination + Total Orders */}
      <div className="mt-4 flex justify-between w-full">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
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
        <div>
          
        </div>
      </div>
    </div>
  );
}
