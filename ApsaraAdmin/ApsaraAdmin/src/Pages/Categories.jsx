import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;
const API_ROOT = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // form state
  const [name, setName] = useState("");
  const [bannerHeading, setBannerHeading] = useState("");
  const [filters, setFilters] = useState([]); // array of strings
  const [filterInput, setFilterInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [headingFile, setHeadingFile] = useState(null);

  const [editing, setEditing] = useState(null); // category object when editing
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const filterInputRef = useRef();

  // fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories/get`);
      if (!res.ok) throw new Error("Failed fetching categories");
      const data = await res.json();
      setCategories(data || []);
      setCurrentPage(1); // Reset pagination on fetch
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // utility to build image src from returned path
  const buildImgSrc = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const p = path.replace(/^\/+/, "");
    return `${API_ROOT}/${p}`;
  };

  // add filter tag
  const addFilter = () => {
    const val = filterInput.trim();
    if (!val) return;
    if (filters.includes(val)) {
      toast.error("Filter already added");
      setFilterInput("");
      return;
    }
    setFilters((s) => [...s, val]);
    setFilterInput("");
    filterInputRef.current?.focus();
  };

  const removeFilter = (f) => setFilters((s) => s.filter((x) => x !== f));

  // clear form
  const clearForm = () => {
    setName("");
    setBannerHeading("");
    setFilters([]);
    setFilterInput("");
    setBannerFile(null);
    setHeadingFile(null);
    setEditing(null);
  };

  // submit add or update
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editing) {
        // UPDATE flow
        const payload = {
          name,
          bannerHeading,
          filters,
        };

        if (bannerFile || headingFile) {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("bannerHeading", bannerHeading);
          filters.forEach((f) => formData.append("filters", f));
          if (bannerFile) formData.append("bannerImage", bannerFile);
          if (headingFile) formData.append("headingImage", headingFile);

          const res = await fetch(
            `${API_BASE}/categories/update/${editing._id}`,
            {
              method: "PUT",
              body: formData,
            }
          );

          if (!res.ok) {
            toast.error("Update failed with files. Trying without images...");
            const res2 = await fetch(
              `${API_BASE}/categories/update/${editing._id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );
            if (!res2.ok) throw new Error("Update failed");
            toast.success("Category updated (without image changes)");
          } else {
            toast.success("Category updated");
          }
        } else {
          const res = await fetch(
            `${API_BASE}/categories/update/${editing._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) throw new Error("Update failed");
          toast.success("Category updated");
        }
      } else {
        // CREATE flow
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bannerHeading", bannerHeading);
        formData.append("filters", filters.join(","));
        if (bannerFile) formData.append("bannerImage", bannerFile);
        if (headingFile) formData.append("headingImage", headingFile);

        const res = await fetch(`${API_BASE}/categories/add`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Add failed:", text);
          throw new Error("Add failed");
        }
        toast.success("Category created");
      }

      clearForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setName(cat.name || "");
    setBannerHeading(cat.bannerHeading || "");
    if (Array.isArray(cat.filters)) setFilters(cat.filters);
    else if (typeof cat.filters === "string") {
      const arr = cat.filters
        ? cat.filters
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      setFilters(arr);
    } else setFilters([]);

    setBannerFile(null);
    setHeadingFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (cat) => {
    setDeleteTarget(cat);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `${API_BASE}/categories/delete/${deleteTarget._id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Category deleted");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans text-gray-900">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Category Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store product categories and filters.</p>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 sm:p-6 mb-10">
        <h2 className="text-lg font-semibold mb-6 border-b pb-2">
          {editing ? "Edit Category" : "Create New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Ex: Bags"
                required
              />
            </div>

            {/* Banner Heading */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Banner Heading
              </label>
              <input
                value={bannerHeading}
                onChange={(e) => setBannerHeading(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Shop latest Bags"
              />
            </div>

            {/* Filters */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              <label className="block text-sm font-semibold mb-2">Search Filters / Tags</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  ref={filterInputRef}
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFilter();
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type filter and press Enter"
                />
                <button
                  type="button"
                  onClick={addFilter}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(f)}
                      className="hover:text-red-600 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold mb-2">Banner Image</label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {editing && !bannerFile && editing.bannerImage && (
                  <div className="relative w-24 h-14 group">
                    <img
                      src={buildImgSrc(editing.bannerImage)}
                      alt="banner"
                      className="h-full w-full object-cover rounded-md border cursor-zoom-in"
                      onClick={() => setPreviewImage(buildImgSrc(editing.bannerImage))}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md pointer-events-none" />
                  </div>
                )}
                {bannerFile && (
                  <img
                    src={URL.createObjectURL(bannerFile)}
                    alt="preview"
                    className="h-24 w-40 object-cover rounded-lg border border-blue-200"
                  />
                )}
              </div>
            </div>

            {/* Heading Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold mb-2">Heading Icon/Image</label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeadingFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {editing && !headingFile && editing.headingImage && (
                  <div className="relative w-24 h-14 group">
                    <img
                      src={buildImgSrc(editing.headingImage)}
                      alt="heading"
                      className="h-full w-full object-cover rounded-md border cursor-zoom-in"
                      onClick={() => setPreviewImage(buildImgSrc(editing.headingImage))}
                    />
                  </div>
                )}
                {headingFile && (
                  <img
                    src={URL.createObjectURL(headingFile)}
                    alt="preview"
                    className="h-24 w-40 object-cover rounded-lg border border-blue-200"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-all active:scale-95"
            >
              {editing ? "Save Changes" : "Create Category"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  clearForm();
                }}
                className="text-sm font-medium text-red-600 hover:underline ml-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Category List</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {loading ? "Refreshing..." : `${categories.length} Total`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Name", "Banner Heading", "Filters", "Images", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((cat, idx) => (
                <tr key={cat._id || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{indexOfFirstItem + idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]">
                    {cat.bannerHeading || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(Array.isArray(cat.filters)
                        ? cat.filters
                        : (cat.filters || "").split(",")
                      )
                        .filter(Boolean)
                        .map((f, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200"
                          >
                            {f}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {cat.bannerImage ? (
                        <img
                          src={buildImgSrc(cat.bannerImage)}
                          alt="banner"
                          className="h-10 w-16 object-cover rounded shadow-sm hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => setPreviewImage(buildImgSrc(cat.bannerImage))}
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-50 border rounded flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                      )}
                      {cat.headingImage && (
                        <img
                          src={buildImgSrc(cat.headingImage)}
                          alt="heading"
                          className="h-10 w-10 object-cover rounded shadow-sm hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => setPreviewImage(buildImgSrc(cat.headingImage))}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(cat)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {categories.length > itemsPerPage && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-500 uppercase">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length}
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                PREVIOUS
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 text-xs font-bold bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong>? 
              This will permanently delete the category.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div 
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative animate-in zoom-in duration-200">
            <img
              src={previewImage}
              alt="preview"
              className="rounded-xl max-h-[85vh] max-w-full object-contain shadow-2xl border border-white/10"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;