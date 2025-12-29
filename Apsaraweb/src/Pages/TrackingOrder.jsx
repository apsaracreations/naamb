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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      toast.error("Login required to fetch orders");
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
      .catch(() => toast.error("Network error fetching orders"));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-sans">
      <Toaster position="bottom-center" />
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Your Orders
      </h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const product = order.products[0];
            const hasTracking = Boolean(order.trackingId);
            return (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
                  {product?.image ? (
                    <img
                      src={buildImgSrc(product.image)}
                      alt={product.name || "product"}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  <span className="text-gray-900 font-medium">{product?.title}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  ₹{product?.price ?? "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product?.quantity ?? "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap font-semibold ${
                    hasTracking ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {hasTracking ? order.shippingStatus || "Pending" : "Will be shipped soon"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {hasTracking ? order.trackingId : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
