// Header.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";
import useCart from "@/hooks/use-cart"; // ✅ correct import
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Collections",
    children: [
      { name: "Men", href: "/catalog/men" },
      { name: "Women", href: "/catalog/women" },
      { name: "Kids", href: "/catalog/kids" },
      { name: "Blue Light", href: "/catalog/blue-light" },
      { name: "Sunglasses", href: "/catalog/sunglasses" },
      { name: "Men & Women", href: "/catalog/both" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  const location = useLocation();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const languages = ["EN", "UR", "FR", "AR"];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* 🔹 Top Bar */}
      <div className="bg-[#2d0142] text-white text-xs sm:text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-8">
          <div className="flex-1 flex justify-center gap-4 sm:gap-6 font-medium">
            <span>🚚 Delivery in 2–5 days</span>
            <span>🎁 Free shipping over $200</span>
          </div>

          {/* Language Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-medium hover:text-gray-200">
              {language} <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-28 bg-white border shadow-lg rounded-lg py-2 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/ainal-pk-logo.png" alt="Lens Vision" className="h-8 sm:h-9" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      activeDropdown === item.name
                        ? "text-pink-600"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-48 bg-white border shadow-lg rounded-lg py-2"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-pink-600"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-pink-600 rounded-full"
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* 🔹 Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-gray-700 hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart with badge */}
            <Link to="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 🔹 Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-white border-l shadow-xl p-6 md:hidden z-50 overflow-y-auto"
          >
            <nav className="flex flex-col space-y-6 mt-8">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="space-y-2">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <div className="pl-3 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block text-sm ${
                            location.pathname === child.href
                              ? "text-pink-600"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg font-medium ${
                      location.pathname === item.href
                        ? "text-pink-600"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
