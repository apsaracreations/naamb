import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Namb.png";
import ShopPage from "./ShopPage";
import Login from "./Login";

const API_URL = import.meta.env.VITE_API_URL;
const HEADER_HEIGHT = 96;

const Header = () => {
  const navigate = useNavigate();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // --- Fetch Cart Logic ---
  const fetchCartCount = useCallback(async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      setCartCount(0);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id || parsedUser.id;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API_URL}/cart/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data?.products) {
        const total = data.products.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0
        );
        setCartCount(total);
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  }, []);

  // --- Real-Time Sync Logic ---
  useEffect(() => {
    const syncEverything = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      fetchCartCount();
    };

    syncEverything();

    window.addEventListener("storage", syncEverything);
    window.addEventListener("userLogin", syncEverything);
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("storage", syncEverything);
      window.removeEventListener("userLogin", syncEverything);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, [fetchCartCount]);

  // Lock scroll when menus are open
  useEffect(() => {
    document.body.style.overflow =
      isShopOpen || isLoginOpen || isMobileMenuOpen ? "hidden" : "unset";
  }, [isShopOpen, isLoginOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCartCount(0);
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
      setIsMobileMenuOpen(false);
    } else {
      toast.info("Please login to access the cart");
      setIsLoginOpen(true);
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Shop", action: () => setIsShopOpen(true) },
    { label: "Training", path: "/training" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Blog", path: "/blog" },
    { label: "Track Orders", path: "/tracking" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <ToastContainer hideProgressBar autoClose={1000} theme="colored" />
      <header
        className="sticky top-0 left-0 right-0 z-50 bg-[#310000] shadow-lg"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center h-full px-6 relative">
          {/* 📱 Mobile Toggle */}
          <button
            className="xl:hidden text-2xl z-50 p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* 💻 Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-7 font-medium text-white flex-1">
            {menuItems.map(({ label, path, action }, idx) => (
              <button
                key={idx}
                onClick={() => (action ? action() : handleNavigate(path))}
                className="hover:text-[#E6B17E] transition-colors text-[13px] uppercase tracking-wide"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* 🏛️ Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <button
              onClick={() => handleNavigate("/")}
              className="pointer-events-auto"
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </button>
          </div>

          {/* 🛒 Right Side Icons */}
          <div className="flex items-center justify-end space-x-5 text-white flex-1 z-50">
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:text-[#E6B17E] text-2xl transition-colors"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E6B17E] text-[#310000] text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#310000]">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs hidden lg:block opacity-80 italic">
                  Hi, {user.name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-[11px] font-bold uppercase border border-[#E6B17E]/50 px-3 py-1.5 rounded hover:bg-[#E6B17E] hover:text-[#310000] transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-2 hover:text-[#E6B17E] text-2xl transition-colors"
              >
                <FaUser />
              </button>
            )}
          </div>
        </div>

        {/* 📱 Mobile Drawer Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[96px] bg-[#310000] z-40 flex flex-col p-8 space-y-6 xl:hidden overflow-y-auto">
            {menuItems.map(({ label, path, action }, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action) action();
                  else handleNavigate(path);
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl text-left border-b border-white/10 pb-4 text-white hover:text-[#E6B17E] transition-colors"
              >
                {label}
              </button>
            ))}
            
            {/* Mobile Logout (visible only when logged in) */}
            {user && (
              <button
                onClick={handleLogout}
                className="text-[#E6B17E] text-left text-xl font-bold uppercase pt-4"
              >
                Logout Account
              </button>
            )}
          </div>
        )}
      </header>

      {isShopOpen && <ShopPage isOverlay onClose={() => setIsShopOpen(false)} />}
      {isLoginOpen && <Login isOverlay onClose={() => setIsLoginOpen(false)} />}
    </>
  );
};

export default Header;