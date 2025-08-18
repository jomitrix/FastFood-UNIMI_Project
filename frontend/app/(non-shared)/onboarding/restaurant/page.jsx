"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { WaveClean } from "@/components/waves";
import { Phone, MapPin, Briefcase, Storefront } from "@/components/icons/heroicons";
import { RestaurantService } from '@/services/restaurantService';
import { addToast } from "@heroui/toast";

export default function OnboardingPreferences() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [vat, setVat] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateAddress = (v) => /^(?=.{15,200}$)([\p{L}0-9.''\-/ ]+),\s*([\p{L} \-']{2,}),\s*([0-9A-Za-z\- ]{4,12}),\s*([\p{L} \-']{3,})$/u.test(v);
  const invalidAddress = useMemo(() => address && !validateAddress(address), [address]);

  const validatePhone = (v) => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v);
  const invalidPhone = useMemo(() => phone && !validatePhone(phone), [phone]);

  const validateVat = (v) => /^\d{11}$/.test(v);
  const invalidVat = useMemo(() => vat && !validateVat(vat), [vat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErr = {};

    if (!restaurantName) newErr.restaurantName = "Restaurant name required";

    if (!address) newErr.address = "Address required";
    else if (invalidAddress) newErr.address = "Invalid address";

    if (!phone) newErr.phone = "Phone required";
    else if (invalidPhone) newErr.phone = "Invalid phone";

    if (!vat) newErr.vat = "VAT required";
    else if (invalidVat) newErr.vat = "Invalid VAT number";

    if (Object.keys(newErr).length) { setErrors(newErr); return; }

    setIsLoading(true);

    const data = await RestaurantService.editRestaurant(restaurantName, phone, address, vat);
    if (!data || data.status !== "success") {
      setIsLoading(false);
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger" });
    }

    setIsLoading(false);
    router.push("/manager/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f5]">
      <WaveClean />

      <section className="mt-5 bg-[#f5f3f5] flex flex-col w-full items-center justify-center p-4">
        <Card
          className="w-full max-w-lg bg-background/95 backdrop-blur-sm shadow-xl border border-[#083d77]/20"
          classNames={{ base: "border-0 shadow-0", body: "border-0 shadow-0" }}
        >
          <CardHeader className="flex flex-col gap-3 px-6 pt-12 pb-0">
            <h1 className="font-semibold text-[#083d77] text-4xl text-center">
              Onboarding
            </h1>
            <p className="w-2/3 text-center leading-6 text-lg font-sm">
              Complete these details to finish setting up your account
            </p>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                type="text"
                value={restaurantName}
                onChange={(e) => { setRestaurantName(e.target.value); setErrors(p => ({ ...p, restaurantName: undefined })); }}
                isInvalid={!!errors.restaurantName}
                errorMessage={errors.restaurantName}
                label={<span className="font-medium">Nome Ristorante</span>}
                placeholder="es. Ristorante da Mario"
                labelPlacement="outside"
                radius="sm"
                size="lg"
                endContent={<Storefront className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
              />

              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                isInvalid={!!errors.phone || invalidPhone}
                errorMessage={errors.phone || "Invalid phone number"}
                label={<span className="font-medium">Phone Number</span>}
                placeholder="e.g. +39 333 123 4567"
                labelPlacement="outside"
                radius="sm"
                size="lg"
                endContent={<Phone className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
              />

              <Input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                isInvalid={!!errors.address || invalidAddress}
                errorMessage={errors.address || "Format: Road, City, ZIP, Province"}
                type="text"
                label={
                  <span>
                    Restaurant Address
                    <span className="text-danger ml-1">*</span>
                  </span>
                }
                placeholder="Example: Via Roma 1, Roma, 00100, Italy"
                labelPlacement="outside"
                endContent={<MapPin className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                radius="sm"
                size="lg"
              />

              <Input
                type="text"
                value={vat}
                onChange={(e) => { setVat(e.target.value); setErrors(p => ({ ...p, vat: undefined })); }}
                isInvalid={!!errors.vat || invalidVat}
                errorMessage={errors.vat || "Invalid VAT number"}
                label={<span className="font-medium">VAT Number</span>}
                placeholder="e.g. 01234567890"
                labelPlacement="outside"
                radius="sm"
                size="lg"
                endContent={<Briefcase className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
              />

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-[#083d77] text-white"
              >
                Save
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
