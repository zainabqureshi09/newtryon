"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          We’re redefining eyewear with premium quality, timeless designs, and
          innovative try-on experiences.
        </motion.p>
      </section>

      {/* Mission / Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower people to express themselves with eyewear that blends
              style, comfort, and technology.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-muted-foreground">
              Building the future of eyewear through sustainability, innovation,
              and unforgettable customer experiences.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Story Section */}
      <section className="space-y-6 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold"
        >
          Our Story
        </motion.h2>
        <p className="text-muted-foreground leading-relaxed">
          Founded with a passion for design and technology, we’ve crafted a
          collection of eyewear that celebrates individuality while ensuring
          comfort and durability. With our virtual try-on experience, you can
          find your perfect fit from anywhere.
        </p>
      </section>

      {/* Team Section */}
      <section className="space-y-10">
        <h2 className="text-center text-3xl font-bold">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Ayesha Khan", role: "Founder & CEO", img: "/team/ayesha.jpg" },
            { name: "Ali Raza", role: "Design Lead", img: "/team/ali.jpg" },
            { name: "Sara Malik", role: "Tech Lead", img: "/team/sara.jpg" },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center space-y-3"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 mx-auto rounded-full object-cover shadow-lg"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
