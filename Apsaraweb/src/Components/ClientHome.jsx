import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";


const API_BASE = import.meta.env.VITE_API_URL;

const ClientHome = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const [formData, setFormData] = useState({
  name: "",
  companyName: "",
  phone: "",
  email: "",
  review: "",
  userId: parsedUser?.id || "", // <-- FIXED
});

  // ---------------- FETCH CLIENT LOGOS ----------------
  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients/get`);
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- FETCH REVIEWS ----------------
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/all`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- SUBMIT REVIEW ----------------
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting data:", formData);

  try {
    const res = await fetch(`${API_BASE}/reviews/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      toast.success("✨ Review submitted!");
      setShowForm(false);
      fetchReviews();
setFormData({
  name: "",
  companyName: "",
  phone: "",
  email: "",
  review: "",
  userId: parsedUser?.id || "",
});

    } else {
      toast.error(data.message || "❌ Something went wrong");
    }

  } catch (error) {
    console.log(error);
    toast.error("🚨 Server error");
  }
};

  useEffect(() => {
    fetchClients();
    fetchReviews();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen pt-10">

      <Toaster
  position="top-right"
  toastOptions={{
    style: {
      zIndex: 999999,
    },
  }}
/>


      {/* --- Clients Section --- */}
      <section className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-[#310000] mb-4">
          Our Trusted Clients
        </h2>
        <p className="text-gray-600 mb-10">
          We proudly work with top companies who trust our services.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 justify-items-center px-6 md:px-16">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client._id}
                className="flex flex-col  items-center hover:scale-105 transition duration-300"
              >
                <img
                  src={`${API_BASE.replace("/api", "")}/${client.image}`}
                  alt={client.name}
                  className="h-20 w-20 object-contain border border-[#e5dfd3] rounded-md shadow-sm  transition duration-300"
                />
                <p className="mt-3 text-sm font-semibold text-gray-700">
                  {client.name}
                </p>
              </div>
            ))
          ) : (
            <p>No clients added yet.</p>
          )}
        </div>
      </section>

      {/* --- Reviews Section --- */}
      <section className="py-10 px-6 md:px-20 bg-[#fafafa] shadow-inner">
        <h2 className="text-4xl md:text-5xl font-serif text-[#310000] text-center mb-6">
          Client Reviews
        </h2>

        <div className="text-center mb-10">
<button
  onClick={() => {
    if (!parsedUser) {
      toast.error(" Please log in to submit a review");
      return;
    }
    setShowForm(true);
  }}
  className="px-6 py-3 bg-[#310000] text-white cursor-pointer rounded-full font-semibold shadow hover:bg-[#450000] transition"
>
  Submit Your Review
</button>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-2xl border border-[#e5dfd3] shadow-md hover:shadow-lg transition"
              >
                <p className="text-gray-700 italic mb-4">“{review.review}”</p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-[#310000]">{review.name}</h4>
                  <p className="text-gray-600 text-sm">{review.companyName}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No reviews yet.</p>
          )}
        </div>

        {/* Review Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[500px] p-8 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-900 text-2xl"
              >
                ×
              </button>

              <h3 className="text-2xl font-serif text-[#310000] text-center mb-6">
                Submit Your Review
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {["name", "companyName", "phone", "email"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={formData[field]}
                    placeholder={field.replace("Name", " Name")}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                ))}

                <textarea
                  name="review"
                  rows="4"
                  value={formData.review}
                  onChange={handleChange}
                  required
                  placeholder="Write your experience..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                ></textarea>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#310000] text-white rounded-full font-semibold shadow hover:bg-[#450000] transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientHome;
