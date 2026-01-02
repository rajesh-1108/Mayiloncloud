import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/hero/banner.png";
import leftFood from "../assets/hero/banner.png";
import rightFood from "../assets/hero/banner.png";

export default function LandingHero() {
  const navigate = useNavigate();

  const goMenu = () => navigate("/");

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "420px"
      }}
    >
      {/* LEFT FOOD IMAGE */}
      

      {/* RIGHT FOOD IMAGE */}
      
      {/* CENTER TEXT + SEARCH */}
      <div className="flex flex-col items-center justify-center text-center h-full px-4">
        <h1 className="text-white font-bold text-3xl md:text-4xl leading-snug mt-20">
          Order food & groceries. Discover
          <br />
          best restaurants. Swiggy it!
        </h1>

        {/* SEARCH BARS */}
        <div className="flex flex-col md:flex-row gap-3 mt-6 w-full max-w-3xl">

          {/* Location Input */}
          <div className="bg-white rounded-xl px-4 py-3 flex items-center shadow w-full md:w-1/2">
            <span className="text-gray-500 mr-2">📍</span>
            <input
              placeholder="Enter your delivery location"
              className="w-full outline-none"
            />
            <span className="text-gray-400">⌄</span>
          </div>

          {/* Search Input */}
          <div className="bg-white rounded-xl px-4 py-3 flex items-center shadow w-full md:w-1/2">
            <span className="text-gray-500 mr-2">🔍</span>
            <input
              placeholder="Search for restaurant, item or more"
              className="w-full outline-none"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
