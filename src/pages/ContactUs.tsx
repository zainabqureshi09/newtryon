"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";


export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-20 font-inter">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold font-poppins tracking-tight"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Have a question or need help? Our team is here to provide you with the
          support and guidance you deserve.
        </motion.p>
      </section>

      {/* Contact Info Cards */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition bg-white">
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold font-poppins">Call Us</h3>
              <p className="text-muted-foreground font-inter text-base">+92 300 1234567</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition bg-white">
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <Mail className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold font-poppins">Email Us</h3>
              <p className="text-muted-foreground font-inter text-base">
                support@lensvision.com
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10 font-poppins"
        >
          Send Us a Message
        </motion.h2>

        <Card className="rounded-2xl shadow-md bg-white">
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="Your Name" className="rounded-xl font-inter" />
              <Input placeholder="Your Email" type="email" className="rounded-xl font-inter" />
            </div>
            <Input placeholder="Subject" className="rounded-xl font-inter" />
            <Textarea placeholder="Your Message" rows={5} className="rounded-xl font-inter" />
            <Button
              size="lg"
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 font-poppins text-lg"
            >
              Send Message
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-6 font-poppins"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-2xl shadow-md bg-muted/30"
        >
          <h3 className="text-lg font-semibold font-poppins">How do I track my order?</h3>
          <p className="text-muted-foreground font-inter">
            Once your order is shipped, we’ll send you a tracking number via email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 rounded-2xl shadow-md bg-muted/30"
        >
          <h3 className="text-lg font-semibold font-poppins">Can I return or exchange my glasses?</h3>
          <p className="text-muted-foreground font-inter">
            Yes, we offer hassle-free returns and exchanges within 14 days of delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="p-6 rounded-2xl shadow-md bg-muted/30"
        >
          <h3 className="text-lg font-semibold font-poppins">Do you ship internationally?</h3>
          <p className="text-muted-foreground font-inter">
            Currently, we deliver all across US and UK. International shipping is coming soon.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
