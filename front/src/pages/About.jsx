import React from "react";
import bg from "../assets/hero/about1.png";
import bg1 from "../assets/hero/about2.png";

export default function About() {
  return (
    <div className="w-full">

      {/* HERO SECTION 1 */}
      <div
        className="relative w-full h-[330px] md:h-[380px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-40 px-6 py-3 rounded-xl">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow">
            About Cloud Kitchen
          </h1>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <section className="container py-8 md:py-12">
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>

        <p className="text-gray-700 leading-relaxed text-md mb-6">
          Welcome to <span className="font-semibold">Cloud Kitchen</span>, a modern 
          food delivery platform designed to bring your favorite meals straight
          to your doorstep. We believe in delivering fresh, delicious, and 
          hygienic meals crafted with love and passion.
        </p>

        <p className="text-gray-700 leading-relaxed text-md mb-6">
          Our mission is to provide a seamless ordering experience, fast
          delivery, and a variety of cuisines at your fingertips. Whether you're
          craving biryani, pizza, burgers, or refreshing beverages — we’ve got 
          something for everyone.
        </p>
      </section>

      {/* HERO SECTION 2 */}
      <div
        className="relative w-full h-[330px] md:h-[380px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-40 px-6 py-3 rounded-xl">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow">
            Fresh | Fast | Delivered
          </h1>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <section className="container py-8 md:py-12">
        <h2 className="text-2xl font-bold mb-4">Our Promise</h2>

        <ul className="text-gray-700 text-md leading-relaxed space-y-3">
          <li>✔ Fresh and hygienic meals every time</li>
          <li>✔ Fast delivery with real-time tracking</li>
          <li>✔ Affordable pricing with premium taste</li>
          <li>✔ 100% customer satisfaction guaranteed</li>
        </ul>
      </section>

    </div>
  );
}

