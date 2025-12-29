import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const API_ROOT = API_URL.replace(/\/api\/?$/, "");

// Background images for left side under filter box
const filterBackgroundImages = [
  "https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/93179/247251/legacy_products%2FPRT_8658_74823__82221.1708925164.jpg?c=2",
  "https://desicallyethnic.com/cdn/shop/files/A7403022_1824919b-5798-40b9-804d-bc4f6dbfab11.jpg?v=1729055451",
  "https://www.tallengestore.com/cdn/shop/products/minia_4_e7e485ee-d1a7-49f2-b8fc-ae5aff1c2cd9.jpg?v=1518871140",
  "https://cdn.magicdecor.in/com/2024/04/29172313/Ethnic-kalamkari-Art-Design-Wallpaper-Mural.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbGYGmwsyHfvGR0TdF4guMt0DLX3fm8yeXpg&s",
];

// Simple helper to build full image URL from backend paths
const buildImgSrc = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.replace(/^\/+/, "").replace(/\\/g, "/");
  return `${API_ROOT}/${p}`;
};

// Reusable Filter Sidebar wrapper
const FilterSidebar = ({ children }) => (
  <aside className="w-full border border-gray-100 shadow-2xl p-6 bg-white sticky top-6 z-20">
    {children}
  </aside>
);

const ProductsListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);

  // UI state from old design
  const [priceRange, setPriceRange] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch category + products
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/categories/get/${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data.category || null);
        const prod = data.products || [];
        setProducts(prod);
        setFilters(data.category?.filters || []);

        if (prod.length > 0) {
          const max = Math.max(...prod.map((p) => p.price));
          setMaxPrice(max);
          setPriceRange(max);
        } else {
          setMaxPrice(10000);
          setPriceRange(10000);
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [categoryId]);

  // Derived count, search + filter + sort (using useMemo like old code)
  const filteredProducts = useMemo(() => {
    let current = [...products];

    // search by name/description
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      current = current.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.categoryName || "").toLowerCase().includes(q)
      );
    }

    // material filter (from category.filters; here matched against materialsCare, description, name)
    if (selectedFilter !== "all") {
      const f = selectedFilter.toLowerCase();
      current = current.filter(
        (p) =>
          (p.materialsCare || "").toLowerCase().includes(f) ||
          (p.description || "").toLowerCase().includes(f) ||
          (p.name || "").toLowerCase().includes(f)
      );
    }

    // price filter
    current = current.filter((p) => p.price <= priceRange);

    // sort by createdAt (if available) or fallback index
    if (sortBy === "newest") {
      current.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "oldest") {
      current.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    }

    return current;
  }, [products, searchTerm, selectedFilter, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-16 text-xl">
        Loading ...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-16 text-xl text-red-600">
        Category not found.
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] font-sans min-h-screen">
      {/* Banner with API image and heading */}
      <div className="relative h-72 md:h-96 w-full mb-8">
        <img
          src={buildImgSrc(category.bannerImage)}
          alt={category.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1920x400/808080/FFFFFF?text=Category+Banner";
          }}
        />
        <div className="absolute inset-0 bg-[#2e080b] opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-wider font-light drop-shadow-md text-center">
            {category.bannerHeading || category.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        {/* Top: count + search + sort (from old design) */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          {/* Search */}
          <div className="w-full md:w-1/3 relative order-2 md:order-1">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A3F2D] focus:border-[#3A3F2D] transition"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Count + sort */}
          <div className="flex items-center justify-between w-full md:w-auto space-x-6 order-1 md:order-2">
            <p className="text-xl text-gray-700 font-semibold">
              Showing{" "}
              <span className="text-[#3A3F2D]">
                {filteredProducts.length}
              </span>{" "}
              items
            </p>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="sortBy"
                className="text-base text-gray-700 font-medium hidden sm:block"
              >
                Sort By:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-[#3A3F2D] focus:border-[#3A3F2D]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="none">Default Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main layout: filters + background images + products grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: filter + background images */}
          <div className="w-full md:w-72 flex flex-col">
            <FilterSidebar>
              <h2 className="text-2xl font-serif text-[#310000] font-medium mb-6 border-b border-gray-300 pb-3">
                Filter Options
              </h2>

              {/* Material filters from backend */}
              {filters && filters.length > 0 && (
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Material / Filter
                  </label>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#3A3F2D] focus:border-[#3A3F2D]"
                  >
                    <option value="all">All</option>
                    {filters.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price filter */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Price Range
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Max Price: ₹ {priceRange.toLocaleString("en-IN")} INR
                </p>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: "#3A3F2D" }}
                />
              </div>
            </FilterSidebar>

            {/* Background images below filter box, like old layout */}
            <div className="hidden md:block border border-gray-100 shadow-2xl overflow-hidden bg-white/70">
              <div className="grid grid-cols-1 grid-rows-5">
                {filterBackgroundImages.map((src, index) => (
                  <div
                    key={index}
                    className="overflow-hidden h-64 border-b border-gray-200 last:border-b-0"
                  >
                    <img
                      src={src}
                      alt={`Artisan Craft ${index}`}
                      className="w-full h-full object-cover opacity-60 hover:opacity-100 transition duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x400/e0e0e0/333333?text=Artisan+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: products grid */}
          <main className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-12 xl:gap-x-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group flex flex-col overflow-hidden"
                  >
                    <div
                      onClick={() =>
                        navigate(`/product-details/${product._id}`)
                      }
                      className="relative overflow-hidden w-full h-[300px] bg-[#f9f8f6] mb-4 cursor-pointer"
                    >
                      <img
                        src={buildImgSrc(
                          product.images && product.images[0]
                        )}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x400/e0e0e0/333333?text=Product+Image";
                        }}
                      />
                    </div>
                    <div className="text-left p-1 space-y-1 flex-grow flex flex-col justify-between">
                      <p className="uppercase text-xs text-gray-500 font-medium">
                        {product.categoryName}
                      </p>
                      <h3
                        onClick={() =>
                          navigate(`/product-details/${product._id}`)
                        }
                        className="text-lg font-serif text-[#310000] font-normal leading-snug hover:underline cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xl font-sans text-gray-800 font-semibold">
                        ₹ {product.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-2xl text-gray-600 font-serif">
                    No products found matching your criteria.
                  </p>
                  <p className="text-md text-gray-500 mt-2">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsListing;
