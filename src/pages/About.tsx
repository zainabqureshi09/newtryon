import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero Section Animation Timeline
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        heroRef.current.querySelectorAll(".hero-title"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      ).fromTo(
        heroRef.current.querySelectorAll(".hero-text"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
      );
    }

    // Staggered cards
    gsap.utils.toArray<HTMLElement>(".stagger-card").forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll(".card-item"),
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });

    // Team animation with rotation
    gsap.utils.toArray<HTMLElement>(".team-member").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50, rotate: 10 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1,
          delay: i * 0.2,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // Contact button pulse on scroll
    gsap.fromTo(
      ".contact-btn",
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".contact-btn",
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative text-center py-24 bg-gradient-to-b from-purple-950 via-[#1a001f] to-background text-white space-y-6"
      >
        <h1 className="hero-title text-5xl md:text-6xl font-extrabold tracking-tight">
          About Us
        </h1>
        <p className="hero-text text-lg md:text-xl max-w-2xl mx-auto text-white/80">
          Redefining eyewear with <strong>premium craftsmanship</strong>,{" "}
          <strong>timeless design</strong>, and{" "}
          <strong>cutting-edge virtual try-on technology</strong>.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 stagger-card">
        {[
          {
            title: "Our Mission",
            desc: "To empower self-expression with eyewear that blends style, comfort, and technology — making every frame a reflection of your individuality.",
          },
          {
            title: "Our Vision",
            desc: "To build the future of eyewear with sustainability, innovation, and experiences that feel truly unforgettable.",
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="card-item rounded-2xl shadow-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20"
          >
            <CardContent className="p-8 space-y-4">
              <h2 className="text-3xl font-bold text-purple-950">{item.title}</h2>
              <p className="text-purple-950/80 leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 stagger-card">
        {[
          {
            title: "Premium Craftsmanship",
            desc: "Every frame is carefully designed and handcrafted with the finest materials.",
          },
          {
            title: "Next-Gen Technology",
            desc: "Our AI virtual try-on gives you a realistic, instant preview of every style.",
          },
          {
            title: "Sustainable Future",
            desc: "We’re committed to eco-friendly practices and recyclable materials.",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="card-item rounded-2xl shadow-md bg-surface border border-border hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-6 space-y-4 text-center">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Team Section */}
      <section className="py-24">
        <h2 className="text-center text-4xl font-bold mb-12">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            { name: "Ayesha Khan", role: "Founder & CEO", img: "/team/ayesha.jpg" },
            { name: "Ali Raza", role: "Design Lead", img: "/team/ali.jpg" },
            { name: "Sara Malik", role: "Tech Lead", img: "/team/sara.jpg" },
          ].map((member, idx) => (
            <div key={idx} className="team-member text-center space-y-4">
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg border-4 border-white/10"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-surface to-background">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions, feedback, or collaboration ideas? We’d love to hear
            from you.
          </p>
          <a
            href="/contact"
            className="contact-btn inline-block px-8 py-4 text-lg rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110 transition-transform"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
