import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, Camera, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { ColorwayPicker } from '@/components/product/ColorwayPicker';
import { SpecTiles } from '@/components/shared/SpecTiles';
import { useCartStore } from '@/store/cart';
import { toast } from '@/hooks/use-toast';
import { products } from '@/data/products.json';

type ProductType = typeof products[number];

// -------------------------
// Subcomponents
// -------------------------
const Gallery = ({ hero, gallery, name }: { hero?: string; gallery?: string[]; name: string }) => (
  <div className="space-y-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center overflow-hidden"
    >
      {hero ? (
        <img src={hero} alt={`${name} hero`} className="object-contain h-full w-full" />
      ) : (
        <div className="text-muted-foreground">No Image Available</div>
      )}
    </motion.div>

    <div className="grid grid-cols-3 gap-2">
      {gallery && gallery.length > 0 ? (
        gallery.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="aspect-square bg-surface rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <img src={img} alt={`${name} preview ${idx + 1}`} className="object-cover h-full w-full" />
          </motion.div>
        ))
      ) : (
        <span className="text-xs text-muted-foreground">No previews</span>
      )}
    </div>
  </div>
);

const FeaturesList = ({ features }: { features: string[] }) => (
  <div className="space-y-4">
    <h3 className="font-semibold">Features</h3>
    <ul className="space-y-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MaterialsList = ({ materials }: { materials: string[] }) => (
  <div className="space-y-4">
    <h3 className="font-semibold">Premium Materials</h3>
    <ul className="space-y-2">
      {materials.map((material) => (
        <li key={material} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>{material}</span>
        </li>
      ))}
    </ul>
  </div>
);

// -------------------------
// Main Component
// -------------------------
export default function Product() {
  const { slug } = useParams();
  const product: ProductType | undefined = products.find((p) => p.id === slug);
  const [selectedColorway, setSelectedColorway] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultColorway = useMemo(() => Object.keys(product.colorways)[0], [product.colorways]);
  const currentColorway = selectedColorway || defaultColorway;
  const colorwayData = product.colorways[currentColorway as keyof typeof product.colorways];

  const specs = useMemo(
    () => [
      { label: 'Frame Width', value: `${product.dimensions.frameWidth}mm` },
      { label: 'Lens Width', value: `${product.dimensions.lensWidth}mm` },
      { label: 'Bridge Width', value: `${product.dimensions.bridgeWidth}mm` },
      { label: 'Temple Length', value: `${product.dimensions.templeLength}mm` },
    ],
    [product.dimensions]
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: `${product.id}-${currentColorway}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      colorway: currentColorway,
      quantity: 1,
      image: colorwayData?.images.hero || '/placeholder.png',
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} in ${colorwayData?.name} has been added to your cart.`,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => !prev);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <Link to="/catalog" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Link>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <Gallery hero={colorwayData?.images.hero} gallery={colorwayData?.images.gallery} name={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.trending && <Badge>Trending</Badge>}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                {product.inStock && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">In Stock</span>
                  </div>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
              <div className="text-3xl font-bold mb-6">${product.price}</div>
            </div>

            <ColorwayPicker colorways={product.colorways} selected={currentColorway} onChange={setSelectedColorway} />

            <Separator />
            <FeaturesList features={product.features} />
            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} size="lg" className="flex-1" disabled={isAdding} aria-label="Add to cart">
                {isAdding && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>

              <Link to="/try-on" className="flex-1">
                <Button variant="outline" size="lg" className="w-full" aria-label="Try on virtually">
                  <Camera className="w-4 h-4 mr-2" />
                  Try On
                </Button>
              </Link>

              <Button
                variant={isWishlisted ? 'default' : 'ghost'}
                size="lg"
                onClick={handleWishlistToggle}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-20">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="guide">Size Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-8">
              <SpecTiles items={specs} />
            </TabsContent>

            <TabsContent value="materials" className="mt-8">
              <MaterialsList materials={product.materials} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reviews coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="mt-8">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Size guide coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}