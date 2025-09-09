import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroMarquee } from "@/components/hero/HeroMarquee";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MarqueeBanner from "@/components/MarqueeBanner";
import ProductHome from "./ProductHome";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  const addSectionRef = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    sectionsRef.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });

    if (parallaxRef.current) {
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -10, scale: 1 },
        {
          yPercent: 10,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <div className="w-full bg-white text-black font-sans">
      {/* Hero Section */}
      <HeroMarquee />
      <MarqueeBanner />

      {/* Product Collection Showcase */}
      <section
        ref={addSectionRef}
        className="py-32 bg-gradient-to-r from-purple-50 to-purple-100"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-6xl font-extrabold mb-10 text-purple-900 tracking-tight leading-tight font-display">
            Our Signature Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Men", img: "/src/assets/homeMen.jpg" },
              { name: "Women", img: "/src/assets/homeFemale.jpg" },
              { name: "Blue Light", img: "/src/assets/homeBluelight.jpg" },
            ].map((cat, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden group relative border border-purple-200 shadow-lg hover:shadow-2xl transition-shadow duration-500"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg font-display">
                    {cat.name} Collection
                  </h3>
                  <p className="text-purple-200 font-sans">
                    Luxury styles handpicked for you
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        ref={addSectionRef}
        className="py-28 bg-gray-50 text-center relative z-20"
      >
        <h2 className="text-5xl font-extrabold mb-12 text-purple-900 tracking-tight font-display">
          Why Choose LensVision?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 container mx-auto px-6">
          {[
            {
              title: "Premium Quality",
              desc: "Crafted with top materials for durability and elegance.",
            },
            {
              title: "Smart Technology",
              desc: "Blue-light filters and AI-powered try-ons.",
            },
            {
              title: "Luxury Design",
              desc: "Frames that tell a story of modern fashion.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl border border-purple-200 shadow-md hover:shadow-xl transition duration-300"
            >
              <h3 className="text-2xl font-bold mb-4 text-purple-800 font-display">
                {item.title}
              </h3>
              <p className="text-gray-700 font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Philosophy */}
      <section
        ref={addSectionRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: "url(/src/assets/homeCen.jpg)" }}
        >
          <div className="absolute inset-0 bg-purple-900/80" />
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-6xl font-extrabold mb-6 text-purple-200 drop-shadow-xl tracking-tight font-display">
            Redefining Eyewear
          </h2>
          <p className="text-xl text-purple-100 leading-relaxed font-sans font-light">
            At LensVision, we don’t just make glasses. We craft experiences
            that blend technology, fashion, and luxury into one. Every frame
            tells a story of elegance.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={addSectionRef}
        className="py-28 container mx-auto px-6 text-center relative z-20"
      >
        <h2 className="text-5xl font-extrabold mb-12 text-purple-900 tracking-tight font-display">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "Ayesha K.",
              review:
                "The virtual try-on is mind-blowing! Bought my glasses in minutes, felt like luxury shopping.",
            },
            {
              name: "Omar R.",
              review:
                "Never experienced eyewear like this. The quality and fitting are unmatched.",
            },
            {
              name: "Sophia M.",
              review:
                "LensVision has completely changed how I shop for glasses. Cinematic and futuristic.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl border border-purple-200 shadow-md hover:shadow-xl transition duration-300"
            >
              <p className="text-lg text-gray-700 mb-4 italic font-sans">
                “{t.review}”
              </p>
              <h4 className="text-purple-700 font-bold font-display">
                {t.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      <ProductHome />

      {/* CTA */}
      <section
        ref={addSectionRef}
        className="py-32 text-center bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-100 relative z-20"
      >
        <h2 className="text-6xl font-extrabold mb-6 text-purple-900 tracking-tight font-display">
          Experience Virtual Try-On Now
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto font-sans font-medium">
          Step into the future of eyewear with our cinematic, AI-powered try-on
          experience.
        </p>
        <Link to="/tryon">
          <Button className="px-10 py-6 text-lg rounded-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:scale-110 transition-transform shadow-xl text-white font-semibold font-sans">
            Start Virtual Try-On <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
