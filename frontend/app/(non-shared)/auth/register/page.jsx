"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Tabs, Tab } from "@heroui/tabs";
import { Eye, EyeClosed } from "@/components/icons/heroicons";

export default function Register() {
  const router = useRouter();

  const [accountType, setAccountType] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const invalidEmail = useMemo(() => {
        if (email === "") return false;
        return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validazione
    const newErrors = {};
    if (!name) newErrors.name = "Nome richiesto";
    if (!email) newErrors.email = "Email richiesta";
    else if (!validateEmail(email)) newErrors.email = "Email non valida";
    if (!password) newErrors.password = "Password richiesta";
    else if (password.length < 6) newErrors.password = "Password deve essere di almeno 6 caratteri";
    if (!confirmPassword) newErrors.confirmPassword = "Conferma password richiesta";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Le password non coincidono";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Mock API call
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/auth/login");
    } catch (error) {
      setErrors({ general: "Errore durante la registrazione. Riprova." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-background/60 flex flex-col items-center justify-center relative p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl border border-primary/20">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
          <h1 className="font-bold text-primary text-3xl text-center">Registrati</h1>
          <p className="text-default-500 text-center">Crea il tuo account</p>
        </CardHeader>
        
        <CardBody className="px-6 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {errors.general}
              </div>
            )}
            
            <Tabs
              className="items-center justify-center mb-2"
              selectedKey={accountType}
              onSelectionChange={(value) => setAccountType(value)}
            >
              <Tab key="user" title="Utente"/>
              <Tab key="restaurant" title="Ristorante"/>
            </Tabs>

            <Input
              type="text"
              label={accountType === "restaurant" ? "Nome Ristorante" : "Nome Utente"}
              placeholder={accountType === "restaurant" ? "Inserisci il nome del ristorante" : "Inserisci il tuo nome utente"}
              value={name}
              onChange={(e) => {
                setName(e.target.value.trim());
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              variant="bordered"
              size="lg"
            />

            <Input
              type="email"
              label="Email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              isInvalid={!!errors.email || invalidEmail}
              errorMessage={errors.email || "Email non valida"}
              variant="bordered"
              size="lg"
            />
            
            <Input
              type={isVisible ? "text" : "password"}
              label="Password"
              placeholder="Inserisci la tua password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value.trim());
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              endContent={
                <button 
                  className="focus:outline-none" 
                  type="button" 
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" size={20} />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                  )}
                </button>
              }
              variant="bordered"
              size="lg"
            />

            <Input
              type={isConfirmVisible ? "text" : "password"}
              label="Ripeti Password"
              placeholder="Ripeti la tua password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value.trim());
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              endContent={
                <button 
                  className="focus:outline-none" 
                  type="button" 
                  onClick={toggleConfirmVisibility}
                  aria-label="toggle confirm password visibility"
                >
                  {isConfirmVisible ? (
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none" size={20} />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                  )}
                </button>
              }
              variant="bordered"
              size="lg"
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? "Registrazione in corso..." : "Registrati"}
            </Button>
            
            <div className="flex flex-col gap-2 mt-4 text-center">
              <p className="text-sm text-default-500">
                Hai già un account?{" "}
                <Link href="/auth/login" className="text-primary font-medium">
                  Accedi
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}