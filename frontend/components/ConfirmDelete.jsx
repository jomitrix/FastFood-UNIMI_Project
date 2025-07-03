"use client";
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Delete } from "@/components/icons/heroicons";

export default function ConfirmDelete({ type, isModalOpen, setIsModalOpen, onDelete }) {
    const formattedType = type ? ` ${type}` : '';
    
    const cancelDelete = () => {
        setIsModalOpen(false);
    };
    const confirmDelete = () => {
        onDelete();
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={cancelDelete}
            placement='center'
            size="sm"
            className="bg-white shadow-xl"
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                        duration: 0.3,
                        ease: "easeOut"
                        }
                    },
                    
                    exit: {
                        y: 20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn"
                        }
                    }
                }
            }}
        >
            <ModalContent className="rounded-xl p-4">
                <div className="flex flex-col items-center pt-4">
                    <ModalHeader className="flex flex-col gap-1 justify-center items-center py-0">
                        <div className="bg-red-50 p-2 rounded-full mb-2 w-min">
                            <Delete className="h-8 w-8 text-danger flex-shrink-0" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Confirm Deletion</h3>
                    </ModalHeader>
                </div>
                <ModalBody>
                    <p className="text-center text-md text-gray-600">
                        Are you sure you want to delete {formattedType}? <b>This action cannot be undone.</b>
                    </p>
                </ModalBody>
                <ModalFooter className="flex flex-col w-full gap-2 px-6 pb-6 pt-2">
                    <Button 
                        className="bg-danger text-white w-full font-medium shadow-sm hover:shadow-md transition-shadow"
                        onPress={confirmDelete}
                    >
                        Delete
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full text-gray-700 font-medium"
                        onPress={cancelDelete}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )}