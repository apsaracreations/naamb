import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZES, pageList } from "./usePagination";

const pill = "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition";

// "Show [10] per page" picker, placed in each list's filter bar
export const PageSizeSelect = ({ pageSize, setPageSize, className = "" }) => (
  <label className={`flex shrink-0 items-center gap-2 text-sm text-stone-500 ${className}`}>
    <span className="whitespace-nowrap">Show</span>
    <select
      className="h-10 rounded-lg border border-stone-300 bg-white px-2 text-sm text-stone-900 outline-none focus:border-[#310000] focus:ring-2 focus:ring-[#310000]/15"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
      aria-label="Rows per page"
    >
      {PAGE_SIZES.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
    <span className="whitespace-nowrap">per page</span>
  </label>
);

// Footer: "Showing 1–10 of 42" + page numbers
export const Pagination = ({ page, pages, setPage, start, total, pageSize }) => {
  if (total === 0) return null;
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="flex flex-col items-center gap-3 border-t border-stone-200 px-5 py-3 sm:flex-row sm:justify-between">
      <p className="text-xs text-stone-500">
        Showing <span className="font-medium text-stone-700">{start + 1}</span>–
        <span className="font-medium text-stone-700">{Math.min(start + pageSize, total)}</span> of{" "}
        <span className="font-medium text-stone-700">{total}</span>
      </p>
      {pages > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pages">
          <button
            type="button"
            className={`${pill} text-stone-600 hover:bg-stone-100 disabled:opacity-40`}
            disabled={page === 1}
            onClick={() => go(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageList(page, pages).map((p) =>
            typeof p === "string" ? (
              <span key={p} className="px-1 text-xs text-stone-400">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => go(p)}
                aria-current={p === page ? "page" : undefined}
                className={`${pill} ${p === page ? "bg-[#310000] text-white" : "text-stone-700 hover:bg-stone-100"}`}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            className={`${pill} text-stone-600 hover:bg-stone-100 disabled:opacity-40`}
            disabled={page === pages}
            onClick={() => go(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
};
