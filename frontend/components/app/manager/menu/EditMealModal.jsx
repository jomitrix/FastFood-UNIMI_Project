"use client";
import { useState, useRef, useEffect } from 'react';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Button } from '@heroui/button';
import { Plus, Upload } from '@/components/icons/heroicons';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import ConfirmDelete from '@/components/ConfirmDelete';

export default function EditMealModal({ isOpen, onClose, onSubmit, onDelete, mealData, courses = [], areas = [] }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    //const [description, setDescription] = useState('');
    const [price, setPrice] = useState(9.99);
    const [category, setCategory] = useState("Miscellaneous");
    const [area, setArea] = useState("Unknown");
    const [errors, setErrors] = useState({});
    const newIngredientInputRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [mealId, setMealId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Carica i dati del pasto quando viene aperto il modale o cambia mealData
    useEffect(() => {
        if (isOpen && mealData) {
            setMealId(mealData.id);
            setImage(mealData?.image || null);
            setName(mealData?.name || '');
            setIngredients(mealData?.ingredients || []);
            //setDescription(mealData?.description || '');
            setPrice(mealData.price || 0.49);
            setCategory(mealData?.category || "Miscellaneous");
            setArea(mealData?.area || "Unknown");
            setErrors({});
            setNewIngredient('');
        }
    }, [isOpen, mealData]);
    
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

    // Gestione submit per l'aggiornamento del pasto
    const handleSubmitEditMeal = () => {
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

        // Creazione oggetto meal aggiornato per la submission
        const updatedMeal = {
            name: name,
            image: image || "https://placehold.co/500x500?text=No+Image",
            ingredients: ingredients,
            id: mealId, 
            price: price,
            currency: "€",
            category: category,
            area: area
        };

        // Invio del pasto aggiornato al componente padre
        onSubmit(updatedMeal);
        
        // Chiusura del modale
        onClose();
    };

    // Modifica la funzione di eliminazione per aprire la modale di conferma
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };
    
    // Funzione per confermare l'eliminazione
    const confirmDelete = () => {
        if (onDelete && mealId) {
            onDelete(mealId);
            setIsDeleteModalOpen(false);
            onClose();
        }
    };
    
    // Funzione per annullare l'eliminazione
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="2xl"
                className="bg-white shadow-lg m-0"
            >
                <ModalContent className='rounded-t-xl rounded-b-none sm:rounded-b-xl'>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit meal
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            {/* Nome e Immagine del pasto */}
                            <div className="flex gap-4 items-center">
                                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border relative">
                                    {image && (
                                        <img 
                                            src={image}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    )}
                                    <Button
                                        className={`bg-[#003c6e] text-white w-full h-full flex items-center justify-center absolute top-0 left-0 rounded-xl
                                            ${image ? 'opacity-50 hover:opacity-90' : 'opacity-100'}`}
                                        isIconOnly
                                        onPress={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={24} />
                                    </Button>
                                    
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
                            {/*<div className="flex flex-col gap-1">
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
                            </div>*/}
                                
                            {/* Categoria e Area */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <Select
                                    label="Category"
                                    placeholder="Select a category"
                                    variant="faded"
                                    className="w-full"
                                    classNames={{
                                        trigger: "bg-warning-100",
                                    }}
                                    selectedKeys={[category]}
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys)[0];
                                        if (selected) setCategory(selected);
                                    }}
                                >
                                    {courses.map((course) => (
                                        <SelectItem key={course} value={course}>
                                            {course}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Area"
                                    placeholder="Select an area"
                                    variant="faded"
                                    className="w-full"
                                    classNames={{
                                        trigger: "bg-primary-100",
                                    }}
                                    selectedKeys={[area]}
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys)[0];
                                        if (selected) setArea(selected);
                                    }}
                                >
                                    {areas.map((areaItem) => (
                                        <SelectItem key={areaItem} value={areaItem}>
                                            {areaItem}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Ingredienti */}
                            <div className="flex flex-col" id="ingredients-container">
                                <p className="text-sm">Ingredients</p>
                                <div className="max-h-[8rem] sm:max-h-40 overflow-y-auto flex flex-col">
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
                                                    <Plus className="rotate-[45deg]" size={24} />
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
                                        if (numValue < 0.49) {
                                            numValue = 0.49; // Imposta il prezzo minimo a 0.49
                                        }
                                        setPrice(numValue);
                                        if (errors.price) {
                                            setErrors({...errors, price: undefined});
                                        }
                                    }}
                                    isInvalid={!!errors.price}
                                    errorMessage={errors.price}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button 
                            className="bg-danger text-white" 
                            onPress={handleDeleteClick}
                        >
                            Delete
                        </Button>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-[#003c6e] text-white"
                                onPress={handleSubmitEditMeal}
                            >
                                Save
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
            {/* Modale di conferma per l'eliminazione */}
            <ConfirmDelete
                type="this meal"
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                onDelete={confirmDelete}
                onClose={cancelDelete}
            />
        </>
    );
}
