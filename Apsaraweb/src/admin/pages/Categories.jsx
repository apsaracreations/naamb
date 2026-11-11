import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch, buildImgSrc, toList } from "../api";
import {
  PageHeader, Card, Button, Badge, Thumb, EmptyState, LoadingRow, ConfirmModal, ImageLightbox,
  thCls, tdCls,
} from "../components/ui";
import { usePagination } from "../components/usePagination";
import { Pagination, PageSizeSelect } from "../components/Pagination";
import CategoryForm from "./CategoryForm";

const FilterChips = ({ filters }) => {
  const list = toList(filters);
  if (!list.length) return <span className="text-stone-400">—</span>;
  return (
    <div className="flex max-w-xs flex-wrap gap-1">
      {list.slice(0, 4).map((f) => <Badge key={f}>{f}</Badge>)}
      {list.length > 4 && <Badge>+{list.length - 4}</Badge>}
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCategory, setFormCategory] = useState(null); // null = closed, {} = new
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/categories/get");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pager = usePagination(categories, "categories");

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/categories/delete/${toDelete._id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c._id !== toDelete._id));
      toast.success("Category deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const actions = (c) => (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => setFormCategory(c)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
      <Button variant="dangerGhost" size="icon" onClick={() => setToDelete(c)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  const images = (c) => (
    <div className="flex items-center gap-2">
      <Thumb src={buildImgSrc(c.bannerImage)} alt="Banner" className="h-10 w-16" onClick={() => setPreview(buildImgSrc(c.bannerImage))} />
      <Thumb src={buildImgSrc(c.headingImage)} alt="Heading" className="h-10 w-10" onClick={() => setPreview(buildImgSrc(c.headingImage))} />
    </div>
  );

  return (
    <>
      <PageHeader
        title="Categories"
        description="Shop categories, their banners and the filters customers can use."
        actions={<Button onClick={() => setFormCategory({})}><Plus className="h-4 w-4" /> Add category</Button>}
      />

      <Card bodyClassName="">
        {categories.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-stone-200 p-4">
            <p className="text-sm text-stone-500">{categories.length} categor{categories.length === 1 ? "y" : "ies"}</p>
            <PageSizeSelect {...pager} />
          </div>
        )}
        {loading && !categories.length ? (
          <LoadingRow label="Loading categories…" />
        ) : !categories.length ? (
          <EmptyState title="No categories yet" description="Create a category before adding products." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className={thCls}>Images</th>
                    <th className={thCls}>Name</th>
                    <th className={thCls}>Banner heading</th>
                    <th className={thCls}>Filters</th>
                    <th className={`${thCls} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pager.pageItems.map((c) => (
                    <tr key={c._id} className="hover:bg-stone-50">
                      <td className={tdCls}>{images(c)}</td>
                      <td className={`${tdCls} font-medium text-stone-900`}>{c.name}</td>
                      <td className={tdCls}><p className="max-w-[220px] truncate">{c.bannerHeading || "—"}</p></td>
                      <td className={tdCls}><FilterChips filters={c.filters} /></td>
                      <td className={tdCls}>{actions(c)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-stone-100 md:hidden">
              {pager.pageItems.map((c) => (
                <li key={c._id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    {images(c)}
                    {actions(c)}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{c.name}</p>
                    <p className="truncate text-xs text-stone-500">{c.bannerHeading}</p>
                  </div>
                  <FilterChips filters={c.filters} />
                </li>
              ))}
            </ul>

            <Pagination {...pager} />
          </>
        )}
      </Card>

      {formCategory && (
        <CategoryForm
          category={formCategory._id ? formCategory : null}
          onClose={() => setFormCategory(null)}
          onSaved={() => { setFormCategory(null); load(); }}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete category?"
        message={<>This permanently deletes <strong>{toDelete?.name}</strong> <strong>and every product inside it</strong>. This cannot be undone.</>}
        confirmLabel="Delete category"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
      <ImageLightbox src={preview} onClose={() => setPreview(null)} />
    </>
  );
};

export default Categories;
