import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200); // 200px ke baad hi Top button dikhega
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-4 z-50">
      {/* Scroll to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Scroll to Bottom */}
      <button
        onClick={scrollToBottom}
        className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </div>
  );
}
