import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ROOT}/${path.replace(/^\/+/, "")}`;
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      toast.error("Login required to fetch orders");
      setLoading(false);
      return;
    }
    const userId = JSON.parse(user).id || JSON.parse(user)._id;
    fetch(`${API_URL}/payment/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to load orders");
        }
      })
      .catch(() => toast.error("Network error fetching orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4 md:mt-10 font-serif">
      <Toaster position="bottom-center" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} orders found</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <>
          {/* --- DESKTOP TABLE VIEW (Visible on md and up) --- */}
          <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tracking ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const product = order.products[0];
                  const hasTracking = Boolean(order.trackingId);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <img
                          src={product?.image ? buildImgSrc(product.image) : "/placeholder.png"}
                          alt={product?.title}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product?.title}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{product?.price}</td>
                      <td className="px-6 py-4 text-gray-600">{product?.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasTracking ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {hasTracking ? order.shippingStatus || "Shipped" : "Processing"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{order.trackingId || "---"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARD VIEW (Visible on small screens) --- */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => {
              const product = order.products[0];
              const hasTracking = Boolean(order.trackingId);
              return (
                <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={product?.image ? buildImgSrc(product.image) : "/placeholder.png"}
                      alt={product?.title}
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-bold truncate">{product?.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50 text-sm">
                    <div>
                      <p className="text-gray-400">Paid Amount</p>
                      <p className="font-bold text-gray-900">₹{product?.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Quantity</p>
                      <p className="font-bold text-gray-900">{product?.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Status</p>
                      <span className={`text-xs font-bold ${hasTracking ? "text-green-600" : "text-yellow-600"}`}>
                        {hasTracking ? order.shippingStatus || "Shipped" : "Processing"}
                      </span>
                    </div>
                    {hasTracking && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-gray-400 font-bold">Tracking ID</p>
                        <p className="text-xs font-mono font-bold text-gray-700">{order.trackingId}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTable;