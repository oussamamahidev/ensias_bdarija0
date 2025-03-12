"use client"

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action"
import { viewQuestion } from "@/lib/actions/interaction.action"
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action"
import { toggleSaveQuestion } from "@/lib/actions/user.action"
import { formatAndDivideNumber } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "../ui/use-toast"
import { Button } from "../ui/button"
import { ThumbsUp, ThumbsDown, Bookmark, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  type: string
  itemId: string
  userId: string
  upvotes: number
  hasAlreadyUpvoted: boolean
  downvotes: number
  hasAlreadyDownvoted: boolean
  hasSaved?: boolean
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasAlreadyUpvoted,
  downvotes,
  hasAlreadyDownvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [isDownvoting, setIsDownvoting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [votes, setVotes] = useState({
    upvotes,
    downvotes,
    hasAlreadyUpvoted,
    hasAlreadyDownvoted,
    hasSaved: hasSaved || false,
  })

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    })
  }, [itemId, userId, pathname])

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You need to log in to vote on this post",
      })
    }

    if (voteType === "upvote") {
      setIsUpvoting(true)
      try {
        // Show heart animation if upvoting and not already upvoted
        if (!votes.hasAlreadyUpvoted) {
          setShowHeartAnimation(true)
          setTimeout(() => setShowHeartAnimation(false), 1000)
        }

        // Optimistic update
        setVotes((prev) => ({
          ...prev,
          upvotes: prev.hasAlreadyUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          hasAlreadyUpvoted: !prev.hasAlreadyUpvoted,
          hasAlreadyDownvoted: false,
          downvotes: prev.hasAlreadyDownvoted ? prev.downvotes - 1 : prev.downvotes,
        }))

        if (type === "Question") {
          await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
            hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
            path: pathname,
          })
        } else if (type === "Answer") {
          await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
            hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
            path: pathname,
          })
        }

        toast({
          title: votes.hasAlreadyUpvoted ? "Upvote removed" : "Upvoted successfully",
          variant: "default",
        })
      } catch (error) {
        console.log(error)
        // Revert optimistic update on error
        setVotes((prev) => ({
          ...prev,
          upvotes: votes.hasAlreadyUpvoted ? prev.upvotes + 1 : prev.upvotes - 1,
          hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
          hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
          downvotes: votes.downvotes,
        }))
        toast({
          title: "Something went wrong",
          description: "Failed to upvote. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUpvoting(false)
      }
    }

    if (voteType === "downvote") {
      setIsDownvoting(true)
      try {
        // Optimistic update
        setVotes((prev) => ({
          ...prev,
          downvotes: prev.hasAlreadyDownvoted ? prev.downvotes - 1 : prev.downvotes + 1,
          hasAlreadyDownvoted: !prev.hasAlreadyDownvoted,
          hasAlreadyUpvoted: false,
          upvotes: prev.hasAlreadyUpvoted ? prev.upvotes - 1 : prev.upvotes,
        }))

        if (type === "Question") {
          await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
            hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
            path: pathname,
          })
        } else if (type === "Answer") {
          await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
            hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
            path: pathname,
          })
        }

        toast({
          title: votes.hasAlreadyDownvoted ? "Downvote removed" : "Downvoted successfully",
          variant: "default",
        })
      } catch (error) {
        console.log(error)
        // Revert optimistic update on error
        setVotes((prev) => ({
          ...prev,
          downvotes: votes.hasAlreadyDownvoted ? prev.downvotes + 1 : prev.downvotes - 1,
          hasAlreadyDownvoted: votes.hasAlreadyDownvoted,
          hasAlreadyUpvoted: votes.hasAlreadyUpvoted,
          upvotes: votes.upvotes,
        }))
        toast({
          title: "Something went wrong",
          description: "Failed to downvote. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDownvoting(false)
      }
    }
  }

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You need to log in to save this question",
      })
    }

    setIsSaving(true)
    try {
      // Optimistic update
      setVotes((prev) => ({
        ...prev,
        hasSaved: !prev.hasSaved,
      }))

      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathname,
      })

      toast({
        title: votes.hasSaved ? "Removed from saved" : "Saved successfully",
        variant: "default",
      })
    } catch (error) {
      console.log(error)
      // Revert optimistic update on error
      setVotes((prev) => ({
        ...prev,
        hasSaved: votes.hasSaved,
      }))
      toast({
        title: "Something went wrong",
        description: "Failed to save question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex gap-5 relative">
      {/* Floating heart animation */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            className="absolute -top-10 left-2 text-red-500 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.5, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1 }}
          >
            <Heart className="h-6 w-6 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-center gap-2.5">
        <Button
          onClick={() => handleVote("upvote")}
          disabled={isUpvoting}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
            votes.hasAlreadyUpvoted
              ? "bg-primary-500 text-white hover:bg-primary-600 scale-110"
              : "bg-light-800 dark:bg-dark-300 text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400 hover:scale-105"
          }`}
          size="icon"
        >
          <ThumbsUp className={`h-4 w-4 ${votes.hasAlreadyUpvoted ? "animate-bounce-subtle" : ""}`} />
        </Button>
        <div className="flex-center min-w-[18px] rounded-sm px-2 py-1 bg-light-700/50 dark:bg-dark-400/50">
          <p className="text-sm font-medium text-dark400_light700">{formatAndDivideNumber(votes.upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-2.5">
        <Button
          onClick={() => handleVote("downvote")}
          disabled={isDownvoting}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
            votes.hasAlreadyDownvoted
              ? "bg-red-500 text-white hover:bg-red-600 scale-110"
              : "bg-light-800 dark:bg-dark-300 text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400 hover:scale-105"
          }`}
          size="icon"
        >
          <ThumbsDown className={`h-4 w-4 ${votes.hasAlreadyDownvoted ? "animate-bounce-subtle" : ""}`} />
        </Button>
        <div className="flex-center min-w-[18px] rounded-sm px-2 py-1 bg-light-700/50 dark:bg-dark-400/50">
          <p className="text-sm font-medium text-dark400_light700">{formatAndDivideNumber(votes.downvotes)}</p>
        </div>
      </div>

      {type === "Question" && (
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
            votes.hasSaved
              ? "bg-blue-500 text-white hover:bg-blue-600 scale-110"
              : "bg-light-800 dark:bg-dark-300 text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400 hover:scale-105"
          }`}
          size="icon"
        >
          <Bookmark className={`h-4 w-4 ${votes.hasSaved ? "fill-current animate-bounce-subtle" : ""}`} />
        </Button>
      )}
    </div>
  )
}

export default Votes

