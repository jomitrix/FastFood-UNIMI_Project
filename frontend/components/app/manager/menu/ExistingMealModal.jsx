"use client";
import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Skeleton } from "@heroui/skeleton";

export default function ExistingModal({ isOpen, onClose, searchMeals, setQueryResult, queryResult, onSearch, onAddMeal }) {
    const [selectedMealId, setSelectedMealId] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setSelectedMealId(null);
        setSearchValue("");
        setQueryResult([]);
    }, [isOpen, setQueryResult]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchValue(query);
        onSearch(query);
    };

    const handleAddMeal = () => {
        if (!selectedMealId) return;
        
        const mealToAdd = queryResult.find(meal => meal.idMeal === selectedMealId);
        if (!mealToAdd) return;

        const formattedMeal = {
            id: Date.now().toString(),
            name: mealToAdd.strMeal,
            image: mealToAdd.strMealThumb || "https://placehold.co/500x500?text=No+Image",
            ingredients: mealToAdd.strIngredient1,
            category: mealToAdd.strCategory,
            area: mealToAdd.strArea,
            price: 0.49, // Default price, can be adjusted later
            currency: "€"
        };

        onAddMeal(formattedMeal);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            className="bg-white shadow-lg m-0"
        >
            <ModalContent className='rounded-t-xl rounded-b-none sm:rounded-b-xl'>
                <ModalHeader className="flex flex-col gap-1">
                    Add existing meal
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="search"
                            label="Search an existing meal"
                            placeholder="Start typing..."
                            size="lg"
                            classNames={{
                                label: "text-sm mb-4",
                                input: "text-lg",
                            }}
                            variant="faded"
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        <ScrollShadow size={30} hideScrollBar className="max-h-60 overflow-y-auto flex flex-col gap-2 mt-2">
                            {queryResult.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center">
                                    {searchValue.trim() === "" ? 
                                        "Start typing to search." : 
                                        "No meals found matching your search."}
                                </p>
                            ) : (
                                queryResult.map((meal) => (
                                    <div 
                                        key={meal.idMeal} 
                                        className={`p-3 rounded-lg flex flex-shrink-0 relative items-center gap-3 cursor-pointer border ${selectedMealId === meal.idMeal ? 'border-[#003c6e] bg-[#003c6e]/5' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => setSelectedMealId(meal.idMeal)}
                                    >   
                                        <Skeleton className="h-14 w-14 rounded-md object-cover" />
                                        <img 
                                            src={meal.strMealThumb}  
                                            className="h-14 w-14 rounded-md object-cover absolute"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{meal.strMeal}</h3>
                                            <p className="text-sm text-gray-500">{meal.strCategory} • {meal.strArea}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollShadow>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        variant="ghost" 
                        onPress={() => {
                            setSelectedMealId(null);
                            setSearchValue("");
                            setQueryResult([]);
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="bg-[#003c6e] text-white"
                        onPress={handleAddMeal}
                        isDisabled={!selectedMealId}
                    >
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}