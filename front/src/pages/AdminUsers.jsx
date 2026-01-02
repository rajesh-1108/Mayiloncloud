import React, { useEffect, useState } from "react";
import { API } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  const [tempPassword, setTempPassword] = useState(null);

  const isSuperadmin = user?.role === "superadmin";

  // Load users
  async function loadUsers() {
    const res = await fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Create Admin Account
  async function createUser(e) {
    e.preventDefault();
    if (!isSuperadmin) return alert("Only superadmin can create admins.");

    setCreating(true);

    const res = await fetch(`${API}/admin/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setTempPassword({
      email: data.user.email,
      password: data.tempPassword,
    });

    setForm({ name: "", email: "", role: "admin" });
    loadUsers();
    setCreating(false);
  }

  // Reset user password
  async function resetPassword(id) {
    if (!confirm("Reset password for this user?")) return;

    const res = await fetch(`${API}/admin/reset-user-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: id }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setTempPassword(data);
  }

  // Delete user
  async function deleteUser(id) {
    if (!confirm("Delete this user permanently?")) return;

    const res = await fetch(`${API}/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    loadUsers();
  }

  return (
    <div className="container py-4">
      <h1 className="text-3xl font-bold mb-4">Superadmin • User Management</h1>

      {/* Create Admin Form */}
      <div className="card p-4 mb-5">
        <h2 className="text-xl font-bold mb-2">Create New Admin Account</h2>

        <form onSubmit={createUser} className="grid gap-3">
          <input
            className="input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      {/* Temp password */}
      {tempPassword && (
        <div className="card p-4 mb-5">
          <h3 className="font-semibold">Temporary Password</h3>
          <p>Email: {tempPassword.email}</p>
          <p>Password: {tempPassword.password}</p>
          <p className="text-xs text-gray-500 mt-2">
            Share this only once. User must change password after login.
          </p>
        </div>
      )}

      {/* Users List */}
      <h2 className="text-2xl font-bold mb-3">All Users</h2>

      <div className="grid-menu">
        {users.map((u) => (
          <div key={u._id} className="card p-3">
            <h3 className="font-bold">{u.name}</h3>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-xs text-gray-400">Role: {u.role}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-outline"
                onClick={() => resetPassword(u._id)}
              >
                Reset PW
              </button>

              <button
                className="btn btn-outline"
                onClick={() => deleteUser(u._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

