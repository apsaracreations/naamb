import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ShoppingCart, Minus, Plus, X, Check, ZoomIn } from "lucide-react";
import SimilarProducts from "../Components/SimilarProducts";
import Login from "../Components/Login";
import toast, { Toaster } from 'react-hot-toast';


const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const DetailSection = ({ title, content, isOpen, onToggle }) => (
  <div className="border-t border-gray-200 py-4">
    <button
      className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800"
      onClick={onToggle}
    >
      {title}
      <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="mt-3 text-gray-600 leading-relaxed text-sm animate-fade-in">{content}</div>
    )}
  </div>
);

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${API_ROOT}/${p}`;
};

const CustomStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 50, y: 50 });


  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/get/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(
          data.images && data.images.length > 0
            ? { url: buildImgSrc(data.images[0]), alt: data.name }
            : null
        );
        setOpenSection("Materials & Care");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  const totalPrice = useMemo(() => {
    if (!product) return "";
    const total = product.price * quantity;
    return `₹ ${total.toLocaleString("en-IN")} INR`;
  }, [product, quantity]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "increment") return prev + 1;
      if (type === "decrement" && prev > 1) return prev - 1;
      return prev;
    });
  };

const handleAddToCart = () => {
  const userToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!userToken || !storedUser) {
    setShowLogin(true);
    return;
  }

  // Parse the stored user JSON string
  const user = JSON.parse(storedUser);
  const userId = user.id || user._id; // support both formats

  fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      userId,
      productId: product._id,
      quantity,
    }),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      console.log("Backend response:", data);
      
      if (!res.ok) throw new Error(data?.message || "Something failed");

      toast.success("🛒 Added to cart!");
      return data;
    })
    .catch((err) => {
      toast.error(err.message || "Something went wrong");
      console.error("Frontend error ->", err.message);
    });
};


  const handleCloseLogin = () => setShowLogin(false);

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverPosition({ x: 50, y: 50 });
  };

  if (loading) {
    return <div className="text-center py-16 text-xl">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-16 text-xl text-red-600">Product not found.</div>;
  }

  return (
    <div className="bg-[#f9f8f6] min-h-screen font-sans">
      <style>{CustomStyles}</style>
          <Toaster
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        style: { zIndex: 99999 }
      }}
    />

      {/* Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-[#3A3F2D] text-white shadow-xl flex items-center justify-between space-x-4 animate-fade-in rounded-lg">
          <p className="font-semibold">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Login Prompt Modal */}
{showLogin && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
    <div className="relative bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md">
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-black"
        onClick={() => setShowLogin(false)}
      >
        <X className="w-5 h-5" />
      </button>

      <Login onClose={handleCloseLogin} />

    </div>
  </div>
)}


      <div className="container mx-auto px-6 py-12 md:py-24 max-w-7xl">
        {/* Product Title on Mobile */}
        <div className="block md:hidden mb-8 text-center">
          <p className="text-xl text-gray-500 mb-1">| AUTHENTIC CRAFT. CREATED IN INDIA.</p>
          <h1 className="text-3xl font-serif text-[#310000] font-light mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600">Category: {product.categoryName}</p>
        </div>

        {/* Main Grid: Images Left, Details Right */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16 md:items-center">
          {/* Left: Image Gallery */}
          <div className="md:col-span-3 space-y-4">
            {selectedImage && (
              <div
                className="relative aspect-square bg-gray-100 border border-[#e5dfd3] overflow-hidden shadow-md cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                    isHovering ? "scale-150" : "scale-100"
                  }`}
                  style={{ transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%` }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/1000x1000/cccccc/333333?text=Image+Not+Found";
                  }}
                />
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-105 transition-all duration-200"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Thumbnail Selector */}
            <div className="flex space-x-3 justify-center  md:justify-start">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedImage({ url: buildImgSrc(image), alt: `${product.name} image ${idx + 1}` })
                  }
                  className={`w-20 h-20 overflow-hidden cursor-pointer  rounded-md border-2 transition-all duration-300 ${
                    selectedImage?.url === buildImgSrc(image)
                      ? "border-[#3A3F2D] shadow-lg scale-105"
                      : "border-gray-300 opacity-75 hover:opacity-100 hover:border-gray-500"
                  }`}
                >
                  <img
                    src={buildImgSrc(image)}
                    alt={`${product.name} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/80x80/cccccc/333333?text=Thumb";
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Product Category on Desktop */}
            <div className="hidden md:block mt-4 text-gray-600">
              <p>
                <span className="font-semibold">Category: </span>
                {product.categoryName}
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Name and SKU */}
            <div className="hidden md:block">
              <p className="uppercase text-sm tracking-widest text-gray-500 font-medium border-b border-gray-100 pb-1">
                | AUTHENTIC CRAFT. CREATED IN INDIA.
              </p>
              <h1 className="text-4xl font-serif text-[#310000] font-light mt-2 mb-2">{product.name}</h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 border-b border-gray-200 pb-6">{product.description}</p>

            {/* Points list */}
            <div className="space-y-3">
              {product.points && product.points.length > 0 && product.points.map((point, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-[#3A3F2D] shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-base">{point}</span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="text-gray-700 font-semibold border-b border-gray-200 pb-6">
              Quantity in stock: {product.quantity}
            </div>

            <div className="text-lg font-medium text-gray-700 flex justify-between border-b pb-4">
              <span className="opacity-70">Price</span>
              <span className="font-bold text-gray-900 text-xl">₹{product.price}</span>
            </div>

            {/* Quantity selector and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-0 border border-gray-300 rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="px-3 py-2 text-center font-bold text-base text-[#310000] w-10">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-grow flex items-center justify-center cursor-pointer space-x-2 bg-[#310000] text-white py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-[#4a0000] transition duration-300 active:scale-[0.99] md:text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-base font-semibold whitespace-nowrap">ADD TO CART - {totalPrice}</span>
              </button>
            </div>

            {/* Quick Info Block */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#3A3F2D] font-bold">✓</span>
                <p>Free Shipping on orders above ₹ 5,000</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#3A3F2D] font-bold">✓</span>
                <p>30-Day Easy Returns Policy</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#3A3F2D] font-bold">✓</span>
                <p>Secure Payments powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="mt-16 border-t border-gray-300 pt-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-[#310000] font-medium mb-6">Product Information</h2>
          <DetailSection
            title="Materials & Care"
            content={product.materialsCare || "N/A"}
            isOpen={openSection === "Materials & Care"}
            onToggle={() =>
              setOpenSection((prev) => (prev === "Materials & Care" ? null : "Materials & Care"))
            }
          />
          <DetailSection
            title="Dimensions"
            content={product.dimensions || "N/A"}
            isOpen={openSection === "Dimensions"}
            onToggle={() =>
              setOpenSection((prev) => (prev === "Dimensions" ? null : "Dimensions"))
            }
          />
        </div>
      </div>

      <SimilarProducts />
    </div>
  );
};

export default ProductDetails;
