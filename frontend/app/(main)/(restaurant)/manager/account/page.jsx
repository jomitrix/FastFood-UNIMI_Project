'use client';
import { withAuth } from '@/utils/withAuth';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Eye, EyeClosed, Restaurant, Email,
  Storefront, Phone, MapPin, Briefcase, Handle
} from "@/components/icons/heroicons";
import { Chip } from "@heroui/chip";
import { RadioGroup, Radio } from "@heroui/radio";
  import { addToast } from "@heroui/toast";
import { weekDays } from "@/utils/lists";
import { optimizeImage } from "@/utils/optimizeImage";
import AccountHeader from "@/components/app/account/AccountHeader";
import ConfirmDelete from "@/components/ConfirmDelete";
import Image from "next/image";
import { useAuth } from '@/contexts/AuthContext';
import { RestaurantService } from '@/services/restaurantService';
import { UserService } from '@/services/userService';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const toggleNewVisibility = () => setIsNewVisible(!isNewVisible);
  const [isConfNewVisible, setIsConfNewVisible] = useState(false);
  const toggleConfNewVisibility = () => setIsConfNewVisible(!isConfNewVisible);

  const [isUserChanged, setIsUserChanged] = useState(false);
  const [isRestaurantChanged, setIsRestaurantChanged] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(`${process.env.NEXT_PUBLIC_API_URL}${user?.restaurant.logo || null}`);
  const [bannerImagePreview, setBannerImagePreview] = useState(`${process.env.NEXT_PUBLIC_API_URL}${user?.restaurant.banner || null}`);

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [username, setUsername] = useState(user.username);
  const [restaurantName, setRestaurantName] = useState(user.restaurant.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.restaurant.phoneNumber);
  const [address, setAddress] = useState(user.restaurant.position.address);
  const [iva, setIva] = useState(user.restaurant.vat || "");

  const [openingHours, setOpeningHours] = useState(Object.values(user.restaurant.openingHours));
  const [serviceMode, setServiceMode] = useState(user.restaurant.serviceMode || "all");

  const [stagedHours, setStagedHours] = useState(openingHours);
  const [stagedServiceMode, setStagedServiceMode] = useState(serviceMode);

  const hasHourErrors = useMemo(
    () =>
      stagedHours.some(
        (h) => !h.closed && (h.open === "" || h.close === "" || h.open >= h.close)
      ),
    [stagedHours]
  );

  const hasHoursOrServiceChanges = useMemo(() => {
    if (stagedServiceMode !== serviceMode) return true;
    
    for (let i = 0; i < stagedHours.length; i++) {
      const staged = stagedHours[i];
      const original = openingHours[i];
      if (staged.open !== original.open || 
          staged.close !== original.close || 
          staged.closed !== original.closed) {
        return true;
      }
    }
    return false;
  }, [stagedHours, openingHours, stagedServiceMode, serviceMode]);

  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const invalidEmail = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePhone = (phone) =>
    phone.match(/^\+(?:[0-9] ?){6,14}[0-9]$/);
  const invalidPhone = useMemo(() => {
    if (phone === "") return false;
    return validatePhone(phone) ? false : true;
  }, [phone]);

  const validateAddress = (address) =>
    address.match(/^(?=.{15,200}$)([\p{L}0-9.''\-/ ]+),\s*([\p{L} \-']{2,}),\s*([0-9A-Za-z\- ]{4,12}),\s*([\p{L} \-']{3,})$/u);
  const invalidAddress = useMemo(() => {
    if (address === "") return false;
    return validateAddress(address) ? false : true;
  }, [address]);

  const validateIva = (iva) =>
    iva.match(/^\d{11}$/);
  const invalidIva = useMemo(() => {
    if (iva === "") return false;
    return validateIva(iva) ? false : true;
  }, [iva]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = "Name required";
    if (!surname) newErrors.surname = "Surname required";
    if (!username) newErrors.username = "Username required";
    if (!email) newErrors.email = "Email required";
    else if (invalidEmail) newErrors.email = "Invalid email";

    if (newPassword && newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword && newPassword !== confirmNewPassword)
      newErrors.confirmNewPassword = "Passwords don't match";
    if (isUserChanged && !currentPassword)
      newErrors.currentPassword = "Current password required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      addToast({
        title: "Error",
        description: "Please fix the errors before saving.",
        color: "danger",
        timeout: 4000,
      });
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
      description: "Account information updated successfully!",
      color: "success",
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    })
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!restaurantName) newErrors.restaurantName = "Restaurant Name required";
    if (!phone) newErrors.phone = "Phone number required";
    else if (invalidPhone) newErrors.phone = "Invalid phone number";
    if (!address) newErrors.address = "Address required";
    else if (invalidAddress) newErrors.address = "Format: Road, City, ZIP, Province";
    if (!iva) newErrors.iva = "VAT Number required";
    else if (invalidIva) newErrors.iva = "Invalid VAT Number";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      addToast({
        title: "Error",
        description: "Please fix the errors before saving.",
        color: "danger",
        timeout: 4000,
      });
      return;
    }

    const data = await RestaurantService.editRestaurant(restaurantName, phone, address, iva);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger" });
    }

    setIsRestaurantChanged(false);
    addToast({
      title: "Success",
      description: "Restaurant information updated successfully!",
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

  const onHourChange = (idx, field, value) =>
    setStagedHours((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [field]: value };
      return clone;
    });

  const toggleClosed = (idx) =>
    setStagedHours((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], closed: !clone[idx].closed };
      return clone;
    });

  const copyMondayToWeek = () =>
    setStagedHours((prev) => {
      const monday = prev[0];
      return prev.map((h, i) => (i === 0 ? h : { ...h, ...monday }));
    });

  const handleSaveHoursAndService = async () => {
    if (hasHourErrors) {
      addToast({
        title: "Error",
        description:
          "Please check that the closing time is always after the opening time.",
        timeout: 4000,
        color: "danger",
      });
      return;
    }

    const data = await RestaurantService.editOpenings(stagedHours[0], stagedHours[1], stagedHours[2], stagedHours[3], stagedHours[4], stagedHours[5], stagedHours[6], stagedServiceMode);
    if (!data || data.status !== "success") {
      return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger" });
    }

    setOpeningHours(stagedHours);
    setServiceMode(stagedServiceMode);
    addToast({
      title: "Success",
      description: "Opening hours and service mode updated successfully.",
      timeout: 5000,
      color: "success",
    });
  };

  const handleCancelHoursAndService = () => {
    setStagedHours(openingHours);
    setStagedServiceMode(serviceMode);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedImage = await optimizeImage(file);
        setProfileImage(optimizedImage);
        setProfileImagePreview(URL.createObjectURL(optimizedImage));
      } catch (error) {
        addToast({
          title: "Error",
          description: error.message,
          color: "danger",
          timeout: 4000,
        });
      }
    }
  };

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedImage = await optimizeImage(file);
        setBannerImage(optimizedImage);
        setBannerImagePreview(URL.createObjectURL(optimizedImage));
      } catch (error) {
        addToast({
          title: "Error",
          description: error.message,
          color: "danger",
          timeout: 4000,
        });
      }
    }
  };

  const handleImageUpload = async (type) => {
    addToast({
      title: "Success",
      description: `${type} image uploaded successfully.`,
      color: "success",
      timeout: 4000,
    });

    if (type === 'Profile') {
      const data = await RestaurantService.editLogo(profileImage);
      if (!data || data.status !== "success") {
        return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger" });
      }

      setProfileImage(null);
    } else {
      const data = await RestaurantService.editBanner(bannerImage);
      if (!data || data.status !== "success") {
        return addToast({ title: "Error", description: data.error ?? "Server Error", color: "danger" });
      }

      setBannerImage(null);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f5f3f5]">
      <AccountHeader
        accountType="restaurant"
        title={`Welcome, ${user.name}`}
        subtitle="Manage your Restaurant Info and Settings"
      />

      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center items-center p-4 pb-10">
        <div className="w-full mt-4 sm:mt-6 gap-2 flex flex-col gap-5 sm:gap-8">
          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="w-full font-bold text-2xl flex justify-between">
              <div>Account Info</div>
              <Chip
                color="secondary"
                className="pl-2"
                startContent={<Restaurant size={14} />}
                variant="flat"
              >
                Restaurant
              </Chip>
            </CardHeader>

            <div className="w-full flex flex-col justify-center items-center my-4">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>

            <form onSubmit={handleSubmit}>
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
                    label={
                      <span>
                        Name
                        <span className="text-danger ml-1">*</span>
                      </span>
                    }
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    type="text"
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsUserChanged(true);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
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

          {/* New Restaurant Information card */}
          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="w-full font-bold text-2xl flex justify-between">
              <div>Restaurant Information</div>
            </CardHeader>

            <div className="w-full flex flex-col justify-center items-center my-4">
              <Divider className="w-[90%] flex bg-black/10" />
            </div>

            <form onSubmit={handleRestaurantSubmit}>
              <CardBody className="flex flex-col gap-4">
                <Input
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                    setIsRestaurantChanged(true);
                    setErrors((prev) => ({ ...prev, restaurantName: undefined }));
                  }}
                  isInvalid={!!errors.restaurantName}
                  errorMessage={errors.restaurantName}
                  type="text"
                  label={
                    <span>
                      Restaurant Name
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Restaurant Name"
                  labelPlacement="outside"
                  endContent={<Storefront className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />
                <Input
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setIsRestaurantChanged(true);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  isInvalid={!!errors.phone || invalidPhone}
                  errorMessage={errors.phone || "Invalid phone number"}
                  type="tel"
                  label={
                    <span>
                      Restaurant Phone Number
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Example: +39 1234 567 890"
                  labelPlacement="outside"
                  endContent={<Phone className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />
                <Input
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setIsRestaurantChanged(true);
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  isInvalid={!!errors.address || invalidAddress}
                  errorMessage={errors.address || "Format: Road, City, ZIP, Province"}
                  type="text"
                  label={
                    <span>
                      Restaurant Address
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Example: Via Roma 1, Roma, 00100, Italy"
                  labelPlacement="outside"
                  endContent={<MapPin className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />
                <Input
                  value={iva}
                  onChange={(e) => {
                    setIva(e.target.value);
                    setIsRestaurantChanged(true);
                    setErrors((prev) => ({ ...prev, iva: undefined }));
                  }}
                  isInvalid={!!errors.iva || invalidIva}
                  errorMessage={errors.iva || "Invalid VAT Number"}
                  type="text"
                  label={
                    <span>
                      VAT Number
                      <span className="text-danger ml-1">*</span>
                    </span>
                  }
                  placeholder="Example: 01234567890"
                  labelPlacement="outside"
                  endContent={<Briefcase className="text-2xl text-default-500 pointer-events-none flex-shrink-0" />}
                  radius="sm"
                  size="lg"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    radius="sm"
                    isDisabled={!isRestaurantChanged}
                  >
                    Update Restaurant Info
                  </Button>
                </div>
              </CardBody>
            </form>
          </Card>

          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl">
              Images
            </CardHeader>
            <div className="w-full my-3 flex justify-center">
              <Divider className="w-[90%] bg-black/10" />
            </div>
            <CardBody className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-bold">Profile Picture</h3>
                <p>This will appear on the order list.</p>
                <p className="text-sm text-default-500 mb-2">Recommended size: 400x400px.</p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-default-200 flex items-center justify-center overflow-hidden">
                    {profileImagePreview ? (
                      <Image src={profileImagePreview} alt="Profile preview" width={128} height={128} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-default-500">Preview</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button as="label" variant="flat" radius="sm">
                      Choose file
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </Button>
                    {profileImage && (
                      <Button color="primary" radius="sm" onPress={() => handleImageUpload('Profile')} >
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">Banner Image</h3>
                <p>This will appear on the search page.</p>
                <p className="text-sm text-default-500 mb-2">Recommended size: 1200x675px (16:9).</p>
                <div className="flex flex-col gap-4">
                  <div className="aspect-video w-full sm:w-2/3 rounded-md bg-default-200 flex items-center justify-center overflow-hidden">
                    {bannerImagePreview ? (
                      <Image src={bannerImagePreview} alt="Banner preview" width={1200} height={675} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-default-500">Preview</span>
                    )}
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button as="label" variant="flat" radius="sm">
                      Choose file
                      <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageChange} />
                    </Button>
                    {bannerImage && (
                      <Button color="primary" radius="sm" onPress={() => handleImageUpload('Banner')}>
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="w-full p-4 sm:p-8">
            <CardHeader className="font-bold text-2xl flex justify-between">
              <span>Opening hours & Service</span>
            </CardHeader>

            <div className="w-full my-3 flex justify-center">
              <Divider className="w-[90%] bg-black/10" />
            </div>

            <CardBody className="flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-bold">Opening hours</h3>
                <Button size="sm" variant="flat" onPress={copyMondayToWeek}>
                  Set Monday to all
                </Button>
              </div>

              {weekDays.map((day, idx) => {
                const { open, close, closed } = stagedHours[idx];
                const invalid = !closed && open >= close;
                return (
                  <div
                    key={day}
                    className="flex flex-col md:flex-row items-center w-full"
                  >
                    <div className="w-24 font-medium">{day}</div>

                    <div className="flex flex-row gap-2 grow w-full md:w-auto">
                      <Input
                        type="time"
                        label="Open"
                        value={open}
                        isDisabled={closed}
                        isInvalid={invalid}
                        onChange={(e) => onHourChange(idx, "open", e.target.value)}
                        size="sm"
                        radius="sm"
                        className="min-w-0 flex-1"
                      />
                      <Input
                        type="time"
                        label="Close"
                        value={close}
                        isDisabled={closed}
                        isInvalid={invalid}
                        onChange={(e) => onHourChange(idx, "close", e.target.value)}
                        size="sm"
                        radius="sm"
                        className="min-w-0 flex-1"
                      />
                    </div>

                    <div className="w-full md:w-32 mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant={closed ? "flat" : "light"}
                        color={closed ? "secondary" : "default"}
                        onPress={() => toggleClosed(idx)}
                        type="button"
                        className="w-full"
                      >
                        {closed ? "Closed" : "Set closed"}
                      </Button>
                    </div>
                  </div>
                );
              })}

              <h3 className="text-lg font-bold pt-4">Service mode</h3>
              <RadioGroup
                name="serviceMode"
                value={stagedServiceMode}
                onValueChange={setStagedServiceMode}
                orientation="horizontal"
                className="gap-6"
              >
                <Radio value="all">All</Radio>
                <Radio value="delivery">Delivery</Radio>
                <Radio value="takeaway">Takeaway</Radio>
              </RadioGroup>

              <div className="self-end flex gap-2">
                { hasHoursOrServiceChanges && (
                  <Button
                    size="lg"
                    radius="sm"
                    variant="flat"
                    onPress={handleCancelHoursAndService}
                    type="button"
                  >
                    Undo Changes
                  </Button>
                )}
                <Button
                  color="primary"
                  size="lg"
                  radius="sm"
                  onPress={handleSaveHoursAndService}
                  isDisabled={hasHourErrors || !hasHoursOrServiceChanges}
                  type="button"
                >
                  Save
                </Button>
              </div>
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
          type="your Restaurant account"
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}