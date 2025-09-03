"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Have a question or need help? Our team is here to provide you with the
          support and guidance you deserve.
        </motion.p>
      </section>

      {/* Contact Info Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Phone className="w-6 h-6 text-purple-500" />,
            title: "Call Us",
            desc: "+92 300 1234567",
          },
          {
            icon: <Mail className="w-6 h-6 text-pink-500" />,
            title: "Email Us",
            desc: "support@lensvision.com",
          },
          {
            icon: <MapPin className="w-6 h-6 text-sky-500" />,
            title: "Visit Us",
            desc: "123 Main Street, Karachi, Pakistan",
          },
        ].map((info, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">{info.icon}</div>
                <h3 className="text-xl font-semibold">{info.title}</h3>
                <p className="text-muted-foreground">{info.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Send Us a Message
        </motion.h2>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="Your Name" className="rounded-xl" />
              <Input placeholder="Your Email" type="email" className="rounded-xl" />
            </div>
            <Input placeholder="Subject" className="rounded-xl" />
            <Textarea placeholder="Your Message" rows={5} className="rounded-xl" />
            <Button size="lg" className="w-full rounded-xl">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.3317843126377!2d67.00113631500006!3d24.86073468406533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dfb4d2c8c23%3A0xa1a8a2d6a4f8b9a6!2sKarachi!5e0!3m2!1sen!2s!4v1694012345678"
          width="100%"
          height="100%"
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Frequently Asked Questions
        </motion.h2>

        {[
          {
            q: "How do I track my order?",
            a: "Once your order is shipped, we’ll send you a tracking number via email.",
          },
          {
            q: "Can I return or exchange my glasses?",
            a: "Yes, we offer hassle-free returns and exchanges within 14 days of delivery.",
          },
          {
            q: "Do you ship internationally?",
            a: "Currently, we deliver all across Pakistan. International shipping is coming soon.",
          },
        ].map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="p-6 rounded-2xl shadow-md bg-muted/30"
          >
            <h3 className="text-lg font-semibold">{faq.q}</h3>
            <p className="text-muted-foreground">{faq.a}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
