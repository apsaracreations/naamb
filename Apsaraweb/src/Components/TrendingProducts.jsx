import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopPage from './ShopPage'; // Keep your existing ShopPage import

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

// Product Card component as per your current design
const ProductCard = ({ product, onClick }) => (
  <div 
    className="group flex flex-col overflow-hidden cursor-pointer"
    onClick={() => onClick(product._id)}
  > 
    <div className="relative overflow-hidden w-full h-[400px] bg-gray-100 mb-4 ">
      <img
        src={product.images && product.images[0]
          ? `${API_ROOT}/${product.images[0].replace(/^\/+/, '').replace(/\\/g, '/')}`
          : "https://placehold.co/400x300/e0e0e0/333333?text=Product+Image"}
        alt={product.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
      />
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          console.log(`Product ${product._id} added to cart!`);
        }}
        className="absolute top-4 right-4 p-2 bg-white/70 rounded-full text-[#3A3F2D] hover:bg-[#3A3F2D] hover:text-white transition opacity-80 group-hover:opacity-100 shadow-md"
        title="Add to Cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </button>
    </div>

    <div className="text-left space-y-1 p-1 flex-grow flex flex-col justify-between">
      <div>
        <p className="uppercase text-xs tracking-widest text-gray-500 font-medium">
          {product.categoryName}
        </p>
        <h3 className="text-lg font-serif text-[#310000] font-normal hover:underline leading-snug line-clamp-2"> 
          {product.name}
        </h3>
      </div>
      <p className="text-xl font-sans text-gray-800 font-semibold pt-1">
        ₹ {product.price}
      </p>
    </div>
  </div>
);

const TrendingProducts = () => {
  const navigate = useNavigate();
  const [showShop, setShowShop] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch first 4 products from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/get`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const firstFour = data.slice(0, 4);
          setProducts(firstFour);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Prevent scroll when shop overlay is open
  useEffect(() => {
    document.body.style.overflow = showShop ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showShop]);

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
    console.log(`Navigating to product details for ID: ${productId}`);
  };

  const handleSeeAllClick = () => {
    setShowShop(true);
  };

  return (
    <>
      <div className="py-6 md:py-6 font-sans">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#310000] font-light mb-2">
              Our Top Handcrafted Trending Picks
            </h2>
            <p className="text-lg text-gray-600">
              A selection of the best Bags, Decor, and Jewelry.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:grid-cols-4 xl:gap-x-8">
              {products.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSeeAllClick}
              className="px-8 py-3 bg-[#310000dc] cursor-pointer text-white rounded-full font-semibold tracking-wider shadow-lg hover:bg-[#3c0808] "
            >
              See All Products
            </button>
          </div>
        </div>
      </div>

      {showShop && (
        <ShopPage
          isOverlay={true}
          onClose={() => setShowShop(false)}
        />
      )}
    </>
  );
};

export default TrendingProducts;
