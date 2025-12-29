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
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Blog Management</h2>
        <span className="text-black px-4 py-2 text-md">Total: {blogs.length}</span>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Add Blog Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 grid gap-4">
          <h3 className="text-xl font-semibold mb-2">Add Blog</h3>

          <input
            ref={fileInputRef}
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
            name="heading"
            placeholder="Heading"
            className="border p-2 rounded"
            value={formData.heading}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            className="border p-2 rounded resize-none"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="url"
            name="link"
            placeholder="Redirect Link"
            className="border p-2 rounded"
            value={formData.link}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Add Blog"}
          </button>
        </form>

        {/* Blog List */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Blog Records</h3>

          {blogs.length === 0 && !loading && (
            <p>No blogs available. Add one using the form!</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                >
                  <img
                    src={buildImgSrc(blog.image)}
                    alt={blog.heading}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h4 className="font-semibold text-center">{blog.heading}</h4>

                  <p className="text-gray-600 text-sm mb-3">{blog.description.slice(0, 100)}...</p>

                  <p className="text-xs text-gray-500 mb-3 text-center">Posted on: {formattedDate}</p>

                  <div className="flex justify-between gap-4">
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                    >
                      View Blog
                    </a>

                    <button
                      onClick={() => setDeleteId(blog._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h3 className="text-lg font-semibold mb-3">Are you sure?</h3>
            <p className="text-gray-600 mb-5">This action cannot be undone.</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteBlog}
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

export default Blogs;
