import { useEffect, useState } from "react";
import { API } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const res = await fetch(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(await res.json());
  }

  async function cancelOrder(id) {
    if (!confirm("Cancel this order?")) return;

    await fetch(`${API}/orders/${id}/cancel`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadOrders();
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (orders.length === 0)
    return <p className="text-center">No orders yet</p>;

  return (
    <div className="container py-4">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.map((o) => (
        <div key={o._id} className="card p-4 mb-4">
          <div className="flex justify-between">
            <b>Order #{o._id.slice(-6)}</b>
            <span className="text-sm">{o.status}</span>
          </div>

          <div className="mt-2 text-sm">
            {o.items.map((i) => (
              <div key={i._id}>
                {i.name} × {i.qty}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3">
            <span>Total ₹{o.totalAmount}</span>

            {o.status !== "Delivered" && o.status !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(o._id)}
                className="text-red-600 text-sm underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

