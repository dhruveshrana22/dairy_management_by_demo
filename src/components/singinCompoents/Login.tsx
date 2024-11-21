"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Grid, Link } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Errors {
  loginValue?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<"Email" | "MobileNumber">("Email");
  const [loginValue, setLoginValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isValidInput, setIsValidInput] = useState(false);

  // Advanced email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Advanced phone number validation (supports multiple formats)
  const validatePhoneNumber = (phone: string): boolean => {
    // Supports formats:
    // (123) 456-7890
    // 123-456-7890
    // 123.456.7890
    // 1234567890
    const phoneRegex =
      /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  // Validate input based on selected login type
  useEffect(() => {
    let isValid = false;

    if (loginType === "Email") {
      isValid = validateEmail(loginValue);
    } else if (loginType === "MobileNumber") {
      isValid = validatePhoneNumber(loginValue);
    }

    setIsValidInput(isValid);
  }, [loginValue, loginType]);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    // Email validation
    if (loginType === "Email") {
      if (!loginValue) {
        newErrors.loginValue = "Please enter your email";
      } else if (!validateEmail(loginValue)) {
        newErrors.loginValue = "Please enter a valid email address";
      }
    }

    // Mobile number validation
    if (loginType === "MobileNumber") {
      if (!loginValue) {
        newErrors.loginValue = "Please enter your mobile number";
      } else if (!validatePhoneNumber(loginValue)) {
        newErrors.loginValue = "Please enter a valid mobile number";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log({ loginType, loginValue, password });
      // Add your login logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Login Method</Label>
              <Select
                value={loginType}
                onValueChange={(value) =>
                  setLoginType(value as "Email" | "MobileNumber")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select login method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="MobileNumber">Mobile Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginValue">{loginType}</Label>
              <Input
                id="loginValue"
                type="text"
                placeholder={`Enter your ${loginType}`}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                className={
                  loginValue && !isValidInput
                    ? "border-destructive"
                    : loginValue && isValidInput
                    ? "border-green-500"
                    : ""
                }
              />
              {loginValue && !isValidInput && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {loginType === "Email"
                      ? "Please enter a valid email address"
                      : "Please enter a valid mobile number"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-between w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="submit"
                className="w-50px"
                disabled={!isValidInput || !password}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
