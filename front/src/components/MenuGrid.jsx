import React from "react";
import { IMAGE_BASE } from "../api/client";

export default function MenuGrid({ items, onAdd }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item._id} className="card p-3">
         <img
  src={IMAGE_BASE + item.imageUrl}
  alt={item.name}
  className="w-full h-40 object-cover rounded-t-lg"
/>



          <h3 className="font-bold mt-2">{item.name}</h3>
          <p className="text-sm text-gray-600">₹{item.price}</p>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={() => onAdd(item)}
          >
            ADD
          </button>
        </div>
      ))}
    </div>
  );
}

