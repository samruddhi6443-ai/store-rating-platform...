import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { setAuth } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      setAuth(response.data.token, response.data.user);
      const role = response.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STORE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/stores");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Welcome Back</h1>
        <p className="text-slate-600 mb-6">Sign in to your account</p>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              className="w-full rounded border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              className="w-full rounded border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="w-full rounded bg-slate-800 px-4 py-2 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link className="text-slate-800 font-semibold underline hover:no-underline" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
