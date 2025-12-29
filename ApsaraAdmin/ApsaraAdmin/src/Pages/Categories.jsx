import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;
const API_ROOT = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // utility to build image src from returned path
  const buildImgSrc = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // remove leading slashes
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

    // basic validation
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
          // Try multipart PUT
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
            // fallback to JSON PUT (no images)
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
          // no file changes — send JSON
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
        // CREATE flow (multipart/form-data)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bannerHeading", bannerHeading);
        formData.append("filters", filters.join(",")); // backend expects comma-separated
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

  // start edit: populate form
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

  // open delete modal
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
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* FORM */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                placeholder="Ex: Electronics"
                required
              />
            </div>

            {/* Banner Heading */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Banner heading
              </label>
              <input
                value={bannerHeading}
                onChange={(e) => setBannerHeading(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                placeholder="Shop latest electronics"
              />
            </div>

            {/* Filters */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Filters</label>

              <div className="flex gap-2">
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
                  className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                  placeholder="Type filter name and press Add or Enter"
                />
                <button
                  type="button"
                  onClick={addFilter}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(f)}
                      className="text-gray-500 hover:text-gray-800"
                      aria-label={`Remove ${f}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Banner image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              {editing && !bannerFile && editing.bannerImage && (
                <img
                  src={buildImgSrc(editing.bannerImage)}
                  alt="banner"
                  className="h-12 w-20 object-cover rounded cursor-pointer mt-2"
                  onClick={() =>
                    setPreviewImage(buildImgSrc(editing.bannerImage))
                  }
                />
              )}
              {bannerFile && (
                <img
                  src={URL.createObjectURL(bannerFile)}
                  alt="banner preview"
                  className="mt-2 h-24 object-cover rounded"
                />
              )}
            </div>

            {/* Heading Image */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Heading image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeadingFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              {editing && !headingFile && editing.headingImage && (
                <img
                  src={buildImgSrc(editing.headingImage)}
                  alt="heading"
                  className="h-12 w-20 object-cover rounded cursor-pointer mt-2"
                  onClick={() =>
                    setPreviewImage(buildImgSrc(editing.headingImage))
                  }
                />
              )}
              {headingFile && (
                <img
                  src={URL.createObjectURL(headingFile)}
                  alt="heading preview"
                  className="mt-2 h-24 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {editing ? "Update Category" : "Add Category"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="border px-4 py-2 rounded"
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
                className="ml-auto text-sm text-gray-600 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">All Categories</h2>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${categories.length} items`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  #
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  Banner Heading
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  Filters
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  Images
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {categories.map((cat, idx) => (
                <tr key={cat._id || idx} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm">{idx + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium">
                    {cat.name}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    {cat.bannerHeading || "-"}
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(cat.filters)
                        ? cat.filters
                        : (cat.filters || "").split(",")
                      )
                        .filter(Boolean)
                        .map((f, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                          >
                            {f}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      {cat.bannerImage ? (
                        <img
                          src={buildImgSrc(cat.bannerImage)}
                          alt="banner"
                          className="h-12 w-20 object-cover rounded cursor-pointer"
                          onClick={() =>
                            setPreviewImage(buildImgSrc(cat.bannerImage))
                          }
                        />
                      ) : (
                        <div className="h-12 w-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          No banner
                        </div>
                      )}

                      {cat.headingImage ? (
                        <img
                          src={buildImgSrc(cat.headingImage)}
                          alt="heading"
                          className="h-12 w-20 object-cover rounded cursor-pointer"
                          onClick={() =>
                            setPreviewImage(buildImgSrc(cat.headingImage))
                          }
                        />
                      ) : (
                        <div className="h-12 w-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          No heading
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(cat)}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-gray-500"
                  >
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete category</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={previewImage}
              alt="preview"
              className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 bg-red-600 w-10 h-10 text-white flex items-center justify-center rounded-full hover:bg-red-700 shadow-lg"
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
