import React, { useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const STATUS_LIST = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // DATE FILTER
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= LOAD ORDERS ================= */
  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load orders failed:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;

    const orderDate = new Date(o.createdAt).toISOString().slice(0, 10);
    if (fromDate && orderDate < fromDate) return false;
    if (toDate && orderDate > toDate) return false;

    return true;
  });

  /* ================= STATUS UPDATE ================= */
  async function updateStatus(orderId, status) {
    const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.message || "Update failed");
    }

    loadOrders();
  }
window.dispatchEvent(new Event("order-updated"));
  /* ================= DELIVERY ASSIGN ================= */
  async function assignDelivery(orderId, partner) {
    await fetch(`${API}/admin/orders/${orderId}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(partner),
    });
  }

  /* ================= PRINT SINGLE ================= */
  function printOrder(order) {
    const win = window.open("", "", "width=800,height=600");

    win.document.write(`
      <html>
        <head>
          <title>Order ${order._id}</title>
          <style>
            body { font-family: Arial; padding: 20px }
            h2 { margin-bottom: 10px }
            table { width: 100%; border-collapse: collapse }
            td, th { border: 1px solid #ddd; padding: 8px }
          </style>
        </head>
        <body>
          <h2>Order #${order._id.slice(-6)}</h2>
          <p>Status: ${order.status}</p>
          <p>Customer: ${order.customer?.name}</p>
          <p>Phone: ${order.deliveryAddress?.phone}</p>
           <p><b>Address:</b><br/>
        ${order.deliveryAddress?.line1}<br/>
        ${order.deliveryAddress?.city},
        ${order.deliveryAddress?.state} - 
        ${order.deliveryAddress?.pincode}
      </p>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            ${order.items
              .map(
                (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.qty}</td>
                <td>₹${i.price * i.qty}</td>
              </tr>`
              )
              .join("")}
          </table>

          <h3>Total: ₹${order.totalAmount}</h3>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  }

  /* ================= PRINT ALL ================= */
 function printAllOrders() {
  if (!orders.length) {
    alert("No orders to print");
    return;
  }

  const win = window.open("", "", "width=900,height=650");

  win.document.write(`
    <html>
      <head>
        <title>All Orders</title>
        <style>
          body { font-family: Arial; padding: 20px }
          h2 { margin-top: 30px }
          table { width: 100%; border-collapse: collapse; margin-top: 10px }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left }
          hr { margin: 30px 0 }
        </style>
      </head>
      <body>
        <h1>All Orders Report</h1>
  `);

  orders.forEach((order, index) => {
    win.document.write(`
      <h2>${index + 1}. Order #${order._id.slice(-6)}</h2>
      <p><b>Customer:</b> ${order.customer?.name || "-"}</p>
      <p><b>Phone:</b> ${order.deliveryAddress?.phone || "-"}</p>
      <p><b>Status:</b> ${order.status}</p>

      <table>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${order.items
          .map(
            (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.qty}</td>
                <td>₹${i.price * i.qty}</td>
              </tr>
            `
          )
          .join("")}
      </table>

      <p><b>Total:</b> ₹${order.totalAmount}</p>
      <hr />
    `);
  });

  win.document.write(`
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
}


  /* ================= DELETE ================= */
  async function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return;
    await fetch(`${API}/admin/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadOrders();
  }

  async function clearAllOrders() {
    if (!window.confirm("⚠️ Clear ALL orders?")) return;
    await fetch(`${API}/admin/orders`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadOrders();
  }

  /* ================= UI ================= */
  if (loading) return <p className="text-center py-10">Loading orders…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={printAllOrders} className="btn btn-primary">
          🖨 Print All
        </button>
        {/* <button onClick={clearAllOrders} className="btn bg-red-600 text-white">
          Clear Orders
        </button>*/}
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          {STATUS_LIST.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          className="input"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* ORDERS */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="card p-4 space-y-2">
            <h2 className="font-bold">Order #{order._id.slice(-6)}</h2>
            <p>Status: {order.status}</p>
            <p>Customer: {order.customer?.name}</p>
            <p>
              <b>Phone:</b> {order.deliveryAddress?.phone}
            </p>
            <p>
              <b>Address:</b>
              <br />
              {order.deliveryAddress?.line1}
              <br />
              {order.deliveryAddress?.city},{order.deliveryAddress?.state} -
              {order.deliveryAddress?.pincode}
            </p>
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <b>Total: ₹{order.totalAmount}</b>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => printOrder(order)}
                className="btn btn-outline"
              >
                Print
              </button>
              <button
                onClick={() => deleteOrder(order._id)}
                className="btn btn-outline text-red-600"
              >
                Delete
              </button>
            </div>

            {/* STATUS UPDATE */}
<div className="mt-3">

  <p className="text-xs font-semibold text-gray-600 mb-2">
    Update Status
  </p>

  {/* ✅ MOBILE: BUTTONS */}
  <div className="flex flex-wrap gap-2 sm:hidden">
    {STATUS_LIST.map((s) => (
      <button
        key={s}
        onClick={() => updateStatus(order._id, s)}
        className={`
          px-3 py-2 rounded-full text-xs font-medium
          ${order.status === s
            ? "bg-orange-600 text-white"
            : "bg-gray-200 text-gray-700"}
        `}
      >
        {s}
      </button>
    ))}
  </div>

  {/* ✅ DESKTOP: DROPDOWN */}
  <div className="hidden sm:block">
    <select
      className="input w-56"
      value={order.status}
      onChange={(e) =>
        updateStatus(order._id, e.target.value)
      }
    >
      {STATUS_LIST.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>

</div>



            <input
              className="input mt-2"
              placeholder="Assign delivery partner"
              onBlur={(e) =>
                assignDelivery(order._id, {
                  name: e.target.value,
                  phone: "9876543210",
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
