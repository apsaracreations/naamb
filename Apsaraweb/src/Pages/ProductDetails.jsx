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

const formatCurrency = (amount) => {
  return `₹ ${amount.toLocaleString("en-IN")}`;
};

const CustomStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #5C644B;
    border-radius: 10px;
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
  const [showLogin, setShowLogin] = useState(false);

  // LIGHTBOX & HOVER
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 50, y: 50 });

  // RECEIPT MODAL STATE (Add this logic where your payment success triggers)
  const [showReceipt, setShowReceipt] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "John Doe",
    addressLine1: "123 Green Valley",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    phone: "+91 9876543210",
    email: "john@example.com"
  });

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

    const user = JSON.parse(storedUser);
    const userId = user.id || user._id;

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
        if (!res.ok) throw new Error(data?.message || "Something failed");
        toast.success("🛒 Added to cart!");
        return data;
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong");
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
    <div className="bg-[#f9f8f6] min-h-screen font-serif">
      <style>{CustomStyles}</style>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{ style: { zIndex: 99999 } }}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="relative bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
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

      {/* Responsive Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[95vh] sm:max-h-[90vh] relative">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-800 text-2xl font-bold z-10 p-2"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-6 mt-4 sm:mt-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#5C644B] mb-1">Payment Successful!</h2>
                <p className="text-gray-600 text-xs sm:text-sm">Here is your order receipt</p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">Shipping To:</h3>
                <p className="text-gray-800 text-sm sm:text-base">{shippingDetails.fullName}</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {shippingDetails.addressLine1}, {shippingDetails.city}, {shippingDetails.state} - {shippingDetails.zipCode}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">Phone: {shippingDetails.phone}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Email: {shippingDetails.email}</p>
              </div>

              <div className="overflow-x-auto mb-6 border rounded-lg">
                <table className="w-full border-collapse min-w-[500px] sm:min-w-full">
                  <thead>
                    <tr className="bg-[#F3F4F6]">
                      <th className="border-b p-3 text-left text-gray-700 text-xs sm:text-sm">Product</th>
                      <th className="border-b p-3 text-center text-gray-700 text-xs sm:text-sm">Quantity</th>
                      <th className="border-b p-3 text-right text-gray-700 text-xs sm:text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="border-b p-3 flex items-center gap-3">
                        <img
                          src={selectedImage?.url}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border flex-shrink-0"
                        />
                        <span className="text-gray-800 font-medium text-xs sm:text-sm line-clamp-2">{product.name}</span>
                      </td>
                      <td className="border-b p-3 text-center text-gray-700 text-xs sm:text-sm">{quantity}</td>
                      <td className="border-b p-3 text-right text-gray-800 font-semibold text-xs sm:text-sm">
                        {formatCurrency(product.price * quantity)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="p-3 text-right font-bold text-gray-800 text-sm">Total Paid</td>
                      <td className="p-3 text-right font-bold text-[#5C644B] text-sm sm:text-base">{totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Thank you for choosing NAMb!</p>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  You will receive a tracking ID once your order is dispatched. Track your order anytime in the "Track Your Order" page.
                </p>
              </div>

              <div className="flex justify-center pb-2">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="w-full sm:w-auto px-8 py-3 bg-[#5C644B] text-white font-semibold rounded-lg hover:bg-[#3A3F2D] transition shadow-md text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-24 max-w-7xl">
        {/* Product Title on Mobile */}
        <div className="block md:hidden mb-8 text-center">
          <p className="text-sm sm:text-xl text-gray-500 mb-1">| AUTHENTIC CRAFT. CREATED IN INDIA.</p>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#310000] font-light mb-2">{product.name}</h1>
          <p className="text-xs sm:text-sm text-gray-600">Category: {product.categoryName}</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16 md:items-start">
          {/* Left: Image Gallery */}
          <div className="md:col-span-3 space-y-4">
            {selectedImage && (
              <div
                className="relative aspect-square bg-gray-100 border border-[#e5dfd3] overflow-hidden shadow-md cursor-zoom-in rounded-lg"
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
                />
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-105 transition-all duration-200"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Thumbnail Selector */}
            <div className="flex space-x-2 sm:space-x-3 justify-center md:justify-start overflow-x-auto pb-2">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedImage({ url: buildImgSrc(image), alt: `${product.name} image ${idx + 1}` })
                  }
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden cursor-pointer rounded-md border-2 transition-all duration-300 ${
                    selectedImage?.url === buildImgSrc(image)
                      ? "border-[#3A3F2D] shadow-lg scale-105"
                      : "border-gray-300 opacity-75 hover:opacity-100 hover:border-gray-500"
                  }`}
                >
                  <img src={buildImgSrc(image)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="hidden md:block">
              <p className="uppercase text-sm tracking-widest text-gray-500 font-medium border-b border-gray-100 pb-1">
                | AUTHENTIC CRAFT. CREATED IN INDIA.
              </p>
              <h1 className="text-4xl font-serif text-[#310000] font-light mt-2 mb-2">{product.name}</h1>
            </div>

            <p className="text-base sm:text-lg text-gray-600 border-b border-gray-200 pb-6">{product.description}</p>

            <div className="space-y-3">
              {product.points?.map((point, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-[#3A3F2D] shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">{point}</span>
                </div>
              ))}
            </div>

            <div className="text-gray-700 font-semibold border-b border-gray-200 pb-6">
              Quantity in stock: {product.quantity}
            </div>

            <div className="text-lg font-medium text-gray-700 flex justify-between border-b pb-4">
              <span className="opacity-70">Price</span>
              <span className="font-bold text-gray-900 text-xl">₹{product.price}</span>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0 w-full sm:w-auto justify-center">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-bold text-[#310000] w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="p-3 bg-gray-100 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-2 bg-[#310000] text-white py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-[#4a0000] transition active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="whitespace-nowrap">ADD TO CART - {totalPrice}</span>
              </button>
            </div>

            {/* Info Block */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#3A3F2D] font-bold">✓</span>
                <p>Free Shipping on orders above ₹ 5,000</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#3A3F2D] font-bold">✓</span>
                <p>30-Day Easy Returns Policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info Accordion */}
        <div className="mt-16 border-t border-gray-300 pt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#310000] font-medium mb-6">Product Information</h2>
          <DetailSection
            title="Materials & Care"
            content={product.materialsCare || "N/A"}
            isOpen={openSection === "Materials & Care"}
            onToggle={() => setOpenSection(prev => prev === "Materials & Care" ? null : "Materials & Care")}
          />
          <DetailSection
            title="Dimensions"
            content={product.dimensions || "N/A"}
            isOpen={openSection === "Dimensions"}
            onToggle={() => setOpenSection(prev => prev === "Dimensions" ? null : "Dimensions")}
          />
        </div>
      </div>

      <SimilarProducts />
    </div>
  );
};

export default ProductDetails;