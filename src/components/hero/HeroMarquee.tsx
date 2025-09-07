import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui";

interface ColorwayOption {
  id: string;
  name: string;
  hero: string;
  accent: string;
  type: "image" | "video";
}

const colorways: ColorwayOption[] = [
  {
    id: "classic-black",
    name: "Classic Black",
    hero: "/src/assets/hero-aviator.mp4", // 👈 your custom video path
    accent: "#000000",
    type: "video",
  },
  {
    id: "modern-frame",
    name: "Modern Frame",
    hero: "https://picsum.photos/1920/1080?random=1", // placeholder image
    accent: "#2e026d",
    type: "image",
  },
  {
    id: "elegant-rose",
    name: "Elegant Rose",
    hero: "https://picsum.photos/1920/1080?random=2", // placeholder image
    accent: "#ec4899",
    type: "image",
  },
];

export function HeroMarquee() {
  const { activeColorway } = useUIStore();
  const currentColorway =
    colorways.find((c) => c.id === activeColorway) || colorways[0];

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-black">
      {/* Background (image or video) */}
      {currentColorway.type === "video" ? (
        <motion.video
          key={currentColorway.id}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <source src={currentColorway.hero} type="video/mp4" />
        </motion.video>
      ) : (
        <motion.div
          key={currentColorway.id}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${currentColorway.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-left text-white"
        >
          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Virtual</span>
            <span className="block bg-gradient-to-r from-sky-400 via-pink-500 to-purple-700 bg-clip-text text-transparent">
              Try-On
            </span>
            <motion.span
              className="block text-2xl sm:text-3xl lg:text-4xl font-light mt-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            >
              Virtually
            </motion.span>
          </h1>

          {/* Paragraph */}
          <p className="text-lg md:text-xl mb-8 text-sky-100">
            Experience the future of eyewear shopping <br /> with our AI-powered
            virtual try-on technology
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/try-on">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-950 via-pink-700 to-sky-700 text-white font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Try On Now
              </Button>
            </Link>
            <Link to="/catalog">
              <Button
                size="xl"
                variant="glass"
                className="w-full sm:w-auto border bg-white border-black text-black hover:text-white hover:bg-sky-400/20"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
