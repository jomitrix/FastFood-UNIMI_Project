"use client";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input"

export default function ExistingModal({ isOpen, onClose }) {
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
                            variant="bordered"
                        />
                        <div className="max-h-60 overflow-y-auto flex flex-col gap-2 mt-2">
                            <p className="text-gray-500 text-sm text-center">
                                No results. Start typing to search.
                            </p>
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
                        onPress={() => alert("Mock")}
                    >
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}