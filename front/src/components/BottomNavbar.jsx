import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
//images
import home from "../images/home.png"
import profile from "../images/profile.png"
import car from "../images/car.png"
import order from "../images/ord.png"

//bottom
export default function BottomNavbar() {
  const { cartCount = 0 } = useCart();
document.querySelector("button")?.scrollIntoView()
if (location.pathname === "/checkout") return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-50 sm:hidden">
      <div className="flex justify-around py-2 text-xs">

        {/* HOME */}
        <Link
          to="/"
          className="flex flex-col items-center text-gray-700"
        >
          <img src={home} alt="profile" className="w-8"></img>
          <span>Home</span>
        </Link>

        {/* CART */}
        <Link
          to="/cart"
          className="relative flex flex-col items-center text-gray-700"
        >
          <img src={car} alt="cart" className="w-8"></img>
            
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-3
                           bg-red-600 text-white
                           text-[10px] font-bold
                           w-5 h-5
                           flex items-center justify-center
                           rounded-full"
              >
                {cartCount}
              </span>
            )}
          
          <span>Cart</span>
        </Link>

        {/* ORDERS */}
        <Link
          to="/orders"
          className="flex flex-col items-center text-gray-700"
        >
          <img src={order} alt="order" className="w-8"></img>
          <span>Orders</span>
        </Link>

        {/* PROFILE */}
        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-700"
        >
          <img src={profile} alt="profile" className="w-8"></img>
          <span>Profile</span>
        </Link>

      </div>
    </nav>
  );
}

