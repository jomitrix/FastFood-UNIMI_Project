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

      router.push("/home");
    } catch (error) {
      setErrors({ general: "Errore durante il login. Riprova." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <WaveClean/>
    
    <section className="bg-gradient-to-b from-background to-background/60 flex flex-col items-center mt-[5rem] relative p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl border border-[#003f5e]/20">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
          <h1 className="font-bold text-[#003f5e] text-3xl text-center">
            Welcome
          </h1>
          <p className="text-default-500 text-center">Login to your account</p>
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
              <Tab key="user" title="User" />
              <Tab key="restaurant" title="Restaurant" />
            </Tabs>

            <Input
              type="email"
              label="Email"
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
              label="Password"
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

            {/*<Link href="/auth/forgot-password" className="ml-1 text-sm text-[#003f5e]">
              Password dimenticata?
            </Link>*/}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 bg-[#003f5e] text-white"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <div className="flex flex-col gap-2 mt-4 text-center">
              <p className="text-sm text-default-500">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#003f5e] font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
    </>
  );
}