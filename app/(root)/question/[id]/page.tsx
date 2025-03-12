/* eslint-disable @typescript-eslint/no-explicit-any */
import Answer from "@/components/forms/Answer"
import AllAnswers from "@/components/shared/AllAnswers"
import ParseHtml from "@/components/shared/ParseHtml"
import Votes from "@/components/shared/Votes"
import { getQuestionById } from "@/lib/actions/question.action"
import { getUserById } from "@/lib/actions/user.action"
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"

import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Eye,
  Clock,
  ThumbsUp,
  Share2,
  Bookmark,
  AlertTriangle,
  Award,
  Tag,
  Users,
  TrendingUp,
  Zap,
  Sparkles,
  Flame,
  Heart,
  Star,
  Coffee,
  Lightbulb,
  Rocket,
  Trophy,
} from "lucide-react"
import QuestionStats from "@/components/shared/QuestionStats"
import RelatedQuestions from "@/components/shared/RelatedQuestions"


interface URLProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [q: string]: string | undefined }>
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { id } = await params
  const { page, filter } = await searchParams
  const result = await getQuestionById({ questionId: id })
  const { userId: clerkId } = await auth()

  let mongoUser

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }

  // Mock data for related questions
  const relatedQuestions = [
    {
      _id: "1",
      title: "How to implement authentication in Next.js?",
      tags: [
        { _id: "101", name: "nextjs" },
        { _id: "102", name: "auth" },
      ],
      author: { name: "John Doe", picture: "/placeholder.svg?height=40&width=40" },
      upvotes: 24,
      views: 1200,
      answers: 5,
    },
    {
      _id: "2",
      title: "Best practices for state management in React",
      tags: [
        { _id: "103", name: "react" },
        { _id: "104", name: "redux" },
      ],
      author: { name: "Jane Smith", picture: "/placeholder.svg?height=40&width=40" },
      upvotes: 18,
      views: 950,
      answers: 3,
    },
    {
      _id: "3",
      title: "How to optimize MongoDB queries?",
      tags: [
        { _id: "105", name: "mongodb" },
        { _id: "106", name: "database" },
      ],
      author: { name: "Alex Johnson", picture: "/placeholder.svg?height=40&width=40" },
      upvotes: 15,
      views: 820,
      answers: 2,
    },
  ]

  // Calculate engagement score for gamification
  const engagementScore = (result?.views || 0) + (result?.upvotes?.length || 0) * 5 + (result?.answer?.length || 0) * 10

  // Determine question level based on engagement
  const getQuestionLevel = (score: number) => {
    if (score > 1000) return { level: "Legendary", icon: <Trophy className="text-yellow-500" /> }
    if (score > 500) return { level: "Hot", icon: <Flame className="text-orange-500" /> }
    if (score > 200) return { level: "Popular", icon: <Zap className="text-blue-500" /> }
    if (score > 100) return { level: "Rising", icon: <TrendingUp className="text-green-500" /> }
    return { level: "New", icon: <Sparkles className="text-purple-500" /> }
  }

  const questionLevel = getQuestionLevel(engagementScore)

  return (
    <div className="animate-fade-in">
      {/* Floating particles for visual interest */}
      <div className="particle-container">
        <div
          className="particle bg-primary-500/20 w-20 h-20 rounded-full absolute top-20 right-10 animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="particle bg-blue-500/20 w-16 h-16 rounded-full absolute top-40 left-10 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="particle bg-purple-500/20 w-12 h-12 rounded-full absolute bottom-20 right-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="particle bg-green-500/20 w-24 h-24 rounded-full absolute bottom-40 left-20 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-primary-500 via-orange-400 to-yellow-500">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        {/* Glassmorphism card */}
        <div className="relative z-10 p-8 md:p-12 backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl">
          <div className="flex flex-col gap-4">
            {/* Author and actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href={`/profile/${result?.author?.clerkId}`}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all hover:bg-white/30 group max-w-fit"
              >
                <div className="relative">
                  <Image
                    src={result?.author?.picture ?? "/assets/icons/avatar.svg"}
                    className="rounded-full object-cover border-2 border-white/50 group-hover:border-white transition-all"
                    width={40}
                    height={40}
                    alt="profile"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-0.5 border-2 border-white">
                    <Star className="h-3 w-3" />
                  </div>
                </div>

                <div>
                  <p className="font-medium text-white group-hover:text-white/90 transition-colors">
                    {result?.author?.name}
                  </p>
                  <p className="text-xs text-white/70 group-hover:text-white/80 transition-colors">
                    Asked {getTimestamp(result?.createdAt)}
                  </p>
                </div>
              </Link>

              {/* Question level badge */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 max-w-fit">
                {questionLevel.icon}
                <span className="text-white text-sm font-medium">{questionLevel.level} Question</span>
              </div>

              <div className="flex gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/20 text-white hover:bg-white/30 hover:text-white rounded-full"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/20 text-white hover:bg-white/30 hover:text-white rounded-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Title with animated gradient */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2 animate-pulse-slow">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-white bg-300% animate-gradient">
                {result?.title}
              </span>
            </h1>

            {/* Tags with hover effects */}
            <div className="flex flex-wrap gap-2 mt-2">
              {result?.tags.map((tag: any) => (
                <Link href={`/tags/${tag._id}`} key={tag._id}>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm transition-all duration-300 hover:scale-105 px-3 py-1">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Stats with icons */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-1.5 bg-white/10 rounded-full">
                  <Eye className="h-4 w-4" />
                </div>
                <span>{formatAndDivideNumber(result?.views)} views</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-1.5 bg-white/10 rounded-full">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span>{formatAndDivideNumber(result?.answer?.length)} answers</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-1.5 bg-white/10 rounded-full">
                  <ThumbsUp className="h-4 w-4" />
                </div>
                <span>{formatAndDivideNumber(result?.upvotes.length)} upvotes</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-1.5 bg-white/10 rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <span>{getTimestamp(result?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Question Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Content Card with Neumorphism */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary-500 via-orange-400 to-yellow-500"></div>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <Badge className="bg-primary-500 text-white mb-4 px-3 py-1.5 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Question
                </Badge>
                <Votes
                  type="Question"
                  itemId={JSON.stringify(result._id)}
                  userId={JSON.stringify(mongoUser?._id)}
                  upvotes={result.upvotes.length}
                  hasAlreadyUpvoted={result.upvotes.includes(mongoUser?._id)}
                  downvotes={result.downvotes.length}
                  hasAlreadyDownvoted={result.downvotes.includes(mongoUser?._id)}
                  hasSaved={mongoUser?.saved.includes(result._id)}
                />
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <ParseHtml data={result.content} />
              </div>

              {/* Interactive action buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Buy me a coffee</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>Follow Question</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
                >
                  <Rocket className="h-4 w-4" />
                  <span>Boost</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Stats Card - Visual representation */}
          <QuestionStats
            views={result?.views || 0}
            upvotes={result?.upvotes?.length || 0}
            downvotes={result?.downvotes?.length || 0}
            answers={result?.answer?.length || 0}
            createdAt={result?.createdAt}
          />

          {/* Answers Section with Tabs */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"></div>
            <CardContent className="p-8">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-dark100_light900 flex items-center">
                    <div className="p-2 bg-blue-500/10 rounded-full mr-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    {result?.answer?.length} Answers
                  </h2>

                  <TabsList className="bg-light-800 dark:bg-dark-300 p-1 rounded-full">
                    <TabsTrigger
                      value="all"
                      className="rounded-full data-[state=active]:bg-primary-500 data-[state=active]:text-white"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="rounded-full data-[state=active]:bg-primary-500 data-[state=active]:text-white"
                    >
                      Most Voted
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="rounded-full data-[state=active]:bg-primary-500 data-[state=active]:text-white"
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-5 flex w-full flex-col gap-6">
                  <AllAnswers
                    questionId={result._id}
                    userId={mongoUser?._id}
                    totalANswers={result?.answer?.length}
                    page={page}
                    filter={filter}
                  />
                </TabsContent>

                <TabsContent value="popular" className="mt-5 flex w-full flex-col gap-6">
                  <AllAnswers
                    questionId={result._id}
                    userId={mongoUser?._id}
                    totalANswers={result?.answer?.length}
                    page={page}
                    filter="highestVotes"
                  />
                </TabsContent>

                <TabsContent value="recent" className="mt-5 flex w-full flex-col gap-6">
                  <AllAnswers
                    questionId={result._id}
                    userId={mongoUser?._id}
                    totalANswers={result?.answer?.length}
                    page={page}
                    filter="recent"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Answer Form with Animated Background */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <CardContent className="p-8 relative z-10">
              <h3 className="text-xl font-bold text-dark100_light900 mb-6 flex items-center">
                <div className="p-2 bg-green-500/10 rounded-full mr-3">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                Your Answer
              </h3>

              <Answer
                question={result.content}
                questionId={JSON.stringify(result._id)}
                authorId={JSON.stringify(mongoUser?._id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Enhanced Cards */}
        <div className="space-y-6">
          {/* Engagement Score Card */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <div className="p-2 bg-yellow-500/10 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                Engagement Score
              </h3>

              <div className="relative pt-5">
                <div className="w-full h-4 bg-light-800 dark:bg-dark-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(engagementScore / 10, 100)}%` }}
                  ></div>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {engagementScore} points
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-primary-500">{formatAndDivideNumber(result?.views)}</p>
                  <p className="text-sm text-dark500_light700">Views</p>
                </div>
                <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-blue-500">{formatAndDivideNumber(result?.answer?.length)}</p>
                  <p className="text-sm text-dark500_light700">Answers</p>
                </div>
                <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-green-500">{formatAndDivideNumber(result?.upvotes.length)}</p>
                  <p className="text-sm text-dark500_light700">Upvotes</p>
                </div>
                <div className="bg-light-800/50 dark:bg-dark-300/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-red-500">{formatAndDivideNumber(result?.downvotes.length)}</p>
                  <p className="text-sm text-dark500_light700">Downvotes</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-dark500_light700 mb-3">Asked {getTimestamp(result?.createdAt)}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Tags Card */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 via-violet-400 to-indigo-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <div className="p-2 bg-purple-500/10 rounded-full mr-3">
                  <Tag className="h-5 w-5 text-purple-500" />
                </div>
                Related Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {result?.tags.map((tag: any) => (
                  <Link key={tag._id} href={`/tags/${tag._id}`}>
                    <Badge className="bg-light-800 dark:bg-dark-300 text-dark400_light700 hover:bg-light-700 dark:hover:bg-dark-400 transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full">
                      #{tag.name}
                      <span className="ml-2 text-xs bg-light-700 dark:bg-dark-400 px-2 py-0.5 rounded-full">
                        {Math.floor(Math.random() * 100)}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Questions Card */}
          <RelatedQuestions questions={relatedQuestions} />

          {/* Hot Network Questions */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 via-pink-400 to-rose-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <div className="p-2 bg-red-500/10 rounded-full mr-3">
                  <Flame className="h-5 w-5 text-red-500" />
                </div>
                Hot Network Questions
              </h3>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-2 items-start group">
                    <div className="h-2 w-2 rounded-full bg-primary-500 mt-2 group-hover:bg-primary-600 transition-colors"></div>
                    <Link
                      href="#"
                      className="text-sm text-dark400_light700 hover:text-primary-500 transition-colors line-clamp-2 group-hover:translate-x-1 transition-transform"
                    >
                      How to implement authentication in a Next.js application with Clerk?
                    </Link>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 rounded-full hover:bg-primary-500 hover:text-white transition-colors"
              >
                View More
              </Button>
            </CardContent>
          </Card>

          {/* Community Insights Card - NEW */}
          <Card className="overflow-hidden border-none shadow-lg bg-light-900 dark:bg-dark-200 relative">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-400 to-indigo-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-full mr-3">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                Community Insights
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-light-800/50 dark:bg-dark-300/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <Rocket className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-dark400_light700">Response Time</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">Fast</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-light-800/50 dark:bg-dark-300/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-dark400_light700">Active Members</span>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500">{Math.floor(Math.random() * 50) + 10}</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-light-800/50 dark:bg-dark-300/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span className="text-dark400_light700">Top Contributor</span>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-500">{result?.author?.name}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page

