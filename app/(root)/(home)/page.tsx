import { Suspense } from "react"
import QuestionCard from "@/components/cards/QuestionCard"

import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"
import { HomePageFilters } from "@/constants/filters"
import { getFeaturedQuestions, getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action"
import Link from "next/link"
import Loading from "./loading"
import { PlusCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@clerk/nextjs/server"
import HomeHero from "@/components/home/HomeHero"
import TrendingTopics from "@/components/home/TrendingTopics"

import FeaturedQuestions from "@/components/home/FeaturedQuestions"
import TopContributors from "@/components/home/TopContributors"

import type { Metadata } from "next"
import HomeFilters from "@/components/home/HomeFilers"
import StatsCounter from "@/components/home/StatusCounter"

export const metadata: Metadata = {
  title: "Home | D2sFlow",
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

async function FeaturedQuestionsContainer() {
  const featuredQuestions = await getFeaturedQuestions()
  return <FeaturedQuestions questions={featuredQuestions} />
}

async function FeaturedQuestionsWrapper() {
  const featuredQuestions = await getFeaturedQuestions()
  return <FeaturedQuestions questions={featuredQuestions} />
}

const showFeaturedSections = true

export default async function Home({ searchParams }: HomePageProps) {
  // Server-side auth
  const { userId } = await auth()
  let result

  const { q, filter, page } = await searchParams

  if (filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: q,
        page: Number.parseInt(page || "1"),
      })
    } else {
      result = {
        questions: [],
        isNext: false,
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: q,
      filter: filter,
      page: Number.parseInt(page || "1"),
    })
  }

  // Use JSON.parse(JSON.stringify()) to safely serialize MongoDB data
  // This is a simple way to convert MongoDB objects to plain JavaScript objects
  const serializedQuestions = JSON.parse(JSON.stringify(result.questions))

  // Mock stats for the counter component
  const stats = {
    questions: 15423,
    answers: 32876,
    users: 8954,
    tags: 1243,
  }

  // Check if we should show featured sections
  const showFeaturedSections = !q && !filter && page === undefined

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <Suspense
        fallback={<div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-2xl" />}
      >
        <HomeHero hasUserId={!!userId} />
      </Suspense>

      {/* Stats Counter */}
      <Suspense
        fallback={<div className="h-24 w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-xl mt-8" />}
      >
        <StatsCounter stats={stats} />
      </Suspense>

      {/* Trending Topics */}
      <Suspense
        fallback={<div className="h-32 w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-xl mt-8" />}
      >
        <TrendingTopics />
      </Suspense>

      {/* Questions Section Header */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center mt-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400 animate-text flex items-center gap-2">
          <TrendingUp className="h-7 w-7" />
          Browse Questions
        </h2>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 min-h-[46px] px-5 py-3 text-light-900 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium">
            <PlusCircle size={18} />
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense
          fallback={<div className="flex-1 h-[56px] bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}
        >
          <LocalSearch
            route="/"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search questions..."
            otherClasses="flex-1"
          />
        </Suspense>
        <Suspense
          fallback={<div className="h-[56px] w-[170px] bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}
        >
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </Suspense>
      </div>

      <Suspense
        fallback={<div className="mt-8 h-14 w-full bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}
      >
        <div className="mt-6">
          <HomeFilters />
        </div>
      </Suspense>

      {showFeaturedSections && (
        <Suspense
          fallback={<div className="mt-10 h-60 w-full bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}
        >
          {/* @ts-ignore */}
          <FeaturedQuestionsContainer />
        </Suspense>
      )}

      {/* Regular Questions Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6">
        {serializedQuestions.length > 0 ? (
          serializedQuestions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
              currentUserId={userId}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </div>

      {/* Top Contributors Section */}
      {showFeaturedSections && (
        <Suspense
          fallback={<div className="mt-16 h-60 w-full bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}
        >
          <TopContributors />
        </Suspense>
      )}

      <div className="mt-10">
        <Suspense fallback={<Loading />}>
          <Pagination pageNumber={page ? +page : 1} isNext={result.isNext || false} />
        </Suspense>
      </div>
    </div>
  )
}

