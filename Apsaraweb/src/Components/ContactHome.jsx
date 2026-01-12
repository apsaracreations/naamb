import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactHome = () => {
   const navigate = useNavigate();

       const handleNavigate = (path) => {
        navigate(path);
    };
  return (
    <div className=" font-sans">
      <div className="container mx-auto px-6">
        {/* Contact Section Content Container */}
        <div className=" p-10 md:p-16  border-gray-300">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="uppercase text-sm tracking-widest text-gray-500 font-medium mb-2">
              Get in Touch
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#310000] font-light leading-snug">
              Have a question or a custom request?
            </h2>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center border-t border-b  border-gray-600 py-10">
            
            {/* 1. Email */}
            <div className="space-y-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-[#3A3F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="text-xl font-serif text-[#310000] font-medium">Email Support</h4>
              <p className="text-gray-700 text-sm">Our team will get back to you within 24 hours.</p>
              <a href="mailto:apsaracreations23@gmail.com" className="font-semibold text-[#310000] hover:text-[#310000] transition">
                apsaracreations23@gmail.com
              </a>
            </div>

            {/* 2. Phone */}
            <div className="space-y-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-[#3A3F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.07 11.07 0 005.42 5.42l1.129-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h4 className="text-xl font-serif text-[#310000] font-medium">Call Us</h4>
              <p className="text-gray-700 text-sm">Monday - Friday, 10am - 6pm IST.</p>
              <a href="tel:+919946186811" className="font-semibold text-[#310000] hover:text-[#310000] transition">
                +91 9946186811
              </a>
            </div>

            {/* 3. Visit Full Page */}
            <div className="space-y-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-[#310000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <h4 className="text-xl font-serif text-[#310000] font-medium">Contact Form</h4>
              <p className="text-gray-700 text-sm">For detailed inquiries, use our dedicated form.</p>
              <button onClick={()=>handleNavigate("/contact")} className="px-6 py-2.5 mt-2 bg-[#310000da] cursor-pointer text-white rounded-full font-semibold shadow hover:bg-[#310000] transition">
                Go to Contact Page
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactHome;