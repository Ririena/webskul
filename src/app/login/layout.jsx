import Navigation from "@/layout/Navigation";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
export const metadata = {
  title: "Login Siswa",
  description: "Hello"
};

export default function layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Toaster/>
    </>
  );
}
