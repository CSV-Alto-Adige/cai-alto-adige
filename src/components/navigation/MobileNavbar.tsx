"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import CAILogo from '@/assets/cai_logo.png'

export function MobileNav({navigation}: any) {
const [open, setOpen] = useState(false);
  return (
    <div className="block xl:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    Menu
                    <Menu className="ml-2 h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
                <SheetHeader className="flex-row items-center gap-x-4 px-4 py-4 bg-blue-50">
                    <Image src={CAILogo} alt="Logo" className="w-12"/>
                    <SheetTitle>CAI - ALTO ADIGE</SheetTitle>
                </SheetHeader>
                <nav className="grid py-8 px-4 items-center gap-y-12 mt-12">
                    {navigation.main.map((item: any) => (
                        <Link onClick={() => setOpen(false)} key={item.name} href={item.href} className="leading-6 text-zinc-800 flex gap-x-4">
                            {item.icon && <item.icon className="h-5 w-5 text-[#0E4D71]" />}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    </div>
  )
}
