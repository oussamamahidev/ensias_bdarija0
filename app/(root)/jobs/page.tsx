import { Suspense } from "react"
import JobCard from "@/components/cards/JobCard"
import JobsFilter from "@/components/jobs/JobFilter"
import { FILTER_SEARCH_PARAMS_KEY, QUERY_SEARCH_PARAMS_KEY } from "@/constants"
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.action"
import type { SearchParamsProps } from "@/types"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FilterLoading() {
  return <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function JobsLoading() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-48 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      ))}
    </div>
  )
}

const generateJobSearchQuery = (userLocation: string, searchParams?: { [key: string]: string | undefined }) => {
  if (searchParams) {
    if (
      QUERY_SEARCH_PARAMS_KEY in searchParams &&
      searchParams[QUERY_SEARCH_PARAMS_KEY] &&
      FILTER_SEARCH_PARAMS_KEY in searchParams &&
      searchParams[FILTER_SEARCH_PARAMS_KEY]
    ) {
      return `${searchParams[QUERY_SEARCH_PARAMS_KEY]} in ${searchParams[FILTER_SEARCH_PARAMS_KEY]}`
    } else if (QUERY_SEARCH_PARAMS_KEY in searchParams && searchParams[QUERY_SEARCH_PARAMS_KEY]) {
      return `${searchParams[QUERY_SEARCH_PARAMS_KEY]}`
    } else if (FILTER_SEARCH_PARAMS_KEY in searchParams && searchParams[FILTER_SEARCH_PARAMS_KEY]) {
      return `Software Developer in ${searchParams[FILTER_SEARCH_PARAMS_KEY]}`
    }
  }
  if (userLocation.trim().length === 0) {
    return "Software Developer"
  }
  return `Software Developer in ${userLocation}`
}

export default async function Jobs({ searchParams }: SearchParamsProps) {
  // Fetch user location
  const userLocation = await fetchLocation()

  // Get page number from search params
  const page = searchParams.page || "1"

  // Generate search query
  const query = generateJobSearchQuery(userLocation, searchParams)
  console.log("Search query:", query) // Debug log

  // Fetch jobs with the generated query
  const jobs = await fetchJobs({
    query,
    page,
  })
  console.log("Jobs found:", jobs.length) // Debug log

  // Fetch countries for the filter
  const countries = await fetchCountries()

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearch
            route="/jobs"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Job Title, Company or Keywords"
            otherClasses="flex-1"
          />
        </Suspense>

        <Suspense fallback={<FilterLoading />}>
          <JobsFilter filters={countries} otherClasses="min-h-[56px] sm:min-w-[170px]" />
        </Suspense>
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            if (job.jobTitle && job.jobTitle.toLowerCase() !== "undefined") {
              return <JobCard key={job.id} job={job} />
            }
            return null
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>Oops! We couldn&apos;t find any jobs at the moment.</p>
            <p className="mt-2">This could be due to:</p>
            <ul className="mt-2 list-disc pl-5 text-left">
              <li>API rate limits - The job search API has limited free requests</li>
              <li>Search query too specific - Try a more general search term</li>
              <li>Location issues - Try selecting a different location</li>
            </ul>
            <p className="mt-4">Try again with different search parameters or check back later.</p>
          </div>
        )}
      </section>

      {jobs.length > 0 && (
        <div className="mt-10">
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
            <Pagination pageNumber={Number.parseInt(page)} isNext={jobs.length === 10} />
          </Suspense>
        </div>
      )}
    </>
  )
}

