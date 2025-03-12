"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare, ThumbsUp, Eye, Sparkles, ArrowRight } from "lucide-react"

interface RelatedQuestionsProps {
  questions: {
    _id: string
    title: string
    tags: { _id: string; name: string }[]
    author: { name: string; picture: string }
    upvotes: number
    views: number
    answers: number
  }[]
}

const RelatedQuestions = ({ questions }: RelatedQuestionsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-400 to-indigo-500"></div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
          <div className="p-2 bg-cyan-500/10 rounded-full mr-3">
            <Sparkles className="h-5 w-5 text-cyan-500" />
          </div>
          Related Questions
        </h3>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <Link
              key={question._id}
              href={`/question/${question._id}`}
              className="block group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`p-4 rounded-lg ${
                  hoveredIndex === index
                    ? "bg-primary-500/5 border border-primary-500/20"
                    : "bg-light-800/50 dark:bg-dark-300/50 border border-transparent"
                } transition-all duration-300`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4
                    className={`font-medium text-dark200_light900 group-hover:text-primary-500 transition-colors line-clamp-2 ${
                      hoveredIndex === index ? "text-primary-500" : ""
                    }`}
                  >
                    {question.title}
                  </h4>

                  <div
                    className={`transform transition-transform duration-300 ${
                      hoveredIndex === index ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 text-primary-500" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag._id}
                      className="bg-light-700 dark:bg-dark-400 text-dark400_light700 hover:bg-light-600 dark:hover:bg-dark-500 transition-colors text-xs px-2 py-0.5"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Image
                      src={question.author.picture || "/placeholder.svg"}
                      alt={question.author.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs text-dark400_light700">{question.author.name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-dark500_light700">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {question.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {question.answers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {question.views}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 rounded-full hover:bg-primary-500 hover:text-white transition-colors group"
        >
          <span>View More Questions</span>
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default RelatedQuestions

