import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

const buildImgSrc = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // remove slashes at start
  const p = path.replace(/^\/+/, '');
  return `${API_BASE.replace(/\/api\/?$/, '')}/${p}`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const ArticleCard = ({ post }) => (
  <div className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-[#e5dfd3]">
    
    {/* Image */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={buildImgSrc(post.image)}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://placehold.co/600x400/D4C9C3/310000?text=Article+Image';
        }}
      />
    </div>

    {/* Content */}
    <div className="p-6 space-y-3 flex flex-col">
      <h3 className="text-xl font-serif text-[#310000] leading-snug group-hover:text-[#5C644B] transition-colors duration-300">
        {post.heading}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {post.description}
      </p>

      {/* Footer */}
      <div className="pt-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100">
        <span className="font-medium text-[#3A3F2D]">
          {formatDate(post.createdAt)}
        </span>

        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-full text-xs border border-[#3A3F2D] text-[#3A3F2D] hover:bg-[#3A3F2D] hover:text-white transition"
        >
          Read →
        </a>
      </div>
    </div>
  </div>
);



const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_BASE}/blogs/get`);
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        setBlogs([]);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans py-16">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-[#310000] font-light mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            The Artisan Journal
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Stories of craftsmanship, heritage, and the conscious pursuit of
            beauty in everyday life.
          </p>
        </header>

        {/* Blog Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((post) => (
              <ArticleCard key={post.id || post._id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blogs;
