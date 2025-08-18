"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { WaveClean } from "@/components/waves";
import { courses, areas, allergens } from "@/utils/lists";
import { UserService } from '@/services/userService';
import { addToast } from "@heroui/toast";

export default function OnboardingPreferences() {
  const router = useRouter();
  const [allergensList, setAllergensList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [subscribe, setSubscribe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const editPreferences = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    setIsLoading(true);

    const data = await UserService.editPreferences(
      Array.from(allergensList),
      Array.from(categories),
      Array.from(cuisines),
      subscribe
    );

    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setIsLoading(false);

    addToast({
      title: "Success",
      description: "Changes saved successfully!",
      color: "success",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    });

    router.push("/");
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
              Set your preferences to enhance your food experience
            </p>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <form onSubmit={editPreferences} className="flex flex-col gap-6">

              {/* Allergens */}
              <div className="flex flex-col gap-1">
                <Select
                  items={allergens.map(item => ({ value: item, label: item }))}
                  label={<span className="font-medium">Allergens</span>}
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Select allergens"
                  selectionMode="multiple"
                  selectedKeys={allergensList}
                  onSelectionChange={setAllergensList}
                  className="w-full"
                  radius="sm"
                  size="lg"
                >
                  {(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <p className="text-sm text-default-500">
                  Select any allergens we should be aware of
                </p>
              </div>

              {/* Preferred Food Categories */}
              <div className="flex flex-col gap-1">
                <Select
                    items={courses.map(item => ({ value: item.name, label: item.name }))}
                    variant="bordered"
                    label={<span className="font-medium">Preferred Food Categories</span>}
                    labelPlacement="outside"
                    placeholder="Select preferred categories"
                    selectionMode="multiple"
                    selectedKeys={categories}
                    onSelectionChange={setCategories}
                    className="w-full"
                    radius="sm"
                    size="lg"
                  >
                    {(item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )}
                  </Select>
                <p className="text-sm text-default-500">
                  Select your favorite food categories
                </p>
              </div>

              {/* Preferred Cuisines */}
              <div className="flex flex-col gap-1">
                <Select
                  items={areas.map(item => ({ value: item, label: item }))}
                  variant="bordered"
                  label={<span className="font-medium">Preferred Cuisines</span>}
                  labelPlacement="outside"
                  placeholder="Select preferred cuisines"
                  selectionMode="multiple"
                  selectedKeys={cuisines}
                  onSelectionChange={setCuisines}
                  className="w-full"
                  radius="sm"
                  size="lg"
                >
                  {(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <p className="text-sm text-default-500">
                  Select your favorite cuisines
                </p>
              </div>

              {/* Subscribe checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
                <div className="flex flex-col">
                  <label className="font-medium cursor-pointer">
                    Subscribe to special offers and promotions
                  </label>
                  <p className="text-sm text-default-500">
                    You’ll see restaurant food in your home that matches your preferences.
                  </p>
                </div>
              </div>

              {/* Save button */}
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-[#083d77] text-white"
              >
                Save Preferences
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
