import React, { useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCustomers() {
    setLoading(true);

    const res = await fetch(`${API}/admin/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  // Block or Unblock user
  async function toggleBlock(id, status) {
    const res = await fetch(`${API}/admin/customers/block`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, blocked: status }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    loadCustomers();
  }

  if (loading) return <div>Loading customers…</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Customer Management</h1>

      <div className="grid gap-4">
        {customers.map((c) => (
          <div key={c._id} className="card p-4">

            <h2 className="font-bold text-lg">
              {c.name}{" "}
              {c.blocked && (
                <span className="text-xs text-red-600 ml-2">(Blocked)</span>
              )}
            </h2>

            <p className="text-sm text-gray-600">{c.email}</p>
            <p className="text-sm text-gray-600">{c.phone || "No phone"}</p>

            <p className="text-sm text-gray-500 mt-1">
              Total Orders: {c.orderCount}
            </p>

            <div className="flex gap-2 mt-3">
              {c.blocked ? (
                <button
                  className="btn btn-outline w-full"
                  onClick={() => toggleBlock(c._id, false)}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="btn btn-outline w-full"
                  onClick={() => toggleBlock(c._id, true)}
                >
                  Block
                </button>
              )}
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
