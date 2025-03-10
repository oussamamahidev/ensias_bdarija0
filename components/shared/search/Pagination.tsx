"use client"

import { formUrlQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { PAGE_NUMBER_SEARCH_PARAMS_KEY } from "@/constants"
import { Suspense, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  pageNumber: number
  isNext: boolean
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNavigation = useCallback(
    (direction: string) => {
      const nextPageNumber = direction === "prev" ? pageNumber - 1 : pageNumber + 1

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: PAGE_NUMBER_SEARCH_PARAMS_KEY,
        Value: nextPageNumber.toString(),
      })

      router.push(newUrl, { scroll: false })
    },
    [pageNumber, router, searchParams],
  )

  if (!isNext && pageNumber === 1) return null

  return (
    <Suspense>
      <div className="flex w-full items-center justify-center gap-2">
        <Button
          disabled={pageNumber === 1}
          onClick={() => handleNavigation("prev")}
          variant="outline"
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60"
        >
          <ChevronLeft size={16} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Previous</span>
        </Button>

        <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-orange-400 px-4 py-2.5 shadow-sm">
          <p className="text-sm font-semibold text-white">{pageNumber}</p>
        </div>

        <Button
          disabled={!isNext}
          onClick={() => handleNavigation("next")}
          variant="outline"
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </Suspense>
  )
}

export default Pagination

