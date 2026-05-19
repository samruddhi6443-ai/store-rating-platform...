import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
    imageUrl: ""
  });
  const [query, setQuery] = useState({ search: "", sort: "createdAt", order: "desc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStores = async () => {
    try {
      const response = await api.get("/admin/stores", { params: query });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stores");
    }
  };

  useEffect(() => {
    loadStores();
  }, [query]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/stores", form);
      setForm({ name: "", email: "", address: "", ownerId: "" });
      loadStores();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Stores</h1>
          <p className="text-slate-600">Create stores and review ratings.</p>
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Create Store</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="name"
            placeholder="Store name (20-60 chars)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="email"
            type="email"
            placeholder="Store email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="address"
            placeholder="Store address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="ownerId"
            placeholder="Owner user ID"
            value={form.ownerId}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <button
            className="rounded bg-slate-800 px-4 py-2 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 rounded border border-slate-200 px-3 py-2"
            placeholder="Search by name, email, or address"
            value={query.search}
            onChange={(e) => setQuery({ ...query, search: e.target.value })}
          />
          <select
            className="rounded border border-slate-200 px-3 py-2"
            value={query.sort}
            onChange={(e) => setQuery({ ...query, sort: e.target.value })}
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <select
            className="rounded border border-slate-200 px-3 py-2"
            value={query.order}
            onChange={(e) => setQuery({ ...query, order: e.target.value })}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                <td className="px-4 py-3">{store.email}</td>
                <td className="px-4 py-3">{store.address}</td>
                <td className="px-4 py-3">
                  {store.averageRating || 0} ({store.ratingCount || 0})
                </td>
                <td className="px-4 py-3">{store.owner?.name || "-"}</td>
                <td className="px-4 py-3">
                  {new Date(store.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStores;
