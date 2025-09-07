import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";
import Footer from "./components/shared/Footer";
import AboutPage from "./pages/About";
import ContactUs from "./pages/ContactUs";
import { CardTitle } from "./components/ui/card";
import MenCatalog from "./pages/MenCatalog";
import WomenCatalog from "./pages/WomenCatalog";
import BlueLightCatalog from "./pages/BlueLightCatalog";
import BothCatalog from "./pages/UnisexCatalog";
import KidsCatalog from "./pages/KidsCatalog";
import SunglassesCatalog from "./pages/SunglassesCatalog";
import ProductHome from "./pages/ProductHome";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import ThankYouPage from "./pages/ThankYouPage";
import TryOn from "./pages/TryOn";

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
          <Route path="/try-on" element={<TryOn glassesUrl={undefined} />} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/thank-you" element={<ThankYouPage/>} />
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/product-cart" element={<ProductHome />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/catalog/men" element={<MenCatalog />} />
          <Route path="/catalog/kids" element={<KidsCatalog />} />
          <Route path="/catalog/women" element={<WomenCatalog />} />
          <Route path="/catalog/sunglasses" element={<SunglassesCatalog />} />
          <Route path="/catalog/blue-light" element={<BlueLightCatalog />} />
          <Route path="/catalog/both" element={<BothCatalog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
