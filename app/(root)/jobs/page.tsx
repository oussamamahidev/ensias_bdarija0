import { Suspense } from "react";
import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/jobs/JobFilter";
import { FILTER_SEARCH_PARAMS_KEY, QUERY_SEARCH_PARAMS_KEY } from "@/constants";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import type { SearchParamsProps } from "@/types";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Pagination from "@/components/shared/search/Pagination";
import NoResult from "@/components/shared/NoResult";

// Loading fallbacks
function SearchbarLoading() {
  return (
    <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
  );
}

function FilterLoading() {
  return (
    <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
  );
}

function JobsLoading() {
  return (
    <div className="mt-12 flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-48 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse"
        />
      ))}
    </div>
  );
}

const generateJobSearchQuery = (
  userLocation: string,
  resolvedSearchParams: { [key: string]: string | string[] | undefined }
) => {
  if (
    QUERY_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY] &&
    FILTER_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]
  ) {
    return `${resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]} in ${resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]}`;
  } else if (
    QUERY_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]
  ) {
    return `${resolvedSearchParams[QUERY_SEARCH_PARAMS_KEY]}`;
  } else if (
    FILTER_SEARCH_PARAMS_KEY in resolvedSearchParams &&
    resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]
  ) {
    return `Software Developer in ${resolvedSearchParams[FILTER_SEARCH_PARAMS_KEY]}`;
  }

  if (userLocation.trim().length === 0) {
    return "Software Developer";
  }
  return `Software Developer in ${userLocation}`;
};

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams before using it
  const resolvedSearchParams = await searchParams;

  // Fetch user location
  const userLocation = await fetchLocation();

  // Get page number from search params
  const page = resolvedSearchParams.page?.toString() || "1";

  // Generate search query with resolved searchParams
  const query = generateJobSearchQuery(userLocation, resolvedSearchParams);
  console.log("Search query:", query); // Debug log

  // Fetch jobs with the generated query
  const jobs = await fetchJobs({
    query,
    page,
  });
  console.log("Jobs found:", jobs.length); // Debug log

  // Fetch countries for the filter
  const countries = await fetchCountries();

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
          <JobsFilter
            filters={countries}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </Suspense>
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            if (job.jobTitle && job.jobTitle.toLowerCase() !== "undefined") {
              return <JobCard key={job.id} job={job} />;
            }
            return null;
          })
        ) : (
          <NoResult
            link="/jobs"
            title="Oops! We couldn't find any jobs at the moment"
            description="API rate limits - The job search API has limited free requests  Search query too specific - Try a more general search term"
            linktitle="Try again with different search"
          />
        )}
      </section>

      {jobs.length > 0 && (
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />
            }
          >
            <Pagination
              pageNumber={Number.parseInt(page)}
              isNext={jobs.length === 10}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
