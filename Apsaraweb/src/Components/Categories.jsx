import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Get the API URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- Helper function to construct full image URL ---
// This is essential for serving static files from the backend (e.g., Express/Node)
const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Ensure the path is relative to the API base, then prepend the base URL
    // e.g., if imagePath is 'uploads/images/file.jpg' and API_BASE_URL is 'http://192.168.1.3:5000/api'
    // We want 'http://192.168.1.3:5000/uploads/images/file.jpg'
    
    // We trim the '/api' part from VITE_API_URL to get the root server URL
    const serverBaseUrl = API_BASE_URL.replace('/api', ''); 

    // The image path usually comes from multer (e.g., 'uploads/...')
    // We assume the imagePath doesn't start with a slash and is relative.
    return `${serverBaseUrl}/${imagePath}`;
};


const Categories = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = categories.length;
  const slidesPerPage = 3;

  // --- Fetch Categories Logic ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Assuming your backend route is `/api/categories/get`
        const response = await axios.get(`${API_BASE_URL}/categories/get`); 
        
        // Map the fetched data and FIX the image URL
        const formattedCategories = response.data.map(cat => ({
          id: cat._id,
          name: cat.name,
          // ⭐ CORRECTION: Use getFullImageUrl helper to display image
          image: getFullImageUrl(cat.headingImage), 
          link: `/products/${cat._id}`, // Correct dynamic link
        }));

        setCategories(formattedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // ------------------------------

  // --- Navigation Handler ---
  const handleCategoryClick = (link) => {
    // This correctly navigates to /products/:id
    navigate(link);
  };
  // --------------------------

  // --- Auto Slide Logic ---
  useEffect(() => {
    if (totalSlides === 0) return;
    
    const autoSlideInterval = 5000;
    
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = totalSlides - slidesPerPage;
        if (maxIndex <= 0) return 0;
        return (prevIndex >= maxIndex) ? 0 : prevIndex + 1;
      });
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [totalSlides, slidesPerPage]);
  // -------------------------

  // Handlers for manual navigation
  const nextSlide = () => {
    const maxIndex = totalSlides - slidesPerPage;
    if (currentIndex < maxIndex) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };
  
  // Logic to calculate the translated position for the slider track
  const getTranslateX = () => {
    let visibleOnScreen = 1;
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
          visibleOnScreen = slidesPerPage;
      } else if (window.innerWidth >= 768) {
          visibleOnScreen = 2;
      }
    }
    
    const percentage = 100 / visibleOnScreen;
    
    return `-${currentIndex * percentage}%`;
  }
  
  // --- Loading and Error States ---
  if (loading) {
      return (
          <div className="py-20 text-center font-sans">
              <p className="text-xl text-gray-700">Loading categories...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="py-20 text-center font-sans">
              <p className="text-xl text-red-600">Error: {error}</p>
          </div>
      );
  }

  if (totalSlides === 0) {
      return (
          <div className="py-20 text-center font-sans">
              <p className="text-xl text-gray-700">No categories found.</p>
          </div>
      );
  }
  // ---------------------------------

  return (
    <div className=" py-10 md:py-14 font-sans border border-[#e5dfd3]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#310000] font-light mb-2">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our curated collections of handcrafted goods.
          </p>
        </div>
        
        {/* Slider Container */}
        <div className="relative flex items-center">
            
            {/* --- Navigation Buttons (Left/Previous) --- */}
            <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-3 bg-transparent text-[#3A3F2D] cursor-pointer hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed hidden lg:block mx-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {/* Main Slider Content Area */}
            <div className="relative overflow-hidden flex-grow">
              
              {/* Slider Track */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(${getTranslateX()})` 
                }}
              >
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.link)}
                    // Added cursor-pointer to indicate it's clickable
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4 group cursor-pointer" 
                    style={{ 
                        // Logic for minWidth is kept for correct slider display
                        minWidth: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 / slidesPerPage}%` : (window.innerWidth >= 768 ? '50%' : '100%'),
                    }}
                  >
                    <div className="relative overflow-hidden bg-white h-96 border border-gray-300"> 
                      {/* Image */}
                      <img
                        src={category.image} // This now has the full URL
                        alt={category.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300"></div>

                      {/* Text Content - Centered at bottom */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
                        <h3 className="text-2xl font-serif font-bold mb-1 drop-shadow-lg">
                          {category.name}
                        </h3>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Navigation Buttons (Right/Next) --- */}
            <button
                onClick={nextSlide}
                // The maxIndex calculation in nextSlide handles this better, but we need a check here too.
                disabled={currentIndex >= totalSlides - slidesPerPage} 
                className="p-3 bg-transparent text-[#3A3F2D] hover:bg-gray-100 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed hidden lg:block mx-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
        
        {/* Mobile/Small Screen Dots Navigation (Updated to handle dynamic categories) */}
        <div className="flex justify-center space-x-2 mt-8 lg:hidden">
            {categories.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)} 
                    className={`w-3 h-3 rounded-full transition-all ${
                        currentIndex === index ? "bg-[#3A3F2D] scale-110" : "bg-gray-400"
                    }`}
                ></button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;