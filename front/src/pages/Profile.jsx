import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { API } from "../api/client";

export default function Profile() {
const { user, token, refreshUser } = useAuth();

  const [form, setForm] = useState({
    label: "Home",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  if (!user) return null;

  /* ================= SAVE / UPDATE ADDRESS ================= */

async function addAddress() {
  

  const res = await fetch(`${API}/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || "Failed to save address");

  await refreshUser(); // ✅ FIX
  setForm({
    label: "Home",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
}



  /* ================= DELETE ADDRESS ================= */
  async function deleteAddress(index) {
  if (!window.confirm("Delete this address?")) return;

  const res = await fetch(`${API}/address/${index}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Failed to delete address");
    return;
  }

  await refreshUser(); // ✅ THIS IS THE KEY
}


  /* ================= INPUT HELPERS ================= */
  function onlyLetters(value) {
    return value.replace(/[^a-zA-Z\s]/g, "");
  }

  function onlyDigits(value, max) {
    return value.replace(/\D/g, "").slice(0, max);
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>

      {/* PROFILE INFO */}
      <div className="card p-4 space-y-2 mb-4">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>

        {user.photo && (
          <img
            src={user.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-2"
          />
        )}
      </div>

      {/* ADDRESSES */}
      <h2 className="text-lg font-semibold mb-3">My Addresses</h2>

<div className="space-y-4">
  {user.addresses?.map((a, i) => (
    <div
      key={i}
      className="bg-white rounded-xl border border-gray-200 p-4
                 shadow-sm hover:shadow-md transition"
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        {/* LABEL */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold
          ${
            a.label === "Home"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {a.label}
        </span>

        {/* ACTIONS */}
        <div className="flex gap-3 text-sm">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              setForm(a);
              setEditIndex(i);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => deleteAddress(i)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ADDRESS */}
      <p className="mt-3 text-gray-800 font-medium leading-relaxed">
        {a.line1}, {a.city} – {a.pincode}
      </p>

      {/* PHONE */}
      <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
        📞 {a.phone}
      </p>
    </div>
  ))}
</div>


      {/* ADDRESS FORM */}
      <div className="card p-4 space-y-2 mt-4">
        <h3 className="font-semibold">
          {editIndex !== null ? "Edit Address" : "Add New Address"}
        </h3>

        <select
          className="input"
          value={form.label}
          onChange={(e) =>
            setForm({ ...form, label: e.target.value })
          }
        >
          <option value="Home">🏠 Home</option>
          <option value="Work">🏢 Work</option>
        </select>

        <input
          className="input"
          placeholder="Address"
          value={form.line1}
          onChange={(e) =>
            setForm({ ...form, line1: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: onlyLetters(e.target.value) })
          }
        />

        <input
          className="input"
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: onlyLetters(e.target.value) })
          }
        />

        <input
          className="input"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({
              ...form,
              pincode: onlyDigits(e.target.value, 6),
            })
          }
        />

        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: onlyDigits(e.target.value, 10),
            })
          }
        />

        <button
          className="btn btn-primary w-full mt-2"
          onClick={addAddress}
        >
          {editIndex !== null ? "Update Address" : "Save Address"}
        </button>
      </div>
    </div>
  );
}


