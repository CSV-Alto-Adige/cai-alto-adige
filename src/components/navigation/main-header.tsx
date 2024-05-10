"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { CartSheet } from '../sheet';
import CAILogo from '@/assets/cai_logo.png'
import { motion, useScroll, useMotionValue, useMotionValueEvent } from "framer-motion";
import ClientSideRouter from "../ClientSideRouter";



const navigation = {
  main: [
    { name: 'Chi siamo', href: 'https://www.cai.it/gruppo_regionale/gp-alto-adige' },
    { name: 'Contatti', href: 'https://www.cai.it/gruppo_regionale/gp-alto-adige/chi-siamo/' },
  ],
}

export default function MainHeader( { events } : any) {

  const { scrollY } = useScroll();
  const [ hidden, setHidden ] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Providing a default value of 0 for `previous` if it's undefined
    const previous = scrollY.getPrevious() || 0;
  
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
    variants={{
      visible: { y: 0},
      hidden:{ y: "-200%" },
    }} 
    animate={ hidden ? "hidden" : "visible" }
    transition={{ duration: 0.35, ease: "easeInOut" }}
    className="bg-white shadow-xl bg-opacity-90 backdrop-blur-xl z-50 xl:rounded-xl w-full lg:container mx-auto sticky top-0 lg:top-8 -mb-24">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <ClientSideRouter route={`/`} ariaLabel="Home">
            <div className="flex items-center gap-x-2">
              <Image src={CAILogo} alt="Logo" className="w-12"/>
              <span className="leading-6 font-bold text-lg tracking-tight hidden md:block">CAI - ALTO ADIGE</span>
            </div>
          </ClientSideRouter>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
        <nav className="columns-2 sm:flex sm:justify-center sm:space-x-6" aria-label="Menu">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href} className="leading-6 text-zinc-800">{item.name}</Link>
          ))}
        </nav>
        </div>
        <CartSheet events={events}/>
      </nav>
    </motion.header>
  )
}
