import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/911234567890" // replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 duration-300"
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
};

export default WhatsAppButton;
