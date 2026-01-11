import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;
const API_ROOT = (import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "");

const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "");
  return `${API_ROOT}/${p}`;
};

const formatINR = (n) => {
  if (n === null || n === undefined || n === "") return "-";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const emptyForm = {
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    points: "",
    materialsCare: "",
    dimensions: "",
    images: [],
  };
  const [form, setForm] = useState(emptyForm);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const fileInputRef = useRef();

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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onFilesSelected = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 5) {
      toast.error("You can upload maximum 5 images.");
      e.target.value = "";
      return;
    }
    if (files.length < 1) {
      toast.error("Select at least 1 image.");
      e.target.value = "";
      return;
    }
    setForm((s) => ({ ...s, images: files }));
    const previews = files.map((f) => URL.createObjectURL(f));
    setSelectedPreviews(previews);
  };

  const clearSelectedPreviews = () => {
    selectedPreviews.forEach((u) => URL.revokeObjectURL(u));
    setSelectedPreviews([]);
  };

  const resetForm = () => {
    clearSelectedPreviews();
    setForm(emptyForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openEdit = (product) => {
    setForm({
      id: product._id,
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      categoryId: product.categoryId?._id || product.categoryId,
      points: Array.isArray(product.points) ? product.points.join(",") : (product.points || ""),
      materialsCare: product.materialsCare || "",
      dimensions: product.dimensions || "",
      images: [],
    });
    clearSelectedPreviews();
    setIsEditOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.price) return toast.error("Price is required");
    if (!form.quantity) return toast.error("Quantity is required");
    if (!form.categoryId) return toast.error("Select a category");

    if (!form.id && (!form.images || form.images.length < 1)) {
      return toast.error("Upload at least 1 image (max 5).");
    }
    if (form.images && form.images.length > 5) {
      return toast.error("Max 5 images allowed.");
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("quantity", form.quantity);
      fd.append("categoryId", form.categoryId);
      fd.append("materialsCare", form.materialsCare);
      fd.append("dimensions", form.dimensions);

      const pointsArray = form.points ? form.points.split(",").map((s) => s.trim()).filter(Boolean) : [];
      if (form.id) {
        fd.append("points", JSON.stringify(pointsArray));
      } else {
        fd.append("points", pointsArray.join(","));
      }

      if (form.images && form.images.length > 0) {
        form.images.forEach((f) => fd.append("images", f));
      }

      let url = `${API_BASE}/products/add`;
      let method = "POST";
      if (form.id) {
        url = `${API_BASE}/products/update/${form.id}`;
        method = "PUT";
      }

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (!res.ok) return toast.error(data.message || "Failed");

      toast.success(data.message || (form.id ? "Updated" : "Added"));
      resetForm();
      setIsEditOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

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

  return (
    <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
          <div className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">
            {loading ? "Loading..." : `${products.length} products total`}
          </div>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={submitForm} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Product Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Name *</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Product name" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Price (INR) *</label>
                <input name="price" type="number" value={form.price} onChange={onChange} placeholder="Price" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Quantity *</label>
                <input name="quantity" type="number" value={form.quantity} onChange={onChange} placeholder="Available qty" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Category *</label>
                <select name="categoryId" value={form.categoryId} onChange={onChange} className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition bg-white" required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Materials & Care</label>
                <input name="materialsCare" value={form.materialsCare} onChange={onChange} placeholder="e.g. 100% Cotton" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Dimensions</label>
                <input name="dimensions" value={form.dimensions} onChange={onChange} placeholder="e.g. 10x20 cm" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Description *</label>
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Write product description here..." className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none h-32 transition resize-none" required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Highlights (Comma separated)</label>
              <input name="points" value={form.points} onChange={onChange} placeholder="e.g. Premium Quality, Fast Shipping" className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition" />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.points.split(",").map((s) => s.trim()).filter(Boolean).map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-medium uppercase tracking-wider">{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Images & Actions */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-dashed border-gray-300">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Product Images</label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" />
              
              {/* Previews of newly selected files */}
              {selectedPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {selectedPreviews.map((src, i) => (
                    <img key={i} src={src} className="h-16 w-full object-cover rounded border bg-white" alt="Preview" />
                  ))}
                </div>
              )}

              {/* Show existing images during edit */}
              {isEditOpen && form.id && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Current Images</p>
                  <div className="flex flex-wrap gap-2">
                    {products.find((pp) => pp._id === form.id)?.images?.map((img, i) => (
                      <img key={i} src={buildImgSrc(img)} className="h-12 w-12 object-cover rounded border cursor-pointer hover:opacity-75" onClick={() => setPreviewImage(buildImgSrc(img))} alt="Current" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto space-y-3">
              <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-900 transition active:scale-[0.98]">
                {form.id ? "UPDATE PRODUCT" : "ADD PRODUCT"}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => { resetForm(); setIsEditOpen(false); }} className="flex-1 border border-gray-300 font-bold py-2.5 rounded-md hover:bg-gray-50 transition text-sm">
                  RESET
                </button>
                {form.id && (
                  <button type="button" onClick={() => { setForm(emptyForm); setIsEditOpen(false); }} className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-md hover:bg-red-100 transition text-sm">
                    CANCEL
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Inventory Overview</h2>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Price/Qty</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Highlights</th>
                <th className="px-6 py-4">Gallery</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">No products found in database.</td>
                </tr>
              )}

              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 max-w-[250px]">
                    <div className="font-bold text-gray-800 truncate">{p.name}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">{p.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-black">{formatINR(p.price)}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{p.quantity} Units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                      {p.categoryName || p.categoryId?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(p.points || []).slice(0, 3).map((pt, i) => (
                        <span key={i} className="bg-gray-200/50 text-gray-500 text-[9px] px-1.5 py-0.5 rounded font-medium">{pt}</span>
                      ))}
                      {(p.points || []).length > 3 && <span className="text-[9px] text-gray-400 font-bold">...</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {p.images.slice(0, 3).map((img, i) => (
                        <img key={i} src={buildImgSrc(img)} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover cursor-pointer hover:z-10 transition-transform" onClick={() => setPreviewImage(buildImgSrc(img))} alt="" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteConfirmId(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure? This product and its images will be removed forever.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={doDelete} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[110] p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl w-full">
            <button className="absolute -top-12 right-0 text-white text-3xl font-light hover:rotate-90 transition-transform duration-300" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage} className="max-h-[85vh] w-auto object-contain mx-auto rounded shadow-2xl" alt="Product view" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;