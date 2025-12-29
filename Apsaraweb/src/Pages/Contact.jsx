import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FormInput = ({ label, id, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-[#310000] focus:ring focus:ring-[#310000]/20 transition duration-150 text-gray-800"
    />
  </div>
);

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong. Try again!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans py-16">
      <Toaster />

      <div className="container mx-auto px-6 lg:px-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#310000] font-light mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question, need support, or just want to connect — our team is ready to assist.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-2xl shadow-lg border border-[#e5dfd3]">
            <h2 className="text-2xl font-serif text-[#310000] mb-8 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Your Name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                <FormInput
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <FormInput
                label="Subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is your query about?"
              />

              <div className="flex flex-col">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Type your detailed message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-[#310000] focus:ring focus:ring-[#310000]/20 transition duration-150 text-gray-800"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-10 py-3 bg-[#310000] text-white cursor-pointer rounded-full font-semibold text-lg shadow-md transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4d1e1e]"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5dfd3]">
              <h3 className="text-xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
                Reach Out Directly
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhoneAlt className="text-[#310000] text-lg" />
                  <p className="text-gray-700 font-medium">+91 1234 567 890</p>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-[#310000] text-lg" />
                  <p className="text-gray-700 font-medium">support@apsarainstitute.com</p>
                </div>

                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-[#310000] text-lg mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Apsara Training Institute,<br />Palakkad, Kerala, India
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-[#e5dfd3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5412.230047748176!2d76.36457298694899!3d10.773229996347236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7dbfdb8e95711%3A0x767bab6f9202242!2sApsara%20Training%20Institute!5e1!3m2!1sen!2sin!4v1760259064736!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Apsara Institute Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
