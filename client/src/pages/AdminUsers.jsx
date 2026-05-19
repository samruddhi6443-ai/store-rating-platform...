import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });
  const [query, setQuery] = useState({
    search: "",
    role: "",
    sort: "createdAt",
    order: "desc"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users", { params: query });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [query]);

  const loadUserDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/admin/users/${userId}`);
      setDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/users", form);
      setForm({ name: "", email: "", password: "", address: "", role: "USER" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-600">Create and review user accounts.</p>
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Create User</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="name"
            placeholder="Full name (20-60 chars)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="rounded border border-slate-200 px-3 py-2"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <select
            className="rounded border border-slate-200 px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="USER">USER</option>
            <option value="STORE_OWNER">STORE_OWNER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
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
            value={query.role}
            onChange={(e) => setQuery({ ...query, role: e.target.value })}
          >
            <option value="">All roles</option>
            <option value="USER">USER</option>
            <option value="STORE_OWNER">STORE_OWNER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select
            className="rounded border border-slate-200 px-3 py-2"
            value={query.sort}
            onChange={(e) => setQuery({ ...query, sort: e.target.value })}
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
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

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.address}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-sm font-semibold text-slate-800 underline"
                      onClick={() => {
                        setSelectedUser(user.id);
                        loadUserDetails(user.id);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">User Details</h2>
          {!selectedUser && <p className="text-sm text-slate-500">Select a user to view details.</p>}
          {detailsLoading && <p className="text-sm text-slate-500">Loading...</p>}
          {!detailsLoading && details && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-semibold text-slate-900">{details.user.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-semibold text-slate-900">{details.user.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Address</p>
                <p className="font-semibold text-slate-900">{details.user.address}</p>
              </div>
              <div>
                <p className="text-slate-500">Role</p>
                <p className="font-semibold text-slate-900">{details.user.role}</p>
              </div>
              {details.ownerSummary && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Store Owner Rating</p>
                  <p className="font-semibold text-slate-900">
                    Average rating: {details.ownerSummary.averageRating}
                  </p>
                  <p className="text-slate-600">
                    Stores: {details.ownerSummary.storeCount}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
