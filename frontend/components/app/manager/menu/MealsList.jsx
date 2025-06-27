'use client';
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Draggable, MoveUp, MoveDown, Edit, Plus, ChefHat, Pizza } from "@/components/icons/heroicons";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@heroui/dropdown";
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter, M } from "@heroui/modal";
import NewMealModal from "./NewMealModal";
import ExistingMealModal from "./ExistingMealModal";
import EditMealModal from "./EditMealModal";

export default function MealsList({ meals, onMealsReorder }) {
    const [isMoveable, setIsMoveable] = useState(false);
    const [localMeals, setLocalMeals] = useState([]);
    const [queryResult, setQueryResult] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [mealFormData, setMealFormData] = useState({});

    useEffect(() => {
        setLocalMeals(meals);
        setIsModified(false);
    }, [meals]);
    
    const handleMoveUp = (index) => {
        if (index <= 0) return;
        
        const newMeals = [...localMeals];
        const temp = newMeals[index];
        newMeals[index] = newMeals[index - 1];
        newMeals[index - 1] = temp;
        
        setLocalMeals(newMeals);
        setIsModified(true);
    };
    
    const handleMoveDown = (index) => {
        if (index >= localMeals.length - 1) return;
        
        const newMeals = [...localMeals];
        const temp = newMeals[index];
        newMeals[index] = newMeals[index + 1];
        newMeals[index + 1] = temp;
        
        setLocalMeals(newMeals);
        setIsModified(true);
    };
    
    const handleUpdate = () => {
        if (onMealsReorder) {
            onMealsReorder(localMeals);
        }
        setIsModified(false);
        setIsMoveable(false);
    };

    // Funzione per gestire l'invio del nuovo pasto
    const handleSubmitNewMeal = () => {
        // Qui puoi effettuare la chiamata API o aggiornare lo stato locale
        
        setLocalMeals([...localMeals, {
            id: Date.now().toString(),
            price: mealFormData.price,
            currency: "€",
            data: {
                strMeal: mealFormData.name,
                strMealThumb: mealFormData.image,
                ingredients: mealFormData.ingredients,
            },
        }]);
        
        setLastMeal(mealFormData);
        setIsModalOpen(null);
    };
    
    // Funzione per trovare il pasto selezionato
    const findMealById = (id) => {
        return localMeals.find(meal => meal.id === id);
    };
    
    // Funzione per gestire l'aggiornamento di un pasto
    const handleUpdateMeal = (updatedMeal) => {
        const updatedMeals = localMeals.map(meal => 
            meal.id === updatedMeal.id ? updatedMeal : meal
        );
        
        setLocalMeals(updatedMeals);
        setIsModified(true);
    };
    
    // Funzione per gestire l'eliminazione di un pasto
    const handleDeleteMeal = (mealId) => {
        const updatedMeals = localMeals.filter(meal => meal.id !== mealId);
        setLocalMeals(updatedMeals);
        setIsModified(true);
    };

    return (
        <div className="w-full mt-0 flex flex-col items-center justify-center w-full h-full">
            {/* Search Bar */}
            {/*<div className="w-full max-w-3xl mb-4 px-4 sm:px-0">
                <Input
                    type="search"
                    placeholder="Cerca un pasto..."
                    className="w-full"
                    classNames={{
                        inputWrapper: "py-5 sm:py-7",
                        input: "text-base sm:text-lg"
                    }}
                    onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        setQueryResult(searchMeals.filter(result => result.strMeal.toLowerCase().includes(query)));
                    }}
                />
            </div>*/}

            {/* Meals List */}
            <div className="w-full max-w-3xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <Button
                            className="text-sm sm:text-base"
                            size="sm"
                            onPress={() => setIsMoveable(!isMoveable)}
                        >
                            { !isMoveable ? (
                                <>
                                    <Draggable size={14} className="block sm:hidden mr-1"/>
                                    <Draggable size={18} className="hidden sm:block mr-1"/>
                                    <span className="inline">Sort</span>
                                </>
                            ) : (
                                <>
                                    <Edit size={14} className="mr-1 block sm:hidden"/>
                                    <Edit size={18} className="mr-1 hidden sm:block"/>
                                    <span className="inline">Edit</span>
                                </>
                            )}
                        </Button>
                        {isModified && (
                            <Button
                                className="text-sm sm:text-base bg-green-600 text-white"
                                size="sm"
                                onPress={handleUpdate}
                            >
                                Aggiorna
                            </Button>
                        )}
                    </div>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button
                                
                                className="bg-[#003c6e] text-white text-sm sm:text-base"
                                size="sm"
                            >
                                <span className="inline">Add a Meal</span>
                                <Plus size={16} className="block sm:hidden text-white"/>
                                <Plus size={20} className="hidden sm:block"/>
                            </Button>
                        </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownSection title="Add a meal">
                        <DropdownItem 
                            key="new"
                            isPressable
                            description="Create a new meal"
                            startContent={<ChefHat size={23} className="text-[#003c6e]"/>}
                            onPress={() => setIsModalOpen("new")}
                        >
                            New Meal
                        </DropdownItem>
                        <DropdownItem
                            key="existing"
                            isPressable
                            description="Select an existing one"
                            startContent={<Pizza size={23} className="text-[#003c6e]"/>}
                            onPress={() => setIsModalOpen("existing")}
                        >
                            Existing Meal
                        </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="w-full max-w-3xl flex flex-col gap-3">
                    {localMeals.map((meal, index) => (
                        <Card 
                            key={meal.id}
                            className="w-full p-3 sm:p-5"
                        >
                            <CardBody className="p-0">
                                <div className="flex flex-col sm:flex-row w-full">
                                    {/* Meal info section */}
                                    <div className="flex flex-row items-center w-full sm:w-[70%]">
                                        <img 
                                            src={meal.data.strMealThumb} 
                                            alt={meal.data.strMeal} 
                                            className="rounded-xl mr-3 w-14 h-14 sm:w-16 sm:h-16 object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <CardHeader className="p-0">
                                                <h2 className="text-base sm:text-lg text-black font-semibold truncate">{meal.data.strMeal}</h2>
                                            </CardHeader>
                                            <p className="text-gray-500 text-sm sm:text-base line-clamp-1">{
                                                meal.data.ingredients && Array.isArray(meal.data.ingredients) && meal.data.ingredients.length > 0
                                                    ? meal.data.ingredients.slice(0, 3).join(', ') + (meal.data.ingredients.length > 3 ? ", ..." : "")
                                                    : "No ingredients specified"
                                            }</p>
                                        </div>
                                    </div>
                                    
                                    {/* Controls section */}
                                    <div className="flex flex-row items-center justify-between mt-3 sm:mt-0 sm:justify-end w-full sm:w-[30%]">
                                        {/* Price */}
                                        <p className="text-base sm:text-lg font-semibold text-black">{meal.price.toFixed(2)}{meal.currency}</p>
                                        
                                        {/* Order controls and Edit*/}
                                        {isMoveable ? (
                                            <div className="flex flex-col ml-3">
                                                <Button
                                                    isIconOnly
                                                    variant="transparent"
                                                    className="h-min w-min"
                                                    onPress={() => handleMoveUp(index)}
                                                    isDisabled={index === 0}
                                                >
                                                    <MoveUp size={20} className={index === 0 ? "text-black/10" : "text-black/40 hover:text-black/70"} />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    variant="transparent"
                                                    className="h-min w-min"
                                                    onPress={() => handleMoveDown(index)}
                                                    isDisabled={index === localMeals.length - 1}
                                                >
                                                    <MoveDown size={20} className={index === localMeals.length - 1 ? "text-black/10" : "text-black/40 hover:text-black/70"} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                isIconOnly
                                                variant="trasparent"
                                                className="p-1"
                                                onPress={() => {
                                                    setSelectedMeal(findMealById(meal.id));
                                                    setIsModalOpen("edit");
                                                }}
                                            >
                                                <Edit className="text-[#003c6e]" size={22}/>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Modal per i nuovi pasti */}
            <NewMealModal
                isOpen={isModalOpen === "new"} 
                onClose={() => setIsModalOpen(null)}
                onSubmit={(newMeal) => {
                    setLocalMeals([...localMeals, newMeal]);
                    setIsModified(true);
                }}
            />

            {/* Modal per la modifica dei pasti */}
            <EditMealModal 
                isOpen={isModalOpen === "edit"} 
                onClose={() => setIsModalOpen(null)}
                mealData={selectedMeal}
                onSubmit={handleUpdateMeal}
                onDelete={handleDeleteMeal}
            />

            {/* Modal per l'aggiunta di pasti esistenti */}
            <ExistingMealModal 
                isOpen={isModalOpen === "existing"} 
                onClose={() => setIsModalOpen(null)}
            />

        </div>
    );
}