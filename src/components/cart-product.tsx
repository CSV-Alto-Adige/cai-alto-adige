import React, { useContext } from 'react'
import { format } from "date-fns"
import { it } from 'date-fns/locale';
import { CartContext } from '@/store/cart-context'
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, Button} from "@nextui-org/react";
import { events } from './nextUITable/events-table';
import { AlertCircle, CalendarDays, Heart, MapPin } from 'lucide-react';

// Define the type for the expected props
interface CartProductProps {
    id: string;
    open: Boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  }

function getEventData(id: string) {
    let eventData = events.find(event => event.id === id);
    if (eventData == undefined) {
        return undefined;
    }
    return eventData;
}

export default function CartEvent(props: CartProductProps) {

    const cart = useContext(CartContext);
    const id = props.id
    const event = getEventData(id);

    if (!event) {
      return <p>Evento non trovato.</p>;
  }


    const handleDelete = (id: any) => {
      cart.deleteFromCart(id);
    
      if (cart.items.length === 1) {
        props.setOpen(false);
      }
    };

  return (
    <Card className="max-w-[400px] my-6">
    <CardHeader className="flex gap-3">
      <Image
        alt="nextui logo"
        height={100}
        radius="sm"
        src={event.image}
        width={100}
        className="w-12 h-12 object-cover"
      />
      <div className="flex flex-col">
        <h3 className="text-md">{event.activity}</h3>
        <p className="text-small text-default-500">{event.activityType}</p>
      </div>
    </CardHeader>
    <Divider/>
    <CardBody>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2 items-center">
          <CalendarDays className="h-4 w-4"/>
          <p className="text-sm text-zinc-600">Data Inizio: <span className="text-zinc-900">{format(event.startDate, "dd LLL, y", { locale: it })}</span></p>
        </div>
        <div className="flex gap-x-2 items-center">
          <MapPin className="h-4 w-4"/>
          <p className="text-sm text-zinc-600">Località: <span className="text-zinc-900">{event.location}</span></p>
        </div>
        <div className="flex gap-x-2 items-center">
          <AlertCircle className="h-4 w-4"/>
          <p className="text-sm text-zinc-600">Difficoltá: <span className="text-zinc-900">{event.difficulty}</span></p>
        </div>
      </div>
    </CardBody>
    <Divider/>
    <CardFooter>
      <Button 
        color="secondary" 
        size="sm" 
        startContent={<Heart className="h-4 w-4"/>} 
        className="mx-4 my-2 w-full"
        onClick={() => handleDelete(event.id)}
      >
        Elimina dai favoriti
      </Button>
    </CardFooter>
  </Card>
  )
}
