'use client';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeClosed, Profile, Email, Handle } from "@/components/icons/heroicons";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import AccountHeader from "@/components/app/account/AccountHeader";
import ConfirmDelete from "@/components/ConfirmDelete";
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { courses, areas, allergens } from "@/public/utils/lists";

export default function ProfilePage() {
  const router = useRouter();

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

  // dati iniziali mock
  const mockUser = {
    name: "John",
    surname: "Glovo",
    email: "john.glovo@example.com",
    username: "JohnGlovo",
    accountType: "user"
  };

  const mock = mockUser;

  // stati locali per rendere i campi editabili
  const [name, setName] = useState(mock.name);
  const [surname, setSurname] = useState(mock.surname);
  const [username, setUsername] = useState(mock.username);
  const [email, setEmail] = useState(mock.email);

  // Modify these states to use new Set() instead of arrays
  const [userAllergies, setUserAllergies] = useState(new Set([]));
  const [preferredCourses, setPreferredCourses] = useState(new Set([]));
  const [preferredAreas, setPreferredAreas] = useState(new Set([]));
  const [offersOptIn, setOffersOptIn] = useState(false);

  useEffect(() => {
    // esegui solo in ambiente client
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (/*!*/token) {
      router.push("/auth/login");
    }
  }, [router]);

  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const invalidEmail = useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = (e) => {
    // Check if e exists and has preventDefault method before calling it
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    const newErrors = {};
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
      return;
    }
    
    // Convert Sets to arrays for the API request
    const updatedUserData = {
      name,
      surname,
      username,
      email,
      allergies: Array.from(userAllergies),
      preferredCourses: Array.from(preferredCourses),
      preferredAreas: Array.from(preferredAreas),
      offersOptIn,
    };
    
    // invia la richiesta di aggiornamento...
    console.log("Updated user data:", updatedUserData);
    
    setIsUserChanged(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");

    console.log(updatedUserData);

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

  const handleDelete = (e) => {
    // Simula cancellazione account e logout
    /*localStorage.removeItem("token");*/
    router.push("/auth/login");
  };

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f6f6f6]">
      <AccountHeader
        accountType={mock.accountType}
        title={`Welcome, ${mock.name}`}
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

              <form onSubmit={handleSubmit}>
                <CardBody className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setIsUserChanged(true);
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name}
                      type="text"
                      label="Name"
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
                      label="Surname"
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
                      setErrors((prev) => ({ ...prev, 
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
                    items={courses.map(item => ({ value: item, label: item }))}
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

                <div className="mt-2 w-full">
                  <Checkbox
                    isSelected={offersOptIn}
                    onValueChange={setOffersOptIn}
                    className="w-full"
                    size="lg"
                  >
                    <span className="h-full text-medium break-words">Subscribe to special offers and promotions</span>
                  </Checkbox>
                  <p className="text-sm text-gray-500 mt-1 ml-8">
                    You'll see resturant food in your home that matches your preferences.
                  </p>
                </div>

                <Button
                  color="primary"
                  size="lg"
                  radius="sm"
                  className="w-1/2 mt-2 self-center break-words whitespace-normal"
                  onPress={handleSubmit}
                >
                  Save Preferences
                </Button>
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