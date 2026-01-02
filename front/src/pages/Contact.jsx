import React, { useState } from "react";
import { apiFetch } from "../api/client";
import bg from "../assets/hero/contact1.png";
import { FaWhatsapp, FaPhoneAlt, FaMoon, FaSun } from "react-icons/fa";

export default function Contact() {
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(form)
      });
      alert("Message sent successfully");
      setForm({ name: "", email: "", message: "" });
    } catch {
      alert("Failed to send message");
    }
    setLoading(false);
  }

  return (
    <div className={dark ? "bg-gray-900 text-white" : "bg-[#F9E7A5]"}>

      {/* HERO */}
      <div
        className="relative h-[420px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
        <button
          onClick={() => setDark(!dark)}
          className="absolute top-5 right-5 bg-white p-3 rounded-full shadow"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <form
          onSubmit={submitForm}
          className={`p-6 rounded-2xl shadow-xl w-[90%] max-w-lg ${
            dark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>

          <input
            className="input mb-3"
            placeholder="Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input mb-3"
            type="email"
            placeholder="Email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            className="input mb-4"
            rows="4"
            placeholder="Message"
            value={form.message}
            required
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* MAP */}
      <div className="container py-10">
        <iframe
          src="https://www.google.com/maps?q=Chennai&t=&z=14&output=embed"
          width="100%"
          height="350"
          className="rounded-2xl shadow"
          loading="lazy"
        ></iframe>
      </div>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a
          href="tel:+918778055387"
          className="bg-blue-600 text-white p-4 rounded-full shadow"
        >
          <FaPhoneAlt />
        </a>

        <a
          href="https://wa.me/+918778055387"
          className="bg-green-500 text-white p-4 rounded-full shadow"
          target="_blank"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
}




