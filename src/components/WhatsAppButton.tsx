import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923001234567" // ✅ apna WhatsApp number dalna
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-50"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
}
