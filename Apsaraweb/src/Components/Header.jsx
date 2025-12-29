import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Namb.png";
import ShopPage from "./ShopPage";
import Login from "./Login";

const HEADER_HEIGHT = 96;
const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
  const navigate = useNavigate();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0); // New state for count
  const mobileMenuRef = useRef(null);

  // 1. Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Fetch Cart Count Logic
  useEffect(() => {
    const fetchCartCount = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!storedUser || !token) {
        setCartCount(0);
        return;
      }

      const userId = JSON.parse(storedUser)._id || JSON.parse(storedUser).id;

      try {
        const res = await fetch(`${API_URL}/cart/get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.products) {
          // Calculate total quantity of all items in cart
          const total = data.products.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        }
      } catch (err) {
        console.error("Error fetching cart count:", err);
      }
    };

    fetchCartCount();
    
    // Optional: Listen for a custom event if items are added elsewhere
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, [user]); // Re-run when user logs in/out

  useEffect(() => {
    document.body.style.overflow =
      isShopOpen || isLoginOpen || isMobileMenuOpen ? "hidden" : "unset";
  }, [isShopOpen, isLoginOpen, isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
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
      <ToastContainer hideProgressBar autoClose={1500} theme="colored" />

      <header
        className="sticky top-0 left-0 right-0 z-50 bg-[#310000]/95 backdrop-blur-md shadow-lg"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full text-white relative">
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            {menuItems.map(({ label, path, action }, idx) => (
              <button
                key={idx}
                onClick={() => (action ? action() : handleNavigate(path))}
                className="hover:text-[#E6B17E] transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <button onClick={() => handleNavigate("/")}>
              <img src={Logo} alt="Logo" className="h-20 md:h-24 object-contain" />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6 text-xl">
            
            {/* CART ICON WITH BADGE */}
            <button onClick={handleCartClick} className="relative p-2 hover:text-[#E6B17E] transition-colors">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#E6B17E] text-[#310000] text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#310000] animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs hidden lg:block opacity-80">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className="text-xs uppercase tracking-tighter border border-white/30 px-2 py-1 rounded hover:bg-white hover:text-black transition">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hover:text-[#E6B17E]">
                <FaUser />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {isShopOpen && <ShopPage isOverlay onClose={() => setIsShopOpen(false)} />}
      {isLoginOpen && <Login isOverlay onClose={() => setIsLoginOpen(false)} />}
    </>
  );
};

export default Header;