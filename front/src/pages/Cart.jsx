import React from "react";
import { useCart } from "../context/CartContext";
import { IMAGE_BASE } from "../api/client";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, totalRupees, addOne, removeOne, removeItem } = useCart();

  return (
    <div className="container pt-4 pb-40">

      {/* HEADER */}
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      {/* EMPTY CART */}
      {(!items || items.length === 0) && (
        <p className="text-gray-500 text-center mt-10">
          Your cart is empty 🍽️
        </p>
      )}

      {/* CART ITEMS */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm animate-slide-in"
          >
            {/* IMAGE (SMALL & FIXED) */}
            <img
              src={IMAGE_BASE + item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />

            {/* DETAILS */}
            <div className="flex-1">
              <h2 className="text-sm font-semibold">{item.name}</h2>
              <p className="text-xs text-gray-500">₹{item.price}</p>

              <div className="flex items-center justify-between mt-2">
                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 flex items-center justify-center 
                               bg-gray-200 rounded-full text-lg"
                    onClick={() => removeOne(item._id)}
                  >
                    −
                  </button>

                  <span className="text-sm font-medium">
                    {item.qty}
                  </span>

                  <button
                    className="w-7 h-7 flex items-center justify-center 
                               bg-gray-200 rounded-full text-lg"
                    onClick={() => addOne(item._id)}
                  >
                    +
                  </button>
                </div>

                {/* PRICE */}
                <span className="text-sm font-bold">
                  ₹{item.price * item.qty}
                </span>
              </div>
            </div>

            {/* REMOVE */}
            <button
              className="text-red-500 text-xs"
              onClick={() => removeItem(item._id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* FIXED CHECKOUT BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-2xl z-[60]">
           <div className="flex justify-between items-center mb-4">
    <span className="text-gray-600">Total payable</span>
    <span className="text-2xl font-bold">₹{totalRupees}</span>
  </div>

  <Link
    to="/checkout"
    className="block text-center bg-orange-600 
               hover:bg-orange-700 text-white 
               font-bold py-4 rounded-xl text-lg"
  >
    PROCEED TO CHECKOUT
  </Link>

        </div>
      )}
    </div>
  );
}

