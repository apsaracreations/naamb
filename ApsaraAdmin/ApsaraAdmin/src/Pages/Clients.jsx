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
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
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
    <div className="p-6 mt-20">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Client Management</h2>
        <span className="text-black px-4 py-2 text-md">
          Total: {clients.length}
        </span>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Add Client Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg p-6 grid gap-4"
        >
          <h3 className="text-xl font-semibold mb-2">Add Client</h3>

          <input
            type="file"
            name="image"
            accept="image/*"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-28 object-contain border rounded-md p-2 bg-gray-50"
            />
          )}

          <input
            type="text"
            name="name"
            placeholder="Client Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Add Client"}
          </button>
        </form>

        {/* Client Records */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Client Records</h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6">
            {clients.length === 0 && <p>No clients added yet.</p>}

            {clients.map((client) => (
              <div
                key={client._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <img
                  src={`${API_BASE.replace("/api", "")}/${client.image}`}
                  className="w-full h-28 object-contain bg-gray-50 rounded-md p-2"
                />

                <h4 className="font-semibold text-center mt-3">
                  {client.name}
                </h4>

                <button
                  onClick={() => setDeleteId(client._id)}
                  className="mt-4 w-full text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------ REVIEW SECTION ------------------ */}
      <h2 className="text-3xl font-semibold mt-16 mb-6">Client Reviews</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {reviews.length === 0 && (
          <p className="text-gray-500 text-lg">No reviews available.</p>
        )}

        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition"
          >
            <h3 className="font-bold text-xl text-blue-600">{review.name}</h3>
            <p className="text-gray-500">{review.companyName}</p>

            <p className="text-sm text-gray-600 mt-2">{review.email}</p>
            <p className="text-sm text-gray-600">{review.phone}</p>

            <p className="mt-3 text-gray-700 italic border-l-4 pl-3 border-blue-500">
              "{review.review}"
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Posted: {new Date(review.date).toLocaleDateString()}
            </p>

            <button
              onClick={() => setDeleteReviewId(review._id)}
              className="mt-4 w-full text-red-600 hover:text-red-800 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal (Clients + Reviews share this UI) */}
      {(deleteId || deleteReviewId) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h3 className="text-lg font-semibold mb-3">Are you sure?</h3>
            <p className="text-gray-600 mb-5">This action cannot be undone.</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteReviewId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={deleteId ? deleteClient : deleteReview}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
