import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { buildImgSrc, formatDate, formatINR, SHIPPING_STATUSES, statusTone } from "../api";
import { Modal, Button, Badge, Thumb, Field, inputCls } from "../components/ui";

const Info = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-1.5 text-sm">
    <span className="shrink-0 text-stone-500">{label}</span>
    <span className="min-w-0 break-words text-right font-medium text-stone-900">{children || "—"}</span>
  </div>
);

const OrderDetailsModal = ({ order, onClose, onSave }) => {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!order) return;
    setTrackingId(order.trackingId || "");
    setStatus(order.shippingStatus || "Pending");
  }, [order]);

  if (!order) return null;
  const s = order.shippingDetails || {};
  const address = [s.address, s.city, s.state].filter(Boolean).join(", ");
  const pin = s.pinCode || s.zipCode;

  const save = async () => {
    setSaving(true);
    try {
      await onSave(order, { trackingId: trackingId.trim(), status });
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={`Order #${order._id.slice(-8).toUpperCase()}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={save} loading={saving}>Save changes</Button>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Customer & delivery</h4>
          <div className="divide-y divide-stone-100 rounded-lg border border-stone-200 px-4 py-1">
            <Info label="Name">{s.fullName}</Info>
            <Info label="Phone">{s.phone && <a href={`tel:${s.phone}`} className="hover:underline">{s.phone}</a>}</Info>
            <Info label="Email">{s.email}</Info>
            <Info label="Address">{address}</Info>
            <Info label="Pin code">{pin}</Info>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Payment</h4>
          <div className="divide-y divide-stone-100 rounded-lg border border-stone-200 px-4 py-1">
            <Info label="Placed">{formatDate(order.createdAt)}</Info>
            <Info label="Payment">
              <Badge tone={order.status === "paid" ? "green" : "yellow"}>{order.status}</Badge>
            </Info>
            <Info label="Razorpay order"><span className="font-mono text-xs">{order.razorpayOrderId}</span></Info>
            <Info label="Payment ID"><span className="font-mono text-xs">{order.razorpayPaymentId}</span></Info>
            <Info label="Shipping">
              <Badge tone={statusTone[order.shippingStatus || "Pending"]}>{order.shippingStatus || "Pending"}</Badge>
            </Info>
          </div>
        </div>
      </div>

      <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-stone-500">Items</h4>
      <ul className="divide-y divide-stone-100 rounded-lg border border-stone-200">
        {order.products.map((p, i) => (
          <li key={p._id || i} className="flex items-center gap-3 p-3">
            <Thumb src={buildImgSrc(p.image)} alt={p.name} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-900">{p.name || p.title || "Product"}</p>
              <p className="text-xs text-stone-500">{p.quantity} × {formatINR(p.price)}</p>
            </div>
            <p className="whitespace-nowrap text-sm font-semibold text-stone-900">{formatINR((p.price || 0) * (p.quantity || 0))}</p>
          </li>
        ))}
        <li className="flex items-center justify-between bg-stone-50 p-3 text-sm">
          <span className="font-medium text-stone-600">Total paid</span>
          <span className="text-base font-semibold text-stone-900">{formatINR(order.totalAmount)}</span>
        </li>
      </ul>

      <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-stone-500">Update shipping</h4>
      <div className="grid gap-4 rounded-lg border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2">
        <Field label="Tracking ID">
          <input className={inputCls} value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g. DTDC123456" />
        </Field>
        <Field label="Shipping status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            {SHIPPING_STATUSES.map((st) => <option key={st}>{st}</option>)}
          </select>
        </Field>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
