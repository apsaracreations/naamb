import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { adminFetch, getAdminToken, setAdminToken } from "../api";
import { Button, Field, inputCls } from "../components/ui";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (getAdminToken()) return <Navigate to="/admin/orders" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminFetch("/admin/login", { method: "POST", json: { username, password } });
      setAdminToken(data.token);
      toast.success("Welcome back!");
      navigate("/admin/orders", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#310000]">
              <img src="/Namb.png" alt="Naamb" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-xl font-semibold text-stone-900">Admin Login</h1>
            <p className="mt-1 text-sm text-stone-500">Sign in to manage the Naamb store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Username">
              <input
                className={inputCls}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" loading={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <Link to="/" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-stone-500 hover:text-stone-800">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </div>
  );
};

export default Login;
