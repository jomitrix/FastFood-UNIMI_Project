"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Tabs, Tab } from "@heroui/tabs";
import { Eye, EyeClosed } from "@/components/icons/heroicons";
import { WaveClean } from "@/components/waves";

export default function Login() {
  const router = useRouter();

  const [accountType, setAccountType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

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
    if (!email) newErrors.email = "Email richiesta";
    else if (!validateEmail(email)) newErrors.email = "Email non valida";
    if (!password) newErrors.password = "Password richiesta";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Mock API call
    try {
      // Simula chiamata API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Controlla account type e se è effettuato l'onboarding in caso push /onboarding/user o restaurant
      accountType === "user" ? router.push("/") : router.push("/manager/account");
    } catch (error) {
      setErrors({ general: "Errore durante il login. Riprova." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f5]">
    <WaveClean/>
    
    <section className="mt-10 bg-[#f5f3f5] flex flex-col w-full items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white"
        classNames={{ base: "border-0 shadow-0", body: "border-0  shadow-0"  }}>
        <CardHeader className="flex flex-col gap-3 px-6 pt-12 pb-0">
          <h1 className="font-semibold text-[#083d77] text-4xl text-center">
            Login
          </h1>
          <p className="w-2/3 text-center leading-6 text-lg font-sm">Enter your details to get sign in to your account</p>
        </CardHeader>

        <CardBody className="px-6 py-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <p className="font-medium">
                Account Type
              </p>
              <Tabs
                className="items-center  mb-2"
                selectedKey={accountType}
                onSelectionChange={(value) => setAccountType(value)}
                classNames={{ tabContent: "font-medium"}}
              >
                <Tab key="user" title="User" />
                <Tab key="restaurant" title="Restaurant" />
              </Tabs>
            </div>

            <Input
              type="email"
              label={
                <span className="font-medium">
                  Email
                </span>
              }
              labelPlacement="outside"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              isInvalid={!!errors.email || invalidEmail}
              errorMessage={errors.email || "Invalid email"}
              variant="bordered"
              size="lg"
            />

            <Input
              type={isVisible ? "text" : "password"}
              label={
                <span className="font-medium">
                  Password
                </span>
              }
              labelPlacement="outside"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
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
                    <EyeClosed className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  ) : (
                    <Eye className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  )}
                </button>
              }
              variant="bordered"
              size="lg"
            />

            {/*<Link href="/auth/forgot-password" className="ml-1 text-sm text-[#083d77]">
              Password dimenticata?
            </Link>*/}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 bg-[#083d77] text-white font-semibold"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <div className="flex flex-col gap-2 mt-4 text-center">
              <p className="text-sm text-default-500">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#083d77] font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
    </div>
  );
}