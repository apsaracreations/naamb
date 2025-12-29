import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Import FaEye and FaEyeSlash
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 New state for password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👈 New function to toggle password visibility
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
        toast.success(
          data.message ||
            (isSignup ? "Signup successful!" : "Login successful!"),
          { position: "top-center" }
        );

        if (isSignup) {
          // Stay in modal and switch to login mode after signup
          setTimeout(() => {
            setIsSignup(false);
            setFormData({ email: formData.email, password: "", name: "" });
          }, 1500);
        } else {
          // Store token & user then close
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

// ✅ Console check
console.log("Saved Token:", localStorage.getItem("token"));
console.log("Saved User:", JSON.parse(localStorage.getItem("user")));

          setTimeout(() => onClose(), 1500);
        }
      } else {
        toast.error(data.message || "Something went wrong!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Server error. Please try again later.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} hideProgressBar theme="colored" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 md:p-10 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            <FaTimes />
          </button>

          {/* Heading */}
          <h2 className="text-3xl font-serif text-[#3A2D2D] mb-4 text-center">
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm text-center">
            {isSignup
              ? "Join Apsara Institute to explore more opportunities."
              : "Login to continue your journey with Apsara Institute."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Full Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full outline-none text-gray-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  // 💡 Use showPassword state to toggle between 'password' and 'text'
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full outline-none text-gray-700"
                  required
                />
                {/* 💡 Password Toggle Button */}
                <button
                  type="button" // Important: set type="button" to prevent form submission
                  onClick={toggleShowPassword}
                  className="text-gray-400 ml-2 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} 
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3A2D2D] text-white cursor-pointer py-2 rounded-lg font-semibold hover:bg-[#513939] transition duration-300"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Sign Up"
                : "Login"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-sm text-gray-600 text-center">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-[#3A2D2D] font-semibold cursor-pointer hover:underline"
                  onClick={() => setIsSignup(false)}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  className="text-[#3A2D2D] font-semibold cursor-pointer hover:underline"
                  onClick={() => setIsSignup(true)}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;