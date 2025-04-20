"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Tag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data
const trendingTags = [
  {
    id: "t1",
    name: "javascript",
    count: 4328,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  { id: "t2", name: "react", count: 3245, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  {
    id: "t3",
    name: "typescript",
    count: 2876,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  { id: "t4", name: "nextjs", count: 2154, color: "bg-black text-white dark:bg-white dark:text-black" },
  {
    id: "t5",
    name: "tailwindcss",
    count: 1987,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    id: "t6",
    name: "node.js",
    count: 1876,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "t7",
    name: "mongodb",
    count: 1654,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  { id: "t8", name: "css", count: 1543, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  {
    id: "t9",
    name: "html",
    count: 1432,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "t10",
    name: "api",
    count: 1321,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
]

export default function TrendingTags() {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null)

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="bg-light-900 dark:bg-dark-200 rounded-2xl p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag size={20} className="text-orange-500" />
                <h2 className="text-2xl font-bold text-dark100_light900">Trending Tags</h2>
              </div>
              <p className="text-dark400_light700">Explore the most popular topics in our community</p>
            </motion.div>

            <Link href="/tags">
              <Button variant="ghost" className="text-primary-500 hover:text-primary-600">
                View All Tags
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {trendingTags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Link
                  href={`/tags/${tag.id}`}
                  onMouseEnter={() => setHoveredTag(tag.id)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <div
                    className={`${tag.color} px-4 py-2.5 rounded-full flex items-center transition-all duration-200 ${
                      hoveredTag === tag.id ? "scale-105 shadow-md" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{tag.name}</span>
                    <Badge className="ml-2 bg-white/20 text-xs">{tag.count.toLocaleString()}</Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
