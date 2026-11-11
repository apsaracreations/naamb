import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { adminFetch, buildImgSrc, formatINR } from "../api";
import {
  PageHeader, Card, Button, Badge, Thumb, EmptyState, LoadingRow, ConfirmModal, ImageLightbox,
  Pagination, usePagination, inputCls, thCls, tdCls,
} from "../components/ui";
import ProductForm from "./ProductForm";

const stockBadge = (qty) =>
  qty <= 0 ? <Badge tone="red">Out of stock</Badge> : qty < 5 ? <Badge tone="yellow">{qty} left</Badge> : <Badge tone="green">{qty} in stock</Badge>;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formProduct, setFormProduct] = useState(null); // null = closed, {} = new, product = edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([adminFetch("/products/get"), adminFetch("/categories/get")]);
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch (err) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const catId = p.categoryId?._id || p.categoryId;
      return (!categoryFilter || catId === categoryFilter) && (!term || p.name?.toLowerCase().includes(term));
    });
  }, [products, search, categoryFilter]);

  const pager = usePagination(filtered, 10);
  const categoryName = (p) => p.categoryId?.name || p.categoryName || "—";

  const doDelete = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/products/delete/${toDelete._id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== toDelete._id));
      toast.success("Product deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const actions = (p) => (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => setFormProduct(p)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
      <Button variant="dangerGhost" size="icon" onClick={() => setToDelete(p)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} products in your store`}
        actions={<Button onClick={() => setFormProduct({})} disabled={!categories.length}><Plus className="h-4 w-4" /> Add product</Button>}
      />

      {!loading && !categories.length && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Create a category first — every product needs one.
        </div>
      )}

      <Card bodyClassName="">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input className={`${inputCls} pl-9`} placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); pager.setPage(1); }} />
          </div>
          <select className={`${inputCls} sm:w-52`} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); pager.setPage(1); }}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {loading && !products.length ? (
          <LoadingRow label="Loading products…" />
        ) : !filtered.length ? (
          <EmptyState title="No products found" description={products.length ? "Try a different search or category." : "Add your first product to start selling."} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className={thCls}>Product</th>
                    <th className={thCls}>Category</th>
                    <th className={`${thCls} text-right`}>Price</th>
                    <th className={thCls}>Stock</th>
                    <th className={`${thCls} hidden xl:table-cell`}>Images</th>
                    <th className={`${thCls} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pager.pageItems.map((p) => (
                    <tr key={p._id} className="hover:bg-stone-50">
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          <Thumb src={buildImgSrc(p.images?.[0])} alt={p.name} className="h-11 w-11" onClick={() => setPreview(buildImgSrc(p.images?.[0]))} />
                          <div className="min-w-0 max-w-[180px] xl:max-w-xs">
                            <p className="truncate font-medium text-stone-900">{p.name}</p>
                            <p className="truncate text-xs text-stone-500">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tdCls}><Badge>{categoryName(p)}</Badge></td>
                      <td className={`${tdCls} whitespace-nowrap text-right font-semibold text-stone-900`}>{formatINR(p.price)}</td>
                      <td className={tdCls}>{stockBadge(p.quantity)}</td>
                      <td className={`${tdCls} hidden text-stone-500 xl:table-cell`}>{p.images?.length || 0}</td>
                      <td className={tdCls}>{actions(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-stone-100 md:hidden">
              {pager.pageItems.map((p) => (
                <li key={p._id} className="flex gap-3 p-4">
                  <Thumb src={buildImgSrc(p.images?.[0])} alt={p.name} className="h-14 w-14" onClick={() => setPreview(buildImgSrc(p.images?.[0]))} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium text-stone-900">{p.name}</p>
                      <p className="whitespace-nowrap text-sm font-semibold text-stone-900">{formatINR(p.price)}</p>
                    </div>
                    <p className="truncate text-xs text-stone-500">{categoryName(p)}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {stockBadge(p.quantity)}
                      {actions(p)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Pagination {...pager} />
          </>
        )}
      </Card>

      {formProduct && (
        <ProductForm
          product={formProduct._id ? formProduct : null}
          categories={categories}
          onClose={() => setFormProduct(null)}
          onSaved={() => { setFormProduct(null); load(); }}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete product?"
        message={<>This will permanently remove <strong>{toDelete?.name}</strong> from the store.</>}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
      <ImageLightbox src={preview} onClose={() => setPreview(null)} />
    </>
  );
};

export default Products;
