"use client"

import { useContext } from "react";
import Image from "next/image";
import PostImage from "@/assets/AG-Altopiano-di-Sennes.jpeg"
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { CartContext } from '@/store/cart-context'; 

type Props = {
  params: {
    id: string; // Assuming `id` is a string. Adjust this type as necessary.
  };
}


export default function AttivitaPage({params: {id}}: Props) {

  const cart = useContext(CartContext);

  const addToCartHandler = () => {
    cart.addOneToCart(id); 
  };

    return (
      <div className="bg-white min-h-[90vh] flex items-center">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nome Attività</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Informazioni attività
            </h2>

            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">01/01/2025</p>

              <div className="ml-4 border-l border-gray-300 pl-4">
                <h2 className="sr-only">Località</h2>
                <div className="flex items-center">
                  <p className="ml-2 text-sm text-gray-500">Località</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">Note</p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <Image src={PostImage} width={500} height={600} alt="AttivitÀ" className="h-full w-full object-cover object-center"/>
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <Button
          onClick={addToCartHandler}
          disabled={cart.items.some(item => item.id === id)}
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#0E4D71] px-8 py-6 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            Aggiungi ai favoriti
            <Heart className="ml-2 h-4 w-4" />
        </Button>
        </div>
      </div>
    </div>
    );
  }