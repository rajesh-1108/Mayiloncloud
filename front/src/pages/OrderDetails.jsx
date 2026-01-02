import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [id, token]);

  async function submitReview() {
    const res = await fetch(`${API}/orders/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setOrder(data);
  }

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="container max-w-lg mx-auto py-4">
      <h1 className="text-xl font-bold mb-3">Order Details</h1>

      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.status}</p>

        <hr />

        {/* ITEMS */}
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{i.name} × {i.qty}</span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}

        <hr />

        {/* STATUS TIMELINE */}
        <div>
          <h3 className="font-semibold mb-2">Order Status</h3>
          {order.statusTimeline?.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-3 h-3 rounded-full bg-green-600 mt-1" />
              <div>
                <p className="font-medium">{s.status}</p>
                <p className="text-xs text-gray-500">
                  {new Date(s.time).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <hr />

        {/* ⭐ REVIEW SECTION */}
        {order.status === "Delivered" && !order.review && (
          <div>
            <h3 className="font-semibold mb-2">Rate Your Order</h3>

            <select
              className="input mb-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>

            <textarea
              className="input"
              placeholder="Write your feedback…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              className="btn btn-primary w-full mt-2"
              onClick={submitReview}
            >
              Submit Review
            </button>
          </div>
        )}

        {/* SHOW REVIEW */}
        {order.review && (
          <div>
            <h3 className="font-semibold mb-1">Your Review</h3>
            <p>⭐ {order.review.rating} / 5</p>
            <p className="text-sm text-gray-600">
              {order.review.comment}
            </p>
          </div>
        )}

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}

