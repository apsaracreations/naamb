import React, { useState, useEffect } from "react";
import TrendingProducts from "../Components/TrendingProducts";
import Categories from "../Components/Categories";
import ContactHome from "../Components/ContactHome";
import Logo from "../assets/Namb.png"; 
import ClientHome from "../Components/ClientHome";
import { useNavigate } from 'react-router-dom';
import ShopPage from '../Components/ShopPage';

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${API_ROOT}/${p}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [isShopOpen, setIsShopOpen] = useState(false); 
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Scroll lock effect (copied from Header, good practice)
  useEffect(() => {
    document.body.style.overflow = isShopOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isShopOpen]);

  // Fetch first 3 products to use as slides
  useEffect(() => {
    fetch(`${API_URL}/products/get`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)){
          const firstThree = data.slice(0, 3).map(product => ({
            title: product.name,
            description: product.description || "No description provided.",
            image: buildImgSrc(product.images && product.images[0])
          }));
          setSlides(firstThree);
        } else {
          setSlides([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch slider products:", err);
        setSlides([]);
      });
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return; // no slides, no interval
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="font-sans bg-[#f9f8f6] ">
        {/* HERO SECTION */}
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
          {/* LEFT SECTION */}
          <div className="relative flex flex-col justify-center items-start text-white p-10 md:p-16 overflow-hidden bg-[#3A3F2D] min-h-screen">
            {/* Warli Art Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage:"url('https://www.studyiq.com/articles/wp-content/uploads/2023/12/22181446/Warli-Art1.png')"}}
            ></div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#310000]/90 "></div>

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Logo + Name */}
              <div className="flex items-center -space-x-6">
                <div className="w-44 h-44 md:w-48 md:h-48">
                  <img src={Logo} alt="Naamb Logo" className="w-full h-full object-cover drop-shadow-lg" />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] uppercase text-white/90">Naamb</h1>
              </div>

              {/* Hero Heading */}
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight text-white drop-shadow-md">
                Crafted with <span className="text-[#F5E6CA]">soul</span>,<br />
                inspired by <span className="text-[#F5E6CA]">heritage</span>.
              </h2>

              {/* Description */}
              <p className="text-lg md:text-lg text-gray-200 leading-relaxed max-w-2xl font-light">
                Experience the <span className="font-semibold text-[#F5E6CA]">art of India</span> through timeless handcrafted pieces.  
                Every creation from <span className="font-medium">Naamb</span> is a story of tradition, dedication, and craftsmanship that bridges culture and elegance.
              </p>

              {/* CTA Button */}
              <button onClick={() => handleNavigate('/about')} className="px-7 py-3 bg-[#F5E6CA] text-[#310000] text-base font-semibold rounded-full shadow-lg cursor-pointer hover:bg-[#e8d6a8] transition-all duration-300">
                Explore Now
              </button>
            </div>
          </div>

          {/* RIGHT SECTION - Premium Compact Slider */}
          <div className="relative flex items-center justify-center p-6 md:p-10 min-h-screen">
            <div className="relative w-full md:w-[80%] lg:w-[85%] h-[600px] overflow-hidden">
              {/* Slides with Fade Transition */}
              <div className="relative w-full h-full flex items-center justify-center">
                {slides.length === 0 ? (
                  <p className="text-white text-lg">Loading slides...</p>
                ) : (
                  slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                      {/* Text Content */}
                      <div className="absolute bottom-16 left-10 md:left-14 text-white max-w-lg drop-shadow-lg">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">{slide.title}</h2>
                        <p className="text-gray-200 text-base md:text-lg mb-5 leading-relaxed">{slide.description}</p>
                        <button
                          onClick={() => setIsShopOpen(true)}
                          className="px-6 py-2.5 bg-white text-[#3A3F2D] cursor-pointer rounded-full font-semibold shadow-md hover:bg-gray-200 transition"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3A3F2D] p-2 rounded-full shadow-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3A3F2D] p-2 rounded-full shadow-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Navigation */}
              <div className="absolute bottom-6 w-full flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      current === index ? "bg-white scale-125" : "bg-gray-400/60"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

