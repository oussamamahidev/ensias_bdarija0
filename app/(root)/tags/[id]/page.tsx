import { Suspense } from "react"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"
import { getQuestionsByTagId } from "@/lib/actions/tag.actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hash, TrendingUp, Clock, Eye, MessageSquare, ThumbsUp, Bookmark, Share2, BarChart3, Users, Zap } from 'lucide-react'
import TagStatistics from "@/components/tags/TagStatistics"
import RelatedTagsList from "@/components/tags/RelatedTagsList"
import TopContributors from "@/components/tags/TopContributors"


interface URLProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [q: string]: string | undefined }>
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { id } = await params
  const { q, page, filter = "newest" } = await searchParams

  const result = await getQuestionsByTagId({
    tagId: id,
    searchQuery: q,
    page: parseInt(page || "1"),
  })


  const questionSearialisation = JSON.parse(JSON.stringify(result.questions));

  // Mock data for related tags
  const relatedTags = [
    { _id: '1', name: 'javascript', questionCount: 120 },
    { _id: '2', name: 'react', questionCount: 85 },
    { _id: '3', name: 'typescript', questionCount: 64 },
    { _id: '4', name: 'nextjs', questionCount: 42 },
    { _id: '5', name: 'tailwindcss', questionCount: 38 },
  ]

  // Mock data for tag statistics
  const tagStats = {
    totalQuestions: questionSearialisation.length,
    questionsToday: Math.floor(Math.random() * 10),
    questionsThisWeek: Math.floor(Math.random() * 30),
    questionsThisMonth: Math.floor(Math.random() * 100),
    followers: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 10000),
  }

  // Mock data for top contributors
  const topContributors = [
    { id: '1', name: 'Alex Johnson', image: '/placeholder.svg?height=40&width=40', questions: 24, answers: 56 },
    { id: '2', name: 'Maria Garcia', image: '/placeholder.svg?height=40&width=40', questions: 18, answers: 42 },
    { id: '3', name: 'Sam Taylor', image: '/placeholder.svg?height=40&width=40', questions: 15, answers: 37 },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl primary-gradient text-white mb-8">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1 animate-slide-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Hash className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-3 py-1 text-sm">
                  Tag
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3 capitalize">{result.tagTitle}</h1>
              
              <p className="text-white/80 max-w-xl mb-6">
                Explore {questionSearialisation.length} questions tagged with <span className="font-semibold">{result.tagTitle}</span>. 
                Join the community discussion and share your knowledge.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-primary-500 hover:bg-white/90 rounded-full px-6">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Follow Tag
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-6"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-slide-down">
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{tagStats.totalQuestions}</div>
                  <div className="text-white/70 text-sm">Questions</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{tagStats.followers}</div>
                  <div className="text-white/70 text-sm">Followers</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{tagStats.questionsThisWeek}</div>
                  <div className="text-white/70 text-sm">This Week</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{tagStats.views}</div>
                  <div className="text-white/70 text-sm">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tag Statistics Card */}
          <Card className="card-wrapper overflow-hidden border-none">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Tag Statistics
              </h3>
              <TagStatistics stats={tagStats} />
            </CardContent>
          </Card>

          {/* Related Tags Card */}
          <Card className="card-wrapper overflow-hidden border-none">
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-green-500" />
                Related Tags
              </h3>
              <RelatedTagsList tags={relatedTags} />
            </CardContent>
          </Card>

          {/* Top Contributors Card */}
          <Card className="card-wrapper overflow-hidden border-none">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                Top Contributors
              </h3>
              <TopContributors contributors={topContributors} />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <Card className="card-wrapper border-none">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <LocalSearch
                  route={`/tags/${id}`}
                  iconPosition="left"
                  imgSrc="/assets/icons/search.svg"
                  placeholder="Search tag questions"
                  otherClasses="flex-1"
                />
                
                <Tabs defaultValue={filter || "newest"} className="w-full sm:w-auto">
                  <TabsList className="bg-light-800 dark:bg-dark-300">
                    <TabsTrigger value="newest" asChild>
                      <Link href={`/tags/${id}?filter=newest${q ? `&q=${q}` : ''}`}>
                        <Clock className="h-4 w-4 mr-1" />
                        Newest
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="frequent" asChild>
                      <Link href={`/tags/${id}?filter=frequent${q ? `&q=${q}` : ''}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Frequent
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger value="unanswered" asChild>
                      <Link href={`/tags/${id}?filter=unanswered${q ? `&q=${q}` : ''}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Unanswered
                      </Link>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Featured Question */}
          {questionSearialisation.length > 0 && (
            <div className="relative">
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-2 rounded-full shadow-lg z-10">
                <Zap className="h-4 w-4" />
              </div>
              <Card className="card-wrapper border-2 border-primary-500/30 shadow-md overflow-hidden">
                <div className="h-2 primary-gradient"></div>
                <CardContent className="p-6">
                  <Badge className="bg-primary-500/10 text-primary-500 mb-4">Featured Question</Badge>
                  <QuestionCard
                    key={questionSearialisation[0]._id}
                    _id={questionSearialisation[0]._id}
                    title={questionSearialisation[0].title}
                    tags={questionSearialisation[0].tags}
                    author={questionSearialisation[0].author}
                    upvotes={questionSearialisation[0].upvotes}
                    downvotes={questionSearialisation[0].downvotes}
                    views={questionSearialisation[0].views}
                    answers={questionSearialisation[0].answers}
                    createdAt={questionSearialisation[0].createdAt}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-dark100_light900">
                All Questions
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({questionSearialisation.length})
                </span>
              </h2>
              
              <Link href="/ask-question">
                <Button className="primary-gradient text-white rounded-lg">
                  Ask a Question
                </Button>
              </Link>
            </div>

            {questionSearialisation.length > 0 ? (
              <div className="space-y-4">
                {questionSearialisation.slice(1).map((question: any) => (
                  <Card key={question._id} className="card-wrapper border-none">
                    <CardContent className="p-6">
                      <QuestionCard
                        _id={question._id}
                        title={question.title}
                        tags={question.tags}
                        author={question.author}
                        upvotes={question.upvotes}
                        downvotes={question.downvotes}
                        views={question.views}
                        answers={question.answers}
                        createdAt={question.createdAt}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-wrapper border-none">
                <CardContent className="p-6">
                  <NoResult
                    title="No questions found"
                    description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
                    link="/ask-question"
                    linktitle="Ask a Question"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-10">
            <Suspense key={q} fallback={<div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse"></div>}>
              <Pagination pageNumber={page ? +page : 1} isNext={result.isNext || false} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

