import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const API_ROOT = (API_BASE).replace(/\/api\/?$/, "");

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "");
  return `${API_ROOT}/${p}`;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    heading: "",
    description: "",
    link: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/blogs/get`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data.reverse() : []);
      setLoading(false);
    } catch {
      toast.error("Failed to fetch blogs");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, image: null });
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setFormData({
      image: null,
      heading: "",
      description: "",
      link: "",
    });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a blog image");
      return;
    }
    setLoading(true);
    const submissionData = new FormData();
    submissionData.append("image", formData.image);
    submissionData.append("heading", formData.heading);
    submissionData.append("description", formData.description);
    submissionData.append("link", formData.link);

    try {
      const res = await fetch(`${API_BASE}/blogs/add`, {
        method: "POST",
        body: submissionData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("Blog added successfully");
      resetForm();
      fetchBlogs();
    } catch {
      toast.error("Error uploading blog");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_BASE}/blogs/delete/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Blog deleted");
      setDeleteId(null);
      fetchBlogs();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Blog Management</h1>
          <div className="text-sm font-medium px-4 py-1 bg-gray-100 rounded-full text-gray-600">
            Total: {blogs.length}
          </div>
        </div>

        {/* Two Column Layout for Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Heading *</label>
              <input
                type="text"
                name="heading"
                placeholder="Enter blog title"
                className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition"
                value={formData.heading}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Description *</label>
              <textarea
                name="description"
                placeholder="Write a short summary..."
                className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none h-32 transition resize-none"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Redirect Link *</label>
              <input
                type="url"
                name="link"
                placeholder="https://example.com/full-article"
                className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Right Side: Image Upload & Action */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-dashed border-gray-300">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Blog Image</label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                onChange={handleChange}
                required={!formData.image}
              />
              
              {previewImage && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Image Preview</p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-full object-cover border rounded-md bg-white shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "SAVING..." : "ADD BLOG"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full mt-3 border border-gray-300 font-bold py-2.5 rounded-md hover:bg-gray-50 transition text-sm"
              >
                RESET
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Blog Records Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Blog Records</h3>
        </div>

        <div className="p-6">
          {blogs.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-10 font-medium">No blogs available. Add one using the form!</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => {
              const formattedDate = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "No Date";

              return (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <img
                    src={buildImgSrc(blog.image)}
                    alt={blog.heading}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{blog.heading}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.description}
                    </p>
                    
                    <div className="mt-auto border-t pt-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Posted on: {formattedDate}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={blog.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black text-white px-3 py-2 rounded text-xs font-bold text-center hover:bg-gray-800 transition"
                        >
                          VIEW BLOG
                        </a>
                        <button
                          onClick={() => setDeleteId(blog._id)}
                          className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded text-xs font-bold hover:bg-red-100 transition"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Blog?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Are you sure you want to remove this record?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                CANCEL
              </button>
              <button
                onClick={deleteBlog}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;