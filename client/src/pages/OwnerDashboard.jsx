import React, { useEffect, useState } from "react";
import api from "../services/api";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/owner/dashboard");
        setStores(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Owner Dashboard</h1>
      <p className="mb-6 text-slate-600">Track store ratings and customer feedback.</p>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {stores.map((store) => (
        <div key={store.id} className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
              <p className="text-sm text-slate-600">
                Average rating: <span className="font-semibold">{store.averageRating}</span>
              </p>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {store.ratings.length} ratings
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {store.ratings.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">{item.user.name}</td>
                    <td className="px-3 py-2">{item.user.email}</td>
                    <td className="px-3 py-2">{item.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!store.ratings.length && (
              <p className="px-3 py-2 text-sm text-slate-500">
                No ratings yet.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;
