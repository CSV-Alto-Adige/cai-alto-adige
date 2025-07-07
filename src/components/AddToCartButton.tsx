"use client"
import { useContext } from 'react';
import { Heart } from "lucide-react";
import { CartContext } from '@/store/cart-context'
import { Button } from '@nextui-org/react';
  

const AddToCartButton = ({event}: any) => {
    const cart = useContext(CartContext);
    const addToCartHandler = () => {
        if (event?.id) {
          cart.addOneToCart(event.id);
        }
      };
  return (
    <Button onClick={addToCartHandler} disabled={cart.items.some(item => item.id === event.id)} className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#0E4D71] px-8 py-6 text-base font-medium text-white hover:bg-gray-900">
    Aggiungi ai favoriti <Heart className="ml-2 h-4 w-4" />
  </Button>
  )
}

export default AddToCartButton