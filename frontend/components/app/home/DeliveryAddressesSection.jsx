"use client";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { MapPin } from "@/components/icons/heroicons";
import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { UserService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

export default function DeliveryAddressesSection({
  addresses = [],
  isOpen,
  setIsModalOpen,
  onSave, 
}) {
  const [entries, setEntries] = useState(addresses ?? []);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setEntries(addresses);
  }, [addresses, isOpen]);

  const validateAddress = (addr) => {
    if (!addr) return false;
    else return addr.match(
      /^(?=.{15,200}$)([\p{L}0-9.'’\-/ ]+),\s*([\p{L} \-']{2,}),\s*([0-9A-Za-z\- ]{4,12}),\s*([\p{L} \-']{3,})$/u
    );
  }

  const invalidAddress = useMemo(
    () => entries.map((e) => (e.address === "" ? false : !validateAddress(e.address))),
    [entries]
  );

  const handleChange = (i, val) => {
    const next = [...entries];
    next[i].address = val;
    setEntries(next);
    setErrors((prev) => {
      const nextErr = [...prev];
      delete nextErr[i]?.address;
      return nextErr;
    });
  };

  const addEntry = () => {
    const last = entries[entries.length - 1];
    if (!last.address || !validateAddress(last.address)) {
      setErrors((prev) => {
        const nextErr = [...prev];
        nextErr[entries.length - 1] = {
          address: !last.address ? "Address is required" : "Invalid address format",
        };
        return nextErr;
      });
      return;
    }

    setEntries([...entries, { address: "" }]);
    setErrors([...errors, {}]);
  };

  const removeEntry = async (id) => {
    console.log(entries);
    console.log(id);
    const data = await UserService.deleteDelivery(id);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setEntries(entries.filter((e) => e._id !== id));
    setErrors(errors.filter((e) => e._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErr = entries.map((ent) => {
      const err = {};
      if (!ent.address) err.address = "Address is required";
      else if (!validateAddress(ent.address)) err.address = "Invalid address format";
      return err;
    });
    setErrors(newErr);
    if (newErr.some((o) => Object.keys(o).length)) return;

    const newAddress = entries.filter((e) => addresses.map((a) => a.address).includes(e.address) === false)[0].address;

    const data = await UserService.editDelivery(newAddress);

    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    onSave?.(data.delivery);

    addToast({
      title: "Success",
      description: "Delivery addresses saved successfully!",
      color: "success",
      timeout: 5000,
    });

    setIsModalOpen(false);
  };

  const addDisabled =
    !entries.length || !entries[entries.length - 1].address || invalidAddress[entries.length - 1];

  return (
    <Modal isOpen={isOpen} onClose={() => setIsModalOpen(false)}>
      <ModalContent className="max-w-lg rounded-b-none sm:rounded-xl m-0">
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex items-center justify-between">
            <span className="text-xl font-bold">Delivery Addresses</span>
          </ModalHeader>
          <ModalBody
            as={ScrollShadow}
            size={50}
            className="space-y-6 py-2 h-[60vh] overflow-y-auto"
          >
            {entries.map((ent, i) => (
              <div key={i} className="flex gap-1 items-end">
                <Input
                  label={
                    <span>
                      {`Address ${i + 1} `}
                      <span className="text-danger">*</span>
                    </span>
                  }
                  labelPlacement="outside"
                  placeholder="Example: Via Roma 1, Roma, 00100, Italy"
                  value={ent.address}
                  onChange={(e) => handleChange(i, e.target.value)}
                  isInvalid={!!errors[i]?.address || invalidAddress[i]}
                  errorMessage={
                    errors[i]?.address ||
                    (invalidAddress[i] && "Format: Road, City, ZIP, Province")
                  }
                  endContent={<MapPin className="text-2xl text-default-500" />}
                  size="sm"
                />
                {entries.length > 1 && (
                  <div className="text-right">
                    <Button
                      type="button"
                      color="danger"
                      size="sm"
                      onPress={() => removeEntry(ent._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button
                type="button"
                color="primary"
                size="md"
                onPress={addEntry}
                disabled={addDisabled}
                className="w-full sm:w-auto"
              >
                + Add Address
              </Button>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button variant="ghost" onPress={() => setIsModalOpen(false)}>
              Annulla
            </Button>
            <Button variant="flat" type="submit" className="bg-[#083d77] text-white">
              Salva
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
