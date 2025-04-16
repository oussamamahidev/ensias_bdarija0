import { Suspense } from "react"
import JobCard from "@/components/cards/JobCard"
import JobsFilter from "@/components/jobs/JobFilter"
import { FILTER_SEARCH_PARAMS_KEY, QUERY_SEARCH_PARAMS_KEY } from "@/constants"
import { fetchCountries, fetchJobs, fetchLocation } from "@/lib/actions/job.action"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"
import NoResult from "@/components/shared/NoResult"
import JobsHero from "@/components/jobs/JobsHero"
import JobsStats from "@/components/jobs/JobsStats"
import { Briefcase, MapPin, TrendingUp } from "lucide-react"

// Loading fallbacks
function SearchbarLoading() {
  return (
    <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse">
      <div className="h-full w-[70%] rounded-l-lg bg-light-800 dark:bg-dark-400 animate-pulse"></div>
    </div>
  )
}

function FilterLoading() {
  return (
    <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse">
      <div className="h-full w-[30%] rounded-l-lg bg-light-800 dark:bg-dark-400 animate-pulse"></div>
    </div>
  )
}

function JobsLoading() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-48 w-full rounded-xl bg-light-700 dark:bg-dark-500 animate-pulse overflow-hidden">
          <div className="h-1/3 w-full bg-light-800 dark:bg-dark-400 animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

const generateJobSearchQuery = (
  userLocation: string,
  resolvedSearchParams: { [key: string]: string | string[] | undefined },
) => {
  if (
    QUERY_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY] &&
    FILTER_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]
  ) {
    return `${resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]} in ${resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]}`
  } else if (QUERY_SEARCH_PARAMS_KEY in resolvedSearchParams && resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]) {
    return `${resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]}`
  } else if (FILTER_SEARCH_PARAMS_KEY in resolvedSearchParams && resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]) {
    return `Software Developer in ${resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]}`
  }

  if (userLocation.trim().length === 0) {
    return "Software Developer"
  }
  return `Software Developer in ${userLocation}`
}

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams before using it
  const resolvedSearchParams = await searchParams

  // Fetch user location
  const userLocation = await fetchLocation()

  // Get page number from search params
  const page = resolvedSearchParams.page?.toString() || "1"

  // Generate search query with resolved searchParams
  const query = generateJobSearchQuery(userLocation, resolvedSearchParams)
  console.log("Search query:", query) // Debug log

  // Fetch jobs with the generated query
  const jobs = await fetchJobs({
    query,
    page,
  })
  console.log("Jobs found:", jobs.length) // Debug log

  // Fetch countries for the filter
  const countries = await fetchCountries()

  // Popular job categories for quick filters
  const popularCategories = ["Remote", "Full-time", "Part-time", "Contract", "Internship"]

  return (
    <div className="space-y-8">
      <JobsHero
        query={query}
        jobCount={jobs.length}
        location={resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]?.toString() || userLocation}
      />

      <div className="mt-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearch
            route="/jobs"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Job Title, Company or Keywords"
            otherClasses="flex-1 shadow-sm hover:shadow transition-all duration-300"
          />
        </Suspense>

        <Suspense fallback={<FilterLoading />}>
          <JobsFilter
            filters={countries}
            otherClasses="min-h-[56px] sm:min-w-[170px] shadow-sm hover:shadow transition-all duration-300"
          />
        </Suspense>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {popularCategories.map((category) => (
          <button
            key={category}
            className="flex items-center gap-1.5 rounded-full bg-light-800 dark:bg-dark-300 px-4 py-2 text-sm font-medium text-dark-400 dark:text-light-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-all duration-300"
          >
            {category === "Remote" ? <MapPin size={14} /> : <Briefcase size={14} />}
            {category}
          </button>
        ))}
      </div>

      <JobsStats />

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="h3-bold text-dark100_light900">Available Positions</h2>
          {jobs.length > 0 && (
            <div className="flex items-center gap-2 text-primary-500">
              <TrendingUp size={16} />
              <span className="body-medium">{jobs.length} jobs found</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              if (job.jobTitle && job.jobTitle.toLowerCase() !== "undefined") {
                return <JobCard key={job.id} job={job} />
              }
              return null
            })
          ) : (
            <NoResult
              link="/jobs"
              title="No matching jobs found"
              description="Try adjusting your search criteria or location filter. Our job database updates regularly, so check back soon!"
              linktitle="Browse all jobs"
            />
          )}
        </div>
      </section>

      {jobs.length > 0 && (
        <div className="mt-10">
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
            <Pagination pageNumber={Number.parseInt(page)} isNext={jobs.length === 10} />
          </Suspense>
        </div>
      )}
    </div>
  )
}

