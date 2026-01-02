import React from "react";
import swiggyQR from "../images/swiggyqr.jpeg";
import zomatoQR from "../images/zomato.jpeg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 mb-16 sm:mb-0">
      <div className="container text-center space-y-4">

        <h2 className="text-xl font-semibold">Follow Us</h2>

        {/* SOCIAL + QR */}
        <div className="flex items-center justify-center gap-6">

          {/* FACEBOOK */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 text-2xl"
          >
            <i className="fab fa-facebook"></i>
          </a>

          {/* INSTAGRAM */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 text-2xl"
          >
            <i className="fab fa-instagram"></i>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/918778055387"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 text-2xl"
          >
            <i className="fab fa-whatsapp"></i>
          </a>

          {/* SWIGGY QR */}
          <div className="relative group">
            <a
              href="https://www.swiggy.com/direct/brand/732472?source=swiggy-direct&subSource=generic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={swiggyQR}
                alt="Swiggy"
                className="w-8 cursor-pointer"
              />
              <h5>Swiggy</h5>
            </a>

            {/* QR POPUP */}
            <div className="absolute hidden group-hover:block 
                            top-10 left-1/2 -translate-x-1/2 
                            bg-white p-2 shadow-lg rounded z-50">
              <img src={swiggyQR} className="w-28" />
              <p className="text-xs text-center mt-1 text-black">
                Scan to order
              </p>
            </div>
          </div>

          {/* ZOMATO QR */}
          <div className="relative group">
            <a
              href="https://zomato.onelink.me/xqzv/secgqiw9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={zomatoQR}
                alt="Zomato"
                className="w-8 cursor-pointer"
              />
              <h5>Zomato</h5>
            </a>

            {/* QR POPUP */}
            <div className="absolute hidden group-hover:block 
                            top-10 left-1/2 -translate-x-1/2 
                            bg-white p-2 shadow-lg rounded z-50">
              <img src={zomatoQR} className="w-28" />
              <p className="text-xs text-center mt-1 text-black">
                Scan to order
              </p>
            </div>
          </div>

        </div>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Mayilon Cloud. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
