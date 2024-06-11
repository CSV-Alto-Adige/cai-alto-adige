"use client";

import React, { useContext, useRef, useEffect, useState, createRef } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button"
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
import { CartContext } from "@/store/cart-context"
import CartEvent from "./cart-product";
import jsPDF from "jspdf";
import { PrintableEventList } from "./print/PrintableEventList";
import { useReactToPrint } from "react-to-print";

export function CartSheet({events}: any) {
  const [open, setOpen] = useState(false);
  const cart = useContext(CartContext);
  const eventsCount = cart.items.length;
  const { itemAdded, resetItemAdded } = useContext(CartContext);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  function getEventData(id: string) {
    let eventData = events.find((event: any) => event.id === id);
    if (eventData == undefined) {
        return undefined;
    }
    return eventData;
  }
  

  useEffect(() => {
    if (itemAdded) {
      sheetTriggerRef.current?.click(); // Programmatically click the trigger
      resetItemAdded(); // Reset the state in context
    }
  }, [itemAdded, resetItemAdded]);



  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild ref={sheetTriggerRef}>
        <Button className="ml-6 relative inline-flex items-center bg-[#0e4d71] font-semibold text-sm lg:text-base">
            Favoriti
            <Heart className="ml-2 h-4 w-4" />
            {eventsCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-thin leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{eventsCount}</span>
            )}
        </Button>
      </SheetTrigger>
      <SheetContent className=" overflow-y-scroll flex flex-col justify-between">
        <div id="wishlist">
        <SheetHeader>
          <SheetTitle>I tuoi favoriti</SheetTitle>
          <SheetDescription>
            Esporta la tua lista.
          </SheetDescription>
        </SheetHeader>
            {eventsCount > 0 ?
                <>
                    {cart.items.map( (currentEvent, idx) => (
                        <div key={idx} id={`cart-item-${currentEvent.id}`}>
                            <CartEvent events={events} id={currentEvent.id} open={open} setOpen={setOpen}/>
                        </div>
                    ))}
                </>
            :
                <p className="mt-12">Non hai aggiunto nessuna attività alla tua lista.</p>    
            }
          </div>
        <SheetFooter className="">
          <SheetClose asChild>
            <PrintableEventList events={cart.items.map(item => getEventData(item.id))}/>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
