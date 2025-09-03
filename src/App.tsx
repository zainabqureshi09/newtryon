import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import TryOn from "./pages/TryOn";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Footer from "./components/shared/Footer";
import AboutPage from "./pages/About";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        
        </Routes>
      <Footer/>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
