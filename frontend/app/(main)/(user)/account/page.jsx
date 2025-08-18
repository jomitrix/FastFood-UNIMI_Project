'use client';
import { withAuth } from '@/utils/withAuth';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeClosed, Profile, Email, Handle, CreditCard } from "@/components/icons/heroicons";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import AccountHeader from "@/components/app/account/AccountHeader";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { courses, areas, allergens } from "@/utils/lists";
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';

function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const toggleNewVisibility = () => setIsNewVisible(!isNewVisible);
  const [isConfNewVisible, setIsConfNewVisible] = useState(false);
  const toggleConfNewVisibility = () => setIsConfNewVisible(!isConfNewVisible);

  const [isUserChanged, setIsUserChanged] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // stati locali per rendere i campi editabili
  const [name, setName] = useState(user?.name);
  const [surname, setSurname] = useState(user?.surname);
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);

  const [userAllergies, setUserAllergies] = useState(user?.preferences.allergens || new Set([]));
  const [preferredCourses, setPreferredCourses] = useState(user?.preferences.preferredFoodTypes || new Set([]));
  const [preferredAreas, setPreferredAreas] = useState(user?.preferences.preferredCuisines || new Set([]));
  const [offersOptIn, setOffersOptIn] = useState(user?.preferences.specialOffersFeed ?? true);

  // Stato per indirizzo di fatturazione
  const [billingAddress, setBillingAddress] = useState(user?.billingAddress || "");
  const [billingAddressError, setBillingAddressError] = useState("");
  const [isBillingChanged, setIsBillingChanged] = useState(false);

  // Stato per indirizzi di spedizione (lista)
  const [deliveryAddresses, setDeliveryAddresses] = useState(user?.delivery || []);
  const [newDeliveryAddress, setNewDeliveryAddress] = useState("");
  const [deliveryAddressError, setDeliveryAddressError] = useState("");
  const [isAddingDeliveryAddress, setIsAddingDeliveryAddress] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Stato per metodo di pagamento (solo carta)
  const [cardName, setCardName] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardError, setCardError] = useState("");
  const [savedCards, setSavedCards] = useState(user?.cards || []);

  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const invalidEmail = useMemo(() => {
    if (email === ("" || undefined)) return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const validateAddress = (address) =>
    address.match(/^(?=.{15,200}$)([\p{L}0-9.'’\-/ ]+),\s*([\p{L} \-']{2,}),\s*([0-9A-Za-z\- ]{4,12}),\s*([\p{L} \-']{3,})$/u);

  const validateCardNumber = (num) => num.replace(/\s/g, '').match(/^\d{16}$/);
  const validateCardExpiry = (exp) => exp.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
  
  const isExpiryDateValid = (expiry) => {
    if (!validateCardExpiry(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    
    return expiryDate >= today;
  };
  
  const validateCardCVC = (cvc) => cvc.match(/^\d{3,4}$/);

  const editAccount = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const newErrors = {};
    if (!name) newErrors.name = "Name required";
    if (!surname) newErrors.surname = "Surname required";
    if (!username) newErrors.username = "Username required";
    if (newPassword && newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword && newPassword !== confirmNewPassword)
      newErrors.confirmNewPassword = "Passwords don't match";
    if (isUserChanged && !currentPassword)
      newErrors.currentPassword = "Current password required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const data = await UserService.editAccount(username, name, surname, newPassword, currentPassword);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setIsUserChanged(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");

    addToast({
      title: "Success",
      description: "Changes saved successfully!",
      color: "success",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    });
  };

  const editPreferences = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const data = await UserService.editPreferences(
      Array.from(userAllergies),
      Array.from(preferredCourses),
      Array.from(preferredAreas),
      offersOptIn
    );

    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    addToast({
      title: "Success",
      description: "Changes saved successfully!",
      color: "success",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    })
  };

  const checkDelete = (e) => {
    e.preventDefault();
    if (deleteInput !== "DELETE") {
      setDeleteError('You must type "DELETE" to confirm');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (e) => {
    const data = await UserService.deleteAccount();
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    await logout();

    addToast({
      title: "Success",
      description: "Account deleted successfully!",
      color: "success",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    });
    router.push("/auth/login");
  };

  const handleAddDeliveryAddress = async (e) => {
    e.preventDefault();
    if (!newDeliveryAddress) {
      setDeliveryAddressError("All fields required");
      return;
    }
    if (!validateAddress(newDeliveryAddress)) {
      setDeliveryAddressError("Format: Road, City, ZIP, Province");
      return;
    }

    const data = await UserService.editDelivery(newDeliveryAddress);

    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setDeliveryAddresses(data.delivery);

    setNewDeliveryAddress("");
    setDeliveryAddressError("");
    setIsAddingDeliveryAddress(false);
  };

  const handleRemoveDeliveryAddress = async (id) => {
    const data = await UserService.deleteDelivery(id);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setDeliveryAddresses(deliveryAddresses.filter((e) => e._id !== id));
  };

  const handleSaveBillingAddress = async (e) => {
    if (!billingAddress) {
      setBillingAddressError("Billing address required");
      return;
    }
    if (!validateAddress(billingAddress)) {
      setBillingAddressError("Format: Road, City, ZIP, Province");
      return;
    }

    const data = await UserService.editBilling(billingAddress);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setIsBillingChanged(false);
    setBillingAddressError("");
    addToast({
      title: "Success",
      description: "Billing address saved!",
      color: "success",
      timeout: 5000,
    });
  };

  const invalidBillingAddress = useMemo(
    () => billingAddress !== "" && !validateAddress(billingAddress),
    [billingAddress]
  );
  const invalidNewDeliveryAddress = useMemo(
    () => newDeliveryAddress !== "" && !validateAddress(newDeliveryAddress),
    [newDeliveryAddress]
  );

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (
      !cardName ||
      !cardHolder ||
      !validateCardNumber(cardNumber) ||
      !validateCardExpiry(cardExpiry) ||
      !validateCardCVC(cardCVC)
    ) {
      return;
    }

    const data = await UserService.editCards(
      cardName,
      cardHolder,
      cardNumber,
      cardExpiry,
      cardCVC
    );

    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setSavedCards(data.cards);

    addToast({ title: "Success", description: "Carta salvata!", color: "success" });
    setCardName("");
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVC("");
    setIsAddingCard(false);
  };

  const handleRemoveCard = async (id) => {
    const data = await UserService.deleteCard(id);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger", timeout: 4000 });
    }

    setSavedCards((prev) => prev.filter((card) => card._id !== id));
  }

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType={user?.role}
        title={`Welcome, ${name}`}
      />

      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center items-center p-4 pb-10">
        <div className="w-full mt-4 sm:mt-6 gap-2 flex flex-col gap-5 sm:gap-8">
          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="w-full font-bold text-2xl flex justify-between">
              <div>Account Info</div>
              <Chip
                color="primary"
                startContent={<Profile size={18} />}
                variant="flat"
              >
                User
              </Chip>
            </CardHeader>

            <div className="w-full flex flex-col justify-center items-center my-4">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>

            <form onSubmit={editAccount}>
              <CardBody className="flex flex-col gap-4">
                <div className="flex flex-row gap-4 md:gap-2 flex-wrap md:flex-nowrap">
                  <Input
                    value={name}
                    aria-label="name"
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsUserChanged(true);
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    type="text"
                    label={
                      <span>
                        Name
                        <span className="text-danger ml-1">*</span>
                      </span>
                    }
                    placeholder="Name"
                    labelPlacement="outside"
                    radius="sm"
                    size="lg"
                  />
                  <Input
                    value={surname}
                    onChange={(e) => {
                      setSurname(e.target.value);
                      setIsUserChanged(true);
                      setErrors((prev) => ({ ...prev, surname: undefined }));
                    }}
                    isInvalid={!!errors.surname}
                    errorMessage={errors.surname}
                    type="text"
                    label={
                      <span>
                        Surname
                        <span className="text-danger ml-1">*</span>
                      </span>
                    }
                    placeholder="Surname"
                    labelPlacement="outside"
                    radius="sm"
                    size="lg"
                  />
                </div>

                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsUserChanged(true);
                    setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  isInvalid={!!errors.username}
                  errorMessage={errors.username}
                  type="text"
                  label={
                    <span>
                      Username
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Username"
                  labelPlacement="outside"
                  endContent={<Handle className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />

                <Input
                  value={email}
                  isDisabled
                  classNames={{ input: "cursor-not-allowed pointer-events-auto", }}
                  isInvalid={!!errors.email || invalidEmail}
                  errorMessage={errors.email || "Invalid email"}
                  type="email"
                  label={
                    <span>
                      Email
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Email"
                  labelPlacement="outside"
                  endContent={<Email className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />
              </CardBody>

              <div className="w-full flex flex-col justify-center items-center my-4">
                <Divider className="w-[90%] flex bg-black/10" />
              </div>

              <CardBody className="flex flex-col gap-4">
                <Input
                  type={isNewVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setIsUserChanged(true);
                    setErrors((prev) => ({
                      ...prev,
                      newPassword: undefined,
                      confirmNewPassword: undefined
                    }));
                  }}
                  isInvalid={!!errors.newPassword}
                  errorMessage={errors.newPassword}
                  label="New Password"
                  placeholder="New Password"
                  labelPlacement="outside"
                  radius="sm"
                  size="lg"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleNewVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isNewVisible ? (
                        <EyeClosed className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      )}
                    </button>
                  }
                />

                <Input
                  type={isConfNewVisible ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    setIsUserChanged(true);
                    setErrors((prev) => ({
                      ...prev,
                      confirmNewPassword: undefined
                    }));
                  }}
                  isInvalid={!!errors.confirmNewPassword}
                  errorMessage={errors.confirmNewPassword}
                  label="Confirm New Password"
                  placeholder="Confirm New Password"
                  labelPlacement="outside"
                  radius="sm"
                  size="lg"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleConfNewVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isConfNewVisible ? (
                        <EyeClosed className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      )}
                    </button>
                  }
                />
              </CardBody>

              {isUserChanged && (
                <>
                  <div className="w-full flex flex-col justify-center items-center my-4">
                    <Divider className="w-[90%] flex bg-black/10" />
                  </div>

                  <CardBody className="flex flex-col gap-4 items-center">
                    <p className="font-semibold text-center">
                      Enter your current password to make changes
                    </p>
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                      <Input
                        type={isVisible ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                        }}
                        isInvalid={!!errors.currentPassword}
                        errorMessage={errors.currentPassword}
                        className="w-full p-0"
                        label={
                          <span>
                            Current Password
                            <span className="text-danger ml-1">*</span>
                          </span>
                        }
                        radius="sm"
                        size="lg"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                          >
                            {isVisible ? (
                              <EyeClosed className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            ) : (
                              <Eye className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            )}
                          </button>
                        }
                      />
                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        radius="sm"
                        className="w-full"
                      >
                        Apply Changes
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}
            </form>
          </Card>

          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl">
              Preferences
            </CardHeader>

            <div className="w-full flex flex-col justify-center items-center my-3">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>

            <CardBody className="flex flex-col gap-6">
              <div>
                <Select
                  items={allergens.map(item => ({ value: item, label: item }))}
                  label="Allergens"
                  labelPlacement="outside"
                  placeholder="Select allergens"
                  selectionMode="multiple"
                  selectedKeys={userAllergies}
                  onSelectionChange={setUserAllergies}
                  className="w-full"
                  radius="sm"
                  size="lg"
                >
                  {(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <p className="text-sm text-gray-500 mt-1">Select any allergens we should be aware of</p>
              </div>

              <div>
                <Select
                  items={courses.map(item => ({ value: item.name, label: item.name }))}
                  label="Preferred Food Categories"
                  labelPlacement="outside"
                  placeholder="Select preferred categories"
                  selectionMode="multiple"
                  selectedKeys={preferredCourses}
                  onSelectionChange={setPreferredCourses}
                  className="w-full"
                  radius="sm"
                  size="lg"
                >
                  {(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <p className="text-sm text-gray-500 mt-1">Select your favorite food categories</p>
              </div>

              <div>
                <Select
                  items={areas.map(item => ({ value: item, label: item }))}
                  label="Preferred Cuisines"
                  labelPlacement="outside"
                  placeholder="Select preferred cuisines"
                  selectionMode="multiple"
                  selectedKeys={preferredAreas}
                  onSelectionChange={setPreferredAreas}
                  className="w-full"
                  radius="sm"
                  size="lg"
                >
                  {(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )}
                </Select>
                <p className="text-sm text-gray-500 mt-1">Select your favorite cuisines</p>
              </div>

              <div className="flex flex-col mt-2 w-full">
                <Checkbox
                  isSelected={offersOptIn}
                  onValueChange={setOffersOptIn}
                  className="w-full"
                  size="sm"
                >
                  <span className="h-full text-medium break-words">Subscribe to special offers and promotions</span>
                </Checkbox>
                <p className="text-sm text-gray-500 mt-1 ml-6">
                  You'll see resturant food in your home that matches your preferences.
                </p>
              </div>

              <Button
                color="primary"
                size="lg"
                radius="sm"
                className="self-start mt-2"
                onPress={editPreferences}
              >
                Save Preferences
              </Button>
            </CardBody>
          </Card>

          {/* --- CARD UNICA FATTURAZIONE + SPEDIZIONE --- */}
          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl">
              Billing & Delivery Addresses
            </CardHeader>
            <div className="w-full flex flex-col justify-center items-center my-3">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>
            <CardBody className="flex flex-col gap-3">
              {/* ────── FATTURAZIONE ────── */}
              <Input
                type="text"
                label="Billing Address"
                labelPlacement="outside"
                placeholder="Example: Via Roma 1, Roma, 00100, Italy"
                value={billingAddress}
                onChange={(e) => {
                  setBillingAddress(e.target.value);
                  setIsBillingChanged(e.target.value !== user?.billingAddress);
                  setBillingAddressError("");
                }}
                isInvalid={invalidBillingAddress}
                errorMessage={invalidBillingAddress && "Invalid billing address"}
                radius="sm"
                size="lg"
                className="w-full"
              />
              <Button
                onPress={handleSaveBillingAddress}
                color="primary"
                size="lg"
                radius="sm"
                className="self-start"
                isDisabled={invalidBillingAddress || !isBillingChanged}
              >
                Save Billing Address
              </Button>

              <Divider className="w-[90%] self-center bg-black/10" />

              {/* ────── SPEDIZIONE ────── */}
              {deliveryAddresses.length === 0 && (
                <p className="text-gray-500 pt-5">No delivery address saved.</p>
              )}
              <div className="flex flex-col mb-5 gap-2">
                {deliveryAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center border p-2 rounded-sm bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="text-sm">{addr.address}</div>
                    </div>
                    <Button
                      color="danger"
                      size="sm"
                      radius="sm"
                      onPress={() => handleRemoveDeliveryAddress(addr._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Divider className="w-[90%] self-center bg-black/10 mt-3" />
              </div>
              
              
              {/* form aggiunta spedizione */}
              {!isAddingDeliveryAddress && (
                <Button
                  onPress={() => setIsAddingDeliveryAddress(true)}
                  color="primary"
                  size="lg"
                  radius="sm"
                  className="self-start"
                >
                  Add Delivery Address
                </Button>
              )}
              {isAddingDeliveryAddress && (
                <form onSubmit={handleAddDeliveryAddress} className="flex flex-col gap-4">
                  <Input
                    label="Delivery Address"
                    placeholder="Example: Via Roma 1, Roma, 00100, Italy"
                    value={newDeliveryAddress}
                    onChange={(e) => {
                      setNewDeliveryAddress(e.target.value);
                      setDeliveryAddressError("");
                    }}
                    isInvalid={invalidNewDeliveryAddress}
                    errorMessage={
                      invalidNewDeliveryAddress && "Invalid delivery address"
                    }
                    labelPlacement="outside"
                    radius="sm"
                    size="lg"
                  />
                  <div className="flex gap-2 self-start">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      radius="sm"
                      isDisabled={
                        invalidNewDeliveryAddress ||
                        !newDeliveryAddress
                      }
                    >
                      Save Address
                    </Button>
                    <Button
                      color="default"
                      size="lg"
                      radius="sm"
                      onPress={() => {
                        setIsAddingDeliveryAddress(false);
                        setNewDeliveryAddress("");
                        setDeliveryAddressError("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>

          {/* --- CARD METODO DI PAGAMENTO: lista + form --- */}
          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl flex items-center gap-2">
              Payment Methods
            </CardHeader>
            <div className="w-full flex flex-col justify-center items-center my-3">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>
            <CardBody className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {savedCards.length === 0 ? (
                  <p className="text-gray-500">No cards saved.</p>
                ) : (
                  savedCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center border p-2 rounded-md bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold">
                          {card.name}
                        </div>
                        <div className="text-sm">
                          Holder: {card.holder}
                        </div>
                        <div className="text-sm">•••• •••• •••• {card.number.substr(-4)} – {card.expiry}</div>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        radius="sm"
                        onPress={() => handleRemoveCard(card._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>


              <Divider className="w-[90%] self-center bg-black/10" />

              {/* ────── FORM AGGIUNTA CARTA ────── */}
              {!isAddingCard && (
                <Button
                  onPress={() => setIsAddingCard(true)}
                  color="primary"
                  size="lg"
                  radius="sm"
                  className="self-start"
                >
                  Add Card
                </Button>
              )}
              {isAddingCard && (
                <form onSubmit={handleAddCard} className="flex flex-col gap-4">
                  <Input
                    label="Card Name"
                    labelPlacement="outside"
                    placeholder="Card Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    isInvalid={cardName !== "" && cardName.length < 2}
                    errorMessage="Invalid card name"
                    radius="sm"
                    size="lg"
                  />
                  <div className="flex flex-row gap-4 md:gap-2 flex-wrap md:flex-nowrap">
                    <Input
                      label="Card Holder"
                      labelPlacement="outside"
                      placeholder="Card Holder"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      isInvalid={cardHolder !== "" && cardHolder.length < 2}
                      errorMessage="Invalid card holder"
                      radius="sm"
                      size="lg"
                    />
                    <Input
                      label="Card Number"
                      labelPlacement="outside"
                      placeholder="Example: 1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, ""))}
                      isInvalid={cardNumber !== "" && !validateCardNumber(cardNumber)}
                      errorMessage="Invalid card number"
                      endContent={<CreditCard className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                      maxLength={19}
                      radius="sm"
                      size="lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      label="Expires"
                      labelPlacement="outside"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.replace(/[^\d/]/g, ""))}
                      isInvalid={cardExpiry !== "" && (!validateCardExpiry(cardExpiry) || !isExpiryDateValid(cardExpiry))}
                      errorMessage={
                        cardExpiry && !validateCardExpiry(cardExpiry) 
                          ? "MM/YY Format" 
                          : cardExpiry && !isExpiryDateValid(cardExpiry) 
                            ? "Expiry date has passed" 
                            : "MM/YY Format"
                      }
                      maxLength={5}
                      radius="sm"
                      size="lg"
                      className="w-1/2"
                    />
                    <Input
                      label="CVC"
                      labelPlacement="outside"
                      placeholder="123"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value.replace(/[^\d]/g, ""))}
                      isInvalid={cardCVC !== "" && !validateCardCVC(cardCVC)}
                      errorMessage="3-4 digits"
                      maxLength={4}
                      radius="sm"
                      size="lg"
                      className="w-1/2"
                    />
                  </div>
                  <div className="flex gap-2 self-start">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      radius="sm"
                      isDisabled={
                        !cardName ||
                        !cardHolder ||
                        !validateCardNumber(cardNumber) ||
                        !validateCardExpiry(cardExpiry) ||
                        !isExpiryDateValid(cardExpiry) ||
                        !validateCardCVC(cardCVC)
                      }
                    >
                      Save Card
                    </Button>
                    <Button
                      color="default"
                      size="lg"
                      radius="sm"
                      onPress={() => {
                        setIsAddingCard(false);
                        setCardName("");
                        setCardHolder("");
                        setCardNumber("");
                        setCardExpiry("");
                        setCardCVC("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>

          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl">
              Delete Account
            </CardHeader>

            <div className="w-full flex flex-col justify-center items-center my-3">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>

            <CardBody
              as="form"
              onSubmit={checkDelete}
              className="flex flex-col gap-4"
            >
              <p>
                To delete your account, type "DELETE" in the box below.
                <br />
                Once submitted, you will no longer be able to log in,
                access your data, or restore your account.
              </p>

              <div className="lg:w-1/2 flex flex-col gap-4">
                <Input
                  type="text"
                  label='Type "DELETE"'
                  placeholder="DELETE"
                  value={deleteInput}
                  onChange={(e) => {
                    setDeleteInput(e.target.value);
                    if (deleteError) setDeleteError("");
                  }}
                  isInvalid={!!deleteError}
                  errorMessage={deleteError}
                  labelPlacement="outside"
                  radius="sm"
                  className="w-full"
                  size="lg"
                />

                <Button
                  type="submit"
                  color="danger"
                  size="lg"
                  className="w-full break-words whitespace-normal"
                >
                  Delete Permanently
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <ConfirmDelete
          type="your account"
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);