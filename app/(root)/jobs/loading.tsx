export default function Loading() {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-10 w-1/3 rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
  
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col">
          <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
          <div className="h-14 w-40 rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
        </div>
  
        <div className="mt-12 flex flex-col gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-48 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }
  
  