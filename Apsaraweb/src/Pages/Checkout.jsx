import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const formatCurrency = (amount) => `₹ ${amount.toLocaleString("en-IN")} INR`;

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${API_ROOT}/${p}`;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
];

const FormInput = ({ label, id, type = "text", value, onChange, required = true, placeholder }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-[#5C644B] focus:ring focus:ring-[#5C644B]/20 transition duration-150 text-gray-800"
    />
  </div>
);

const BillModal = ({ isOpen, onClose, shippingDetails, products, total }) => {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
  {/* Container with max height and overflow handling */}
  <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[95vh] sm:max-h-[90vh] relative">
    
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-800 text-2xl font-bold z-10 p-2"
      aria-label="Close Modal"
    >
      &times;
    </button>

    {/* Scrollable Content Area */}
    <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="text-center mb-6 mt-4 sm:mt-0">
        <h2 className="text-xl sm:text-2xl font-bold text-[#5C644B] mb-1">Payment Successful!</h2>
        <p className="text-gray-600 text-xs sm:text-sm">Here is your order receipt</p>
      </div>

      {/* Shipping Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">Shipping To:</h3>
        <p className="text-gray-800 text-sm sm:text-base">{shippingDetails.fullName}</p>
        <p className="text-gray-600 text-xs sm:text-sm">
          {shippingDetails.addressLine1}, {shippingDetails.city}, {shippingDetails.state} - {shippingDetails.zipCode}
        </p>
        <p className="text-gray-600 text-xs sm:text-sm">Phone: {shippingDetails.phone}</p>
        <p className="text-gray-600 text-xs sm:text-sm">Email: {shippingDetails.email}</p>
      </div>

      {/* Products Table */}
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
            {products.map((prod) => (
              <tr key={prod.productId} className="hover:bg-gray-50 transition">
                <td className="border-b p-3 flex items-center gap-3">
                  {prod.image ? (
                    <img
                      src={prod.image.startsWith("http") ? prod.image : buildImgSrc(prod.image)}
                      alt={prod.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg font-light text-[8px] sm:text-[10px] flex-shrink-0">
                      No Image
                    </div>
                  )}
                  <span className="text-gray-800 font-medium text-xs sm:text-sm line-clamp-2">{prod.title}</span>
                </td>
                <td className="border-b p-3 text-center text-gray-700 text-xs sm:text-sm">{prod.quantity}</td>
                <td className="border-b p-3 text-right text-gray-800 font-semibold text-xs sm:text-sm">
                  {formatCurrency(prod.price * prod.quantity)}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="p-3 text-right font-bold text-gray-800 text-sm">Total Paid</td>
              <td className="p-3 text-right font-bold text-[#5C644B] text-sm sm:text-base">{formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Message */}
      <div className="text-center mb-6">
        <p className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Thank you for choosing NAMb!</p>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
          You will receive a tracking ID once your order is dispatched. Track your order anytime in the "Track Your Order" page.
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pb-2">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-3 bg-[#5C644B] text-white font-semibold rounded-lg hover:bg-[#3A3F2D] transition shadow-md text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
  );
};


const Checkout = () => {
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (!user || !userToken) return;

    fetch(`${API_URL}/cart/get/${user.id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setCartItems(
            data.products
              .filter((item) => item.productId && typeof item.productId === "object")
              .map((item) => {
                const prod = item.productId;
                return {
                  productId: prod._id || prod.id,
                  title: prod.name,
                  image: prod.images && prod.images.length > 0 ? prod.images[0] : "",
                  price: prod.price || 0,
                  quantity: item.quantity,
                };
              })
          );
        }
      })
      .catch(console.error);
  }, []);

  const { subtotal, shippingCost, total } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return {
      subtotal: sub,
      shippingCost: 0,
      total: sub,
    };
  }, [cartItems]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const openRazorpay = (paymentData) => {
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "NAMb Store",
      description: "Order Payment",
      order_id: paymentData.razorpayOrderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_URL}/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment successful! Order placed.", { autoClose: 10000, theme: "colored" });
            setShowBillModal(true);
          } else {
            toast.error("Payment verification failed.", { autoClose: 10000, theme: "colored" });
          }
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error("Error occurred during payment verification.", { autoClose: 10000, theme: "colored" });
        }
        setIsPlacingOrder(false);
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled.", { autoClose: 10000, theme: "colored" });
          setIsPlacingOrder(false);
        },
      },
      prefill: {
        name: shippingDetails.fullName,
        email: shippingDetails.email,
        contact: shippingDetails.phone,
      },
      theme: { color: "#5C644B" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      toast.error("Cart is empty.", { autoClose: 10000, theme: "colored" });
      return;
    }
    setIsPlacingOrder(true);

    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (!user) {
      toast.error("User not logged in.", { autoClose: 10000, theme: "colored" });
      setIsPlacingOrder(false);
      return;
    }

    const productsForOrder = cartItems.map(item => ({
      productId: item.productId,
      // name:item.name,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    try {
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          shippingDetails,
          products: productsForOrder,
          subtotal,
          shippingCost,
          totalAmount: total,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => openRazorpay(data);
          script.onerror = () => {
            toast.error("Razorpay SDK failed to load. Are you online?", { autoClose: 10000, theme: "colored" });
            setIsPlacingOrder(false);
          };
          document.body.appendChild(script);
        } else {
          openRazorpay(data);
        }
      } else {
        toast.error("Failed to create order. Please try again.", { autoClose: 10000, theme: "colored" });
        setIsPlacingOrder(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while creating order.", { autoClose: 10000, theme: "colored" });
      setIsPlacingOrder(false);
    }
  };
const closeModal = () => {
  setShowBillModal(false);
  window.location.reload(); // Reload the page on modal close
};


  return (
    <>
      <form onSubmit={handleSubmitOrder} className="min-h-screen bg-[#f9f8f6] font-sans py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif text-[#310000] font-light mb-10 text-center">
            Secure Checkout
          </h1>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-12 bg-white border border-[#e5dfd3] p-8 md:p-10 rounded-2xl shadow-lg">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  1. Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    id="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleShippingChange}
                    placeholder="Jane Doe"
                  />
                  <FormInput
                    label="Email Address"
                    id="email"
                    type="email"
                    value={shippingDetails.email}
                    onChange={handleShippingChange}
                    placeholder="jane@example.com"
                  />
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-800 mb-1 block">
                      Address
                    </label>
                    <textarea
                      id="addressLine1"
                      name="addressLine1"
                      value={shippingDetails.addressLine1}
                      onChange={handleShippingChange}
                      placeholder="Flat 101, Artisan Towers"
                      className="w-full border border-gray-300 rounded-lg p-4 text-base min-h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <FormInput
                    label="City"
                    id="city"
                    value={shippingDetails.city}
                    onChange={handleShippingChange}
                    placeholder="Mumbai"
                  />
                  <div className="space-y-1">
                    <label htmlFor="state" className="text-sm font-medium text-gray-800">
                      State *
                    </label>
                    <select
                      name="state"
                      id="state"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 h-14 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-black transition"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FormInput
                    label="Pin Code"
                    id="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleShippingChange}
                    placeholder="400001"
                  />
                  <FormInput
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={handleShippingChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </section>
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white border border-[#e5dfd3] p-6 md:p-8 rounded-xl shadow-lg sticky top-8">
                <h2 className="text-2xl font-serif text-[#310000] font-medium mb-6 border-b pb-4">
                  Order Summary ({cartItems.length} Items)
                </h2>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3 text-sm text-gray-600">
                      {item.image ? (
                        <img
                          src={item.image.startsWith("http") ? item.image : buildImgSrc(item.image)}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded border border-[#e5dfd3]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400 rounded font-light text-xs">
                          No Image
                        </div>
                      )}
                      <span className="truncate">{item.title} (x{item.quantity})</span><br />
                      <span className="truncate">{item.categoryName}</span>
                      <span className="ml-auto font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-2xl font-bold text-[#310000]">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className={`w-full mt-8 px-6 py-4 bg-[#310000] text-white cursor-pointer rounded-full font-bold text-lg tracking-wider hover:bg-[#280303] transition duration-300 shadow-xl ${
                    isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </button>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing the order, you agree to the terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ToastContainer
        position="bottom-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

<BillModal
  isOpen={showBillModal}
  onClose={closeModal}
  shippingDetails={shippingDetails}
  products={cartItems}
  total={total}
/>

    </>
  );
};

export default Checkout;
