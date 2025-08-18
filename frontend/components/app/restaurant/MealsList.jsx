'use client';
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { ForkKnife, Flag, ExclShield, Plus } from "@/components/icons/heroicons";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

const MealItem = ({ meal, setIsModalOpen, setProductId, isLastElement, lastElementRef }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <Card 
            className="w-full p-3 sm:p-5"
            ref={isLastElement ? lastElementRef : null}
        >
            <CardBody className="p-0">
                <div className="flex flex-col sm:flex-row w-full">
                    {/* Meal info section */}
                    <div className="flex flex-row items-center w-full sm:w-[70%]">
                        <div className="relative mr-3 w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-200 rounded-xl">
                            {!isImageLoaded && <Skeleton className="absolute w-full h-full rounded-xl" />}
                            <img 
                                src={process.env.NEXT_PUBLIC_API_URL + meal.image}
                                alt={meal.name}
                                className={`w-full h-full rounded-xl bg-white object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </div>
                        <div className="flex flex-col h-full justify-around min-w-0">
                            <CardHeader className="p-0">
                                <h2 className="text-base sm:text-lg text-black font-semibold truncate">{meal.name}</h2>
                            </CardHeader>
                            <div className="flex flex-col flex-wrap gap-1">
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
                                </div>
                                { meal.allergens && meal.allergens.length > 0 && (
                                    <Chip
                                        color="danger"
                                        classNames={{ content: "text-xs p-[4px] whitespace-normal" }}
                                        startContent={<ExclShield size={14} className="ml-[0.375rem]"/>}
                                        variant="flat"
                                        size="sm"
                                        className="h-auto"
                                    >
                                        <b className="mr-1">Allergens:</b><span className="break-words">{meal.allergens.join(", ")}</span>
                                    </Chip> 
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Price section */}
                    <div className="flex items-center justify-end gap-3 w-full sm:w-[30%] mt-4 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <p className="text-lg font-semibold text-black">{meal.price.toFixed(2)}{meal.currency}</p>
                        <Button
                            isIconOnly
                            className="bg-[#083d77]"
                            radius="full"
                            size="sm"
                            onPress={() => {setIsModalOpen("product"); setProductId(meal._id);}}
                        >
                            <Plus size={18} className="text-white"/>
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default function ReadOnlyMealsList({ title, meals, setIsModalOpen, setProductId, lastElementRef, isLoadingMore }) {
    const [localMeals, setLocalMeals] = useState([]);

    useEffect(() => {
        setLocalMeals(meals);
    }, [meals]);

    return (
        <div className="w-full flex flex-col gap-3">
            <h1 className="font-bold text-2xl">{title}</h1>
            {localMeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-gray-200">
                    <ForkKnife size={40} className="text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700">No dishes found</h3>
                    <p className="text-gray-500 mt-1">This restaurant hasn't added any dishes yet.</p>
                </div>
            ) : (
                <>
                    {localMeals.map((meal, index) => (
                        <MealItem 
                            key={meal._id}
                            meal={meal}
                            setIsModalOpen={setIsModalOpen}
                            setProductId={setProductId}
                            isLastElement={index === localMeals.length - 1}
                            lastElementRef={lastElementRef}
                        />
                    ))}
                    {isLoadingMore && (
                        <div className="flex justify-center py-4">
                            <Spinner className='w-100 h-100' variant="dots" classNames={{
                                dots: 'bg-[#083d77]',
                            }} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
