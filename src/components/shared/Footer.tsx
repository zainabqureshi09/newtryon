import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import visa from "@/assets/visa.png";
import mastercard from "@/assets/master.png";
import paypal from "@/assets/paypal.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-300 text-white py-12 font-playfair border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 px-6">
        
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-extrabold text-purple-300 mb-3 tracking-wide drop-shadow-lg">
            LensVision
          </h3>
          <p className="text-sm text-purple-200/80 leading-relaxed max-w-sm">
            Experience the future of eyewear shopping with our{" "}
            <span className="text-white font-medium">AI-powered virtual try-on</span> technology.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-5">
            {[
              { Icon: FaFacebookF, link: "https://facebook.com" },
              { Icon: FaInstagram, link: "https://instagram.com" },
              { Icon: FaTwitter, link: "https://twitter.com" },
              { Icon: FaLinkedinIn, link: "https://linkedin.com" },
            ].map(({ Icon, link }, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-purple-800/40 rounded-full hover:bg-purple-600 transition-colors duration-300 shadow-md"
              >
                <Icon className="text-lg text-purple-200 hover:text-white" />
              </a>
            ))}
          </div>
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

        {/* Legal Links */}
        <div>
          <h4 className="text-lg mb-5 text-white uppercase tracking-wider font-semibold border-b border-purple-400/30 pb-2">
            Information
          </h4>
          <ul className="space-y-3">
            {[
              { name: "Privacy Policy", link: "/privacy" },
              { name: "Terms & Conditions", link: "/terms" },
              { name: "Returns & Refunds", link: "/refunds" },
              { name: "Shipping Info", link: "/shipping" },
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-10 pt-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <p className="text-xs text-purple-200/70 tracking-wide">
            &copy; {new Date().getFullYear()} LensVision. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src={visa} alt="Visa" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src={mastercard} alt="MasterCard" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src={paypal} alt="PayPal" className="h-6 grayscale hover:grayscale-0 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
