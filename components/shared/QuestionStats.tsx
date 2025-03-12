"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"
import { Eye, ThumbsUp, ThumbsDown, MessageSquare, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface QuestionStatsProps {
  views: number
  upvotes: number
  downvotes: number
  answers: number
  createdAt: Date
}

const QuestionStats = ({ views, upvotes, downvotes, answers, createdAt }: QuestionStatsProps) => {
  const [activeTab, setActiveTab] = useState<"stats" | "trends">("stats")
  const [animationComplete, setAnimationComplete] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    views: 0,
    upvotes: 0,
    downvotes: 0,
    answers: 0,
  })

  // Calculate engagement metrics
  const totalInteractions = views + upvotes + downvotes + answers
  const upvoteRatio = upvotes > 0 ? (upvotes / (upvotes + downvotes)) * 100 : 0
  const answerRatio = views > 0 ? (answers / views) * 100 : 0

  // Animate stats on component mount
  useEffect(() => {
    if (!animationComplete) {
      const duration = 1500 // ms
      const interval = 20 // ms
      const steps = duration / interval

      const viewsIncrement = views / steps
      const upvotesIncrement = upvotes / steps
      const downvotesIncrement = downvotes / steps
      const answersIncrement = answers / steps

      let current = {
        views: 0,
        upvotes: 0,
        downvotes: 0,
        answers: 0,
      }

      const timer = setInterval(() => {
        current = {
          views: Math.min(current.views + viewsIncrement, views),
          upvotes: Math.min(current.upvotes + upvotesIncrement, upvotes),
          downvotes: Math.min(current.downvotes + downvotesIncrement, downvotes),
          answers: Math.min(current.answers + answersIncrement, answers),
        }

        setAnimatedStats({
          views: Math.floor(current.views),
          upvotes: Math.floor(current.upvotes),
          downvotes: Math.floor(current.downvotes),
          answers: Math.floor(current.answers),
        })

        if (
          current.views >= views &&
          current.upvotes >= upvotes &&
          current.downvotes >= downvotes &&
          current.answers >= answers
        ) {
          clearInterval(timer)
          setAnimationComplete(true)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [views, upvotes, downvotes, answers, animationComplete])

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark100_light900 flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-full mr-3">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            Question Analytics
          </h3>

          <div className="flex bg-light-800 dark:bg-dark-300 rounded-full p-1">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeTab === "stats"
                  ? "bg-primary-500 text-white"
                  : "text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400"
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeTab === "trends"
                  ? "bg-primary-500 text-white"
                  : "text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400"
              }`}
            >
              Trends
            </button>
          </div>
        </div>

        {activeTab === "stats" ? (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
                <div className="p-3 bg-blue-500/10 rounded-full mb-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-500">{formatAndDivideNumber(animatedStats.views)}</p>
                <p className="text-sm text-dark500_light700">Views</p>
              </div>

              <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
                <div className="p-3 bg-green-500/10 rounded-full mb-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-500">{formatAndDivideNumber(animatedStats.answers)}</p>
                <p className="text-sm text-dark500_light700">Answers</p>
              </div>

              <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
                <div className="p-3 bg-primary-500/10 rounded-full mb-2">
                  <ThumbsUp className="h-5 w-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-primary-500">{formatAndDivideNumber(animatedStats.upvotes)}</p>
                <p className="text-sm text-dark500_light700">Upvotes</p>
              </div>

              <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
                <div className="p-3 bg-red-500/10 rounded-full mb-2">
                  <ThumbsDown className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-red-500">{formatAndDivideNumber(animatedStats.downvotes)}</p>
                <p className="text-sm text-dark500_light700">Downvotes</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-dark500_light700 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Posted {getTimestamp(createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{totalInteractions} total interactions</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-dark400_light700">Upvote Ratio</span>
                  <span className="text-sm font-medium text-primary-500">{upvoteRatio.toFixed(1)}%</span>
                </div>
                <Progress value={upvoteRatio} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-dark400_light700">Answer Rate</span>
                  <span className="text-sm font-medium text-green-500">{answerRatio.toFixed(1)}%</span>
                </div>
                <Progress value={answerRatio} className="h-2 bg-green-100 dark:bg-green-900">
                  <div className="h-full bg-green-500 rounded-full" />
                </Progress>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-dark400_light700">Engagement Score</span>
                  <span className="text-sm font-medium text-blue-500">
                    {Math.min(Math.floor(totalInteractions / 10), 100)}/100
                  </span>
                </div>
                <Progress
                  value={Math.min(Math.floor(totalInteractions / 10), 100)}
                  className="h-2 bg-blue-100 dark:bg-blue-900"
                >
                  <div className="h-full bg-blue-500 rounded-full" />
                </Progress>
              </div>
            </div>

            <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4">
              <h4 className="font-medium text-dark200_light900 mb-2">Insights</h4>
              <p className="text-sm text-dark400_light700">
                {upvoteRatio > 80
                  ? "This question is highly rated by the community!"
                  : upvoteRatio > 50
                    ? "This question has a positive reception."
                    : "This question has mixed reactions."}{" "}
                {answerRatio > 5
                  ? "It's generating a lot of answers relative to views."
                  : "It could use more expert answers."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QuestionStats

