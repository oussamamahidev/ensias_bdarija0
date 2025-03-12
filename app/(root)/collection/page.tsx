import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import Filter from "@/components/shared/Filter"
import { QuestionFilters } from "@/constants/filters"
import { getSavedQuestions } from "@/lib/actions/user.action"
import Pagination from "@/components/shared/search/Pagination"
import LocalSearchbar from "@/components/shared/search/LocalSearch"
import CollectionHeader from "@/components/collection/CollectionHeader"
import CollectionTabs from "@/components/collection/CollectionTabs"
import QuickActions from "@/components/collection/QuickActions"
import CollectionOrganizer from "@/components/collection/CollectionOrganizer"

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
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function CollectionPage({ searchParams }: Props) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }
  const { q, filter, page, view = "list", folder = "all" } = await searchParams

  const result = await getSavedQuestions({
    clerkId: userId,
    filter: filter,
    searchQuery: q,
    page: Number.parseInt(page || "1"),
  })

  // Mock data for statistics
  const statistics = {
    total: result.questions?.length || 0,
    categories: {
      javascript: 5,
      react: 3,
      nextjs: 2,
      other: 1,
    },
    savedThisWeek: 3,
    mostViewed: result.questions?.[0]?.title || "No questions saved",
  }

  // Mock data for folders
  const folders = [
    { id: "all", name: "All Questions", count: result.questions?.length || 0 },
    { id: "important", name: "Important", count: 3 },
    { id: "read-later", name: "Read Later", count: 5 },
    { id: "tutorials", name: "Tutorials", count: 2 },
    { id: "solutions", name: "Solutions", count: 4 },
  ]

  // Mock data for recently viewed
  const recentlyViewed = result.questions?.slice(0, 3) || []

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <CollectionHeader totalQuestions={result.questions?.length || 0} view={view as string} />

      <CollectionOrganizer folders={folders} currentFolder={folder as string} />

      <div className="mt-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearchbar
            route="/collection"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for questions"
            otherClasses="flex-1"
          />
        </Suspense>

        <div className="flex items-center gap-3">
          <Suspense fallback={<FilterLoading />}>
            <Filter filters={QuestionFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
          </Suspense>

          <QuickActions />
        </div>
      </div>

      <CollectionTabs
        questions={result.questions || []}
        recentlyViewed={recentlyViewed}
        statistics={statistics}
        view={view as string}
      />

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
        </Suspense>
      </div>
    </div>
  )
}

