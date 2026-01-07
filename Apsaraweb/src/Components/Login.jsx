import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// 1. Import the Google Login component
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup && !formData.name.trim()) {
      toast.warn("Please enter your name!", { position: "top-center" });
      return;
    }

    setLoading(true);
    const endpoint = isSignup ? "/users/register" : "/users/login";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success(data.message || (isSignup ? "Signup successful!" : "Login successful!"));
        if (isSignup) {
          setTimeout(() => {
            setIsSignup(false);
            setFormData({ email: formData.email, password: "", name: "" });
          }, 1500);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => onClose(), 1500);
        }
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Server error. Please try again later.");
    }
  };

  // 2. Handle Google Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Google Login Successful!");
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error(data.message || "Google authentication failed");
      }
    } catch (err) {
      toast.error("Server error during Google login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} hideProgressBar theme="colored" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 md:p-10 relative">
          <button onClick={onClose} className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800 text-xl">
            <FaTimes />
          </button>

          <h2 className="text-3xl font-serif text-[#3A2D2D] mb-4 text-center">
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full outline-none text-gray-700" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full outline-none text-gray-700" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full outline-none text-gray-700" required />
                <button type="button" onClick={toggleShowPassword} className="text-gray-400 ml-2 hover:text-gray-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#3A2D2D] text-white cursor-pointer py-2 rounded-lg font-semibold hover:bg-[#513939] transition duration-300">
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* 3. Divider and Google Button */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-white px-3 text-sm text-gray-400 absolute">OR</span>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                theme="outline"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600 text-center">
            {isSignup ? (
              <p>Already have an account? <button className="text-[#3A2D2D] font-semibold cursor-pointer hover:underline" onClick={() => setIsSignup(false)}>Login here</button></p>
            ) : (
              <p>Don’t have an account? <button className="text-[#3A2D2D] font-semibold cursor-pointer hover:underline" onClick={() => setIsSignup(true)}>Sign up</button></p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;