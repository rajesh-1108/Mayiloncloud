import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="container text-center py-10">
      <h1 className="text-2xl font-bold text-green-600">
        🎉 Order Placed Successfully!
      </h1>

      <p className="mt-2 text-gray-600">
        Order ID: {id}
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <Link to={`/track/${id}`} className="btn btn-primary">
          Track Order
        </Link>
        <Link to="/orders" className="btn btn-outline">
          My Orders
        </Link>
      </div>
    </div>
  );
}
