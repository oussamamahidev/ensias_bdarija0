import { Suspense } from "react"
import Filter from "@/components/shared/Filter"
import NoResult from "@/components/shared/NoResult"

import { TagFilters } from "@/constants/filters"
import { getAllTags } from "@/lib/actions/tag.actions"
import Link from "next/link"

import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FilterLoading() {
  return <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function TagsLoading() {
  return (
    <div className="mt-12 flex flex-wrap gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-48 w-[260px] rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      ))}
    </div>
  )
}
interface HomePageProps {
  searchParams: Promise<{ [q: string]: string | undefined }>;
}
const page = async ({searchParams}:HomePageProps) => {

  const {q,filter,page}= await searchParams;
    const result = await getAllTags({
      searchQuery: q,
      filter: filter,
      page: parseInt(page || "1"),
    }) 
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearch
            route="/tags"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for tags"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<FilterLoading />}>
          <Filter filters={TagFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
        </Suspense>
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link href={`/tags/${tag._id}`} key={tag._id} className="shadow-light100_darknone">
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark300 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">{tag.name}</p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold text-primary-500 mr-2.5">{tag.questions.length}+</span>Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found.."
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </section>

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
        </Suspense>
      </div>
    </>
  )
}


export default page;