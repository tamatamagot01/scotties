"use client";

import Footer from "@/components/Footer";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="font-fredoka">
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
}
