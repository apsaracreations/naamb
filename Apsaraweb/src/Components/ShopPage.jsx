import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ShopPage = ({ isOverlay = false, onClose }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories/get`);
      const data = await res.json();

      // Backend returns an array directly → so check array
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleNavigate = (id) => {
    navigate(`/products/${id}`);
    if (onClose) onClose();
  };

  return (
    <div
      className={`${
        isOverlay
          ? "fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out"
          : "relative bg-white min-h-screen"
      }`}
      style={isOverlay ? { paddingTop: '96px' } : {}}
    >
      <div className="max-w-7xl mx-auto h-full p-10 md:p-16">
        <div className="flex justify-between items-center pb-8 border-b border-gray-200">
          <h2 className="text-4xl font-serif text-[#310000] font-light">
            Shop Our Handcrafted Collections
          </h2>
          {isOverlay && (
            <button
              onClick={onClose}
              className="text-[#310000] hover:text-[#3A3F2D] transition text-2xl"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="pt-10 pb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleNavigate(category._id)}
              className="text-lg text-left font-serif text-[#310000] cursor-pointer hover:text-[#3A3F2D] transition-colors font-medium border-b border-gray-100 pb-2"
            >
              {category.name}
            </button>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-500 text-lg col-span-4 text-center">
              No categories found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
