import { useEffect, useState } from "react";
import { API } from "../api/client";

export default function ReviewsList({ itemId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${API}/reviews/item/${itemId}`)
      .then((r) => r.json())
      .then(setReviews);
  }, [itemId]);

  if (reviews.length === 0)
    return <p className="text-sm text-gray-500">No reviews yet</p>;

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r._id} className="border p-3 rounded">
          <div className="flex justify-between">
            <b>{r.user.name}</b>
            <span className="text-yellow-400">
              {"★".repeat(r.rating)}
            </span>
          </div>
          {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
