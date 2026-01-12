import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/Namb.png";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // or user data key
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#2E110B] text-[#F8F5F1] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="NAMB Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl md:text-2xl font-bold tracking-wide text-[#E6B17E]">
             Admin Panel
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 font-medium items-center">
          <NavButton label="Categories" path="/categories" navigate={navigate} />
          <NavButton label="Products" path="/products" navigate={navigate} />
          <NavButton label="Orders" path="/orders" navigate={navigate} />
          <NavButton label="Clients & Reviews" path="/clients" navigate={navigate} />
          <NavButton label="Blogs" path="/blogs" navigate={navigate} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-[#E6B17E] text-[#2E110B] px-4 py-2 rounded-md hover:bg-[#d89c63] transition"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#432017] py-4 px-6 space-y-4 transition-all duration-300">
          <MobileNavItem label="Categories" path="/categories" navigate={navigate} setMenuOpen={setMenuOpen} />
          <MobileNavItem label="Products" path="/products" navigate={navigate} setMenuOpen={setMenuOpen} />
          <MobileNavItem label="Orders" path="/orders" navigate={navigate} setMenuOpen={setMenuOpen} />
          <MobileNavItem label="Clients & Reviews" path="/clients" navigate={navigate} setMenuOpen={setMenuOpen} />
          <MobileNavItem label="Blogs" path="/blogs" navigate={navigate} setMenuOpen={setMenuOpen} />

          {/* Logout (mobile) */}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full bg-[#E6B17E] text-[#2E110B] px-4 py-2 rounded-md hover:bg-[#d89c63] transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

// Desktop nav button
const NavButton = ({ label, path, navigate }) => (
  <button
    onClick={() => navigate(path)}
    className="cursor-pointer hover:text-[#E6B17E] transition duration-300"
  >
    {label}
  </button>
);

// Mobile nav item
const MobileNavItem = ({ label, path, navigate, setMenuOpen }) => (
  <div
    onClick={() => {
      navigate(path);
      setMenuOpen(false);
    }}
    className="cursor-pointer hover:text-[#E6B17E] transition duration-300 text-lg"
  >
    {label}
  </div>
);

export default Header;
