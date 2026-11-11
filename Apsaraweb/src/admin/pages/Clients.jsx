import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Mail, Phone, Quote } from "lucide-react";
import { adminFetch, buildImgSrc, formatDate } from "../api";
import {
  PageHeader, Card, Button, EmptyState, LoadingRow, ConfirmModal, Modal, Field, inputCls, fileCls,
} from "../components/ui";

const AddClientModal = ({ onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please choose a logo");
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("image", file);
    setSaving(true);
    try {
      await adminFetch("/clients/add", { method: "POST", body: fd });
      toast.success("Client added");
      onSaved();
    } catch (err) {
      toast.error(err.message || "Failed to add client");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add client"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="client-form" loading={saving}>Add client</Button>
        </>
      }
    >
      <form id="client-form" onSubmit={submit} className="space-y-4">
        <Field label="Client name" required>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Corp" required />
        </Field>
        <Field label="Logo" required>
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={fileCls} />
            {preview && <img src={preview} alt="Preview" className="mt-3 h-24 w-full rounded-md bg-white object-contain p-2" />}
          </div>
        </Field>
      </form>
    </Modal>
  );
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null); // { type: "client" | "review", item }
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, r] = await Promise.all([adminFetch("/clients/get"), adminFetch("/reviews/admin/all")]);
      setClients(Array.isArray(c) ? c : []);
      setReviews(Array.isArray(r) ? r : []);
    } catch (err) {
      toast.error(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doDelete = async () => {
    const { type, item } = toDelete;
    setDeleting(true);
    try {
      await adminFetch(type === "client" ? `/clients/delete/${item._id}` : `/reviews/delete/${item._id}`, { method: "DELETE" });
      if (type === "client") setClients((prev) => prev.filter((c) => c._id !== item._id));
      else setReviews((prev) => prev.filter((r) => r._id !== item._id));
      toast.success(type === "client" ? "Client removed" : "Review deleted");
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
        title="Clients & Reviews"
        description="Partner logos and customer reviews shown on the home page."
        actions={<Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add client</Button>}
      />

      <div className="space-y-6">
        <Card title="Clients" subtitle={`${clients.length} partner logo${clients.length === 1 ? "" : "s"}`}>
          {loading && !clients.length ? (
            <LoadingRow />
          ) : !clients.length ? (
            <EmptyState title="No clients yet" description="Add partner logos to show them on the website." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {clients.map((c) => (
                <div key={c._id} className="flex flex-col rounded-lg border border-stone-200 p-3">
                  <div className="flex h-20 items-center justify-center rounded-md bg-stone-50 p-2">
                    <img src={buildImgSrc(c.image)} alt={c.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="mt-3 truncate text-center text-sm font-medium text-stone-900">{c.name}</p>
                  <Button variant="dangerGhost" size="sm" className="mt-2 w-full" onClick={() => setToDelete({ type: "client", item: c })}>
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Customer reviews" subtitle={`${reviews.length} review${reviews.length === 1 ? "" : "s"} from the website`}>
          {loading && !reviews.length ? (
            <LoadingRow />
          ) : !reviews.length ? (
            <EmptyState title="No reviews yet" description="Reviews submitted on the website will appear here." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((r) => (
                <article key={r._id} className="flex flex-col rounded-lg border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#310000]/5 text-sm font-semibold text-[#310000]">
                        {(r.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-900">{r.name}</p>
                        <p className="truncate text-xs text-stone-500">{r.companyName}</p>
                      </div>
                    </div>
                    <Button variant="dangerGhost" size="icon" onClick={() => setToDelete({ type: "review", item: r })} aria-label="Delete review">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="relative mt-3 flex-1 rounded-md bg-stone-50 p-3 pl-8 text-sm leading-relaxed text-stone-700">
                    <Quote className="absolute left-2.5 top-3 h-4 w-4 text-stone-300" />
                    {r.review}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-stone-500">
                    <p className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0" /> {r.email}</p>
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> {r.phone}</p>
                    <p className="pt-1 text-stone-400">{formatDate(r.date, false)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>

      {adding && <AddClientModal onClose={() => setAdding(false)} onSaved={() => { setAdding(false); load(); }} />}

      <ConfirmModal
        open={!!toDelete}
        title={toDelete?.type === "client" ? "Remove client?" : "Delete review?"}
        message={toDelete?.type === "client"
          ? <>Remove <strong>{toDelete?.item?.name}</strong> from the website?</>
          : <>Delete the review from <strong>{toDelete?.item?.name}</strong>? This cannot be undone.</>}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
};

export default Clients;
