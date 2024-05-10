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


  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'A4'
    });
  
    const imageUrl = 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75'; // Update with your image path
    // doc.addImage(imageUrl, 'PNG', 10, 10, 40, 20); // Adjust dimensions and position as needed
  
    const tableBody = cart.items.map(item => {
      const eventData = getEventData(item.id);
      
      return [
        eventData?.activity,
        eventData?.organizerSection,
        eventData?.startDate,
        eventData?.location,
        eventData?.difficulty,
        eventData?.targetGroup,
        eventData?.activityType,
        eventData?.estimatedHours,
        eventData?.contactPhone,
      ];
    });
  
    // Column titles
    const tableColumn = ["Attività", "Sezione", "Data inizio", "Località", "Difficoltà", "Gruppo Target", "Tipo di attività", "Ore stimate", "Telefono"];
  
     // Customizing the header style
     const title = "CAI Alto Adige - Elenco delle tue attività";
     const titleSize = 16; // Font size for the title
     const titleX = 150; // The X coordinate (the middle of an A4 page in landscape, which is 210mm wide)
     const titleY = 20; // The Y coordinate (top margin)
   
     // Adding the title to the document
     doc.setFontSize(titleSize);
     doc.text(title, titleX, titleY, { align: 'center' });
   
     // Since we've added a title at the top, adjust the startY position for the table accordingly
     const options = {
       startY: 30, // Adjust this value as needed to place the table below your title
       headStyles: {
         fillColor: [14, 77, 113], // Custom color for header background
         textColor: 255, // White text color
         fontStyle: 'bold' // Bold text in headers
       },
       // Other options for autoTable...
     };

    // Add the table to the PDF
    (doc as any).autoTable(tableColumn, tableBody, options);
  
    // Save the PDF
    doc.save('selected-events.pdf');
  };
  

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
            <Button type="submit" className="bg-[#0E4D71] w-full mx-auto" onClick={handleExportPDF}>Esporta PDF</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
