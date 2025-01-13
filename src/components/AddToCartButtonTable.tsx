"use client"
import { useContext } from 'react';
import { Heart } from "lucide-react";
import { CartContext } from '@/store/cart-context'
import { Button } from '@nextui-org/react';
  

const AddToCartButtonTable = ({event}: any) => {
    const cart = useContext(CartContext);
    const addToCartHandler = () => {
        if (event.id) {
          cart.addOneToCart(event.id);
        }
      };
  return (
    <Button onClick={addToCartHandler} disabled={cart.items.some(item => item.id === event.id)} color="primary" 
    variant="ghost"
    size="sm" 
    startContent={<Heart className="h-4 w-4"/>} 
    className="mx-4 my-2 w-full text-xs">
    Aggiungi ai favoriti
  </Button>
  )
}

export default AddToCartButtonTable