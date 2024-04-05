"use client"
import { useEffect, useState } from "react";
import { useContext } from "react";
import Image from "next/image";
import PostImage from "@/assets/AG-Altopiano-di-Sennes.jpeg"
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { CartContext } from '@/store/cart-context'
import { events } from "@/components/nextUITable/events-table";
import { Event } from "@/components/nextUITable/events-columns";

type Props = {
  params: {
    id: string; // Assuming `id` is a string. Adjust this type as necessary.
  };
}


export default function AttivitaPage({params: {id}}: Props) {
  const [event, setEvent] = useState<Event | null>(null); 
  const cart = useContext(CartContext);

  useEffect(() => {
    // Ensure `id` is a string to match the event IDs in your dataset
    const eventId = Array.isArray(id) ? id[0] : id;
    const foundEvent = events.find(e => e.id === eventId);
    setEvent(foundEvent || null); // Provide null as a fallback value
  }, [id]);
  

  if (!event) {
    return <div>Loading...</div>;
  }

  const addToCartHandler = () => {
    if (event?.id) {
      cart.addOneToCart(event.id);
    }
  };

  return (
    <div className="bg-white min-h-[90vh] flex items-center mt-12 lg:mt-0">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Event details and image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{event.activity}</h1>
          </div>
          <section aria-labelledby="information-heading" className="mt-4">
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">{event.startDate} - {event.endDate}</p>
              <div className="ml-4 border-l border-gray-300 pl-4">
                <div className="flex items-center">
                  <p className="ml-2 text-sm text-gray-500">{event.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Attività:</span>{event.activityType}</p>
              <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Difficoltà:</span>{event.difficulty}</p>
              <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Durata in ore:</span>{event.estimatedHours}</p>
              <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Dislivello in salita:</span>{event.elevationGain}</p>
              <p className="text-base text-gray-500"><span className="text-gray-900 font-semibold mr-4">Dislivello in discesa:</span>{event.elevationLoss}</p>
            </div>
          </section>
        </div>
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <Image src={PostImage} width={500} height={600} alt="Attività" className="h-full w-full object-cover object-center" />
          </div>
        </div>
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <Button onClick={addToCartHandler} disabled={cart.items.some(item => item.id === event.id)} className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#0E4D71] px-8 py-6 text-base font-medium text-white hover:bg-gray-900">
            Aggiungi ai favoriti <Heart className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}