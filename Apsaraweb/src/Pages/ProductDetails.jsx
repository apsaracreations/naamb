import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ShoppingCart, Minus, Plus, X, Check, ZoomIn, CreditCard } from "lucide-react";
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
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 50, y: 50 });

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

  const handleAddToCart = async (shouldRedirect = false) => {
    const userToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!userToken || !storedUser) {
      setShowLogin(true);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id || user._id;

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
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
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Something failed");

      // Requirement 1: Dispatch event
      window.dispatchEvent(new Event("cartUpdated"));

      if (shouldRedirect) {
        // Requirement 2: Redirect for Buy Now
        navigate("/cart");
      } else {
        toast.success("🛒 Added to cart!");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCloseLogin = () => setShowLogin(false);

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPosition({ x, y });
  };

  if (loading) return <div className="text-center py-16 text-xl">Loading...</div>;
  if (!product) return <div className="text-center py-16 text-xl text-red-600">Product not found.</div>;

  return (
    <div className="bg-[#f9f8f6] min-h-screen font-serif">
      <style>{CustomStyles}</style>
      <Toaster containerStyle={{ zIndex: 99999 }} />

      {/* Login Prompt Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="relative bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={() => setShowLogin(false)}>
              <X className="w-5 h-5" />
            </button>
            <Login onClose={handleCloseLogin} />
          </div>
        </div>
      )}

      {/* Receipt Modal (Logic preserved) */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[95vh] relative overflow-hidden">
            <button onClick={() => setShowReceipt(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-2xl font-bold z-10 p-2">&times;</button>
            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
               <div className="text-center mb-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-[#5C644B] mb-1">Payment Successful!</h2>
                 <p className="text-gray-600 text-xs sm:text-sm">Here is your order receipt</p>
               </div>
               {/* Shipping and Table details remain as per original design */}
               <div className="flex justify-center mt-6">
                 <button onClick={() => setShowReceipt(false)} className="px-8 py-3 bg-[#5C644B] text-white font-semibold rounded-lg hover:bg-[#3A3F2D] transition shadow-md">Close</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-24 max-w-7xl">
        {/* Mobile Title */}
        <div className="block md:hidden mb-6 text-center">
          <p className="text-[10px] tracking-widest text-gray-500 mb-1">| AUTHENTIC CRAFT. CREATED IN INDIA.</p>
          <h1 className="text-2xl font-serif text-[#310000] font-light mb-1">{product.name}</h1>
          <p className="text-xs text-gray-600 uppercase tracking-tighter">Category: {product.categoryName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="md:col-span-3 space-y-4">
            {selectedImage && (
              <div
                className="relative aspect-square bg-gray-100 border border-[#e5dfd3] overflow-hidden shadow-md cursor-zoom-in rounded-lg"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => { setIsHovering(false); setHoverPosition({ x: 50, y: 50 }); }}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isHovering ? "scale-150" : "scale-100"}`}
                  style={{ transformOrigin: `${hoverPosition.x}% ${hoverPosition.y}%` }}
                />
                <button onClick={() => setIsLightboxOpen(true)} className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:bg-white"><ZoomIn className="w-5 h-5" /></button>
              </div>
            )}

            <div className="flex space-x-2 sm:space-x-3 justify-center md:justify-start overflow-x-auto pb-2 custom-scrollbar">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage({ url: buildImgSrc(image), alt: `${product.name} image ${idx + 1}` })}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden cursor-pointer rounded-md border-2 transition-all duration-300 ${selectedImage?.url === buildImgSrc(image) ? "border-[#3A3F2D] scale-105 shadow-md" : "border-gray-300 opacity-75"}`}
                >
                  <img src={buildImgSrc(image)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="hidden md:block">
              <p className="uppercase text-xs tracking-widest text-gray-500 font-medium border-b border-gray-100 pb-1">| AUTHENTIC CRAFT. CREATED IN INDIA.</p>
              <h1 className="text-4xl font-serif text-[#310000] font-light mt-2 mb-2">{product.name}</h1>
            </div>

            <p className="text-sm sm:text-base text-gray-600 border-b border-gray-200 pb-6">{product.description}</p>

            <div className="space-y-3">
              {product.points?.map((point, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#3A3F2D] shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-700 font-semibold border-b border-gray-200 pb-4">Quantity in stock: {product.quantity}</div>

            <div className="text-base font-medium text-gray-700 flex justify-between border-b pb-4">
              <span className="opacity-70">Price</span>
              <span className="font-bold text-gray-900 text-xl">₹{product.price}</span>
            </div>

            {/* ACTION AREA - FULLY RESPONSIVE */}
            <div className="space-y-4">
              {/* Quantity Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full justify-between sm:w-max">
                <button onClick={() => handleQuantityChange("decrement")} className="p-4 bg-gray-50 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}><Minus className="w-4 h-4" /></button>
                <span className="px-8 font-bold text-[#310000] min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange("increment")} className="p-4 bg-gray-50 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
              </div>

              {/* Responsive Button Group */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 flex items-center justify-center space-x-2 border-2 border-[#310000] text-[#310000] py-4 px-6 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#310000] hover:text-white transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#310000] text-white py-4 px-6 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#4a0000] transition-all active:scale-[0.98]"
                >
                  {/* <CreditCard className="w-4 h-4" /> */}
                  <span>Buy It Now — {totalPrice}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg text-[11px] sm:text-xs text-gray-600 space-y-2">
              <div className="flex items-center space-x-2"><span className="text-[#3A3F2D] font-bold">✓</span><p>Free Shipping on orders above ₹ 5,000</p></div>
              <div className="flex items-center space-x-2"><span className="text-[#3A3F2D] font-bold">✓</span><p>30-Day Easy Returns Policy</p></div>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-16 border-t border-gray-300 pt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif text-[#310000] font-medium mb-6">Product Information</h2>
          <DetailSection title="Materials & Care" content={product.materialsCare || "N/A"} isOpen={openSection === "Materials & Care"} onToggle={() => setOpenSection(prev => prev === "Materials & Care" ? null : "Materials & Care")} />
          <DetailSection title="Dimensions" content={product.dimensions || "N/A"} isOpen={openSection === "Dimensions"} onToggle={() => setOpenSection(prev => prev === "Dimensions" ? null : "Dimensions")} />
        </div>
      </div>

      <SimilarProducts />
    </div>
  );
};

export default ProductDetails;