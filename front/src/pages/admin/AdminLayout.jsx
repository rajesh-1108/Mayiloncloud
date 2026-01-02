import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user } = useAuth();
  const isSuperadmin = user?.role === "superadmin";
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 sticky top-0">
      {/* OVERLAY (MOBILE) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={` fixed md:static z-40 w-64 bg-white shadow-lg p-4
        transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className="sidebar-link">
            📊 Dashboard
          </NavLink>

          <NavLink to="/admin/menu" className="sidebar-link">
            🍽 Menu
          </NavLink>

          <NavLink to="/admin/orders" className="sidebar-link">
            📦 Orders
          </NavLink>

          <NavLink to="/admin/customers" className="sidebar-link">
            👤 Customers
          </NavLink>

          {isSuperadmin && (
            <NavLink to="/admin/users" className="sidebar-link">
              🛡 Manage Admins
            </NavLink>
          )}
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1">
        {/* TOP BAR */}
        <header className="bg-white shadow p-3 flex items-center gap-3">
          {/* TOGGLE BUTTON */}
          <button
            className="md:hidden text-2xl p-2 rounded hover:bg-gray-200"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <div className="flex-1 font-semibold">
            Welcome, {user?.name || "Admin"}
          </div>

          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {user?.role}
          </span>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


