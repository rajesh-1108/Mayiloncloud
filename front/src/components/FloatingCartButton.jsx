import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function FloatingCartButton() {
  const { cartCount, totalRupees } = useCart();

  if (cartCount === 0) return null;

  return (
    <Link
      to="/cart"
      className="
        fixed bottom-20 right-5 
        bg-orange-600 text-white 
        px-5 py-3 rounded-full 
        shadow-xl z-50
        flex items-center gap-3
        animate-bounce-slow
      "
    >
      <span className="font-bold">Cart • ₹{totalRupees}</span>

      <span className="bg-white text-orange-600 font-bold w-6 h-6 rounded-full flex justify-center items-center">
        {cartCount}
      </span>
    </Link>
  );
}
