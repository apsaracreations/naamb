import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react"; // optional icon

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // 👇 Auto-scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // 👇 Show button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👇 Button click handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 bg-[#3A3F2D] hover:bg-[#2f3325] text-white"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ArrowUp size={22} />
    </button>
  );
};

export default ScrollToTop;
