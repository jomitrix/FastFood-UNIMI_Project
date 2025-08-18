"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Eye, EyeClosed } from "@/components/icons/heroicons";
import { WaveClean } from "@/components/waves";
import { useAuth } from '@/contexts/AuthContext';
import { addToast } from "@heroui/toast";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

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
    
    try {
      const resp = await login(email, password);

      if (!resp.success) {
        addToast({ title: "Error", description: resp.error ?? "Server Error", color: "danger", timeout: 4000 });
      } else return router.push("/");
    } catch (error) {
      setErrors({ general: "Errore durante il login. Riprova." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f5]">
      <WaveClean />

      <section className="mt-10 bg-[#f5f3f5] flex flex-col w-full items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm shadow-xl border border-[#083d77]/20">
          <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
            <h1 className="font-bold text-[#083d77] text-3xl text-center">
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

              <Input
                type="email"
                label={
                  <span>
                    Email
                    <span className="text-danger ml-1">*</span>
                  </span>
                }
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
                  <span>
                    Password
                    <span className="text-danger ml-1">*</span>
                  </span>
                }
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
                className="w-full mt-2 bg-[#083d77] text-white"
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