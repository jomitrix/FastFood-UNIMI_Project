"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Tabs, Tab } from "@heroui/tabs";
import { Eye, EyeClosed } from "@/components/icons/heroicons";
import { WaveClean } from "@/components/waves";
import { useAuth } from '@/contexts/AuthContext';
import { addToast } from "@heroui/toast";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [accountType, setAccountType] = useState("user");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
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

    const newErrors = {};
    if (!name) newErrors.name = "Name required";
    if (!surname) newErrors.surname = "Surname required";
    if (!username) newErrors.username = "Username required";
    if (!email) newErrors.email = "Email required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password required";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    console.log(accountType);
    try {
      const resp = await register(
        username,
        email,
        password,
        name,
        surname,
        accountType.toLowerCase()
      );

      if (!resp.success) {
        addToast({ title: "Error", description: resp.error ?? "Server Error", color: "danger" });
      } else return router.push(`/onboarding/${accountType.toLowerCase()}`);
    } catch (error) {
      setErrors({ general: "Error during registration. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f5]">
      <WaveClean />

      <section className="mt-5 bg-[#f5f3f5] flex flex-col w-full items-center justify-center p-4">
        <Card
          className="w-full max-w-lg bg-white"
          classNames={{ base: "border-0 shadow-0", body: "border-0 shadow-0" }}
        >
          <CardHeader className="flex flex-col gap-3 px-6 pt-12 pb-0">
            <h1 className="font-semibold text-[#083d77] text-4xl text-center">
              Register
            </h1>
            <p className="w-2/3 text-center leading-6 text-lg font-sm">
              Create your account
            </p>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errors.general && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">
                  {errors.general}
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <p className="font-medium">Account Type</p>
                <Tabs
                  className="items-center mb-2"
                  selectedKey={accountType}
                  onSelectionChange={setAccountType}
                  classNames={{ tabContent: "font-medium" }}
                >
                  <Tab key="user" title="User" />
                  <Tab key="restaurant" title="Restaurant" />
                </Tabs>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <Input
                  type="text"
                  label={
                    <span className="font-medium">
                      Nome <span className="text-danger">*</span>
                    </span>
                  }
                  labelPlacement="outside"
                  placeholder="Inserisci il tuo nome"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value.trim());
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  variant="bordered"
                  size="lg"
                />
                <Input
                  type="text"
                  label={
                    <span className="font-medium">
                      Cognome <span className="text-danger">*</span>
                    </span>
                  }
                  labelPlacement="outside"
                  placeholder="Inserisci il tuo cognome"
                  value={surname}
                  onChange={(e) => {
                    setSurname(e.target.value.trim());
                    if (errors.surname) setErrors(prev => ({ ...prev, surname: undefined }));
                  }}
                  isInvalid={!!errors.surname}
                  errorMessage={errors.surname}
                  variant="bordered"
                  size="lg"
                />
              </div>

              <Input
                type="text"
                label={
                  <span className="font-medium">
                    Username <span className="text-danger">*</span>
                  </span>
                }
                labelPlacement="outside"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.replace(/\s/g, ""));
                  if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                }}
                isInvalid={!!errors.username}
                errorMessage={errors.username}
                variant="bordered"
                size="lg"
              />

              <Input
                type="email"
                label={
                  <span className="font-medium">
                    Email <span className="text-danger">*</span>
                  </span>
                }
                labelPlacement="outside"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                isInvalid={!!errors.email || invalidEmail}
                errorMessage={errors.email || "Invalid email"}
                variant="bordered"
                size="lg"
              />

              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <Input
                  type={isVisible ? "text" : "password"}
                  label={
                    <span className="font-medium">
                      Password <span className="text-danger">*</span>
                    </span>
                  }
                  labelPlacement="outside"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value.trim());
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
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

                <Input
                  type={isConfirmVisible ? "text" : "password"}
                  label={
                    <span className="font-medium">
                      Confirm Password <span className="text-danger">*</span>
                    </span>
                  }
                  labelPlacement="outside"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value.trim());
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
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
                        <EyeClosed className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      )}
                    </button>
                  }
                  variant="bordered"
                  size="lg"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 bg-[#083d77] text-white font-semibold"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>

              <div className="flex flex-col gap-2 mt-4 text-center">
                <p className="text-sm text-default-500">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-[#083d77] font-medium">
                    Login
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
