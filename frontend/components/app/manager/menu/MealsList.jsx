'use client';
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Draggable, MoveUp, MoveDown, Edit, Plus } from "@/components/icons/heroicons";
import { Input } from "@heroui/input";

export default function MealsList({ meals, searchMeals, setIsModalOpen, setMealModalId, onMealsReorder }) {
    const [isMoveable, setIsMoveable] = useState(false);
    const [localMeals, setLocalMeals] = useState([]);
    const [queryResult, setQueryResult] = useState([]);
    const [isModified, setIsModified] = useState(false);
    
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
            <div className="w-full max-w-3xl flex flex-col px-4 sm:px-0">
                <div className="flex justify-between items-center mb-4 px-1">
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
                    <Button
                        isIconOnly
                        className="bg-[#003c6e] text-white"
                        size="sm"
                    >
                        <Plus size={16} className="block sm:hidden text-white"/>
                        <Plus size={20} className="hidden sm:block"/>
                    </Button>
                </div>
                <div className="w-full max-w-3xl flex flex-col gap-3">
                    {localMeals.map((meal, index) => (
                        <Card 
                            key={meal.data.idMeal}
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
                                                meal.data.ingredients.slice(0, 3).join(', ') +
                                                (meal.data.ingredients.length > 3 ? ", ..." : "")
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
                                                onPress={() => alert("Mock: Edit Meal")/*() => {setIsModalOpen(true), setMealModalId(meal.data.id)}*/}
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
        </div>
    );
}