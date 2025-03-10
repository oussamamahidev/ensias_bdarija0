import { Suspense } from "react"
import Filter from "@/components/shared/Filter"
import { QuestionFilters } from "@/constants/filters"
import NoResult from "@/components/shared/NoResult"
import QuestionCard from "@/components/cards/QuestionCard"
import { getSavedQuestions } from "@/lib/actions/user.action"
import Pagination from "@/components/shared/search/Pagination"
import LocalSearchbar from "@/components/shared/search/LocalSearch"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

// import type { SearchParamsProps } from "@/types"

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FilterLoading() {
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

interface Props {
  searchParams: { [key: string]: string | undefined }
}

export default async function CollectionPage({ searchParams }: Props) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearchbar
            route="/collection"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for questions"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<FilterLoading />}>
          <Filter filters={QuestionFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
        </Suspense>
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions?.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="There's no saved questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={searchParams.page ? +searchParams.page : 1} isNext={result.isNext} />
        </Suspense>
      </div>
    </div>
  )
}

