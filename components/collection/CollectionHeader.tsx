"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, Grid3x3, List, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { useToast } from "../ui/use-toast"

interface CollectionHeaderProps {
  totalQuestions: number
  view: string
}

const CollectionHeader = ({ totalQuestions, view }: CollectionHeaderProps) => {
  const { toast } = useToast()
  const [showAnimation, setShowAnimation] = useState(false)
  const [lastSavedCount, setLastSavedCount] = useState(totalQuestions)

  useEffect(() => {
    // Check if a new question was saved
    if (totalQuestions > lastSavedCount && lastSavedCount > 0) {
      setShowAnimation(true)

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast({
        title: "Question saved!",
        description: "Your collection is growing. Keep it up!",
        variant: "default",
      })

      // Reset animation after 3 seconds
      setTimeout(() => {
        setShowAnimation(false)
      }, 3000)
    }

    setLastSavedCount(totalQuestions)
  }, [totalQuestions, lastSavedCount, toast])

  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <h1 className="h1-bold text-dark100_light900 flex items-center gap-2">
          <Bookmark className="h-8 w-8 text-primary" />
          <span>Saved Questions</span>

          <AnimatePresence>
            {showAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-12 -top-12"
              >
                <Sparkles className="h-10 w-10 text-yellow-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </h1>
        <p className="text-muted-foreground mt-1">
          You have saved {totalQuestions} question{totalQuestions !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant={view === "grid" ? "default" : "outline"} size="icon" className="rounded-md" asChild>
          <a href={`/collection?view=grid`}>
            <Grid3x3 className="h-5 w-5" />
          </a>
        </Button>
        <Button variant={view === "list" || !view ? "default" : "outline"} size="icon" className="rounded-md" asChild>
          <a href={`/collection?view=list`}>
            <List className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  )
}

export default CollectionHeader

