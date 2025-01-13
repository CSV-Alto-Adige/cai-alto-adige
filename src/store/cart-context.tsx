"use client";

import React, { createContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from "react";

interface CartItemType {
  id: string;
}

interface CartContextType {
  items: CartItemType[];
  addOneToCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  itemAdded: boolean;
  resetItemAdded: () => void;
  subscribeToDeletion: (callback: (id: string) => void) => void;
  unsubscribeFromDeletion: (callback: (id: string) => void) => void;
}


  const defaultContextValue: CartContextType = {
    items: [],
    addOneToCart: () => {},
    deleteFromCart: () => {},
    itemAdded: false, 
    resetItemAdded: () => {},
    subscribeToDeletion: () => {},
    unsubscribeFromDeletion: () => {},
  };
  

export const CartContext = createContext<CartContextType>(defaultContextValue);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<{ items: CartItemType[] }>({ items: [] });
  const [itemAdded, setItemAdded] = useState(false);
  const deletionSubscribers = useRef<Set<(id: string) => void>>(new Set());

  // Load cart from local storage and update state
  useEffect(() => {
    const data = window.localStorage.getItem('EVENTCART_CAI');
    if (data) {
      setCart(JSON.parse(data));
    }
  }, []);

  // Sync cart state to local storage on changes
  useEffect(() => {
    window.localStorage.setItem('EVENTCART_CAI', JSON.stringify(cart));
  }, [cart]);

  const addOneToCart = useCallback((id: string) => {
    if (!cart.items.some(item => item.id === id)) {
      setCart(prevCart => ({
        ...prevCart,
        items: [...prevCart.items, { id }],
      }));
      setItemAdded(true);
    }
  }, [cart.items]);

  const resetItemAdded = useCallback(() => setItemAdded(false), []);

  const subscribeToDeletion = useCallback((callback: (id: string) => void) => {
    deletionSubscribers.current.add(callback);
}, []);

const unsubscribeFromDeletion = useCallback((callback: (id: string) => void) => {
    deletionSubscribers.current.delete(callback);
}, []);

const deleteFromCart = useCallback((id: string) => {
  setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.id !== id),
  }));
  deletionSubscribers.current.forEach(callback => callback(id));
}, []);

const contextValue = useMemo(() => ({
  items: cart.items,
  addOneToCart,
  deleteFromCart,
  itemAdded,
  resetItemAdded,
  subscribeToDeletion,
  unsubscribeFromDeletion,
}), [cart.items, itemAdded, addOneToCart, deleteFromCart, resetItemAdded, subscribeToDeletion, unsubscribeFromDeletion]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
