import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getUser, getToken } from "../services/auth";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501776192219-1c2a7fca7b24?auto=format&fit=crop&w=1200&q=80";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();
  const token = getToken();

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      let url = "/stores";
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }

      const response = await api.get(url);
      setStores(response.data);
    } catch (err) {
      // If not authenticated, just show empty state
      if (err.response?.status === 401) {
        setStores([]);
      } else {
        setError(err.response?.data?.message || "Failed to load stores");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              Trusted local store reviews
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Discover top-rated stores and share your experience
            </h1>
            <p className="text-lg text-slate-200">
              Search, compare, and rate stores with confidence. Join a growing community helping each other shop smarter.
            </p>

            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 rounded-lg bg-white/10 p-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or address"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-md bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-amber-400 px-6 py-3 font-semibold text-slate-900 hover:bg-amber-300"
              >
                Search Stores
              </button>
            </form>

            {!user && (
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-md bg-white px-6 py-2 font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md border border-white/60 px-6 py-2 font-semibold text-white hover:bg-white hover:text-slate-900"
                >
                  Create Account
                </Link>
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-300">★</span>
                <span>Real reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-300">★</span>
                <span>Verified ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-300">★</span>
                <span>Local insights</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-full w-full rounded-3xl border border-white/10" />
            <div className="relative overflow-hidden rounded-3xl bg-white/5 p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80"
                alt="A modern storefront"
                className="h-80 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 px-4 py-3 text-slate-900 shadow">
                <p className="text-xs uppercase tracking-wide text-slate-500">Top Rated</p>
                <p className="text-sm font-semibold">Neighborhood Market</p>
                <p className="text-xs text-slate-600">4.8 average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {search ? `Search Results for "${search}"` : "Available Stores"}
            </h2>
            <p className="text-slate-600">
              {stores.length} store{stores.length === 1 ? "" : "s"} listed
            </p>
          </div>
          {!user && (
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-700 shadow">
              Sign in to rate stores and save your reviews.
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-slate-600">Loading stores...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && stores.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-slate-600 text-lg mb-4">No stores found</p>
            {!user && (
              <p className="text-slate-500">
                <Link to="/login" className="text-slate-800 underline">
                  Login
                </Link>{" "}
                to rate stores and share feedback
              </p>
            )}
          </div>
        )}

        {!loading && stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={store.imageUrl || FALLBACK_IMAGE}
                    alt={store.name}
                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                    {store.averageRating ? store.averageRating.toFixed(1) : "0.0"} ★
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">
                      {store.name}
                    </h3>
                    <p className="text-sm text-slate-600">{store.address}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {store.ratingCount || 0} review{store.ratingCount === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-4 border-t pt-4">
                  {token ? (
                    store.myRating ? (
                      <p className="text-sm text-slate-700">
                        Your rating: <span className="font-semibold">{store.myRating}/5</span>
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">No rating yet</p>
                    )
                  ) : (
                    <p className="text-sm text-slate-500">Login to rate this store</p>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  {token ? (
                    <Link
                      to="/stores"
                      className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Rate Store
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Login to Rate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
