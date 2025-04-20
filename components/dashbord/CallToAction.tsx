"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function CallToAction() {
  const { isSignedIn } = useUser();

  return (
    <section className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="primary-gradient rounded-2xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mx-auto w-fit">
            <Sparkles size={16} />
            <span className="text-sm font-medium">
              Join thousands of developers
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Ready to take your coding skills to the next level?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/80 max-w-2xl mx-auto mb-8"
        >
          Join our community of passionate developers, ask questions, share your
          knowledge, and build your reputation in the tech world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href={isSignedIn ? "/ask-question" : "/sign-up"}
            className="w-full sm:w-auto"
          >
            <Button className="bg-white text-orange-500 hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-base sm:text-lg font-medium w-full sm:w-auto">
              {isSignedIn ? "Ask Your First Question" : "Join the Community"}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/questions" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-base sm:text-lg font-medium w-full sm:w-auto"
            >
              Browse Questions
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
