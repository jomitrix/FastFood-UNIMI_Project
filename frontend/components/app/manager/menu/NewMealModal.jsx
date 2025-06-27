"use client";
import { useState, useRef, useEffect } from 'react';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Button } from '@heroui/button';
import { Plus, Upload } from '@/components/icons/heroicons';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";

export default function NewMealModal({ isOpen, onClose, onSubmit }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(9.99);
    const [errors, setErrors] = useState({});
    const newIngredientInputRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Reset form when modal is opened
    useEffect(() => {
        if (isOpen) {
            setImage(null);
            setName('');
            setIngredients([]);
            setNewIngredient('');
            setDescription('');
            setPrice(9.99);
            setErrors({});
        }
    }, [isOpen]);
    
    const handleImageUpload = (e) => {
        // Mock 
    };

    const addIngredient = () => {
        const trimmedIngredient = newIngredient.trim();
        if (trimmedIngredient !== '') {
            // (case insensitive)
            const exists = ingredients.some(
                ing => ing.toLowerCase() === trimmedIngredient.toLowerCase()
            );
            
            if (!exists) {
                setIngredients([...ingredients, trimmedIngredient]);
                setNewIngredient('');
                // Il focus torna al campo di input
                if (newIngredientInputRef.current) {
                    newIngredientInputRef.current.focus();
                }
            }
        }
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    // Aggiungere ingredienti anche con Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addIngredient();
        }
    };

    // Scorrein basso quando cambiano gli ingredienti (focus sull'ultimo ingrediente)
    useEffect(() => {
        if (scrollContainerRef.current && ingredients.length > 0) {
            const scrollElement = scrollContainerRef.current;
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [ingredients]);

    // Gestione submit
    const handleSubmitNewMeal = () => {
        // Reset errors
        setErrors({});
        
        // Validazione solo per name e price
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Meal name is required";
        if (!price) newErrors.price = "Meal price is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Creazione oggetto meal per la submission
        const newMeal = {
            data: {
                strMeal: name,
                strMealThumb: image || "https://placehold.co/500x500?text=No+Image",
                ingredients: ingredients,
            },
            id: Date.now().toString(), 
            price: price,
            currency: "€"
        };

        // Invio del nuovo pasto al componente padre
        onSubmit(newMeal);
        
        // Chiusura del modale
        onClose();
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
                    Create new meal
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        {/* Nome e Immagine del pasto */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border">
                                { image ? (
                                    <img 
                                        src={image}
                                        alt="Meal"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <Button
                                        className="bg-[#003c6e] text-white w-full h-full flex items-center justify-center"
                                        isIconOnly
                                        onPress={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={24} />
                                    </Button>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div className="w-full h-full">
                                <Input
                                    label={
                                        <span>
                                            Meal Name
                                            <span className="text-danger ml-1">*</span>
                                        </span>
                                    }
                                    className="h-full w-full"
                                    placeholder="Insert meal name"
                                    labelPlacement="outside"
                                    variant="faded"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) {
                                            setErrors({...errors, name: undefined});
                                        }
                                    }}
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name}
                                />
                            </div>
                        </div>

                        {/* Descrizione */}
                        <div className="flex flex-col gap-1">
                            <Textarea
                                label="Description"
                                labelPlacement="outside"
                                maxLength={200}
                                placeholder="Brief description of the meal"
                                variant="faded"
                                className="transition-height duration-200 ease-in-out"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxRows={3}
                            />
                            <div className="flex justify-end text-xs text-gray-500">
                                {description.length}/200
                            </div>
                        </div>
                            
                        {/* Ingredienti */}
                        <div className="flex flex-col -mt-6" id="ingredients-container">
                            <p className="text-sm">Ingredients</p>
                            <div className="max-h-40 overflow-y-auto flex flex-col">
                                {ingredients.length > 0 ? (
                                    <ScrollShadow 
                                        ref={scrollContainerRef} 
                                        size={30} 
                                        hideScrollBar 
                                        className='gap-2'
                                    >
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index} className="w-full flex gap-2 items-end justify-center mt-2">
                                            <Input
                                                placeholder="Ingredient"
                                                className="flex-grow"
                                                variant="faded"
                                                value={ingredient}
                                                onChange={(e) => {
                                                    const updatedIngredients = [...ingredients];
                                                    updatedIngredients[index] = e.target.value;
                                                    setIngredients(updatedIngredients);
                                                }}
                                            />
                                            <Button 
                                                isIconOnly 
                                                isPressable
                                                className="bg-red-500 text-white" 
                                                size="md"
                                                onPress={() => removeIngredient(index)}
                                            >
                                                <Plus className="rotate-[45deg]" size={20} />
                                            </Button>
                                        </div>
                                    ))}
                                    </ScrollShadow>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="flex gap-2 items-end justify-center mt-2">
                                <Input
                                    placeholder="Add new ingredient"
                                    className="flex-grow"
                                    variant="faded"
                                    value={newIngredient}
                                    onChange={(e) => setNewIngredient(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    ref={newIngredientInputRef}
                                />
                                <Button 
                                    isIconOnly 
                                    isPressable
                                    className="bg-[#003c6e] text-white" 
                                    size="md"
                                    onPress={addIngredient}
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>
                        </div>
                            
                        {/* Prezzo */}
                        <div className="flex gap-4 items-center">
                            <NumberInput
                                minValue={0.49}
                                maxValue={1000.00}
                                step={0.01}
                                decimalScale={2}
                                label={
                                    <span>
                                        Price
                                        <span className="text-danger ml-1">*</span>
                                    </span>
                                }
                                labelPlacement="outside"
                                placeholder="0.00"
                                variant="faded"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">€</span>
                                    </div>
                                }
                                className="flex-grow"
                                value={price}
                                onChange={(value) => {
                                    let numValue = typeof value === 'string' ? parseFloat(value) : value;
                                    numValue = isNaN(numValue) ? 0.49 : numValue;
                                    // Applica il valore minimo immediatamente
                                    if (numValue < 0.49) {
                                        numValue = 0.49;
                                    }
                                    setPrice(numValue);
                                    if (errors.price) {
                                        setErrors({...errors, price: undefined});
                                    }
                                }}
                                onBlur={() => {
                                    // Doppio controllo quando l'utente esce dal campo
                                    if (price < 0.49) {
                                        setPrice(0.49);
                                    }
                                }}
                                isInvalid={!!errors.price}
                                errorMessage={errors.price}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        variant="ghost" 
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="bg-[#003c6e] text-white"
                        onPress={handleSubmitNewMeal}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
