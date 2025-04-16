"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface PopularTagCloudProps {
  tags: any[]
}

export default function PopularTagCloud({ tags }: PopularTagCloudProps) {
  const [positions, setPositions] = useState<any[]>([])

  useEffect(() => {
    // Generate random positions for tags
    const newPositions = tags.map((tag) => ({
      tag,
      x: Math.random() * 80,
      y: Math.random() * 80,
      scale: 0.8 + Math.random() * 0.6,
      rotation: Math.random() * 40 - 20,
      animationDelay: Math.random() * 5,
      animationDuration: 5 + Math.random() * 10,
    }))

    setPositions(newPositions)
  }, [tags])

  return (
    <div className="relative h-[200px] w-[300px] md:h-[250px] md:w-[350px]">
      {positions.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: `${item.y}%`,
            left: `${item.x}%`,
            transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
          }}
          animate={{
            y: [0, -10, 0, 10, 0],
            x: [0, 5, 0, -5, 0],
            rotate: [item.rotation, item.rotation + 5, item.rotation, item.rotation - 5, item.rotation],
          }}
          transition={{
            duration: item.animationDuration,
            delay: item.animationDelay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary-500 px-3 py-1 rounded-full text-sm font-medium shadow-md whitespace-nowrap">
            {item.tag.name}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

