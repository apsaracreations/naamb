import { useState } from "react";

export const PAGE_SIZES = [10, 25, 50, 100];

const readSize = (key, fallback) => {
  try {
    const v = Number(localStorage.getItem(`admin:pageSize:${key}`));
    return PAGE_SIZES.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

// Client-side paging for admin lists. `key` remembers the chosen "rows per page" per list.
export const usePagination = (items, key, defaultSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize, setSize] = useState(() => readSize(key, defaultSize));

  const setPageSize = (size) => {
    setSize(size);
    setPage(1);
    try {
      localStorage.setItem(`admin:pageSize:${key}`, String(size));
    } catch {
      /* storage blocked: choice just isn't remembered */
    }
  };

  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    setPage,
    pages,
    pageSize,
    setPageSize,
    start,
    total: items.length,
    pageItems: items.slice(start, start + pageSize),
  };
};

// Page buttons to show: first, last, current ±1, with "…" gaps
export const pageList = (page, pages) => {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("…" + p);
    out.push(p);
  });
  return out;
};
