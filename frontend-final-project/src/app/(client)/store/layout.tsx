"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="font-fredoka">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
