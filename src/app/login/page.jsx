"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function LoginPage() {
  const { theme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  useEffect(() => {
    setThemeLoaded(true);
  }, [theme]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        alert(signInError.message);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        console.error(userError);
        return;
      }

      if (!userData) {
        const { error: insertError } = await supabase
          .from("user")
          .insert([{ email }]);

        if (insertError) {
          console.error(insertError);
          return;
        }
      }

      alert("Login successful!");
    } catch (error) {
      console.error(error);
    }
  };

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
            <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
            <p className="text-lg">Log in to XI RPL 2</p>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // Toggle input type
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
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                        <AiOutlineEye size={24} />
                    ) : (
                      <AiOutlineEyeInvisible size={24} />
                    
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 p-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
