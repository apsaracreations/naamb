import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// const SHIPPING_THRESHOLD = 10000;
// const FIXED_SHIPPING_COST = 500;

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const formatCurrency = (amount) => `₹ ${amount.toLocaleString('en-IN')} INR`;

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${API_ROOT}/${p}`;
};

// --- Item Card ---
const CartItemCard = ({ item, updateQuantity, removeItem }) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start py-6 border-b border-[#d9c8b4]">
      {/* Image */}
      <div className="w-28 h-28 flex-shrink-0 mb-4 md:mb-0 md:mr-4 rounded-xl overflow-hidden shadow-sm">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "https://placehold.co/100x100/D4C9C3/310000?text=Item")}
        />
      </div>

      {/* Info */}
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-lg font-serif text-[#310000] font-medium">{item.title}</h3>
        <p className="text-xs uppercase tracking-widest text-gray-500">{item.material}</p>
        <p className="text-sm font-semibold text-gray-800 mt-2 block md:hidden">{formatCurrency(item.price)}</p>
      </div>

      {/* Price (Desktop) */}
      <div className="hidden md:block w-28 text-center text-gray-700 font-medium">{formatCurrency(item.price)}</div>

      {/* Quantity */}
      <div className="w-full md:w-32 flex justify-center items-center space-x-3 mt-3 md:mt-0">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 text-gray-600 bg-[#f7efe1] rounded-full hover:bg-[#e2d8c3] disabled:opacity-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="text-lg font-medium w-6 text-center text-[#310000]">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="p-1 text-gray-600 bg-[#f7efe1] rounded-full hover:bg-[#e2d8c3] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Total */}
      <div className="w-full md:w-28 text-right text-lg font-semibold text-[#310000] mt-3 md:mt-0">{formatCurrency(itemTotal)}</div>

      {/* Remove */}
      <div className="w-full md:w-10 text-center md:text-right mt-3 md:mt-0">
        <button
          onClick={() => removeItem(item.productId)}
          className="p-1 text-gray-400 hover:text-red-600 transition"
          title="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// --- Main Cart ---
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Assuming user info/token stored locally
  const userToken = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userId = user?.id || user?._id || null;

  useEffect(() => {
    if (!userId || !userToken) {
      // Probably redirect or show login prompt
      return;
    }
    fetch(`${API_URL}/cart/get/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setCartItems(
            data.products
              .filter(item => item.productId && typeof item.productId === "object")
              .map((item) => {
                const prod = item.productId;
                return {
                  productId: prod._id || prod.id,
                  title: prod.name,
                  material: prod.description || "",
                  price: prod.price || 0,
                  quantity: item.quantity,
                  image: buildImgSrc(prod.images?.[0]),
                };
              })
          );
        }
      })
      .catch(console.error);
  }, [userId, userToken]);

  const { subtotal, shippingCost, total } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const shippingCost = subtotal >= SHIPPING_THRESHOLD || cartItems.length === 0 ? 0 : FIXED_SHIPPING_COST;
    return { subtotal, total: subtotal  };
  }, [cartItems]);

  const isCartEmpty = cartItems.length === 0;

const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ userId, productId, quantity: newQty }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update quantity");
        return res.json();
      })
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) => (item.productId === productId ? { ...item, quantity: newQty } : item))
        );
        
        // ✅ ADD THIS: Tell the Header to refresh the count
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch(console.error);
  };

  const removeItem = (productId) => {
    fetch(`${API_URL}/cart/${userId}/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove item");
        return res.json();
      })
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        
        // ✅ ADD THIS: Tell the Header an item was removed
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch(console.error);
  };



  const handleNavigate = (path) => navigate(path);

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif text-[#310000] font-light mb-10 text-center border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Your Shopping Cart
        </h1>

        {isCartEmpty ? (
          <div className="text-center p-16 bg-white rounded-xl border border-[#e5dfd3] shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0z" />
            </svg>
            <h2 className="text-2xl font-serif text-[#3A2D2D] mb-3">Your cart is empty.</h2>
            <p className="text-gray-600 mb-6">Explore our curated collection of handcrafted treasures.</p>
            <button
              onClick={() => handleNavigate("/shop")}
              className="px-8 py-3 bg-[#310000] text-white rounded-full font-semibold hover:bg-[#5C644B] transition duration-300 shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:flex lg:space-x-10">
            <div className="lg:w-2/3 bg-white border border-[#e5dfd3] p-6 md:p-8 rounded-xl shadow-lg">
              <div className="hidden md:flex justify-between pb-4 border-b border-[#e0d3c0] text-sm font-semibold uppercase tracking-wider text-gray-500">
                <span className="w-2/5">Product</span>
                <span className="w-1/5 text-center">Price</span>
                <span className="w-1/5 text-center">Qty</span>
                <span className="w-1/5 text-right">Total</span>
              </div>

              {cartItems.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => handleNavigate("/shop")}
                  className="text-sm text-gray-600 hover:text-[#310000] flex items-center font-medium transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>

            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white border border-[#e5dfd3] p-6 md:p-8 rounded-xl shadow-lg sticky top-20">
                <h2 className="text-2xl font-serif text-[#310000] font-medium mb-6 border-b-2 border-[#3A2D2D]/20 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>



                <div className="border-t border-[#e0d3c0] pt-4 flex justify-between items-center text-xl font-bold text-[#310000]">
<span>
  Total <span className="text-xs text-gray-500">(included shipping charge)</span>
</span>

                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={() => handleNavigate("/checkout")}
                className="w-full mt-8 px-6 py-4 bg-[#310000]/90 text-white rounded-full font-bold text-lg tracking-wider hover:bg-[#310000] cursor-pointer transition duration-300 shadow-xl"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">100% Secure Payment via All Major Cards</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Cart;
