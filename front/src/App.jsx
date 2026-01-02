import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
import Footer from "./components/Footer";

import HomeMenu from "./pages/HomeMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import OrderTracking from "./pages/OrderTracking";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import MyOrders from "./pages/MyOrders";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MenuManager from "./pages/admin/MenuManager";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import AdminUsers from "./pages/AdminUsers";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";


import {
  AuthRoute,
  AdminRoute,
  SuperAdminRoute,
} from "./routes/ProtectedRoutes";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<HomeMenu />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ================= USER ================= */}
          <Route
            path="/cart"
            element={
              <AuthRoute>
                <Cart />
              </AuthRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <AuthRoute>
                <Checkout />
              </AuthRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <AuthRoute>
                <MyOrders />
              </AuthRoute>
            }
          />
           <Route
  path="/orders/:id"
  element={
    <AuthRoute>
      <OrderDetails />
    </AuthRoute>
  }
/>
<Route
  path="/profile"
  element={
    <AuthRoute>
      <Profile />
    </AuthRoute>
  }
/>

          <Route
            path="/track/:id"
            element={
              <AuthRoute>
                <OrderTracking />
              </AuthRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />

            {/* SUPERADMIN ONLY */}
            <Route
              path="users"
              element={
                <SuperAdminRoute>
                  <AdminUsers />
                </SuperAdminRoute>
              }
            />
          </Route>
        </Routes>
      </main>

      <Footer />
      <BottomNavbar />
    </div>
  );
}


