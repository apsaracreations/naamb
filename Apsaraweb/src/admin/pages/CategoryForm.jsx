import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { adminFetch, buildImgSrc, toList } from "../api";
import { Modal, Button, Field, Thumb, inputCls, fileCls } from "../components/ui";

const ImagePicker = ({ label, required, file, setFile, currentSrc, hint, thumbClass }) => {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview || currentSrc;
  return (
    <Field label={label} required={required} hint={hint}>
      <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={fileCls} />
        {shown && <Thumb src={shown} className={`mt-3 ${thumbClass}`} />}
      </div>
    </Field>
  );
};

const CategoryForm = ({ category, onClose, onSaved }) => {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || "");
  const [bannerHeading, setBannerHeading] = useState(category?.bannerHeading || "");
  const [filters, setFilters] = useState(toList(category?.filters));
  const [filterInput, setFilterInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [headingFile, setHeadingFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const addFilters = () => {
    const incoming = toList(filterInput).filter((f) => !filters.includes(f));
    if (incoming.length) setFilters((prev) => [...prev, ...incoming]);
    setFilterInput("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isEdit && (!bannerFile || !headingFile)) return toast.error("Please choose both a banner image and a heading image");

    setSaving(true);
    try {
      if (!isEdit) {
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("bannerHeading", bannerHeading.trim());
        fd.append("filters", filters.join(","));
        fd.append("bannerImage", bannerFile);
        fd.append("headingImage", headingFile);
        await adminFetch("/categories/add", { method: "POST", body: fd });
      } else if (bannerFile || headingFile) {
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("bannerHeading", bannerHeading.trim());
        filters.forEach((f) => fd.append("filters", f));
        if (bannerFile) fd.append("bannerImage", bannerFile);
        if (headingFile) fd.append("headingImage", headingFile);
        await adminFetch(`/categories/update/${category._id}`, { method: "PUT", body: fd });
      } else {
        await adminFetch(`/categories/update/${category._id}`, {
          method: "PUT",
          json: { name: name.trim(), bannerHeading: bannerHeading.trim(), filters },
        });
      }
      toast.success(isEdit ? "Category updated" : "Category created");
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
      title={isEdit ? "Edit category" : "Add category"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="category-form" loading={saving}>{isEdit ? "Save changes" : "Create category"}</Button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Category name" required>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bags" required />
        </Field>
        <Field label="Banner heading" required>
          <input className={inputCls} value={bannerHeading} onChange={(e) => setBannerHeading(e.target.value)} placeholder="e.g. Shop the latest bags" required />
        </Field>

        <Field label="Filters / tags" hint="Press Enter or Add. Separate several with commas." className="sm:col-span-2">
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFilters();
                }
              }}
              placeholder="e.g. Leather, Cotton"
            />
            <Button variant="secondary" onClick={addFilters}>Add</Button>
          </div>
          {filters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-full bg-stone-100 py-1 pl-3 pr-1 text-xs font-medium text-stone-700 ring-1 ring-inset ring-stone-200">
                  {f}
                  <button type="button" onClick={() => setFilters((prev) => prev.filter((x) => x !== f))} aria-label={`Remove ${f}`} className="rounded-full p-0.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <ImagePicker
          label="Banner image"
          required={!isEdit}
          file={bannerFile}
          setFile={setBannerFile}
          currentSrc={buildImgSrc(category?.bannerImage)}
          hint={isEdit ? "Leave empty to keep the current image" : "Wide image shown at the top of the category page"}
          thumbClass="h-20 w-36"
        />
        <ImagePicker
          label="Heading image"
          required={!isEdit}
          file={headingFile}
          setFile={setHeadingFile}
          currentSrc={buildImgSrc(category?.headingImage)}
          hint={isEdit ? "Leave empty to keep the current image" : "Square image used on category cards"}
          thumbClass="h-20 w-20"
        />
      </form>
    </Modal>
  );
};

export default CategoryForm;
