"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story";
import { Menu } from "@/components/menu";
import { Visit } from "@/components/visit";
import { Gallery } from "@/components/gallery";
import { Footer } from "@/components/footer";
import { ReservationModal } from "@/components/reservation";

export default function Home() {
  const [open, setOpen] = useState(false);
  const openReserve = () => setOpen(true);

  return (
    <>
      <Nav onReserve={openReserve} />
      <main>
        <Hero onReserve={openReserve} />
        <Story />
        <Menu />
        <Visit />
        <Gallery />
      </main>
      <Footer onReserve={openReserve} />
      <ReservationModal open={open} onOpenChange={setOpen} />
    </>
  );
}
