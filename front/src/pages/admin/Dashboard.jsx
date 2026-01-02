import { useEffect, useState } from "react";
import { API } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch (err) {
        console.error(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
    const refresh = () => loadStats();
  window.addEventListener("order-updated", refresh);
   return () => {
    window.removeEventListener("order-updated", refresh);
  };
  }, [token]);

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!stats) return <p className="text-center py-10">No stats available</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat title="Today" value={stats.todaySales} />
        <Stat title="This Week" value={stats.weekSales} />
        <Stat title="This Month" value={stats.monthSales} />
        <Stat title="Total Sales" value={stats.totalSales} />
      </div>

      {/* ITEM SALES */}
      <div className="card p-4">
        <h2 className="font-bold mb-3">Top Selling Items</h2>

        {stats.itemSales.length === 0 && (
          <p className="text-sm text-gray-500">No sales yet</p>
        )}

        {stats.itemSales.map((item) => (
          <div
            key={item._id}
            className="flex justify-between text-sm py-1 border-b"
          >
            <span>{item._id}</span>
            <span>
              {item.qty} × ₹{item.revenue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">₹{value}</p>
    </div>
  );
}
