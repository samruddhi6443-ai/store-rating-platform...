import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-2xl font-bold text-white" to="/">
          🏪 Store Rating
        </Link>
        {user ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm bg-slate-700 px-3 py-1 rounded">
                {user.name}
              </span>
              <span className="text-xs bg-slate-600 px-2 py-1 rounded">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {user.role === "ADMIN" && (
                <>
                  <Link className="hover:text-amber-200" to="/admin/dashboard">
                    Dashboard
                  </Link>
                  <Link className="hover:text-amber-200" to="/admin/users">
                    Users
                  </Link>
                  <Link className="hover:text-amber-200" to="/admin/stores">
                    Stores
                  </Link>
                </>
              )}
              {user.role === "STORE_OWNER" && (
                <Link className="hover:text-amber-200" to="/owner/dashboard">
                  Dashboard
                </Link>
              )}
              {user.role === "USER" && (
                <Link className="hover:text-amber-200" to="/stores">
                  Stores
                </Link>
              )}
              <Link className="hover:text-amber-200" to="/account">
                Account
              </Link>
            </div>

            <button
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              className="rounded px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="rounded bg-white text-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition"
              to="/register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
