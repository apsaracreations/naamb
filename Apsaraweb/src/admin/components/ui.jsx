import React, { useEffect } from "react";
import { X, Loader2, AlertTriangle, Inbox } from "lucide-react";

// ---------- Class tokens ----------
const focus = "outline-none transition focus:border-[#310000] focus:ring-2 focus:ring-[#310000]/15";
export const inputCls = `h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 placeholder:text-stone-400 ${focus}`;
export const textareaCls = `min-h-28 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 ${focus}`;
export const fileCls =
  "block w-full cursor-pointer text-sm text-stone-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-800 hover:file:bg-stone-200";
export const thCls = "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500";
export const tdCls = "px-4 py-3 align-middle text-sm text-stone-700";

// ---------- Layout ----------
export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card = ({ title, subtitle, actions, children, className = "", bodyClassName = "p-5" }) => (
  <section className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm ${className}`}>
    {(title || actions) && (
      <header className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

export const StatCard = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
    {Icon && (
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#310000]/5 text-[#310000] sm:flex">
        <Icon className="h-5 w-5" />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-0.5 break-words text-lg font-semibold text-stone-900 sm:text-xl">{value}</p>
    </div>
  </div>
);

export const Field = ({ label, required, hint, children, className = "" }) => (
  <div className={className}>
    <span className="mb-1.5 block text-sm font-medium text-stone-700">
      {label}
      {required && <span className="text-red-600"> *</span>}
    </span>
    {children}
    {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
  </div>
);

// ---------- Controls ----------
const variants = {
  primary: "bg-[#310000] text-white hover:bg-[#4b0d0d]",
  secondary: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
  dangerGhost: "text-red-600 hover:bg-red-50",
};
const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", icon: "h-8 w-8" };

export const Button = ({ variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props }) => (
  <button
    type="button"
    {...props}
    disabled={disabled || loading}
    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </button>
);

const tones = {
  gray: "bg-stone-100 text-stone-700 ring-stone-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
  red: "bg-red-50 text-red-700 ring-red-200",
};
export const Badge = ({ tone = "gray", children }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
    {children}
  </span>
);

export const Thumb = ({ src, alt = "", className = "h-10 w-10", onClick }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={`${className} shrink-0 rounded-md border border-stone-200 bg-stone-100 object-cover ${onClick ? "cursor-zoom-in" : ""}`}
    />
  ) : (
    <div className={`${className} flex shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-100 text-[10px] text-stone-400`}>
      N/A
    </div>
  );

export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
      <Inbox className="h-6 w-6" />
    </div>
    <p className="text-sm font-medium text-stone-900">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingRow = ({ label = "Loading…" }) => (
  <div className="flex items-center justify-center gap-2 py-14 text-sm text-stone-500">
    <Loader2 className="h-4 w-4 animate-spin" /> {label}
  </div>
);

// ---------- Overlays ----------
export const Modal = ({ open, onClose, title, children, footer, size = "md" }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-3xl" };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-xl ${widths[size]}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-stone-200 px-5 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export const ConfirmModal = ({ open, title = "Are you sure?", message, confirmLabel = "Delete", loading, onConfirm, onCancel }) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </>
    }
  >
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm leading-relaxed text-stone-600">{message}</p>
    </div>
  </Modal>
);

export const ImageLightbox = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <X className="h-5 w-5" />
      </button>
      <img src={src} alt="Preview" className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" />
    </div>
  );
};
