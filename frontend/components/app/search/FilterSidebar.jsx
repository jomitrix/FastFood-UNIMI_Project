"use client";
import { useState, useEffect, useMemo } from 'react';
import { Funnel } from '@/components/icons/heroicons';
import { Badge } from '@heroui/badge';
import { Checkbox } from '@heroui/checkbox';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { areas, allergens } from "@/utils/lists";
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { NumberInput } from '@heroui/number-input';

export default function FilterSidebar({ onFiltersChange, isDrawerOpen = false, setIsDrawerOpen, isMobile = false, searchType, activeFilters: pageFilters }) {
  const [isOpenNow, setIsOpenNow] = useState(pageFilters.isOpenNow);
  const [selectedAllergens, setSelectedAllergens] = useState(pageFilters.selectedAllergens);
  const [selectedCuisines, setSelectedCuisines] = useState(pageFilters.selectedCuisines);
  const [priceRange, setPriceRange] = useState(pageFilters.priceRange);
  
  const localFilters = useMemo(() => ({
    isOpenNow,
    selectedAllergens,
    selectedCuisines,
    priceRange
  }), [isOpenNow, selectedAllergens, selectedCuisines, priceRange]);

  useEffect(() => {
    if (onFiltersChange && !isMobile) {
      onFiltersChange(localFilters);
    }
  }, [localFilters, onFiltersChange, isMobile]);

  const activeFilterCount = useMemo(() => {
    const filters = isMobile ? pageFilters : localFilters;
    let count = 0;
    if (!filters.isOpenNow) count++;
    if (filters.selectedAllergens.length > 0) count++;
    if (filters.selectedCuisines.length > 0) count++;
    if (searchType === 'dishes' && (filters.priceRange.min || filters.priceRange.max)) count++;
    return count;
  }, [localFilters, pageFilters, isMobile, searchType]);

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => {
      const newRange = { ...prev, [field]: value };
      const min = parseFloat(newRange.min);
      const max = parseFloat(newRange.max);

      if (!isNaN(min) && !isNaN(max) && min > max) {
        if (field === 'min') {
          newRange.max = newRange.min;
        } else {
          newRange.min = newRange.max;
        }
      }
      return newRange;
    });
  };

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
    setIsOpenNow(true);
    setSelectedAllergens([]);
    setSelectedCuisines([]);
    setPriceRange({ min: '', max: '' });
  };

  const applyFiltersAndClose = () => {
    onFiltersChange(localFilters);
    setIsDrawerOpen(false);
  };

  const filterContent = (
    <>
      <div>
        <h3 className="font-medium mb-3 text-gray-700">Preferences</h3>
        <div className="space-y-4">
          <Checkbox 
            isSelected={isOpenNow} 
            onValueChange={setIsOpenNow}
            className='pl-4'
            color="primary"
            classNames={{ wrapper: "group-data-[selected=true]:bg-[#083d77]" }}
          >
            Open
          </Checkbox>
        </div>
      </div>

      <Accordion className="mt-4">
        {searchType === 'dishes' && (
          <AccordionItem
            key="price"
            aria-label="Price Range"
            startContent={<Funnel className="h-4 w-4 text-gray-600" />}
            title={<span className="font-medium">Price Range</span>}
            className="accordion-item"
            classNames={{
              content: "py-1",
              trigger: "py-2",
              indicator: "text-gray-500"
            }}
          >
            <div className="flex gap-2 py-1">
              <NumberInput
                type="number"
                minValue={0}
                placeholder="Min"
                value={priceRange.min}
                onChange={(value) => handlePriceChange('min', value)}
                min={0}
              />
              <NumberInput
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(value) => handlePriceChange('max', value)}
                minValue={0}
              />
            </div>
          </AccordionItem>
        )}
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
                color="primary"
                classNames={{ wrapper: "group-data-[selected=true]:bg-[#083d77]" }}
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
                color="primary"
                classNames={{ wrapper: "group-data-[selected=true]:bg-[#083d77]" }}
              >
                {allergen}
              </Checkbox>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );

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
            {filterContent}
          </ModalBody>
          
          <ModalFooter className="border-t">
            <div className="w-full flex justify-between">
              {activeFilterCount > 0 ? (
                <Button 
                  onPress={resetFilters}
                  variant="light"
                  className="text-sm font-medium text-[#083d77] hover:opacity-80"
                >
                  Reset filters
                </Button>
              ) : (
                <div></div>
              )}
              <Button 
                onPress={applyFiltersAndClose}
                className="bg-[#083d77] text-white"
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
          <Badge content={activeFilterCount} shape="circle" className="bg-[#083d77] text-white" />
        )}
      </div>

      <div className="space-y-4">
        {filterContent}
        
        {activeFilterCount > 0 && (
          <button 
            onClick={resetFilters}
            className="text-sm font-medium text-[#083d77] hover:opacity-80"
          >
            Reset filters
          </button>
        )}
      </div>
    </aside>
  );
}