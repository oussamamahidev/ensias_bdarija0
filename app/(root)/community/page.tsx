import UserCard from "@/components/cards/UserCard"
import Filter from "@/components/shared/Filter"
import LocalSearchbar from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import Link from "next/link"
import { Suspense } from "react"

interface Props {
  searchParams: { [key: string]: string | undefined }
}

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FilterLoading() {
  return <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function UsersLoading() {
  return (
    <div className="mt-12 flex flex-wrap gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-60 w-[260px] rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      ))}
    </div>
  )
}

export default async function CommunityPage({ searchParams }: Props) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearchbar
            route="/community"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for amazing minds"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<FilterLoading />}>
          <Filter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
        </Suspense>
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-4xl text-center">
            <p>No Users yet</p>
            <Link href="/sign-in" className="mt-2 font-bold text-accent-blue">
              Join to be the first!!
            </Link>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={searchParams.page ? +searchParams.page : 1} isNext={result.isNext} />
        </Suspense>
      </div>
    </div>
  )
}

