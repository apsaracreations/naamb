import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, ShoppingBag, Clock, Truck, IndianRupee, RefreshCw } from "lucide-react";
import { adminFetch, buildImgSrc, formatDate, formatINR, SHIPPING_STATUSES, statusTone } from "../api";
import {
  PageHeader, Card, StatCard, Button, Badge, Thumb, EmptyState, LoadingRow,
  Pagination, usePagination, inputCls, thCls, tdCls,
} from "../components/ui";
import OrderDetailsModal from "./OrderDetailsModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/payment/orders");
      setOrders(data?.orders || []);
    } catch (err) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders
      .filter((o) => statusFilter === "All" || (o.shippingStatus || "Pending") === statusFilter)
      .filter((o) =>
        !term ||
        [o.shippingDetails?.fullName, o.shippingDetails?.phone, o._id, o.razorpayOrderId, o.trackingId]
          .some((v) => String(v || "").toLowerCase().includes(term))
      )
      .sort((a, b) => {
        const diff = new Date(b.createdAt) - new Date(a.createdAt);
        return sort === "newest" ? diff : -diff;
      });
  }, [orders, search, statusFilter, sort]);

  const pager = usePagination(filtered, 10);

  const stats = useMemo(() => ({
    toShip: orders.filter((o) => ["Pending", "Packed"].includes(o.shippingStatus || "Pending")).length,
    shipped: orders.filter((o) => ["Shipped", "Delivered"].includes(o.shippingStatus)).length,
    revenue: orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
  }), [orders]);

  const saveShipping = async (order, update) => {
    const data = await adminFetch(`/payment/orders/${order._id}/shipping`, { method: "PUT", json: update });
    setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, ...data.order } : o)));
    toast.success("Order updated");
  };

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    pager.setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description="Paid orders from the website. Update tracking and shipping status here."
        actions={<Button variant="secondary" onClick={load} loading={loading}><RefreshCw className="h-4 w-4" /> Refresh</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        <StatCard label="Paid orders" value={orders.length} icon={ShoppingBag} />
        <StatCard label="To ship" value={stats.toShip} icon={Clock} />
        <StatCard label="Shipped" value={stats.shipped} icon={Truck} />
        <StatCard label="Revenue" value={`₹${Math.round(stats.revenue).toLocaleString("en-IN")}`} icon={IndianRupee} />
      </div>

      <Card bodyClassName="">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input className={`${inputCls} pl-9`} placeholder="Search name, phone, order or tracking ID" value={search} onChange={onFilterChange(setSearch)} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex">
            <select className={`${inputCls} md:w-40`} value={statusFilter} onChange={onFilterChange(setStatusFilter)}>
              <option value="All">All statuses</option>
              {SHIPPING_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className={`${inputCls} md:w-36`} value={sort} onChange={onFilterChange(setSort)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <LoadingRow label="Loading orders…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No orders found" description={orders.length ? "Try a different search or filter." : "Paid orders will appear here."} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className={thCls}>Order</th>
                    <th className={thCls}>Customer</th>
                    <th className={thCls}>Items</th>
                    <th className={`${thCls} text-right`}>Total</th>
                    <th className={thCls}>Status</th>
                    <th className={`${thCls} hidden text-right xl:table-cell`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pager.pageItems.map((o) => {
                    const first = o.products?.[0];
                    const status = o.shippingStatus || "Pending";
                    return (
                      <tr key={o._id} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-stone-50">
                        <td className={tdCls}>
                          <p className="font-mono text-xs text-stone-900">#{o._id.slice(-8).toUpperCase()}</p>
                          <p className="mt-0.5 whitespace-nowrap text-xs text-stone-500">{formatDate(o.createdAt)}</p>
                        </td>
                        <td className={tdCls}>
                          <p className="whitespace-nowrap font-medium text-stone-900">{o.shippingDetails?.fullName || "—"}</p>
                          <p className="whitespace-nowrap text-xs text-stone-500">{o.shippingDetails?.phone}</p>
                        </td>
                        <td className={tdCls}>
                          <div className="flex items-center gap-3">
                            <Thumb src={buildImgSrc(first?.image)} alt={first?.name} />
                            <div className="min-w-0 max-w-[130px] xl:max-w-[220px]">
                              <p className="truncate font-medium text-stone-900">{first?.name || first?.title || "Product"}</p>
                              <p className="text-xs text-stone-500">
                                Qty {first?.quantity}{o.products.length > 1 && ` · +${o.products.length - 1} more`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`${tdCls} whitespace-nowrap text-right font-semibold text-stone-900`}>{formatINR(o.totalAmount)}</td>
                        <td className={tdCls}>
                          <Badge tone={statusTone[status]}>{status}</Badge>
                          {o.trackingId && <p className="mt-1 whitespace-nowrap font-mono text-xs text-stone-500">{o.trackingId}</p>}
                        </td>
                        <td className={`${tdCls} hidden text-right xl:table-cell`}>
                          <Button variant="secondary" size="sm">Manage</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-stone-100 md:hidden">
              {pager.pageItems.map((o) => {
                const first = o.products?.[0];
                const status = o.shippingStatus || "Pending";
                return (
                  <li key={o._id}>
                    <button type="button" onClick={() => setSelected(o)} className="flex w-full gap-3 p-4 text-left hover:bg-stone-50">
                      <Thumb src={buildImgSrc(first?.image)} alt={first?.name} className="h-12 w-12" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium text-stone-900">{o.shippingDetails?.fullName || "—"}</p>
                          <p className="whitespace-nowrap text-sm font-semibold text-stone-900">{formatINR(o.totalAmount)}</p>
                        </div>
                        <p className="truncate text-xs text-stone-500">
                          {first?.name || "Product"}{o.products.length > 1 && ` +${o.products.length - 1} more`}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-xs text-stone-500">{formatDate(o.createdAt, false)}</span>
                          <Badge tone={statusTone[status]}>{status}</Badge>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <Pagination {...pager} />
          </>
        )}
      </Card>

      <OrderDetailsModal order={selected} onClose={() => setSelected(null)} onSave={saveShipping} />
    </>
  );
};

export default Orders;
