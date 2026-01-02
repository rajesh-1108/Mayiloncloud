import React, { useState, useEffect } from "react";
import { Link, useNavigate ,useLocation} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import Logo from "../images/may3.png";
import profile from "../images/profile.png"
import Cart from "../images/car.png";
export default function Navbar() {
  const { isAuthed, user, signout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);


  // 🌙 DARK MODE STATE
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // APPLY DARK MODE
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const goLogout = () => {
    signout();
    navigate("/auth");
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperadmin = user?.role === "superadmin";




  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-20">
      <div className="container flex items-center justify-between py-3">
     
        {/* LOGO */}
       {/* LEFT SECTION */}
<div className="flex items-center gap-3">

  {/* LOGO + TITLE (ALWAYS SHOW ON MOBILE & DESKTOP) */}
<Link to="/" className="flex items-center gap-3">
  <img
    src={Logo}
    alt="logo"
    className="w-[90px] sm:w-[110px]"
  />

  <div>
    <div className="font-bold text-lg sm:text-3xl dark:text-white">
      Mayilon Cloud
    </div>
    <div className="text-[10px] sm:text-xs text-gray-500">
      Love Your Food
    </div>
  </div>
</Link>
{/* ================= MOBILE RIGHT ================= */}
<div className="flex items-center gap-3 sm:hidden">

  {/* 🌙 DARK MODE */}
  <button
    onClick={() => setDark(!dark)}
    className="p-2 rounded-full hover:bg-gray-100 
               dark:hover:bg-gray-700 transition"
    title="Toggle dark mode"
  >
    {dark ? "🌞" : "🌙"}
  </button>

  {/* 👤 PROFILE / LOGIN */}
  {isAuthed ? (
    <div className="relative">
      <img
        src={user?.photo || "/avatar.png"}
        alt="profile"
        className="w-9 h-9 rounded-full object-cover border cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800
                     shadow-lg rounded-md border text-sm z-50"
        >
          <div className="px-4 py-2 font-medium">
            {user?.name}
          </div>

          <Link
            to="/orders"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            My Orders
          </Link>
             <Link
            to="/Contact"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
           Contact
          </Link>
            <Link
            to="/About"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
           About
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={goLogout}
            className="w-full text-left px-4 py-2 
                       hover:bg-red-50 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="btn btn-primary text-sm">
      Login
    </Link>
  )}
</div>

</div>


        {/* DESKTOP MENU */}
        {/* ================= DESKTOP RIGHT ================= */}
{/* ================= DESKTOP RIGHT ================= */}
<div className="hidden sm:flex items-center gap-6 text-sm">

  {/* NAV LINKS */}
  <Link to="/" className="hover:text-orange-600 font-medium">
    Menu
  </Link>

  {isAuthed && (
    <Link to="/orders" className="hover:text-orange-600 font-medium">
      Orders
    </Link>
  )}

  <Link to="/contact" className="hover:text-orange-600 font-medium">
    Contact
  </Link>
   <Link to="/about" className="hover:text-orange-600 font-medium">
    About
  </Link>
  {/* CART */}
  <Link to="/cart" className="relative">
    <img src={Cart} alt="cart" className="w-8" />

    {cartCount > 0 && (
      <span
        className="absolute -top-2 -right-2 
                   bg-red-600 text-white 
                   text-xs font-bold 
                   w-5 h-5 
                   flex items-center justify-center 
                   rounded-full"
      >
        {cartCount}
      </span>
    )}
  </Link>

  {/* DARK MODE */}
  <button
    onClick={() => setDark(!dark)}
    className="p-2 rounded-full hover:bg-gray-100 
               dark:hover:bg-gray-700 transition"
  >
    {dark ? "🌞" : "🌙"}
  </button>

  {/* PROFILE / LOGIN */}
  {isAuthed ? (
    <div className="relative">
      <img
        src={user?.photo || profile}
        alt="profile"
        className="w-9 h-9 rounded-full object-cover border cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800
                     shadow-lg rounded-md border text-sm z-50"
        >
          <div className="px-4 py-2 font-medium">
            {user?.name}
          </div>

          
           <Link
            to="/orders"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            My Orders
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={goLogout}
            className="w-full text-left px-4 py-2 
                       hover:bg-red-50 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="btn btn-primary text-sm">
      Login
    </Link>
  )}
</div>

</div>
    </nav>
  );
}
