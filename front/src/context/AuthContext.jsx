import React, { createContext, useContext, useState, useEffect } from "react";
import { API, apiFetch } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  /* =========================
     PERSIST TOKEN
  ========================= */
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /* =========================
     PERSIST USER
  ========================= */
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  /* =========================
     SIGN IN
  ========================= */
  async function signin(email, password) {
    const data = await apiFetch("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    setUser(data.user);
    return data;
  }

  /* =========================
     SIGN UP
  ========================= */
  async function signup(name, email, password) {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    setToken(data.token);
    setUser(data.user);
    return data;
  }

  /* =========================
     REFRESH USER (IMPORTANT)
  ========================= */
  async function refreshUser() {
    if (!token) return;

    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

;

    const data = await res.json();
    setUser(data);
  }

  /* =========================
     LOGOUT
  ========================= */
  function signout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /* =========================
     TOKEN EXPIRY CHECK
  ========================= */
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      signout();
    }
  }, []);
function setAuth(jwtToken, userData) {
  setToken(jwtToken);
  setUser(userData);
}

  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = {
    user,
    token,
    isAuthed: !!token,
    signin,
    setAuth,
    signup,
    signout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   CUSTOM HOOK
========================= */
export function useAuth() {
  return useContext(AuthContext);
}


