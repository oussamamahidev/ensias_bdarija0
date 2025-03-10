export default function Loading() {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="h-12 w-52 bg-light-700 dark:bg-dark-500 animate-pulse rounded-lg mb-8" />

      <div className="mt-9 flex w-full flex-col gap-6">
        <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
        <div className="h-64 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
        <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
        <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      </div>
    </div>
  )
}

