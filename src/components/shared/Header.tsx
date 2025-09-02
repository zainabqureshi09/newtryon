import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/catalog" },
  { name: "Try On", href: "/try-on" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              LensVision
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping Cart"
                className="relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center p-0 text-[10px] shadow"
                    variant="secondary"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
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

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-background border-l border-border shadow-xl p-6 md:hidden z-50"
          >
            <nav className="flex flex-col space-y-6 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
