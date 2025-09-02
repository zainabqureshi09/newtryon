import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Heart, Star, Camera } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { products } from '@/data/products.json';

const categories = ['All', 'Sunglasses', 'Eyeglasses'];
const genders = ['All', 'Men', 'Women', 'Unisex'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem } = useCartStore();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory.toLowerCase();
      const matchesGender = selectedGender === 'All' || product.gender === selectedGender.toLowerCase() || product.gender === 'unisex';
      
      return matchesSearch && matchesCategory && matchesGender;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedGender, sortBy]);

  const handleAddToCart = (product: typeof products[0], colorway: string) => {
    addItem({
      id: `${product.id}-${colorway}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      colorway,
      quantity: 1,
      image: product.colorways[colorway as keyof typeof product.colorways]?.images.hero || '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Find Your Perfect Frames
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Discover premium eyewear designed for every style and occasion
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-sm"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="md:w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const defaultColorway = Object.keys(product.colorways)[0];
              const colorwayData = product.colorways[defaultColorway as keyof typeof product.colorways];
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <div className="text-muted-foreground text-sm">Product Image</div>
                        </div>
                        
                        {product.trending && (
                          <Badge className="absolute top-3 left-3">Trending</Badge>
                        )}
                        
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to="/try-on">
                            <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur">
                              <Camera className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">${product.price}</span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product, defaultColorway)}
                          >
                            Add to Cart
                          </Button>
                        </div>

                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" className="w-full mt-3">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}