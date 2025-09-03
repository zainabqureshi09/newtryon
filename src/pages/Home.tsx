import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroMarquee } from "@/components/hero/HeroMarquee";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MarqueeBanner from "@/components/MarqueeBanner";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

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
  }, []);

  return (
    <div className="w-full bg-white text-black">
      {/* Hero Section */}
      <HeroMarquee />
         <MarqueeBanner/>


      {/* Expanded Features */}
      <section
        ref={addSectionRef}
        className="py-24 container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {[
          {
            title: "Crafted with Precision",
            desc: "Our frames are designed with aerospace-grade materials for unmatched durability.",
            img: "/src/assets/glasses1.webp",
          },
          {
            title: "AI Virtual Try-On",
            desc: "Instantly see how each frame looks on you, powered by advanced AI.",
            img: "/src/assets/glasses2.webp",
          },
          {
            title: "Luxury Guaranteed",
            desc: "Every pair undergoes strict quality checks for flawless finish.",
            img: "/src/assets/glasses3.webp",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200"
          >

            <img src={f.img} alt={f.title} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-purple-700">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Product Collection Showcase */}
      <section
        ref={addSectionRef}
        className="py-32 bg-gradient-to-r from-gray-100 to-gray-200"
      >
     
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-extrabold mb-10 text-gray-900">Our Signature Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["men", "women", "blue-light"].map((cat, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden group relative border border-gray-200"
              >
                <img
                  src={`/images/${cat}-collection.jpg`}
                  alt={cat}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold capitalize text-white">{cat} Collection</h3>
                  <p className="text-gray-200">Luxury styles handpicked for you</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section
        ref={addSectionRef}
        className="py-40 relative text-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url(/images/philosophy-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 text-white">Redefining Eyewear</h2>
          <p className="text-xl text-gray-200 leading-relaxed">
            At LensVision, we don’t just make glasses. We craft experiences that blend
            technology, fashion, and luxury into one. Every frame tells a story of elegance.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={addSectionRef} className="py-28 container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-900">What Our Customers Say</h2>
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
              className="p-8 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <p className="text-lg text-gray-700 mb-4">“{t.review}”</p>
              <h4 className="text-purple-700 font-bold">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Blog/Editorial */}
      <section
        ref={addSectionRef}
        className="py-28 bg-gradient-to-b from-gray-100 to-white"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">From Our Journal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "The Future of Smart Eyewear",
                img: "/images/blog1.jpg",
              },
              {
                title: "Luxury Meets AI: The Next Big Thing",
                img: "/images/blog2.jpg",
              },
              {
                title: "How We Designed the Perfect Frame",
                img: "/images/blog3.jpg",
              },
            ].map((post, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200"
              >
                <img src={post.img} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-purple-700 mb-2">
                    {post.title}
                  </h3>
                  <Link to="/blog" className="text-sm text-purple-600 hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={addSectionRef}
        className="py-32 text-center bg-gradient-to-r from-purple-100 to-indigo-100"
      >
        <h2 className="text-5xl font-bold mb-6 text-gray-900">Experience Virtual Try-On Now</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Step into the future of eyewear with our cinematic, AI-powered try-on experience.
        </p>
        <Link to="/tryon">
          <Button className="px-10 py-6 text-lg rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-transform shadow-xl text-white">
            Start Virtual Try-On <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}