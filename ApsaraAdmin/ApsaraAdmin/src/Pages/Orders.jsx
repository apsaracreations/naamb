import React, { useState, useEffect, useMemo } from "react";
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
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editTrackingId, setEditTrackingId] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/payment/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || data);
      })
      .catch(() => toast.error("Failed to load orders"));
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const name = order.shippingDetails.fullName.toLowerCase();
      const orderId = order._id.toLowerCase();
      const term = searchTerm.trim().toLowerCase();
      return name.includes(term) || orderId.includes(term);
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }, [orders, searchTerm, sortOrder]);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredAndSortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (order) => {
    setEditOrderId(order._id);
    setEditTrackingId(order.trackingId || "");
    setEditStatus(order.shippingStatus || "Pending");
  };

  const handleSave = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/payment/orders/${orderId}/shipping`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingId: editTrackingId, status: editStatus }),
      });
      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId
              ? { ...o, trackingId: editTrackingId, shippingStatus: editStatus }
              : o
          )
        );
        toast.success("Order updated successfully!");
        setEditOrderId(null);
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Network error during update");
    }
  };

  const handleCancel = () => setEditOrderId(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setEditTrackingId(order.trackingId || "");
    setEditStatus(order.shippingStatus || "Pending");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-16 font-sans bg-gray-50 min-h-screen">
      <Toaster position="bottom-center" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Order List</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by customer name or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 flex-grow max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-4 py-2 max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r shadow-sm">
          <p className="text-sm font-medium text-blue-800">
            Current View: {currentOrders.length} of {filteredAndSortedOrders.length} orders 
          </p>
          <p className="text-xs text-blue-600">Page {currentPage} of {totalPages}</p>
        </div>
        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r shadow-sm flex items-center justify-between">
          <span className="text-sm font-bold text-indigo-800 uppercase tracking-wide">Total System Orders:</span>
          <span className="text-2xl font-black text-indigo-900">{orders.length}</span>
        </div>
      </div>

<div className="overflow-x-auto shadow rounded bg-white">
  <table className="w-full border-collapse border border-gray-300">
    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
      <tr>
        <th className="py-3 px-4 border-b text-left">#</th>
        <th className="py-3 px-4 border-b text-left">Order ID</th>
        <th className="py-3 px-4 border-b text-left">Date</th>
        <th className="py-3 px-4 border-b text-left">Customer</th>
        <th className="py-3 px-4 border-b text-left">Items</th>
        <th className="py-3 px-4 border-b text-left">Total</th>
        <th className="py-3 px-4 border-b text-left">Payment</th>
        <th className="py-3 px-4 border-b text-left">Tracking ID</th>
        <th className="py-3 px-4 border-b text-left">Status</th>
        <th className="py-3 px-4 border-b text-center">Actions</th>
      </tr>
    </thead>
    <tbody className="text-gray-700 text-sm">
      {currentOrders.map((order, index) => {
        const tableIndex = indexOfFirstOrder + index + 1;
        
        // Dynamic Status Styles
        const getStatusBadge = (status) => {
          const base = "px-2 py-1 rounded-full text-[10px] font-bold border";
          if (status === 'Shipped') return `${base} bg-green-100 text-green-700 border-green-200`;
          if (status === 'Packed') return `${base} bg-purple-100 text-purple-700 border-purple-200`;
          return `${base} bg-yellow-100 text-yellow-700 border-yellow-200`;
        };

        return (
          <tr key={order._id} className="border-b hover:bg-gray-50 transition">
            <td className="px-4 py-3 font-semibold text-gray-400">{tableIndex}</td>
            <td className="px-4 py-3 font-mono text-[11px] text-indigo-600">{order.razorpayOrderId || order._id}</td>
            <td className="px-4 py-3 whitespace-nowrap text-xs">{formatDate(order.createdAt)}</td>
            <td className="px-4 py-3 font-medium">{order.shippingDetails?.fullName}</td>
            <td className="px-4 py-3">
              <div className="flex items-center space-x-3">
                {order.products[0]?.image && (
                  <img
                    src={buildImgSrc(order.products[0].image)}
                    alt="Product"
                    className="w-10 h-10 object-cover rounded border"
                  />
                )}
                <div className="text-[11px] leading-tight max-w-[120px]">
                  <div className="font-semibold truncate">{order.products[0]?.name}</div>
                  <div className="text-gray-400">Qty: {order.products[0]?.quantity} {order.products.length > 1 && `+ ${order.products.length - 1} more`}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 font-bold">₹{order.totalAmount}</td>
            <td className="px-4 py-3">
              <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3">
              {editOrderId === order._id ? (
                <input
                  className="border rounded px-2 py-1 w-full text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={editTrackingId}
                  onChange={(e) => setEditTrackingId(e.target.value)}
                />
              ) : (
                <span className="font-mono text-xs">{order.trackingId || "—"}</span>
              )}
            </td>
            <td className="px-4 py-3 capitalize">
              {editOrderId === order._id ? (
                <select
                  className="border rounded px-2 py-1 w-full text-xs outline-none"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                </select>
              ) : (
                <span className={getStatusBadge(order.shippingStatus || "Pending")}>
                  {order.shippingStatus || "Pending"}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={() => handleViewDetails(order)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-1.5 text-xs font-semibold transition shadow-sm"
              >
                View
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded shadow">
           <div className="text-sm text-gray-700">
             Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length}
          </div>
          <div className="flex space-x-1">
             <button 
              onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
             >Prev</button>
             {Array.from({length: totalPages}, (_, i) => (
               <button 
                key={i+1} 
                onClick={() => paginate(i+1)}
                className={`px-3 py-1 border rounded ${currentPage === i+1 ? 'bg-indigo-600 text-white' : ''}`}
               >{i+1}</button>
             ))}
             <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
             >Next</button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-black/50 z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] relative border">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-light transition"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 mb-8">
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-widest">Customer Info</h3>
                <p><span className="font-semibold">Name:</span> {selectedOrder.shippingDetails.fullName}</p>
                <p><span className="font-semibold">Email:</span> {selectedOrder.shippingDetails.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedOrder.shippingDetails.phone}</p>
                <p><span className="font-semibold">Address:</span> {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state}</p>
                <p><span className="font-semibold">Pincode:</span> {selectedOrder.shippingDetails.pinCode || selectedOrder.shippingDetails.zipCode || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-widest">Order Info</h3>
                <p><span className="font-semibold">Order ID:</span> {selectedOrder.razorpayOrderId || selectedOrder._id}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                <p><span className="font-semibold">Amount:</span> <span className="text-indigo-600 font-bold">₹{selectedOrder.totalAmount}</span></p>
                <p><span className="font-semibold">Payment Status:</span> <span className="capitalize">{selectedOrder.status}</span></p>
                <p><span className="font-semibold">Shipping Status:</span> <span className="capitalize">{selectedOrder.shippingStatus || "Pending"}</span></p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs uppercase font-bold text-gray-400 mb-4 tracking-widest">Purchased Products</h3>
              <div className="space-y-4">
                {selectedOrder.products.map((p, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <img 
                      src={buildImgSrc(p.image)} 
                      alt={p.name} 
                      className="w-16 h-16 object-cover rounded-md border bg-white shadow-sm"
                    />
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800">{p.name || "Product"}</p>
                      <p className="text-sm text-gray-500">Qty: {p.quantity} | Price: ₹{p.price}</p>
                    </div>
                    <div className="text-right font-semibold text-gray-700">
                      ₹{p.quantity * p.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
              <div className="w-full">
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Update Tracking ID</label>
                <input
                  className="border rounded px-3 py-2 w-full bg-white"
                  placeholder="Enter Tracking ID"
                  value={editTrackingId}
                  onChange={(e) => setEditTrackingId(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Update Status</label>
                <select
                  className="border rounded px-3 py-2 w-full bg-white"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                </select>
              </div>
              <div className="pt-5 w-full sm:w-auto">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold w-full transition shadow-md"
                  onClick={() => {
                    handleSave(selectedOrder._id);
                    setSelectedOrder(null);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;