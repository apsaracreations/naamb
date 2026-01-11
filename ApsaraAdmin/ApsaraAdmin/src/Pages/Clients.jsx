import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchReviews();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients/get`);
      const data = await res.json();
      setClients(data.reverse());
    } catch {
      toast.error("Failed to fetch clients");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/all`);
      const data = await res.json();
      setReviews(data.reverse());
    } catch {
      toast.error("Failed to fetch reviews");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a client logo");
      return;
    }
    setLoading(true);
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("image", formData.image);

    try {
      const res = await fetch(`${API_BASE}/clients/add`, {
        method: "POST",
        body: submitData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("Client added successfully!");
      setFormData({ name: "", image: null });
      setPreviewImage(null);
      fetchClients();
    } catch {
      toast.error("Error adding client");
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_BASE}/clients/delete/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Client removed");
      setDeleteId(null);
      fetchClients();
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteReview = async () => {
    if (!deleteReviewId) return;
    try {
      const res = await fetch(`${API_BASE}/reviews/delete/${deleteReviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Review deleted");
      setDeleteReviewId(null);
      fetchReviews();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* --- CLIENT MANAGEMENT HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Client Management</h2>
          <p className="text-gray-500 text-sm">Add and manage your partner logos</p>
        </div>
        <span className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full font-bold text-sm border border-blue-100">
          Total Clients: {clients.length}
        </span>
      </div>

      {/* --- TWO COLUMN LAYOUT: ADD & VIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Add Client Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 sticky top-24"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Client</h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client Logo</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  onChange={handleChange}
                  required
                />
              </div>

              {previewImage && (
                <div className="relative group">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-full object-contain border-2 border-dashed border-gray-200 rounded-xl p-2 bg-gray-50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Acme Corp"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {loading ? "SAVING..." : "ADD CLIENT"}
              </button>
            </div>
          </form>
        </div>

        {/* Client Records List */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Partner Records</h3>
          
          {clients.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
               <p className="text-gray-400 font-medium">No clients added yet. Use the form to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition group"
                >
                  <div className="h-24 flex items-center justify-center bg-gray-50 rounded-xl mb-3 p-2">
                    <img
                      src={`${API_BASE.replace("/api", "")}/${client.image}`}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-gray-700 text-center text-sm truncate px-2">
                    {client.name}
                  </h4>
                  <button
                    onClick={() => setDeleteId(client._id)}
                    className="mt-3 w-full text-red-500 hover:text-white hover:bg-red-500 border border-red-100 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- REVIEW SECTION --- */}
      <div className="border-t border-gray-200 pt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Client Reviews</h2>
          <div className="h-1 flex-grow bg-gray-100 rounded-full"></div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-10 italic">No reviews received from the website yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{review.name}</h3>
                      <p className="text-blue-600 text-xs font-bold uppercase tracking-wide">{review.companyName}</p>
                    </div>
                    <div className="text-blue-200">
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C14.4647 14 14.017 13.5523 14.017 13V10C14.017 9.44772 14.4647 9 15.017 9H20.017C20.5693 9 21.017 9.44772 21.017 10V18C21.017 19.6569 19.6739 21 18.017 21H14.017ZM3.01709 21L3.01709 18C3.01709 16.8954 3.91252 16 5.01709 16H8.01709V14H4.01709C3.4648 14 3.01709 13.5523 3.01709 13V10C3.01709 9.44772 3.4648 9 4.01709 9H9.01709C9.56937 9 10.0171 9.44772 10.0171 10V18C10.0171 19.6569 8.67394 21 7.01709 21H3.01709Z" /></svg>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[11px] text-gray-500 flex items-center gap-2">
                      <span className="font-bold text-gray-400">EMAIL:</span> {review.email}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-2">
                      <span className="font-bold text-gray-400">PHONE:</span> {review.phone}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm italic leading-relaxed bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                    "{review.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {new Date(review.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setDeleteReviewId(review._id)}
                    className="text-red-400 hover:text-red-600 transition p-1"
                    title="Delete Review"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {(deleteId || deleteReviewId) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full max-w-sm transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 text-sm mb-8">Are you sure you want to remove this? This action cannot be reversed.</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteReviewId(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteId ? deleteClient : deleteReview}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Clients;