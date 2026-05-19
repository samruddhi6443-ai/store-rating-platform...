import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mb-6 text-slate-600">Platform overview and key totals.</p>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {!data ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-3xl font-semibold text-slate-900">{data.totalUsers}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Stores</p>
            <p className="text-3xl font-semibold text-slate-900">{data.totalStores}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Ratings</p>
            <p className="text-3xl font-semibold text-slate-900">{data.totalRatings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