{/* REVISED MISSION SECTION */}
<div className="relative overflow-hidden bg-[#f9f8f6]">
  <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 lg:min-h-screen px-6 py-12 md:py-24 gap-12 items-center">
    
    {/* Left Column: Text Content */}
    <div className="flex flex-col justify-center space-y-8 z-10 order-2 lg:order-1">
      <div className="space-y-4">
        <p className="uppercase text-xs sm:text-sm tracking-[0.2em] text-gray-500 ">
          Our Mission
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#310000] font-light leading-tight">
          Every purchase <br className="hidden sm:block" /> has a purpose
        </h2>
      </div>
      <p className="text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
        We have direct partnerships with over <strong>320 Indian artisans</strong> and over 
        <strong> 2000 indirectly</strong>. As a social enterprise that seeks to offer a 
        <strong> fair-trade platform</strong>, our primary purpose is to support handicraft workers. 
        With each purchase you make, you can help make a difference.
      </p>
    </div>

    {/* Right Column: Visual Stats */}
    <div className="relative flex justify-center items-center min-h-[400px] lg:min-h-[600px] order-1 lg:order-2 group">
      {/* Background Image for Desktop */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.antiquesdealershop.com/wp-content/uploads/2024/06/IMG_5550-scaled.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-[#310000]/70 mix-blend-multiply"></div>
      </div>

      {/* Decorative Image for Mobile */}
      <div className="block lg:hidden absolute inset-0  overflow-hidden">
        <img 
          src="https://img.freepik.com/premium-vector/floral-line-art_564198-4.jpg" 
          alt="Decor" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-[#310000] "></div>
      </div>

      {/* Stats Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 sm:p-12">
        <div className="mb-2">
          <span className="text-7xl md:text-8xl lg:text-9xl font-serif text-[#c8ccbd] font-medium leading-none">
            10+
          </span>
        </div>
        <p className="uppercase text-sm md:text-lg tracking-[0.3em] text-white/90 font-semibold mb-4">
          YEARS
        </p>
        <div className="h-px w-12 bg-[#c8ccbd] mb-4"></div>
        <p className="text-xl md:text-2xl font-serif text-[#c8ccbd] italic">
          of Sourcing & Craftsmanship
        </p>
      </div>
    </div>

  </div>
</div>

        {/* Other Sections */}
        <Categories />
        <TrendingProducts />
        <div
          className="relative w-full py-14 px-6 md:px-16 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('https://www.studyiq.com/articles/wp-content/uploads/2023/12/22181446/Warli-Art1.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#310000]/90"></div>
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-white">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">Our Story</h2>
              <p className="text-lg md:text-xl leading-relaxed text-gray-200 mb-6">
                The Apsara Training Institute in Palakkad district began in 2008 as a single-person Kudumbashree enterprise , initiated with RME financial assistance from Kudumbashree in 2006. Its founding mission is to provide various job training programs to empower rural people and guide them toward financial self-sufficiency.
              </p>
              <button onClick={() => handleNavigate("/about")} className="px-6 py-3 bg-[#F5E6CA] cursor-pointer text-[#3A3F2D] rounded-full font-semibold shadow hover:bg-[#e8d6a8] transition">
                Learn More
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative group">
                <img
                  src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                  alt="Our Story Video Thumbnail"
                  className="w-[350px] md:w-[500px] rounded-lg shadow-2xl border-white/30 transition-transform duration-500 ease-in-out"
                />
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 text-[#3A3F2D] w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#3A3F2D] group-hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <ClientHome />
        <ContactHome />
      </div>

      {isShopOpen && <ShopPage isOverlay={true} onClose={() => setIsShopOpen(false)} />}
    </>
  );
};

export default Home;
