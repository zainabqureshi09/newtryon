import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 text-white py-12 font-playfair border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6">
        
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-extrabold text-purple-300 mb-3 tracking-wide drop-shadow-lg">
            LensVision
          </h3>
          <p className="text-sm text-purple-200/80 leading-relaxed max-w-sm">
            Experience the future of eyewear shopping with our{" "}
            <span className="text-white font-medium">AI-powered virtual try-on</span> technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              { name: "Home", link: "/" },
              { name: "Shop", link: "/shop" },
              { name: "Try On", link: "/try-on" },
              { name: "About", link: "/about" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className="text-purple-200 hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            Contact Us
          </h4>
          <p className="text-sm text-purple-200/80">📧 support@lensvision.com</p>
          <p className="text-sm text-purple-200/80">📞 +1-800-LENS-VISION</p>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-700/40 hover:bg-purple-500 transition-all"
            >
              🌐
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-700/40 hover:bg-purple-500 transition-all"
            >
              🐦
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-700/40 hover:bg-purple-500 transition-all"
            >
              📸
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center mt-10 border-t border-white/10 pt-6">
        <p className="text-xs text-purple-200/70 tracking-wide">
          &copy; {new Date().getFullYear()} LensVision. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
