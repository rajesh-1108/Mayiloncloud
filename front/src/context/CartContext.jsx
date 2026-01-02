// context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // ✅ ADD TO CART (THIS WAS MISSING)
  const addToCart = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const addOne = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const removeOne = (id) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i._id === id && i.qty > 1
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setItems([]);

  const totalRupees = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,     // ✅ EXPOSE HERE
        addOne,
        removeOne,
        removeItem,
        clearCart,
        totalRupees,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);


