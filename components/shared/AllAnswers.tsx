import Filter from "./Filter"
import { AnswerFilters } from "@/constants/filters"
import { getAnswers } from "@/lib/actions/answer.action"
import Link from "next/link"
import Image from "next/image"
import { getTimestamp } from "@/lib/utils"
import ParseHTML from "./ParseHtml"
import Votes from "./Votes"
import Pagination from "./search/Pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  ThumbsUp,
  Award,
  Flag,
  Copy,
  Share2,
  Heart,
  Sparkles,
  Zap,
  Star,
  Lightbulb,
  Bookmark,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  questionId: string
  userId: string
  totalANswers: string
  page?: string
  filter?: string
}

const AllAnswers = async ({ questionId, totalANswers, userId, filter, page }: Props) => {
  const result = await getAnswers({
    questionId,
    page: page ? -page : 1,
    sortBy: filter,
  })

  return (
    <div className="mt-11 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
        <h3 className="text-xl font-bold text-dark100_light900 flex items-center">
          <div className="p-2 bg-primary-500/10 rounded-full mr-3">
            <MessageSquare className="h-5 w-5 text-primary-500" />
          </div>
          <span className="primary-text-gradient">{totalANswers}</span> Answers
        </h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div className="space-y-8">
        {result.answers.map((answer, index) => {
          const isTopAnswer = index === 0 && result.answers.length > 1
          const hasHighVotes = answer.upvotes.length > 5

          return (
            <Card
              key={answer._id}
              className={`card-wrapper overflow-hidden border-none shadow-lg animate-slide-up ${
                isTopAnswer ? "ring-2 ring-primary-500/50" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {isTopAnswer && (
                <div className="bg-gradient-to-r from-primary-500 to-orange-300 text-white px-6 py-2 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="font-medium">Top Answer</span>
                  <div className="ml-auto flex gap-2">
                    <Badge className="bg-white/20 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Community Choice
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className={`p-6 ${isTopAnswer ? "bg-primary-500/5" : ""}`}>
                <div className="flex items-center justify-between mb-6">
                  <Link href={`/profile/${answer.author.clerkId}`} className="flex items-center gap-2 group">
                    <div className="relative">
                      <Image
                        src={answer.author.picture || "/assets/icons/avatar.svg"}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover border-2 border-light-500 dark:border-dark-500 group-hover:border-primary-500 transition-colors"
                      />
                      {isTopAnswer && (
                        <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-0.5">
                          <Award className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-dark300_light700 group-hover:text-primary-500 transition-colors">
                        {answer.author.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-dark400_light500">Answered {getTimestamp(answer.createdAt)}</p>
                        {answer.author.reputation > 100 && (
                          <Badge className="bg-primary-500/10 text-primary-500 text-xs px-2 py-0.5">
                            <Zap className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    <Votes
                      type="Answer"
                      itemId={JSON.stringify(answer._id)}
                      userId={JSON.stringify(userId)}
                      upvotes={answer.upvotes.length}
                      hasAlreadyUpvoted={answer.upvotes.includes(userId)}
                      downvotes={answer.downvotes.length}
                      hasAlreadyDownvoted={answer.downvotes.includes(userId)}
                    />
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <ParseHTML data={answer.content} />
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-2">
                    <Badge
                      className={`${
                        hasHighVotes ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                      } px-3 py-1.5 rounded-full`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {answer.upvotes.length} votes
                    </Badge>

                    {hasHighVotes && (
                      <Badge className="bg-primary-500/10 text-primary-500 px-3 py-1.5 rounded-full">
                        <Lightbulb className="h-3.5 w-3.5 mr-1" />
                        Helpful
                      </Badge>
                    )}

                    {answer.upvotes.length > 10 && (
                      <Badge className="bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full">
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        Brilliant
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                          >
                            <Heart className="h-4 w-4 text-dark400_light500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Like this answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                          >
                            <Bookmark className="h-4 w-4 text-dark400_light500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save this answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                          >
                            <Copy className="h-4 w-4 text-dark400_light500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy link to answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                          >
                            <Share2 className="h-4 w-4 text-dark400_light500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share this answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <Flag className="h-4 w-4 text-dark400_light500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Report this answer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext || false} />
      </div>
    </div>
  )
}

export default AllAnswers

