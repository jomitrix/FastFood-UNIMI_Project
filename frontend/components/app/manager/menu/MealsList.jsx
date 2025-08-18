'use client';
import { useState, useEffect, use } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Draggable, MoveUp, MoveDown, Edit, Plus, ChefHat, Pizza,
         ForkKnife, Flag, ExclShield
 } from "@/components/icons/heroicons";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import NewMealModal from "./NewMealModal";
import ExistingMealModal from "./ExistingMealModal";
import EditMealModal from "./EditMealModal";
import { areas, courses, allergens } from "@/utils/lists";
import { Spinner } from "@heroui/spinner";

export default function MealsList({ meals, searchMeals, onMealsReorder, restaurantId, lastElementRef, isLoadingMore }) {
    const [isMoveable, setIsMoveable] = useState(false);
    const [localMeals, setLocalMeals] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [newMealInitialData, setNewMealInitialData] = useState(null);
    const [mealFormData, setMealFormData] = useState({});
    const [queryResult, setQueryResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLocalMeals(meals);
        setIsModified(false);
    }, [meals]);

    useEffect(() => {
        if (isModalOpen) {
            setIsMoveable(false);
        }
        setIsMoveable(false);
    }, [isModalOpen]);
    
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

    
    const handleAddMeal = (meal, fromExisting = false) => {
        if (fromExisting) {
            setNewMealInitialData(meal);
            setIsModalOpen("new");
            return;
        }

        const newMeals = [...localMeals, meal];
        setLocalMeals(newMeals);
        setIsModalOpen(null);
    };
    
    const findMealById = (id) => {
        return localMeals.find(meal => meal._id === id);
    };
    
    const handleUpdateMeal = (updatedMeal) => {
        const updatedMeals = localMeals.map(meal => 
            meal._id === updatedMeal._id ? updatedMeal : meal
        );
        
        setLocalMeals(updatedMeals);
    };
    

    const handleDeleteMeal = (mealId) => {
        const updatedMeals = localMeals.filter(meal => meal._id !== mealId);
        setLocalMeals(updatedMeals);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setQueryResult([]);
        } else {
            const filtered = searchMeals.filter(meal => 
                meal.strMeal.toLowerCase().includes(query.toLowerCase())
            );
            setQueryResult(filtered);
        }
    };

    const formattedCourses = courses.map(course => ({
        value: course.name,
        label: course.name
    }));

    return (
        <div className="w-full mt-0 flex flex-col items-center justify-center w-full h-full">
            {/* Meals List */}
            <div className="w-full max-w-3xl flex flex-col">
                <div className="flex justify-end items-center mb-4 gap-2">
                    <div className="flex gap-2">
                        {/*<Button
                            className="text-sm sm:text-base"
                            size="sm"
                            onPress={() => setIsMoveable(!isMoveable)}
                            isDisabled={localMeals.length === 0}
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
                        </Button>*/}
                    </div>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button
                                variant="flat"
                                className="bg-[#083d77] text-white text-sm sm:text-base"
                                size="sm"
                            >
                                <span className="inline">Add a Dish</span>
                                <Plus size={16} className="block sm:hidden text-white"/>
                                <Plus size={20} className="hidden sm:block"/>
                            </Button>
                        </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownSection title="Add a dish">
                        <DropdownItem 
                            key="new"
                            isPressable
                            description="Create a new dish"
                            startContent={<ChefHat size={23} className="text-[#083d77]"/>}
                            onPress={() => setIsModalOpen("new")}
                        >
                            New Dish
                        </DropdownItem>
                        <DropdownItem
                            key="existing"
                            isPressable
                            description="Select an existing one"
                            startContent={<Pizza size={23} className="text-[#083d77]"/>}
                            onPress={() => setIsModalOpen("existing")}
                        >
                            Existing Dish
                        </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="w-full max-w-3xl flex flex-col gap-3">
                    {localMeals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-gray-200">
                            <ForkKnife size={40} className="text-gray-300 mb-3" />
                            <h3 className="text-xl font-medium text-gray-700">Your menu is empty</h3>
                            <p className="text-gray-500 mt-1">Add dishes using the "Add a Dish" button above</p>
                        </div>
                    ) : (
                        localMeals.map((meal, index) => (
                            <Card 
                                key={meal._id}
                                className="w-full p-3 sm:p-5"
                                ref={index === localMeals.length - 1 ? lastElementRef : null}
                            >
                                <CardBody className="p-0">
                                    <div className="flex flex-col sm:flex-row w-full">
                                        {/* Meal info section */}
                                        <div className="flex flex-row items-center w-full sm:w-[70%]">
                                            <div className="relative mr-3 w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                                                <Skeleton className="absolute w-full h-full rounded-xl" />
                                                <img 
                                                    // className="absolute w-full h-full rounded-xl object-cover"
                                                    className="absolute w-full h-full rounded-xl bg-white object-cover"
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${meal.image}`}
                                                />
                                            </div>
                                            <div className="flex flex-col h-full justify-around min-w-0">
                                                <CardHeader className="p-0">
                                                    <h2 className="text-base sm:text-lg text-black font-semibold truncate"><span className="font-normal">{index+1}. </span>{meal.name}</h2>
                                                </CardHeader>
                                                <div className="flex flex-wrap gap-1">
                                                    <Chip
                                                        color="warning"
                                                        className="pl-2"
                                                        classNames={{ content: "text-xs" }}
                                                        startContent={<ForkKnife size={14} className="mr-0.5" />}
                                                        variant="flat"
                                                        size="sm"
                                                        >
                                                            {meal.category}
                                                    </Chip>
                                                    <Chip
                                                        color="primary"
                                                        className="pl-2"
                                                        classNames={{ content: "text-xs" }}
                                                        startContent={<Flag size={14} className="mr-0.5" />}
                                                        variant="flat"
                                                        size="sm"
                                                        >
                                                            {meal.area}
                                                    </Chip>
                                                    { meal.allergens && meal.allergens.length > 0 && (
                                                        <Chip
                                                        color="danger"
                                                        classNames={{ content: "text-xs" }}
                                                        startContent={<ExclShield size={14} className="ml-[0.375rem]"/>}
                                                        variant="flat"
                                                        size="sm"
                                                        />
                                                    )}
                                                </div>
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
                                                    variant="transparent"
                                                    className="p-1"
                                                    onPress={() => {
                                                        setSelectedMeal(findMealById(meal._id));
                                                        setIsModalOpen("edit");
                                                    }}
                                                >
                                                    <Edit className="text-[#083d77]" size={22}/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                    {localMeals.length > 0 && isLoadingMore && (
                        <div className="w-full flex justify-center py-3">
                            <Spinner 
                                variant="dots"
                                classNames={{
                                    dots: 'bg-[#083d77]',
                                }} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal per i nuovi pasti */}
            <NewMealModal
                isOpen={isModalOpen === "new"} 
                onClose={() => {
                    setIsModalOpen(null);
                    setNewMealInitialData(null);
                }}
                onSubmit={(newMeal) => handleAddMeal(newMeal)}
                courses={formattedCourses}
                areas={areas}
                allergens={allergens}
                restaurantId={restaurantId}
                initialData={newMealInitialData}
            />

            {/* Modal per la modifica dei pasti */}
            <EditMealModal 
                isOpen={isModalOpen === "edit"} 
                onClose={() => setIsModalOpen(null)}
                mealData={selectedMeal}
                onSubmit={handleUpdateMeal}
                onDelete={handleDeleteMeal}
                courses={formattedCourses}
                areas={areas}
                allergens={allergens}
                restaurantId={restaurantId}
            />

            {/* Modal per l'aggiunta di pasti esistenti */}
            <ExistingMealModal 
                isOpen={isModalOpen === "existing"} 
                onClose={() => setIsModalOpen(null)}
                searchMeals={searchMeals}
                queryResult={queryResult}
                setQueryResult={setQueryResult}
                onSearch={handleSearch}
                onAddMeal={(selectedMeal) => handleAddMeal(selectedMeal, true)}
            />

            {/* Pulsanti fissi in fondo alla pagina */}
            {isModified && (
                <div className="fixed bottom-[4.5rem] sm:bottom-5 right-4 xl:right-auto sm:max-w-3xl sm:w-full sm:flex sm:justify-end z-50">
                    <div className="flex gap-2 justify-between rounded-lg">
                        <Button
                            className="text-sm sm:text-base bg-gray-200 text-black"
                            size="lg"
                            onPress={() => {
                                setLocalMeals(meals);
                                setIsModified(false);
                                setIsMoveable(false);
                            }}
                        >
                            Undo All
                        </Button>
                        <Button
                            className="text-sm sm:text-base bg-green-600 text-white"
                            size="lg"
                            onPress={handleUpdate}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}