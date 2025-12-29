import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL; // e.g. http://192.168.1.3:5000/api
const API_ROOT = (import.meta.env.VITE_API_URL).replace(/\/api\/?$/, ""); // http://192.168.1.3:5000

// build image src: accept absolute urls or stored paths like "/uploads/products/..."
const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // remove leading slash(es)
  const p = path.replace(/^\/+/, "");
  return `${API_ROOT}/${p}`;
};

// format INR
const formatINR = (n) => {
  if (n === null || n === undefined || n === "") return "-";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [previewImage, setPreviewImage] = useState(null); // full screen preview
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // form state (used for both add and edit)
  const emptyForm = {
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    points: "", // comma separated string in form
    materialsCare: "",
    dimensions: "",
    images: [], // FileList or []
  };
  const [form, setForm] = useState(emptyForm);

  // local previews of selected files
  const [selectedPreviews, setSelectedPreviews] = useState([]); // data URLs for preview
  const fileInputRef = useRef();

  // fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/products/get`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/get`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // handle input changes
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // when selecting files
  const onFilesSelected = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 5) {
      toast.error("You can upload maximum 5 images.");
      // reset selection (don't set files)
      e.target.value = "";
      return;
    }
    if (files.length < 1) {
      toast.error("Select at least 1 image.");
      e.target.value = "";
      return;
    }
    // save files into form.images
    setForm((s) => ({ ...s, images: files }));
    // create previews
    const previews = files.map((f) => URL.createObjectURL(f));
    setSelectedPreviews(previews);
  };

  // clear selected previews (revoke URLs)
  const clearSelectedPreviews = () => {
    selectedPreviews.forEach((u) => URL.revokeObjectURL(u));
    setSelectedPreviews([]);
  };

  // reset form to empty
  const resetForm = () => {
    // revoke previews
    clearSelectedPreviews();
    setForm(emptyForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // open edit modal and populate
  const openEdit = (product) => {
    // populate fields from product
    setForm({
      id: product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      categoryId: product.categoryId?._id || product.categoryId || product.categoryId,
      points: Array.isArray(product.points) ? product.points.join(",") : (product.points || ""),
      materialsCare: product.materialsCare || "",
      dimensions: product.dimensions || "",
      images: [], // user may choose new files to replace existing images
    });
    // clear any selected previews
    clearSelectedPreviews();
    setIsEditOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // submit add or update
  const submitForm = async (e) => {
    e?.preventDefault();

    // basic validations
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.price) return toast.error("Price is required");
    if (!form.quantity) return toast.error("Quantity is required");
    if (!form.categoryId) return toast.error("Select a category");

    // For add: require at least 1 image
    if (!form.id && (!form.images || form.images.length < 1)) {
      return toast.error("Upload at least 1 image (max 5).");
    }
    // For add or update, enforce max 5
    if (form.images && form.images.length > 5) {
      return toast.error("Max 5 images allowed.");
    }

    try {
      const fd = new FormData();
      // common fields
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("quantity", form.quantity);
      fd.append("categoryId", form.categoryId);
      fd.append("materialsCare", form.materialsCare);
      fd.append("dimensions", form.dimensions);

      // points: for add endpoint we can send comma-separated string (controller splits),
      // for update the controller attempts JSON.parse on req.body.points; to be safe:
      // - if updating (PUT), send points as JSON array string
      // - if creating (POST), send points as comma-separated string (controller splits)
      const pointsArray = form.points ? form.points.split(",").map((s) => s.trim()).filter(Boolean) : [];
      if (form.id) {
        fd.append("points", JSON.stringify(pointsArray)); // update route expects JSON string
      } else {
        fd.append("points", pointsArray.join(",")); // create route expects comma string
      }

      // images (only append if user selected new files)
      if (form.images && form.images.length > 0) {
        form.images.forEach((f) => fd.append("images", f));
      }

      // Decide URL + method
      let url = `${API_BASE}/products/add`;
      let method = "POST";
      if (form.id) {
        url = `${API_BASE}/products/update/${form.id}`;
        method = "PUT";
      }

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (!res.ok) {
        console.error("Submit error", data);
        return toast.error(data.message || "Failed");
      }

      toast.success(data.message || (form.id ? "Updated" : "Added"));
      resetForm();
      setIsEditOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // delete flow (shows modal, confirmed triggers this)
  const doDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`${API_BASE}/products/delete/${deleteConfirmId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Delete failed");
      } else {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // small helper: show product details: returns table rows for all fields
  const ProductDetailsRow = ({ p }) => {
    return (
      <>
        <td className="px-3 py-2">{p.name}</td>
        <td className="px-3 py-2">{p.description}</td>
        <td className="px-3 py-2">{formatINR(p.price)}</td>
        <td className="px-3 py-2">{p.quantity}</td>
        <td className="px-3 py-2">{p.categoryName || p.categoryId?.name || "-"}</td>
        <td className="px-3 py-2">
          <div className="flex flex-wrap gap-1">
            {(p.points || []).map((pt, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-gray-200 rounded-full">{pt}</span>
            ))}
          </div>
        </td>
        <td className="px-3 py-2">{p.materialsCare || "-"}</td>
        <td className="px-3 py-2">{p.dimensions || "-"}</td>
        <td className="px-3 py-2">
          <div className="flex gap-2">
            {(p.images || []).slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={buildImgSrc(img)}
                alt=""
                className="h-12 w-14 object-cover rounded cursor-pointer border"
                onClick={() => setPreviewImage(buildImgSrc(img))}
              />
            ))}
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Manage Products</h1>
          <div className="text-sm text-gray-500">{loading ? "Loading..." : `${products.length} products`}</div>
        </div>

        {/* FORM CARD */}
        <form onSubmit={submitForm} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: inputs */}
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg space-y-4 border">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Product name *"
                className="w-full border rounded px-3 py-2 focus:outline-none"
                required
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={onChange}
                placeholder="Price (numeric) *"
                className="w-full border rounded px-3 py-2 focus:outline-none"
                required
              />

              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={onChange}
                placeholder="Quantity *"
                className="w-full border rounded px-3 py-2 focus:outline-none"
                required
              />

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={onChange}
                className="w-full border rounded px-3 py-2 focus:outline-none"
                required
              >
                <option value="">Select category *</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                name="materialsCare"
                value={form.materialsCare}
                onChange={onChange}
                placeholder="Materials & Care"
                className="w-full border rounded px-3 py-2 focus:outline-none"
              />

              <input
                name="dimensions"
                value={form.dimensions}
                onChange={onChange}
                placeholder="Dimensions"
                className="w-full border rounded px-3 py-2 focus:outline-none"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Description *"
              className="w-full border rounded px-3 py-2 focus:outline-none h-28"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Points (each point separated by comma)</label>
              <input
                name="points"
                value={form.points}
                onChange={onChange}
                placeholder="e.g. Light weight, Durable, Breathable"
                className="w-full border rounded px-3 py-2 focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.points
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((p, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {p}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Right column: images + submit */}
          <div className="bg-white p-4 rounded-lg border flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Product Images</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesSelected}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Min 1 — Max 5 images. Click thumbnail to preview.</p>

              {/* selected new previews */}
              {selectedPreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {selectedPreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="h-20 w-full object-cover rounded border" />
                    </div>
                  ))}
                </div>
              )}

              {/* when editing, show existing images for product (only when edit open) */}
              {isEditOpen && form.id && products.find((pp) => pp._id === form.id)?.images?.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-1">Existing images (will remain unless you upload new images)</div>
                  <div className="flex gap-2">
                    {products.find((pp) => pp._id === form.id).images.map((img, i) => (
                      <img
                        key={i}
                        src={buildImgSrc(img)}
                        alt=""
                        className="h-16 w-20 object-cover rounded border cursor-pointer"
                        onClick={() => setPreviewImage(buildImgSrc(img))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {form.id ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsEditOpen(false);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Reset
                </button>
              </div>

              {form.id && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setIsEditOpen(false);
                  }}
                  className="mt-2 text-sm text-gray-600 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
<div className="bg-white shadow rounded-lg p-4">
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-lg font-medium">All Products</h2>
  </div>

  <div className="overflow-auto w-full">
    <table className="w-full text-sm border-collapse">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Description</th>
          <th className="px-4 py-2 whitespace-nowrap">Price</th>
          <th className="px-4 py-2 whitespace-nowrap">Qty</th>
          <th className="px-4 py-2 whitespace-nowrap">Category</th>
          <th className="px-4 py-2 whitespace-nowrap">Points</th>
          <th className="px-4 py-2 whitespace-nowrap">Materials</th>
          <th className="px-4 py-2 whitespace-nowrap">Dimensions</th>
          <th className="px-4 py-2 whitespace-nowrap">Images</th>
          <th className="px-4 py-2 whitespace-nowrap text-center">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {products.length === 0 && !loading && (
          <tr>
            <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
              No products yet
            </td>
          </tr>
        )}

        {products.map((p) => (
          <tr key={p._id} className="hover:bg-gray-50 transition">
            
            {/* Name */}
            <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>

            {/* Description */}
            <td className="px-4 py-3 max-w-[200px] text-gray-600 truncate">{p.description}</td>

            {/* Price as INR */}
            <td className="px-4 py-3 font-semibold text-green-600">
              ₹{Number(p.price).toLocaleString("en-IN")}
            </td>

            {/* Quantity */}
            <td className="px-4 py-3 text-center">{p.quantity}</td>

            {/* Category */}
            <td className="px-4 py-3">{p.categoryName || "—"}</td>

            {/* Points */}
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {p.points.map((pt, i) => (
                  <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded-full">
                    {pt}
                  </span>
                ))}
              </div>
            </td>

            {/* Materials */}
            <td className="px-4 py-3">{p.materialsCare || "—"}</td>

            {/* Dimensions */}
            <td className="px-4 py-3">{p.dimensions || "—"}</td>

            {/* Images Scrollable */}
            <td className="px-4 py-3">
              <div className="flex gap-2 overflow-x-auto max-w-[160px]">
                {p.images.map((img, i) => (
                  <img
                    key={i}
                    src={buildImgSrc(img)}
                    className="w-14 h-14 object-cover rounded border cursor-pointer hover:scale-105 transition"
                    onClick={() => setPreviewImage(buildImgSrc(img))}
                  />
                ))}
              </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
              <div className="flex flex-col gap-2 md:flex-row justify-center">
                <button
                  onClick={() => {
                    openEdit(p);
                    setIsEditOpen(true);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteConfirmId(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
</div>


      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete product</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 rounded bg-red-600 text-white">Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW FULLSCREEN */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-4xl w-[90%]">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl" onClick={() => setPreviewImage(null)}>✖</button>
            <img src={previewImage} className="max-h-[80vh] w-auto object-contain mx-auto rounded-md" alt="preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
