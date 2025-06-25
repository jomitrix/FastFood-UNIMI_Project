'use client';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { WaveClean } from "@/components/waves";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeClosed, Profile, Restaurant } from "@/components/icons/heroicons";
import { Chip } from "@heroui/chip";
import OrderList from "@/components/app/profile/OrderList";

export default function ProfilePage() {
  const router = useRouter();
  const [section, setSection] = useState("account");
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

  // dati iniziali mock
  const mockUser = {
    name: "Mario",
    surname: "Rossi",
    email: "mario.rossi@example.com",
    username: "MarioRossi",
    accountType: "user" // or "restaurant"
  };

  // stati locali per rendere i campi editabili
  const [name, setName] = useState(mockUser.name);
  const [surname, setSurname] = useState(mockUser.surname);
  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);

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
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = "Nome richiesto";
    if (!surname) newErrors.surname = "Cognome richiesto";
    if (!username) newErrors.username = "Username richiesto";
    if (!email) newErrors.email = "Email richiesta";
    else if (invalidEmail) newErrors.email = "Email non valida";
    if (newPassword && newPassword.length < 6)
      newErrors.newPassword = "Password deve essere di almeno 6 caratteri";
    if (newPassword && newPassword !== confirmNewPassword)
      newErrors.confirmNewPassword = "Le password non coincidono";
    if (isUserChanged && !currentPassword)
      newErrors.currentPassword = "Password attuale richiesta";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    // invia la richiesta di aggiornamento...
    setIsUserChanged(false);
    setCurrentPassword("");
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (deleteInput !== "ELIMINA") {
      setDeleteError('Devi digitare "ELIMINA" per confermare');
      return;
    }
    // Simula cancellazione account e logout
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="w-full flex flex-col min-h-screen items-center bg-[#f6f6f6]">
      <div className="w-full bg-[#ff8844] flex flex-col items-center text-center">
        {section === "account" && (
            <div className="h-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">
                    Benvenuto, {mockUser.name}
                </h1>
                <p>{mockUser.email}</p>
            </div>
        )}

        {section === "orders" && (
            <div className="h-24 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">
                    Ordini
                </h1>
            </div>
        )}
        
        <Tabs
          variant="light"
          color="white"
          radius="full"
          className="py-2"
          classNames={{
            tabContent: "text-black",
            tab: "data-[selected=true]:font-bold"
          }}
          selectedKey={section}
          onSelectionChange={(value) => setSection(value)}
        >
          <Tab key={"account"} title="Info Account" />
          <Tab key={"orders"} title="Storico Ordini" />
        </Tabs>
      </div>

      <div className="w-full">
        <WaveClean className="h-10 sm:h-20" />
      </div>

      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col justify-center items-center p-4 pb-10">
        {section === "account" && (
          <div className="w-full mt-4 sm:mt-6 gap-2 flex flex-col gap-5 sm:gap-8">
            <Card className="w-full p-4 sm:p-8">
              <CardHeader className="w-full font-bold text-2xl flex justify-between">
                <div>Info Account</div>
                {mockUser.accountType === "user" ? (
                  <Chip
                    color="primary"
                    startContent={<Profile size={18} />}
                    variant="flat"
                  >
                    Utente
                  </Chip>
                ) : (
                  <Chip
                    color="secondary"
                    className="pl-2"
                    startContent={<Restaurant size={14} />}
                    variant="flat"
                  >
                    Ristorante
                  </Chip>
                )}
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
                      label="Nome"
                      placeholder="Nome"
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
                      label="Cognome"
                      placeholder="Cognome"
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
                    label="Username"
                    placeholder="Username"
                    labelPlacement="outside"
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
                    errorMessage={errors.email || "Email non valida"}
                    type="email"
                    label="Email"
                    placeholder="Email"
                    labelPlacement="outside"
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
                      setErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }}
                    isInvalid={!!errors.newPassword}
                    errorMessage={errors.newPassword}
                    label="Nuova Password"
                    placeholder="Nuova Password"
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
                          <EyeClosed
                            className="text-2xl text-default-400 pointer-events-none"
                            size={20}
                          />
                        ) : (
                          <Eye
                            className="text-2xl text-default-400 pointer-events-none"
                            size={20}
                          />
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
                    label="Conferma Nuova Password"
                    placeholder="Conferma Nuova Password"
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
                          <EyeClosed
                            className="text-2xl text-default-400 pointer-events-none"
                            size={20}
                          />
                        ) : (
                          <Eye
                            className="text-2xl text-default-400 pointer-events-none"
                            size={20}
                          />
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
                        Inserisci la tua password attuale per modificare
                      </p>
                      <div className="w-[50%] flex flex-col gap-4">
                        <Input
                          type={isVisible ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          isInvalid={!!errors.currentPassword}
                          errorMessage={errors.currentPassword}
                          className="w-full p-0"
                          label="Password attuale"
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
                                <EyeClosed
                                  className="text-2xl text-default-400 pointer-events-none"
                                  size={20}
                                />
                              ) : (
                                <Eye
                                  className="text-2xl text-default-400 pointer-events-none"
                                  size={20}
                                />
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
                          Applica Modifiche
                        </Button>
                      </div>
                    </CardBody>
                  </>
                )}
              </form>
            </Card>

            <Card className="w-full p-4 sm:p-8">
              <CardHeader className="font-bold text-2xl">
                Elimina Account
              </CardHeader>

              <div className="w-full flex flex-col justify-center items-center my-3">
                <Divider className="w-[90%] flex bg-black/10" />
              </div>

              <CardBody
                as="form"
                onSubmit={handleDelete}
                className="flex flex-col gap-4"
              >
                <p>
                  Per eliminare il tuo account, digita "ELIMINA" nella casella
                  sottostante.
                  <br />
                  Una volta inviata la richiesta, non potrai più accedere,
                  accedere al tuo credito o ripristinare il tuo account.
                </p>

                <div className="lg:w-1/2 flex flex-col gap-4">
                  <Input
                    type="text"
                    label='Scrivi "ELIMINA"'
                    placeholder="ELIMINA"
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
                    Elimina Permanentemente
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {section === "orders" && (
            <OrderList />
        )}
      </div>
    </div>
  );
}
