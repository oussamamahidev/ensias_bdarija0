"use client"

import { GlobalSearchFilters } from "@/constants/filters"
import { formUrlQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

const GlobalFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParams = searchParams.get("type")

  const [active, setActive] = useState(typeParams ?? "")

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("")
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: "type",
        Value: null,
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: "type",
        Value: item.toLowerCase(),
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <Suspense>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5">
        <p className="text-dark-100 dark:text-light-900 font-medium text-sm">Filter by:</p>
        <div className="flex flex-wrap gap-2">
          {GlobalSearchFilters.map((item) => (
            <button
              type="button"
              key={item.value}
              className={`
                                relative overflow-hidden rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all duration-300
                                ${
                                  active === item.value
                                    ? "primary-gradient text-white shadow-light-100 dark:shadow-dark-100"
                                    : "bg-light-800 text-dark-100 hover:bg-light-700 dark:bg-dark-300 dark:text-light-900 dark:hover:bg-dark-400"
                                }
                            `}
              onClick={() => handleTypeClick(item.value)}
            >
              {active === item.value && (
                <span className="absolute inset-0 bg-white/20 animate-pulse-slow opacity-0"></span>
              )}
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </Suspense>
  )
}

export default GlobalFilters

