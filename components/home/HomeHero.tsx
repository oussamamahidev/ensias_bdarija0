"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, Users, Award } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface HomeHeroProps {
  hasUserId: boolean
}

const HomeHero = ({ hasUserId }: HomeHeroProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-transparent dark:from-primary-500/20 dark:via-primary-500/10 dark:to-gray-900/50 border border-primary-500/20 dark:border-primary-500/10 shadow-xl">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Where Developers <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-orange-400 animate-text">
              Share & Grow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl"
          >
            Join our community of passionate developers to ask questions, share knowledge, and build your coding career.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            {!hasUserId ? (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Join the Community
                </Button>
              </Link>
            ) : (
              <Link href="/ask-question">
                <Button
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Ask a Question
                </Button>
              </Link>
            )}

            <Link href={hasUserId ? "/community" : "/sign-in"}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-500 text-primary-500 hover:bg-primary-500/10 rounded-lg px-6 py-3 transition-all duration-300"
              >
                {hasUserId ? "Explore Community" : "Sign In"}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center md:justify-start gap-6 mt-8"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Fast Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Earn Reputation</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative w-full md:w-2/5 h-[300px] flex-shrink-0"
        >
          <Image
            src="/assets/images/hero-illustration.png"
            alt="Developer community illustration"
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src="/assets/images/hero-illustration.png"
            alt="Developer community illustration"
            fill
            className="object-contain hidden dark:block"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80"></div>
    </div>
  )
}

export default HomeHero

