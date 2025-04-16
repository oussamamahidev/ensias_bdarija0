"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Lightbulb, ArrowRight, RefreshCw } from "lucide-react"
import confetti from "canvas-confetti"

interface Props {
  title: string
  description: string
  link: string
  linktitle: string
}

const NoResult = ({ title, description, link, linktitle }: Props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions] = useState(["JavaScript", "React Hooks", "Next.js", "Tailwind CSS", "TypeScript"])
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Rotate through suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [suggestions.length])

  // Trigger confetti on button hover
  useEffect(() => {
    if (isHovering && !showConfetti) {
      setShowConfetti(true)

      // Small confetti burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Reset after animation completes
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }, [isHovering, showConfetti])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 flex w-full flex-col items-center justify-center"
    >
      <motion.div
        className="relative h-48 w-48 mb-8"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 6,
        }}
      >
        <Image
          src="/assets/images/light-illustration.png"
          alt="No results illustration"
          fill
          className="object-contain dark:hidden"
        />
        <Image
          src="/assets/images/dark-illustration.png"
          alt="No results illustration"
          fill
          className="object-contain hidden dark:block"
        />

        {/* Animated search icon */}
        <motion.div
          className="absolute -right-4 -top-4 bg-primary-500 text-white p-3 rounded-full shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 3,
            delay: 1,
          }}
        >
          <Search size={24} />
        </motion.div>

        {/* Animated lightbulb */}
        <motion.div
          className="absolute -left-4 -bottom-4 bg-yellow-500 text-white p-3 rounded-full shadow-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 2,
            delay: 0.5,
          }}
        >
          <Lightbulb size={24} />
        </motion.div>
      </motion.div>

      <motion.h2
        className="h2-bold text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>

      {/* Search suggestions */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Try searching for:</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSuggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-8"
          >
            <span className="text-primary-500 font-medium">{suggestions[currentSuggestion]}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center mt-4 gap-2">
          {suggestions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentSuggestion ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href={link}>
          <Button
            className="bg-gradient-to-r from-primary-500 to-orange-400 hover:from-primary-600 hover:to-orange-500 text-white rounded-lg px-8 py-3 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {linktitle}
            <ArrowRight size={18} />
          </Button>
        </Link>

        <Button
          variant="outline"
          className="border-primary-500 text-primary-500 hover:bg-primary-500/10 rounded-lg px-6 py-2.5 font-medium transition-all duration-300 flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
          Refresh Page
        </Button>
      </div>

      {/* Random fun fact */}
      <motion.div
        className="mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Did you know?</span> The average developer spends 30% of their time searching
          for answers to coding questions!
        </p>
      </motion.div>
    </motion.div>
  )
}

export default NoResult

