import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroMarquee } from '@/components/hero/HeroMarquee';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui';
import { ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type Category = {
  name: string;
  image: string;
  count: string;
};

const features: Feature[] = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Handcrafted frames with premium materials and UV protection",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Fast and free delivery on all orders over $200",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns with full refund guarantee",
  },
];

const categories: Category[] = [
  { name: "Men", image: "/images/category-men.jpg", count: "120+ styles" },
  { name: "Women", image: "/images/category-women.jpg", count: "180+ styles" },
  { name: "Kids", image: "/images/category-kids.jpg", count: "45+ styles" },
  { name: "Blue Light", image: "/images/category-blue-light.jpg", count: "65+ styles" },
];

// Feature card
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-2xl flex items-center justify-center">
      <feature.icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
    <p className="text-muted-foreground">{feature.description}</p>
  </motion.div>
);

// Category card
const CategoryCard = ({ category, index }: { category: Category; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group cursor-pointer"
  >
    <div className="relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-primary/10 to-secondary/10">
      <img
        src={category.image}
        alt={`${category.name} glasses`}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="text-2xl font-bold">{category.name}</h3>
        <p className="text-white/80">{category.count}</p>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const { setStickyBarVisible } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      setStickyBarVisible(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setStickyBarVisible]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroMarquee />

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect frames for every style and occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Virtual Try-On
            </h2>
            <p className="text-xl text-white/90 mb-8">
              See how you look in any frame instantly with our AI-powered technology
            </p>
            <Link to="/try-on" aria-label="Start Virtual Try-On">
              <Button variant="accent" size="xl">
                Start Virtual Try-On
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
