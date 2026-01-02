import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../firebase";
import { API } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { signin, signup, setAuth } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  /* =========================
     EMAIL LOGIN / SIGNUP
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let data;

      if (mode === "login") {
        data = await signin(form.email, form.password);
      } else {
        data = await signup(form.name, form.email, form.password);
      }

      redirectByRole(data.user);
    } catch (err) {
      alert(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     GOOGLE LOGIN
  ========================= */
  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: firebaseToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAuth(data.token, data.user);
      redirectByRole(data.user);
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  }

  /* =========================
     ROLE BASED REDIRECT
  ========================= */
  function redirectByRole(user) {
    if (user.role === "superadmin") {
      navigate("/admin/users");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9E7A5] px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-1 text-center">
          {mode === "login" ? "Welcome Back 👋" : "Create Account"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Order delicious food anytime
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              className="input"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="input"
            placeholder="Email"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
           {mode === "login" && (
  <p
    onClick={() => navigate("/forgot-password")}
    className="text-right text-sm text-blue-600 cursor-pointer hover:underline"
  >
    Forgot password?
  </p>
)}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <img src="/google.png" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* SWITCH MODE */}
        <p
          className="text-center text-sm text-blue-600 mt-4 cursor-pointer"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "New user? Create account"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
