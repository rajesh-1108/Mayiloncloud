import React, { useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin", // superadmin creates only admin
  });

  const [tempPassword, setTempPassword] = useState(null);

  const isSuperadmin = user?.role === "superadmin";

  // ============================
  // LOAD USERS
  // ============================
  async function loadUsers() {
    setLoading(true);

    const res = await fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================
  // CREATE ADMIN USER
  // ============================
  async function createUser(e) {
    e.preventDefault();

    if (!isSuperadmin) {
      return alert("❌ Only Superadmin can create Admin accounts.");
    }

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

    if (!res.ok) {
      alert(data.message);
      setCreating(false);
      return;
    }

    // show temp password
    setTempPassword({
      email: data.user.email,
      password: data.tempPassword,
    });

    // clear form
    setForm({ name: "", email: "", role: "admin" });
    setCreating(false);
    loadUsers();
  }

  // ============================
  // RESET PASSWORD
  // ============================
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

  // ============================
  // DELETE USER
  // ============================
  async function deleteUser(id) {
    if (!confirm("Delete this user permanently?")) return;

    const res = await fetch(`${API}/admin/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);

    loadUsers();
  }

  // ============================
  // UI STARTS
  // ============================

  if (loading) return <div>Loading admins…</div>;

  return (
    <div className="container py-4">

      <h1 className="text-3xl font-bold mb-4">Superadmin • Manage Admins</h1>

      {/* CREATE ADMIN */}
      <div className="card p-4 mb-5">
        <h2 className="text-xl font-bold mb-2">Create New Admin</h2>

        <form onSubmit={createUser} className="grid gap-3">

          <input
            className="input"
            placeholder="Full Name"
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
            {creating ? "Creating…" : "Create Admin"}
          </button>
        </form>
      </div>

      {/* TEMP PASSWORD DISPLAY */}
      {tempPassword && (
        <div className="card p-4 mb-5">
          <div className="font-semibold">Temporary Login Credentials</div>
          <p className="text-sm mt-2"><b>Email:</b> {tempPassword.email}</p>
          <p className="mt-2 p-2 bg-gray-200 rounded font-mono">
            {tempPassword.password}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Share this password only one time.  
            User must change password after first login.
          </p>
        </div>
      )}

      {/* USERS LIST */}
      <h2 className="text-2xl font-bold mb-3">All Admin Accounts</h2>

      <div className="grid-menu">
        {users.map((u) => (
          <div key={u._id} className="card p-4">

            <h3 className="font-bold text-lg">{u.name}</h3>
            <p className="text-sm text-gray-600">{u.email}</p>
            <p className="text-xs text-gray-500 capitalize">Role: {u.role}</p>

            <div className="flex gap-2 mt-4">
              <button
                className="btn btn-outline w-full"
                onClick={() => resetPassword(u._id)}
              >
                Reset PW
              </button>

              {/* Superadmin cannot delete himself */}
              {user._id !== u._id && (
                <button
                  className="btn btn-outline w-full"
                  onClick={() => deleteUser(u._id)}
                >
                  Delete
                </button>
              )}
            </div>

          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No admins found.
          </div>
        )}
      </div>
    </div>
  );
}
