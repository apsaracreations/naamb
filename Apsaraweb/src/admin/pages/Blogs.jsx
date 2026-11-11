import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { adminFetch, buildImgSrc, formatDate } from "../api";
import {
  PageHeader, Card, Button, EmptyState, LoadingRow, ConfirmModal, Modal, Field, inputCls, textareaCls, fileCls,
} from "../components/ui";

const AddBlogModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ heading: "", description: "", link: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a blog image");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v.trim()));
    fd.append("image", file);
    setSaving(true);
    try {
      await adminFetch("/blogs/add", { method: "POST", body: fd });
      toast.success("Blog added");
      onSaved();
    } catch (err) {
      toast.error(err.message || "Failed to add blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title="Add blog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="blog-form" loading={saving}>Add blog</Button>
        </>
      }
    >
      <form id="blog-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Heading" required className="sm:col-span-2">
          <input name="heading" className={inputCls} value={form.heading} onChange={set} placeholder="Blog title" required />
        </Field>
        <Field label="Short description" required className="sm:col-span-2">
          <textarea name="description" className={textareaCls} value={form.description} onChange={set} placeholder="A short summary shown on the blog card" required />
        </Field>
        <Field label="Article link" required hint="Where “Read more” takes the reader" className="sm:col-span-2">
          <input name="link" type="url" className={inputCls} value={form.link} onChange={set} placeholder="https://…" required />
        </Field>
        <Field label="Cover image" required className="sm:col-span-2">
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={fileCls} />
            {preview && <img src={preview} alt="Preview" className="mt-3 aspect-video w-full max-w-sm rounded-md object-cover" />}
          </div>
        </Field>
      </form>
    </Modal>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/blogs/get");
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/blogs/delete/${toDelete._id}`, { method: "DELETE" });
      setBlogs((prev) => prev.filter((b) => b._id !== toDelete._id));
      toast.success("Blog deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Blogs"
        description={`${blogs.length} posts shown on the blog page`}
        actions={<Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add blog</Button>}
      />

      {loading && !blogs.length ? (
        <Card><LoadingRow label="Loading blogs…" /></Card>
      ) : !blogs.length ? (
        <Card><EmptyState title="No blogs yet" description="Add a blog post to show it on the website." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {blogs.map((b) => (
            <article key={b._id} className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
              <img src={buildImgSrc(b.image)} alt={b.heading} className="aspect-video w-full bg-stone-100 object-cover" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-stone-500">{formatDate(b.createdAt, false)}</p>
                <h3 className="mt-1 line-clamp-2 font-semibold text-stone-900">{b.heading}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-stone-600">{b.description}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3">
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open link
                  </a>
                  <Button variant="dangerGhost" size="sm" onClick={() => setToDelete(b)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {adding && <AddBlogModal onClose={() => setAdding(false)} onSaved={() => { setAdding(false); load(); }} />}

      <ConfirmModal
        open={!!toDelete}
        title="Delete blog?"
        message={<>Delete <strong>{toDelete?.heading}</strong>? This cannot be undone.</>}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
};

export default Blogs;
