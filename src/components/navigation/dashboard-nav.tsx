"use client";

import { useContext } from "react"
import Link from 'next/link';
import Image from "next/image";
import { CartSheet } from '../sheet';
import { CartContext } from "@/store/cart-context"
import CAILogo from '@/assets/cai_logo.png'



const navigation = {
  main: [
    { name: 'Chi siamo', href: 'https://www.cai.it/gruppo_regionale/gp-alto-adige' },
    { name: 'Contatti', href: 'https://www.cai.it/gruppo_regionale/gp-alto-adige/chi-siamo/' },
  ],
}

export default function DashboardNav() {
  
  const cart = useContext(CartContext)

  return (
    <header className="bg-[#0e4d71] relative z-50 text-white border border-b-white">
      <nav className="mx-auto flex container items-center justify-between py-4 px-0" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="flex items-center gap-x-4">
            {/* <div className="p-2 rounded-full bg-white">
                <Image src={CAILogo} alt="Logo" className="w-8"/>
            </div> */}
            <span className="leading-6 font-bold text-lg tracking-tight">CAI - ALTO ADIGE</span>
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
        <nav className="columns-2 sm:flex sm:justify-center sm:space-x-6" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href} className="leading-6 text-white">{item.name}</Link>
          ))}
        </nav>
        </div>
        <CartSheet/>
      </nav>
    </header>
  )
}
