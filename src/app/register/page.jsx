"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function RegisterPage() {
  const { theme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    setThemeLoaded(true);
  }, [theme]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful! Please check your email to confirm your account.");
      // Redirect or show further instructions after successful registration
    }
  };

  const password = watch("password", "");

  if (!themeLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${
        theme === "light"
          ? "absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#38CEFF_100%)]"
          : "absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      }`}
    >
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="text-center p-6">
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <p className="text-lg">Sign up for XI RPL 2</p>
            <Separator />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/i,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="mt-1"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 p-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
