import { useEffect, useState } from "react";
import * as api from "../lib/api";
import Badge from "../components/Badge";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.fetchDashboardStats(), api.fetchRecentDonations()]).then(
      ([statsData, donationsData]) => {
        setStats(statsData);
        setDonations(donationsData);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-4xl">FoodRescue dashboard</h1>
      <p className="mt-3 text-ink-soft max-w-lg">The community's impact so far.</p>

      {loading || !stats ? (
        <p className="mt-10 text-ink-soft">Loading dashboard…</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Meals rescued" value={stats.mealsRescued.toLocaleString()} />
            <StatCard label="Food saved" value={`${stats.kgSaved}kg`} />
            <StatCard label="Food providers" value={stats.foodProviders} />
            <StatCard label="Successful claims" value={stats.successfulClaims} />
          </div>

          <section className="mt-14">
            <h2 className="font-display text-2xl mb-5">Recent donations</h2>
            <div className="border border-ink/10 bg-white overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="text-left border-b border-ink/10 text-ink-soft">
                    <th className="px-4 py-3 font-semibold">Food</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3">{d.foodName}</td>
                      <td className="px-4 py-3 text-ink-soft">{d.location}</td>
                      <td className="px-4 py-3">{d.quantity}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.status === "available" ? "available" : "claimed"}>
                          {d.status === "available" ? "Available" : "Claimed"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-ink/10 bg-white px-5 py-6 text-center">
      <p className="font-display text-3xl sm:text-4xl text-leaf-deep">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
