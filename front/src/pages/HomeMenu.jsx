import React, { useEffect, useState } from "react";
import { apiFetch, IMAGE_BASE } from "../api/client";
import { useCart } from "../context/CartContext";
import bg from "../assets/hero/banner3.png";

export default function HomeMenu() {
  const { addToCart } = useCart();

  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [foodType, setFoodType] = useState("ALL");
  const [fade, setFade] = useState(false);

  const categories = ["ALL", "Fastfood","Briyani","Meals", "Juice"];
  const foodTypes = ["ALL", "Veg", "Non-Veg"];

  /* LOAD MENU */
  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await apiFetch("/menu");
        setMenu(Array.isArray(data) ? data : []);
        setFade(true);
       
      } catch (err) {
        console.error("Menu load failed", err);
      }
    }
    loadMenu();
  }, []);

  /* FILTER LOGIC */
  const visibleItems = menu.filter((item) => {
  const matchCategory =
    category === "ALL" || item.category === category;

  const matchFoodType =
    foodType === "ALL" ||
    item.foodType?.toLowerCase() === foodType.toLowerCase();

  const matchSearch =
    item.name.toLowerCase().includes(search.toLowerCase());

  return matchCategory && matchFoodType && matchSearch;
});

  return (
    <div>
      {/* HERO */}
      <div
        className="relative w-full h-[330px] md:h-[380px] flex items-center px-6"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for delicious food..."
            className="w-full px-4 py-3 rounded-xl shadow-xl bg-white"
          />
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 overflow-x-auto px-4 mt-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${category === c ? "bg-orange-600 text-white" : "bg-gray-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* VEG / NON-VEG FILTER */}
      <div className="flex gap-2 overflow-x-auto px-4 mt-3">
        {foodTypes.map((t) => (
          <button
            key={t}
            onClick={() => setFoodType(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${foodType === t ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div
        className={`container px-4 pt-4 pb-20 transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {visibleItems.length === 0 && (
          <p className="text-gray-600 text-center mt-6">
            No items found.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {visibleItems.map((item) => (
            <div
              key={item._id}
              className="relative bg-white rounded-xl p-3 shadow-md"
            >
              {/* IMAGE */}
              <img
                src={IMAGE_BASE + item.imageUrl}
                className="w-full h-32 object-cover rounded-xl"
                alt={item.name}
              />

              {/* VEG / NON-VEG BADGE */}
              {item.foodType && (
                <span
                  className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full
                  ${
                    item.foodType === "Veg"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {item.foodType}
                </span>
              )}

              <div className="mt-2">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">₹{item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="mt-2 w-full bg-orange-600 hover:bg-orange-700
                             text-white py-1 rounded-lg text-sm"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
