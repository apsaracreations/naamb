import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminFetch, buildImgSrc, toList } from "../api";
import { Modal, Button, Field, Thumb, inputCls, textareaCls, fileCls } from "../components/ui";

const MAX_IMAGES = 5;

const ProductForm = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(() => ({
    name: product?.name || "",
    categoryId: product?.categoryId?._id || product?.categoryId || "",
    price: product?.price ?? "",
    quantity: product?.quantity ?? "",
    materialsCare: product?.materialsCare || "",
    dimensions: product?.dimensions || "",
    description: product?.description || "",
    points: toList(product?.points).join(", "),
  }));
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length > MAX_IMAGES) {
      toast.error(`You can upload up to ${MAX_IMAGES} images`);
      e.target.value = "";
      return;
    }
    setFiles(picked);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.price) <= 0) return toast.error("Price must be greater than 0");
    if (Number(form.quantity) < 0) return toast.error("Quantity cannot be negative");
    if (!isEdit && files.length === 0) return toast.error("Upload at least 1 image");

    const fd = new FormData();
    ["name", "categoryId", "price", "quantity", "materialsCare", "dimensions", "description"].forEach((k) => fd.append(k, form[k]));
    const points = toList(form.points);
    fd.append("points", isEdit ? JSON.stringify(points) : points.join(","));
    files.forEach((f) => fd.append("images", f));

    setSaving(true);
    try {
      await adminFetch(isEdit ? `/products/update/${product._id}` : "/products/add", { method: isEdit ? "PUT" : "POST", body: fd });
      toast.success(isEdit ? "Product updated" : "Product added");
      onSaved();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit product" : "Add product"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="product-form" loading={saving}>{isEdit ? "Save changes" : "Add product"}</Button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required className="sm:col-span-2">
          <input name="name" className={inputCls} value={form.name} onChange={set} required />
        </Field>
        <Field label="Category" required>
          <select name="categoryId" className={inputCls} value={form.categoryId} onChange={set} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)" required>
            <input name="price" type="number" min="0" step="0.01" className={inputCls} value={form.price} onChange={set} required />
          </Field>
          <Field label="Stock qty" required>
            <input name="quantity" type="number" min="0" step="1" className={inputCls} value={form.quantity} onChange={set} required />
          </Field>
        </div>
        <Field label="Materials & care">
          <input name="materialsCare" className={inputCls} value={form.materialsCare} onChange={set} placeholder="e.g. 100% cotton, hand wash" />
        </Field>
        <Field label="Dimensions">
          <input name="dimensions" className={inputCls} value={form.dimensions} onChange={set} placeholder="e.g. 10 × 20 cm" />
        </Field>
        <Field label="Description" required className="sm:col-span-2">
          <textarea name="description" className={textareaCls} value={form.description} onChange={set} required />
        </Field>
        <Field label="Highlights" hint="Separate with commas, e.g. Handmade, Gift ready" className="sm:col-span-2">
          <input name="points" className={inputCls} value={form.points} onChange={set} />
        </Field>

        <Field
          label="Images"
          required={!isEdit}
          hint={isEdit ? "Choosing new images replaces all current images. Max 5." : "Up to 5 images. The first one is the cover."}
          className="sm:col-span-2"
        >
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
            <input type="file" accept="image/*" multiple onChange={onFiles} className={fileCls} />
            {(previews.length > 0 || (isEdit && product.images?.length > 0)) && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-stone-500">{previews.length ? "New images" : "Current images"}</p>
                <div className="flex flex-wrap gap-2">
                  {(previews.length ? previews : product.images.map(buildImgSrc)).map((src, i) => (
                    <Thumb key={src + i} src={src} className="h-16 w-16" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Field>
      </form>
    </Modal>
  );
};

export default ProductForm;
