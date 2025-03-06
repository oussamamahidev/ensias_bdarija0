import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import Filter from "@/components/shared/Filter"

import NoResult from "@/components/shared/NoResult"
import QuestionCard from "@/components/cards/QuestionCard"
import { getQuestions } from "@/lib/actions/question.action"

import type { SearchParamsProps } from "@/types"
import { HomePageFilters } from "@/constants/filters"
import HomeFilters from "@/components/home/HomeFilers"
import Pagination from "@/components/shared/search/Pagination"
import LocalSearch from "@/components/shared/search/LocalSearch"


// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FiltersLoading() {
  return <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function QuestionsLoading() {
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-48 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      ))}
    </div>
  )
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
export default async  function Home({searchParams}:HomePageProps) {
  
  const {q,filter,page}= await searchParams;
  const result  = await getQuestions({
    searchQuery: q,
    filter: filter,
    page: parseInt(String(page? + page:1))
  });
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 rounded">Ask a Question</Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearch
            route="/"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for questions..."
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<FiltersLoading />}>
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </Suspense>
      </div>

      <Suspense fallback={<FiltersLoading />}>
        <div className="hidden md:flex">
          <HomeFilters />
        </div>
      </Suspense>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt} downvotes={[]}            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={page ? +page : 1} isNext={result.isNext|| false} />
        </Suspense>
      </div>
    </>
  )
}

