"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, TimerReset } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "../ui/use-toast"

const TimeCapsule = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  // Mock data for time capsule
  const oldQuestion = {
    _id: "old-question-123",
    title: "How to implement authentication in Next.js?",
    savedDate: "6 months ago",
    tags: ["next.js", "authentication", "react"],
  }

  const handleOpenCapsule = () => {
    setIsOpen(true)
    toast({
      title: "Time Capsule Opened!",
      description: "Revisit questions you saved long ago",
      variant: "default",
    })
  }

  return (
    <div className="mt-10">
      <h3 className="font-semibold text-lg mb-4 text-dark100_light900 flex items-center gap-2">
        <TimerReset className="h-5 w-5 text-primary" />
        <span>Time Capsule</span>
      </h3>

      {!isOpen ? (
        <motion.div
          className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg text-center"
          whileHover={{ scale: 1.02 }}
        >
          <Clock className="h-12 w-12 text-primary mx-auto mb-3" />
          <h4 className="font-semibold text-dark100_light900 mb-2">Revisit Your Past Interests</h4>
          <p className="text-muted-foreground mb-4">
            Open the time capsule to see questions you saved long ago. Rediscover what interested you in the past!
          </p>
          <Button onClick={handleOpenCapsule}>Open Time Capsule</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-dark100_light900">From Your Past</h4>
              <p className="text-sm text-muted-foreground">You saved this question {oldQuestion.savedDate}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border">
            <h5 className="font-medium text-dark100_light900 mb-2">{oldQuestion.title}</h5>
            <div className="flex flex-wrap gap-2 mt-2">
              {oldQuestion.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <a href={`/question/${oldQuestion._id}`}>View Question</a>
              </Button>
              <Button variant="ghost" size="sm">
                Add Note
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TimeCapsule

