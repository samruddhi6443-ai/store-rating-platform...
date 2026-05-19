import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
    storeName: "",
    storePhoto: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, storePhoto: file });
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // For store owner, use FormData to handle file upload
      if (form.role === "STORE_OWNER") {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("address", form.address);
        formData.append("role", form.role);
        formData.append("storeName", form.storeName);
        if (form.storePhoto) {
          formData.append("storePhoto", form.storePhoto);
        }

        await api.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // For regular users and admins, send JSON
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
          role: form.role
        });
      }

      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Create Account</h1>
        <p className="text-slate-600 mb-6">Join us to rate and explore stores</p>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name (20-60 characters)
            </label>
            <input
              className="w-full rounded border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              Password (8-16 chars, 1 uppercase, 1 special)
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address (max 400 characters)
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800 resize-none"
              name="address"
              placeholder="123 Main Street, City, State"
              value={form.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Account Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={form.role === "USER"}
                  onChange={handleChange}
                />
                <div>
                  <span className="text-sm font-medium text-slate-800">Regular User</span>
                  <p className="text-xs text-slate-600">Rate and review stores</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="STORE_OWNER"
                  checked={form.role === "STORE_OWNER"}
                  onChange={handleChange}
                />
                <div>
                  <span className="text-sm font-medium text-slate-800">Store Owner</span>
                  <p className="text-xs text-slate-600">Manage your store</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={form.role === "ADMIN"}
                  onChange={handleChange}
                />
                <div>
                  <span className="text-sm font-medium text-slate-800">Administrator</span>
                  <p className="text-xs text-slate-600">Manage platform</p>
                </div>
              </label>
            </div>
          </div>

          {/* Store Owner Specific Fields */}
          {form.role === "STORE_OWNER" && (
            <>
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Store Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Store Name *
                  </label>
                  <input
                    className="w-full rounded border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    type="text"
                    name="storeName"
                    placeholder="Your Store Name"
                    value={form.storeName}
                    onChange={handleChange}
                    required={form.role === "STORE_OWNER"}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Store Photo *
                  </label>
                  {photoPreview && (
                    <div className="mb-3">
                      <img
                        src={photoPreview}
                        alt="Store preview"
                        className="w-full h-32 object-cover rounded border border-slate-300"
                      />
                    </div>
                  )}
                  <input
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-slate-800 file:text-white
                      hover:file:bg-slate-700"
                    type="file"
                    name="storePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={form.role === "STORE_OWNER"}
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    Image will be compressed to 320KB automatically
                  </p>
                </div>
              </div>
            </>
          )}

          <button
            className="w-full rounded bg-slate-800 px-4 py-2 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-50 mt-6"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="text-slate-800 font-semibold underline hover:no-underline" to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
