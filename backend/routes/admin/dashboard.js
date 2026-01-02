import { useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card p-4">
        <h3>Total Sales</h3>
        <p className="text-2xl font-bold">₹{stats.totalSales}</p>
      </div>

      <div className="card p-4">
        <h3>Total Orders</h3>
        <p className="text-2xl font-bold">{stats.ordersCount}</p>
      </div>

      <div className="card p-4">
        <h3>Delivered</h3>
        <p className="text-2xl font-bold">{stats.deliveredCount}</p>
      </div>

      <div className="card p-4">
        <h3>Pending</h3>
        <p className="text-2xl font-bold">{stats.pendingCount}</p>
      </div>
      <button
  onClick={() => window.print()}
  className="btn btn-primary mt-4"
>
  🖨 Print Monthly Report
</button>

    </div>
  );
}

