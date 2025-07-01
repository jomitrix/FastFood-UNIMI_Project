"use client";
import { useState, useEffect, useMemo } from 'react';
import { Funnel, XCircle } from '@/components/icons/heroicons';
import { Badge } from '@heroui/badge';
import { Checkbox } from '@heroui/checkbox';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { areas, allergens } from "@/utils/lists";
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";

export default function FilterSidebar({ onFiltersChange, isDrawerOpen = false, setIsDrawerOpen, isMobile = false }) {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  
  const activeFilters = useMemo(() => ({
    isOpenNow,
    selectedAllergens,
    selectedCuisines
  }), [isOpenNow, selectedAllergens, selectedCuisines]);

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(activeFilters);
    }
  }, [activeFilters, onFiltersChange]);

  const activeFilterCount = Object.values(activeFilters).filter(value => 
    value === true || (Array.isArray(value) && value.length > 0)
  ).length;

  const handleAllergenChange = (allergen) => {
    setSelectedAllergens(prev => {
      if (prev.includes(allergen)) {
        return prev.filter(a => a !== allergen);
      } else {
        return [...prev, allergen];
      }
    });
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(c => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  const resetFilters = () => {
    setIsOpenNow(false);
    setSelectedAllergens([]);
    setSelectedCuisines([]);
  };

  if (isMobile) {
    return (
      <Modal 
        isOpen={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        placement="bottom"
        className="h-[85vh]"
      >
        <ModalContent className=' rounded-b-none sm:rounded-lg m-0 w-full max-h-[66vh]'>
          <ModalHeader >
            <h2 className="font-bold text-lg">Filters</h2>
          </ModalHeader>
          
          <ModalBody className="overflow-auto py-4 px-4">
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Preferences</h3>
              <div className="space-y-4">
                <Checkbox 
                  isSelected={isOpenNow} 
                  onValueChange={setIsOpenNow}
                  color="warning"
                  className='pl-4'
                >
                  Open now
                </Checkbox>
              </div>
            </div>

            <Accordion className="mt-4">
              <AccordionItem
                key="cuisines"
                aria-label="Preferred Cuisine"
                startContent={<Funnel className="h-4 w-4 text-gray-600" />}
                title={
                  <span className="font-medium">Preferred Cuisine</span>
                }
                className="accordion-item"
                classNames={{
                  content: "py-1",
                  trigger: "py-2",
                  indicator: "text-gray-500"
                }}
              >
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto py-1">
                  {areas.map((cuisine) => (
                    <Checkbox 
                      key={cuisine}
                      isSelected={selectedCuisines.includes(cuisine)}
                      onValueChange={() => handleCuisineChange(cuisine)}
                      color="warning"
                    >
                      {cuisine}
                    </Checkbox>
                  ))}
                </div>
              </AccordionItem>
              <AccordionItem
                key="allergens"
                aria-label="Exclude Allergens"
                startContent={<Funnel className="h-4 w-4 text-gray-600" />}
                title={
                  <span className="font-medium">Exclude Allergens</span>
                }
                className="accordion-item"
                classNames={{
                  content: "py-1",
                  trigger: "py-2",
                  indicator: "text-gray-500"
                }}
              >
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto py-1">
                  {allergens.map((allergen) => (
                    <Checkbox 
                      key={allergen}
                      isSelected={selectedAllergens.includes(allergen)}
                      onValueChange={() => handleAllergenChange(allergen)}
                      color="warning"
                    >
                      {allergen}
                    </Checkbox>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          
          <ModalFooter className="border-t">
            <div className="w-full flex justify-between">
              {activeFilterCount > 0 ? (
                <Button 
                  onPress={resetFilters}
                  variant="light"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Reset filters
                </Button>
              ) : (
                <div></div>
              )}
              <Button 
                onPress={() => setIsDrawerOpen(false)}
                color="warning"
                className="bg-[#ff8844] text-white"
              >
                Apply filters
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  return (
    <aside className="hidden lg:block w-64 shrink-0 pt-6 pr-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Filters</h2>
        {activeFilterCount > 0 && (
          <Badge color="warning" content={activeFilterCount} shape="circle" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-3 text-gray-700">Preferences</h3>
          <div className="space-y-4">
            <Checkbox 
              isSelected={isOpenNow} 
              onValueChange={setIsOpenNow}
              color="warning"
              className='pl-4'
            >
              Open now
            </Checkbox>
          </div>
        </div>

        <Accordion>
          <AccordionItem
            key="cuisines"
            aria-label="Preferred Cuisine"
            startContent={<Funnel className="h-4 w-4 text-gray-600" />}
            title={
              <span className="font-medium">Preferred Cuisine</span>
            }
            className="accordion-item"
            classNames={{
              content: "py-1",
              trigger: "py-2",
              indicator: "text-gray-500"
            }}
          >
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto py-1">
              {areas.map((cuisine) => (
                <Checkbox 
                  key={cuisine}
                  isSelected={selectedCuisines.includes(cuisine)}
                  onValueChange={() => handleCuisineChange(cuisine)}
                  color="warning"
                >
                  {cuisine}
                </Checkbox>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem
            key="allergens"
            aria-label="Exclude Allergens"
            startContent={<Funnel className="h-4 w-4 text-gray-600" />}
            title={
              <span className="font-medium">Exclude Allergens</span>
            }
            className="accordion-item"
            classNames={{
              content: "py-1",
              trigger: "py-2",
              indicator: "text-gray-500"
            }}
          >
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto py-1">
              {allergens.map((allergen) => (
                <Checkbox 
                  key={allergen}
                  isSelected={selectedAllergens.includes(allergen)}
                  onValueChange={() => handleAllergenChange(allergen)}
                  color="warning"
                >
                  {allergen}
                </Checkbox>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
        
        {activeFilterCount > 0 && (
          <button 
            onClick={resetFilters}
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Reset filters
          </button>
        )}
      </div>
    </aside>
  );
}
