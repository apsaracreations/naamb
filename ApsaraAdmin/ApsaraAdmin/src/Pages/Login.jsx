import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success("Login Successful 🎉");
      setTimeout(() => navigate("/orders"), 900);

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#eeceb1">
      {/* 🚀 Toast Renderer */}
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleLogin}
        className="bg-[#432017] p-8 rounded-lg shadow-lg w-[350px] text-[#F8F5F1]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Admin Login
        </h2>

        <label className="block mb-2 text-sm">Username</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-[#9f7a73] text-white outline-none mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 pr-10 rounded bg-[#9f7a73] text-white outline-none mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-[#F8F5F1] hover:text-white cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#eeceb1] text-[#2E110B] py-2 rounded-md font-semibold hover:bg-[#d89c63] transition disabled:bg-gray-400 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
