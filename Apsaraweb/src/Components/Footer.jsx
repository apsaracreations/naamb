import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import Logo from "../assets/Namb.png";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaLinkedin, FaCode } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

const policyTexts = {
  "Privacy Policy":
    "Your privacy is important to us. We do not share your personal information with any third parties. All payment and personal data are protected using secure encryption methods.",

  "Shipping Policy":
    "We ship all orders within India. Orders are delivered within 3–4 business days after confirmation. Delivery timelines may slightly vary depending on the location.",

  "Terms and Conditions":
    "By placing an order with Naamb, you agree to abide by our terms and conditions, including product usage, pricing policies, and intellectual property rights.",

  "No Cash on Delivery (COD)":
    "We currently do not offer Cash on Delivery (COD). All orders must be prepaid at the time of purchase to ensure safe and smooth transactions.",

  "Exchange Policy":
    "Exchanges are allowed only in case of wrong product delivery or if the product is damaged from our side. Customers must contact us within 7 days of receiving the product and must provide a proper unpacking video as proof. Products without an unpacking video will not be eligible for exchange.",

  "Cancellations and Refunds":
    "We do not provide cancellations or refunds once the order is placed. Please review your order carefully before confirming the purchase."
};


  const openModal = (title) => {
    setModalTitle(title);
    setModalContent(policyTexts[title]);
    setModalOpen(true);
  };

  return (
    <footer className="bg-[#1A1D14] text-gray-300 pt-16 pb-8 px-6 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* ---------- TOP SECTION: BRAND & LINKS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <img src={Logo} alt="Namb Logo" className="w-32 brightness-110 cursor-pointer" onClick={() => navigate("/")} />
            <p className="text-sm leading-relaxed opacity-80">
              Elevating everyday style with curated, high-quality handcrafted fashion. 
              Discover the art of responsible luxury.
            </p>
            <div className="flex gap-4 text-xl">
               <a href="https://instagram.com/namb" target="_blank" rel="noreferrer" className="hover:text-[#E6B17E] transition-all transform hover:-translate-y-1"><FaInstagram/></a>
               <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" className="hover:text-[#E6B17E] transition-all transform hover:-translate-y-1"><FaWhatsapp/></a>
               <a href="mailto:support@namb.com" className="hover:text-[#E6B17E] transition-all transform hover:-translate-y-1"><FaEnvelope/></a>
            </div>
          </div>

          {/* Our Pages */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Our Pages</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigate("/training")} className="hover:text-[#E6B17E] transition-colors">Training</button></li>
              <li><button onClick={() => navigate("/blog")} className="hover:text-[#E6B17E] transition-colors">Our Blog</button></li>
              <li><button onClick={() => navigate("/about")} className="hover:text-[#E6B17E] transition-colors">About Us</button></li>
              <li><button onClick={() => navigate("/contact")} className="hover:text-[#E6B17E] transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => navigate("/tracking")} className="hover:text-[#E6B17E] transition-colors">Track Your Order</button></li>
              <li><button onClick={() => navigate("/login")} className="hover:text-[#E6B17E] transition-colors">My Account / Login</button></li>
              {["Shipping Policy", "Exchange Policy", "No COD Policy"].map((item) => (
                <li key={item}>
                  <button onClick={() => openModal(item)} className="hover:text-[#E6B17E] transition-colors text-left">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h3>
            <ul className="space-y-4 text-sm">
              {["Privacy Policy", "Terms and Conditions", "Cancellations and Refunds"].map((item) => (
                <li key={item}>
                  <button onClick={() => openModal(item)} className="hover:text-[#E6B17E] transition-colors text-left">{item}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- DIVIDER ---------- */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* ---------- BOTTOM SECTION ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-50 order-2 md:order-1">
            © {new Date().getFullYear()} Namb Studio. All rights reserved.
          </p>

          {/* DEVELOPER PILL */}
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 order-1 md:order-2 shadow-lg group hover:border-[#E6B17E]/50 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
              <FaCode className="text-[#E6B17E]" /> Designed & Developed by
            </span>
            <div className="h-4 w-[1px] bg-gray-600"></div>
            <div className="flex gap-5 items-center">
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="text-white hover:text-[#E6B17E] transition-all hover:scale-125"><FaLinkedin size={16}/></a>
              <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" className="text-white hover:text-[#E6B17E] transition-all hover:scale-125"><FaWhatsapp size={16}/></a>
              <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" className="text-white hover:text-[#E6B17E] transition-all hover:scale-125"><FaInstagram size={16}/></a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#1A1D14] p-8 rounded-3xl max-w-lg w-full relative shadow-2xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-6 text-3xl font-light hover:text-red-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 border-b pb-3 uppercase tracking-tight">{modalTitle}</h2>
            <p className="text-sm leading-relaxed text-gray-600 mb-8">{modalContent}</p>
            <button 
              onClick={() => setModalOpen(false)}
              className="w-full py-4 bg-[#1A1D14] text-white rounded-2xl font-bold text-xs tracking-[0.2em] hover:bg-[#E6B17E] hover:text-black transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;