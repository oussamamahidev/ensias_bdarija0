import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        {/* Search bar loading skeleton */}
        <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse flex-1" />
        
        {/* Filter loading skeleton */}
        <div className="h-10 w-full sm:min-w-[170px] rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      </div>

      {/* Jobs loading skeletons */}
      <div className="mt-12 flex flex-col gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:p-8">
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-6">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-2xl" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex w-full justify-between">
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination loading skeleton */}
      <div className="mt-10">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>
      </div>
    </>
  )
}