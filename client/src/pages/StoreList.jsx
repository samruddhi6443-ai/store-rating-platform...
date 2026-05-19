import React, { useEffect, useState } from "react";
import api from "../services/api";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState({ search: "", sort: "createdAt", order: "desc" });
  const [ratingInput, setRatingInput] = useState({});
  const [error, setError] = useState("");

  const loadStores = async () => {
    try {
      const response = await api.get("/stores", { params: query });
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stores");
    }
  };

  useEffect(() => {
    loadStores();
  }, [query]);

  const handleRate = async (store) => {
    const rating = ratingInput[store.id];
    if (!rating) return;

    try {
      if (store.myRatingId) {
        await api.put(`/ratings/${store.myRatingId}`, { rating });
      } else {
        await api.post("/ratings", { storeId: store.id, rating });
      }
      setRatingInput({ ...ratingInput, [store.id]: "" });
      loadStores();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save rating");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stores</h1>
          <p className="text-slate-600">Browse, rate, and update your reviews.</p>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          className="flex-1 rounded border border-slate-200 px-3 py-2"
          placeholder="Search by name or address"
          value={query.search}
          onChange={(e) => setQuery({ ...query, search: e.target.value })}
        />
        <select
          className="rounded border border-slate-200 px-3 py-2"
          value={query.sort}
          onChange={(e) => setQuery({ ...query, sort: e.target.value })}
        >
          <option value="createdAt">Newest</option>
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

      <div className="grid gap-6 md:grid-cols-2">
        {stores.map((store) => (
          <div key={store.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
                <p className="text-sm text-slate-600">{store.address}</p>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {store.averageRating ? store.averageRating.toFixed(1) : "0.0"} rating
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-600">
              Overall rating: <span className="font-semibold">{store.averageRating || 0}</span>
              {store.ratingCount ? ` (${store.ratingCount} reviews)` : " (no reviews)"}
            </div>

            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm text-slate-700">
                Your rating: <span className="font-semibold">{store.myRating || "Not rated"}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  className="rounded border border-slate-200 px-2 py-1 text-sm"
                  value={ratingInput[store.id] || ""}
                  onChange={(e) =>
                    setRatingInput({ ...ratingInput, [store.id]: e.target.value })
                  }
                >
                  <option value="">Select rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button
                  className="rounded bg-slate-800 px-3 py-1 text-sm text-white"
                  onClick={() => handleRate(store)}
                >
                  {store.myRatingId ? "Update Rating" : "Submit Rating"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
