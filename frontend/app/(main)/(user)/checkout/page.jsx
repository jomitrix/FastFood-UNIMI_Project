'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import AccountHeader from "@/components/app/account/AccountHeader";
import { Profile, MapPin, Time, Notes, CreditCard, ChevronRight, Cash, } from "@/components/icons/heroicons";
import { Button } from "@heroui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { Textarea } from "@heroui/input";
import { useCart } from '@/contexts/CartContext';
import { UserService } from '@/services/userService';
import { RestaurantService } from "@/services/restaurantService";
import { addToast } from "@heroui/toast";
import { getRouteDistance } from '@/utils/getRouteDistance';

export default function Checkout() {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, setCart } = useCart();

    useEffect(() => {
        if (!cart.restaurant || !cart.items || cart.items.length === 0) {
            return router.push('/');
        }
    }, [cart, router]);

    const validatePhone = (phone) => phone.match(/^\+(?:[0-9] ?){6,14}[0-9]$/);
    const validateCardNumber = (num) => num.replace(/\s/g, '').match(/^\d{16}$/);
    const validateCardExpiry = (exp) => exp.match(/^(0[1-9]|1[0-2])\/\d{2}$/);

    const isExpiryDateValid = (expiry) => {
        if (!validateCardExpiry(expiry)) return false;

        const [month, year] = expiry.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month), 0);
        const today = new Date();

        return expiryDate >= today;
    };

    const [name, setName] = useState(user?.name);
    const [surname, setSurname] = useState(user?.surname);
    const [phone, setPhone] = useState(user?.phoneNumber);
    const [tempName, setTempName] = useState("");
    const [tempSurname, setTempSurname] = useState("");
    const [tempPhone, setTempPhone] = useState("");
    const [infoErrors, setInfoErrors] = useState({});

    const [address, setAddress] = useState(cart.deliveryAddress);
    const [filteredAddresses, setFilteredAddresses] = useState([]);
    const [addresses, setAddresses] = useState(user.delivery);
    const [selectedAddress, setSelectedAddress] = useState(cart.deliveryAddress?.address);
    const [newAddress, setNewAddress] = useState("");
    const [newAddressError, setNewAddressError] = useState("");
    const [notes, setNotes] = useState("");
    const [tempNotes, setTempNotes] = useState("");
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState({
        min: 0,
        max: 0
    });

    // Payment data
    const [paymentMethod, setPaymentMethod] = useState(null); // 'cash'  'card'
    const [paymentCards, setPaymentCards] = useState(user.cards);
    const [selectedCardId, setSelectedCardId] = useState(user.cards.length > 0 ? user.cards[0]._id : null);
    const [newCard, setNewCard] = useState({ name: "", holder: "", number: "", expiry: "", cvv: "" });
    const [newCardErrors, setNewCardErrors] = useState({});
    const [tempPaymentMethod, setTempPaymentMethod] = useState('cash');
    const [tempSelectedCardId, setTempSelectedCardId] = useState(null);

    const [orderType, setOrderType] = useState(cart.orderType);
    const [isModalOpen, setIsModalOpen] = useState(null);

    const [fee, setFee] = useState(0);
    const [queueTime, setQueueTime] = useState(0);

    const extractId = id =>
        typeof id === 'string'
            ? id
            : id?.$oid;

    const getSelectedCard = () => {
        if (paymentMethod !== 'card' || !selectedCardId) return null;
        return paymentCards.find(c => extractId(c._id) === selectedCardId);
    }

    //  campi obbligatori
    const infoMissing = !(name && surname && phone);
    const addressMissing = orderType === "delivery" ? !address : false;
    const paymentMissing = !paymentMethod || (paymentMethod === 'card'
        ? !getSelectedCard()
        : false);

    const isCheckoutDisabled = infoMissing || addressMissing || paymentMissing;

    const getQueueTime = async () => {
        const data = await RestaurantService.getQueue(cart.restaurant?._id);
        if (!data || data.status !== "success") {
            return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
        }
        const time = Math.ceil(data.queueCount / 60) || 0;
        setQueueTime(time);
    };

    useEffect(() => {
        getQueueTime();
    }, [cart.restaurant?._id]);

    useEffect(() => {
        if (user?.cards?.length) {
            setPaymentCards(user?.cards);
            if (!selectedCardId) {
                const firstId = typeof user?.cards[0]._id === 'string'
                    ? user?.cards[0]._id
                    : user?.cards[0]._id.$oid;
                setSelectedCardId(firstId);
            }
        }
    }, [user?.cards]);

    useEffect(() => {
        if (!address) return;

        const addressParts = address.address.split(',');
        setFilteredAddresses([addressParts[0], addressParts.slice(1).join(',')]);
        getFee();
    }, [address]);

    const getFee = async () => {
        const data = await RestaurantService.getFee(cart.restaurant?._id, address?._id);
        if (!data || data.status !== "success") {
            return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
        }
        setFee(data.fee);
    };

    useEffect(() => {
        if (!cart.restaurant?.position || !address) return;
        async function calculateDeliveryTime() {
            const time = await getRouteDistance({ lng: cart.restaurant?.position.geopoint.coordinates[0], lat: cart.restaurant?.position.geopoint.coordinates[1] }, address);
            const deliveryDistance = Math.ceil(time / 60);
            setEstimatedDeliveryTime({
                min: deliveryDistance >= 20 ? deliveryDistance - 10 : deliveryDistance,
                max: deliveryDistance + 10
            });
        }

        calculateDeliveryTime();
    }, [cart.restaurant?.position, address]);

    const cards = [
        { key: "info", title: `${name || "Name"} ${surname || "Surname"}`, subtitle: phone || "Phone Number", icon: <Profile />, missing: infoMissing },
        ...(orderType === "delivery" ? [
            { key: "address", title: filteredAddresses[0], subtitle: filteredAddresses[1], icon: <MapPin />, missing: addressMissing }
        ] : []),
        {
            key: "time", title: orderType === "delivery" ? "Delivery Time" : "Takeaway Time",
            subtitle: orderType === "delivery" ? `${estimatedDeliveryTime.min + queueTime} - ${estimatedDeliveryTime.max + queueTime} min` : queueTime > 0 ? `${queueTime} min` : `ASAP`, icon: <Time />, missing: false
        },
        { key: "notes", title: "Additional Notes", subtitle: notes || "Add a note for your order", icon: <Notes />, missing: false },
    ]

    const handleAddressSave = () => {
        if (selectedAddress === "new_address") {
            if (newAddress) {
                const addressRegex = /^(?=.{15,200}$)([\p{L}0-9.'’\-/ ]+),\s*([\p{L} \-']{2,}),\s*([0-9A-Za-z\- ]{4,12}),\s*([\p{L} \-']{3,})$/u;
                if (!addressRegex.test(newAddress)) {
                    setNewAddressError("Format: Road, City, ZIP, Province");
                    return;
                }
                const newAddr = { id: addresses.length + 1, address: newAddress };
                setAddresses([...addresses, newAddr]);
                setAddress(newAddr);
                setSelectedAddress(newAddress);
                setNewAddress("");
                setNewAddressError("");
            } else {
                setNewAddressError("Address cannot be empty.");
                return;
            }
        } else {
            const fullAddress = addresses.find(a => a.address === selectedAddress);
            setAddress(fullAddress);
        }
        setIsModalOpen(null);
    };

    const handleNotesSave = () => {
        setNotes(tempNotes);
        setIsModalOpen(null);
    };

    const handleInfoSave = () => {
        const errors = {};
        if (!tempName) errors.name = "Name is required.";
        if (!tempSurname) errors.surname = "Surname is required.";
        if (!tempPhone) {
            errors.phone = "Phone number is required.";
        } else if (!validatePhone(tempPhone)) {
            errors.phone = "Invalid phone number format";
        }

        if (Object.keys(errors).length > 0) {
            setInfoErrors(errors);
            return;
        }

        setName(tempName);
        setSurname(tempSurname);
        setPhone(tempPhone);
        setIsModalOpen(null);
        setInfoErrors({});
    };

    const handlePaymentSave = async () => {
        if (tempPaymentMethod === "card") {
            let nextSelected = tempSelectedCardId;
            if (tempSelectedCardId === 'new_card') {
                const errors = {};
                if (!newCard.name) errors.name = "Card name is required.";
                if (!newCard.holder) errors.holder = "Card holder name is required.";
                if (!newCard.number) {
                    errors.number = "Card number is required.";
                } else if (!validateCardNumber(newCard.number)) {
                    errors.number = "Invalid card number format.";
                }
                if (!newCard.expiry) {
                    errors.expiry = "Expiry date is required.";
                } else if (!isExpiryDateValid(newCard.expiry)) {
                    errors.expiry = "Invalid or expired date.";
                }
                if (!newCard.cvv) errors.cvv = "CVV is required.";

                if (Object.keys(errors).length > 0) {
                    setNewCardErrors(errors);
                    return;
                }

                const data = await UserService.editCards(
                    newCard.name,
                    newCard.holder,
                    newCard.number,
                    newCard.expiry,
                    newCard.cvv
                );

                if (!data || data.status !== "success") {
                    return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
                }

                setPaymentCards(data.cards);
                nextSelected = data.cards[data.cards.length - 1]._id;
                setNewCard({ name: "", holder: "", number: "", expiry: "", cvv: "" });
                setNewCardErrors({});
            }
            setSelectedCardId(nextSelected);
        }
        setPaymentMethod(tempPaymentMethod);
        setIsModalOpen(null);
    };

    const openModal = (modalKey) => {
        if (modalKey === 'notes') {
            setTempNotes(notes);
        }
        if (modalKey === 'info') {
            setTempName(name);
            setTempSurname(surname);
            setTempPhone(phone);
            setInfoErrors({});
        }
        if (modalKey === 'payment') {
            setTempPaymentMethod(paymentMethod);
            setTempSelectedCardId(selectedCardId);
            setNewCardErrors({});
        }
        if (modalKey === 'address') {
            setSelectedAddress(address?.address);
        }
        if (modalKey === 'address' && orderType !== 'delivery') {
            return;
        }
        setIsModalOpen(modalKey);
    }

    const getCardKey = (card, idx) =>
        typeof card._id === 'string'
            ? card._id
            : card._id?.$oid ?? String(idx);

    const handleCheckout = async () => {
        const orderData = {
            restaurantId: cart.restaurant?._id,
            orderType: cart.orderType,
            meals: cart.items.map(item => ({ meal: item._id, quantity: item.quantity })),
            deliveryAddress: orderType === "delivery" ? address._id : null,
            paymentMethod,
            specialInstructions: notes || "",
            phoneNumber: phone
        };

        const data = await RestaurantService.checkout(orderData.restaurantId, orderData.orderType, orderData.meals, orderData.deliveryAddress, orderData.paymentMethod, orderData.specialInstructions, orderData.phoneNumber);

        if (!data || data.status !== "success") {
            return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
        }

        setCart({ ...cart, items: [], orderType: 'takeaway', deliveryAddress: null });
        router.push(`/orders`);
    }

    if (!cart.restaurant || !cart.items || cart.items.length === 0) {
        return null; 
    }

    return (
        <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
            <AccountHeader
                title="Order Checkout"
                subtitle="Complete your order"
            />
            <div className={`w-full flex flex-wrap sm:flex-nowrap justify-center ${cart.orderType === "delivery" ? "items-stretch" : "items-start"} mt-8 px-3 gap-4`}>
                <div className="flex flex-col flex-1 max-w-3xl gap-4">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-bold">Order Details</h2>
                        </CardHeader>
                        <CardBody>
                            {cards.map((card) => (
                                <Card
                                    key={card.key}
                                    className={`mx-3 border-b rounded-md ${card.key !== "time" && "hover:bg-gray-100"} shadow-none last:border-b-0 ${card.missing ? "bg-red-50" : ""}`}
                                    onPress={() => openModal(card.key)}
                                    isPressable={card.key !== "time"}
                                >
                                    <CardBody className="flex flex-row items-center gap-4">
                                        {card.icon && (
                                            <div className="flex-shrink-0 text-[#083d77]">
                                                {card.icon}
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <h3 className="text-md font-medium">{card.title}</h3>
                                            <p className="text-sm text-gray-600 truncate">{card.subtitle}</p>
                                        </div>
                                        {card.key !== "time" && <ChevronRight className="text-gray-400 ml-auto" />}
                                    </CardBody>
                                </Card>
                            ))}
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-bold">Payment</h2>
                        </CardHeader>
                        <CardBody>
                            <Card
                                className={`mx-3 border-b rounded-md hover:bg-gray-100 shadow-none last:border-b-0 ${paymentMissing ? "bg-red-50" : ""}`}
                                onPress={() => setIsModalOpen("payment")}
                                isPressable
                            >
                                <CardBody className="flex flex-row items-center gap-4">
                                    <div className="flex-shrink-0 text-[#083d77]">
                                        {paymentMethod === 'cash' ? <Cash /> : <CreditCard />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="text-md font-medium">
                                            {!paymentMethod && "Select Payment Method"}
                                            {paymentMethod === 'cash' && "Cash"}
                                            {paymentMethod === 'card' && getSelectedCard() && `${getSelectedCard().name} **** ${getSelectedCard().number.slice(-4)}`}
                                            {paymentMethod === 'card' && !getSelectedCard() && "Choose Credit Card"}
                                        </h3>
                                        {paymentMethod === 'cash' && <p className="text-sm text-gray-600">Pay with cash</p>}
                                    </div>
                                    <ChevronRight className="text-gray-400 ml-auto" />
                                </CardBody>
                            </Card>
                        </CardBody>
                    </Card>
                </div>
                <div className="flex flex-col flex-1 max-w-md">
                    <Card className="h-full">
                        <CardHeader>
                            <h2 className="text-xl font-bold">Summary</h2>
                        </CardHeader>
                        <CardBody>
                            <div className="border-t p-4">
                                {/* Informazioni sul ristorante */}
                                <div className="mb-4 pb-3 border-b flex items-center gap-5">
                                    <img
                                        src={process.env.NEXT_PUBLIC_API_URL + cart.restaurant.logo}
                                        alt={cart.restaurant.name}
                                        className="w-12 h-12 object-contain rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{cart.restaurant.name}</h3>
                                        <p className="text-sm text-gray-600">{cart.restaurant.position.address}</p>
                                    </div>
                                </div>

                                {/* Card cliccabile per gli order items */}
                                <div className={`w-full mb-4 ${cart.orderType === "delivery" ? "border-b pb-3" : ""}`}>
                                    <Card
                                        className={`w-full rounded-md hover:bg-gray-100 shadow-none`}
                                        isPressable
                                        onPress={() => setIsModalOpen("items")}
                                    >
                                        <CardBody className="flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-[#083d77]">
                                                    <img />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Order items</h4>
                                                    <p className="text-sm text-gray-600">{cart.items.length} items</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-gray-400" />
                                        </CardBody>
                                    </Card>
                                </div>

                                <div className="flex flex-col gap-2 mb-4">
                                    {orderType === 'delivery' && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span>{cart.items.reduce(
                                                    (sum, item) => sum + item.price * item.quantity,
                                                    0
                                                ).toFixed(2)}€</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Delivery fee</span>
                                                <span>{fee.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>Estimated delivery time</span>
                                                <span>{estimatedDeliveryTime.min} - {estimatedDeliveryTime.max} min</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-between pt-2 border-t mt-1">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold text-lg">
                                            {(cart.items.reduce(
                                                (sum, item) => sum + item.price * item.quantity,
                                                0
                                            ) + (orderType == 'delivery' ? fee : 0)).toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className={`
                                        w-full py-3 rounded-xl font-medium
                                        ${isCheckoutDisabled
                                            ? "cursor-not-allowed"
                                            : "bg-[#083d77] text-white hover:bg-[#062f5c]"}
                                    `}
                                    onPress={handleCheckout}
                                    size='lg'
                                    isDisabled={isCheckoutDisabled}
                                >
                                    {paymentMethod === 'cash' ? <Cash /> : <CreditCard />}
                                    Pay
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Modale per la selezione dell'indirizzo */}
            <Modal
                isOpen={isModalOpen === "address"}
                onClose={() => setIsModalOpen(null)}
            >
                <ModalContent className="m-0 rounded-b-none sm:rounded-lg">
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Select Delivery Address</h2>
                    </ModalHeader>
                    <ModalBody>
                        <RadioGroup
                            label="Your addresses"
                            value={selectedAddress}
                            onValueChange={setSelectedAddress}
                        >
                            {addresses.map((addr) => (
                                <Radio key={addr._id} value={addr.address}>{addr.address}</Radio>
                            ))}
                            <Radio value="new_address">Add a new address</Radio>
                        </RadioGroup>
                        {selectedAddress === "new_address" && (
                            <div className="mt-4">
                                <Input
                                    label="New address"
                                    placeholder="Street, City, ZIP, Province"
                                    value={newAddress}
                                    onChange={(e) => {
                                        setNewAddress(e.target.value);
                                        if (newAddressError) setNewAddressError("");
                                    }}
                                    isInvalid={!!newAddressError}
                                    errorMessage={newAddressError}
                                />
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#083d77] text-white"
                            onPress={handleAddressSave}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modale per le informazioni personali */}
            <Modal
                isOpen={isModalOpen === "info"}
                onClose={() => setIsModalOpen(null)}
            >
                <ModalContent className="m-0 rounded-b-none sm:rounded-lg">
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Contact Information</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                value={tempName}
                                onValueChange={setTempName}
                                isInvalid={!!infoErrors.name}
                                errorMessage={infoErrors.name}
                            />
                            <Input
                                label="Surname"
                                placeholder="Enter your surname"
                                value={tempSurname}
                                onValueChange={setTempSurname}
                                isInvalid={!!infoErrors.surname}
                                errorMessage={infoErrors.surname}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                value={tempPhone}
                                onValueChange={setTempPhone}
                                isInvalid={!!infoErrors.phone}
                                errorMessage={infoErrors.phone}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#083d77] text-white"
                            onPress={handleInfoSave}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modale per il metodo di pagamento */}
            <Modal isOpen={isModalOpen === "payment"} onClose={() => setIsModalOpen(null)}>
                <ModalContent className="m-0 rounded-b-none sm:rounded-lg">
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Payment Method</h2>
                    </ModalHeader>
                    <ModalBody>
                        <RadioGroup
                            name="pay-kind"
                            label="Select a payment method"
                            value={tempPaymentMethod}
                            onValueChange={(value) => {
                                setTempPaymentMethod(value);
                                if (value === 'card' && paymentCards.length > 0) {
                                    if (!tempSelectedCardId || !paymentCards.find(c => c._id.$oid === tempSelectedCardId)) {
                                        setTempSelectedCardId(paymentCards[0]._id.$oid);
                                    }
                                }
                            }}
                        >
                            <Radio value="cash">Cash</Radio>
                            <Radio value="card">Credit Card</Radio>
                        </RadioGroup>

                        {tempPaymentMethod === 'card' && (
                            <div className="mt-4 pt-4 border-t">
                                <RadioGroup
                                    name="pay-card"
                                    label="Your cards"
                                    value={tempSelectedCardId}
                                    onValueChange={setTempSelectedCardId}
                                >
                                    {paymentCards.map((card, idx) => {
                                        const k = getCardKey(card, idx);
                                        return (
                                            <Radio key={k} value={k}>
                                                {card.name} **** {card.number.slice(-4)}
                                            </Radio>
                                        );
                                    })}
                                    <Radio key="new_card" value="new_card">Add a new card</Radio>
                                </RadioGroup>

                                {tempSelectedCardId === 'new_card' && (
                                    <div className="mt-4 space-y-3">
                                        <Input label="Card Name (e.g. Visa)" value={newCard.name} onValueChange={(v) => setNewCard({ ...newCard, name: v })} isInvalid={!!newCardErrors.name} errorMessage={newCardErrors.name} />
                                        <Input label="Card Holder" value={newCard.holder} onValueChange={(v) => setNewCard({ ...newCard, holder: v })} isInvalid={!!newCardErrors.holder} errorMessage={newCardErrors.holder} />
                                        <Input label="Card Number" value={newCard.number} onValueChange={(v) => setNewCard({ ...newCard, number: v })} isInvalid={!!newCardErrors.number} errorMessage={newCardErrors.number} />
                                        <div className="flex gap-3">
                                            <Input label="Expiry (MM/YY)" value={newCard.expiry} onValueChange={(v) => setNewCard({ ...newCard, expiry: v })} isInvalid={!!newCardErrors.expiry} errorMessage={newCardErrors.expiry} />
                                            <Input label="CVV" value={newCard.cvv} onValueChange={(v) => setNewCard({ ...newCard, cvv: v })} isInvalid={!!newCardErrors.cvv} errorMessage={newCardErrors.cvv} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(null)}>Cancel</Button>
                        <Button className="bg-[#083d77] text-white" onPress={handlePaymentSave}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modale per le note aggiuntive */}
            <Modal
                isOpen={isModalOpen === "notes"}
                onClose={() => setIsModalOpen(null)}
            >
                <ModalContent className="m-0 rounded-b-none sm:rounded-lg">
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Additional Notes</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Textarea
                            label="Your notes"
                            placeholder="Add any special requests for your order here..."
                            value={tempNotes}
                            onValueChange={setTempNotes}
                            minRows={4}
                            maxLength={100}
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {tempNotes.length} / 100
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onPress={() => setIsModalOpen(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#083d77] text-white"
                            onPress={handleNotesSave}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modale per order items */}
            <Modal
                isOpen={isModalOpen === "items"}
                onClose={() => setIsModalOpen(null)}
            >
                <ModalContent className="m-0 rounded-b-none sm:rounded-lg">
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Order Items</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-3">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                    <div className="flex items-center">
                                        <span className="text-lg font-medium mr-2 bg-[#083d77] text-white rounded-full w-7 h-7 flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                        <span className="text-md font-medium">{item.name}</span>
                                    </div>
                                    <span className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col items-center">
                        <div className="flex justify-between w-full pt-2">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold">{cart.items.reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                            ).toFixed(2)}€</span>
                        </div>
                        <Button
                            className="w-full mt-3 bg-[#083d77] text-white py-2 rounded-xl font-medium hover:bg-[#062f5c]"
                            onPress={() => setIsModalOpen(null)}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}