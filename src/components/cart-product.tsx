import React, { useContext } from 'react'
import directus from '@/lib/directus';
import { format } from "date-fns"
import { it } from 'date-fns/locale';
import { CartContext } from '@/store/cart-context'
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Link} from "@nextui-org/react";
import { AlertCircle, CalendarDays, Heart, MapPin } from 'lucide-react';

// Define the type for the expected props
interface CartProductProps {
    id: string;
    open: Boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    events: any
  }


export default function CartEvent(props: CartProductProps) {

    const cart = useContext(CartContext);
    const events = props.events
    const id = props.id
    const event = getEventData(id);

    function getEventData(id: string) {
      let eventData = events.find((event: any) => event.id === id);
      if (eventData == undefined) {
          return undefined;
      }
      return eventData;
  }

    if (!event) {
      return <p>Evento non trovato.</p>;
  }


    const handleDelete = (id: any) => {
      cart.deleteFromCart(id);
    
      if (cart.items.length === 1) {
        props.setOpen(false);
      }
    };

    const handleViewActivity = () => {
      props.setOpen(false);
  };

  return (
      <Card className="max-w-[400px] my-6">
        <CardHeader className="flex gap-3">
        {event.Immagine ? (
            <Image
            alt={event.Titolo}
            height={100}
            radius="sm"
            src={`${directus.url}assets/${event.Immagine}`}
            width={100}
            className="w-12 h-12 object-cover"
          />
            ) : (
              <></>
            )}
          <div className="flex flex-col">
            <h3 className="text-md">{event.Titolo}</h3>
            <p className="text-small text-default-500">{event.Attivita}</p>
          </div>
        </CardHeader>
        <Divider/>
        <CardBody>
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-2 items-center">
              <CalendarDays className="h-4 w-4"/>
              <p className="text-sm text-zinc-600">Data Inizio: <span className="text-zinc-900">{format(event.Data_inizio, "dd LLL, y", { locale: it })}</span></p>
            </div>
            <div className="flex gap-x-2 items-center">
              <MapPin className="h-4 w-4"/>
              <p className="text-sm text-zinc-600">Località: <span className="text-zinc-900">{event.Regione_Provincia} - {event.Zona}</span></p>
            </div>
            <div className="flex gap-x-2 items-center">
              <AlertCircle className="h-4 w-4"/>
              <p className="text-sm text-zinc-600">Difficoltá: <span className="text-zinc-900">{event.Difficolta}</span></p>
            </div>
          </div>
        </CardBody>
        <Divider/>
        <CardFooter>
          <Button 
            color="secondary" 
            size="sm" 
            className="mx-4 my-2 w-full"
            onClick={() => handleDelete(event.id)}
          >
            Elimina dai favoriti
          </Button>
          <Button
              href={`https://attivita.caialtoadige.it/attivita/${event.slug}`}
              as={Link}
              color="primary"
              variant="solid"
              showAnchorIcon
              className='w-full bg-[#0E4D71]'
              onClick={handleViewActivity}
              size='sm'
            >
              Vedi attività
            </Button>
        </CardFooter>
      </Card>
  )
}
