"use client"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import GlobalFilters from "./GlobalFilters"
import { globalSearch } from "@/lib/actions/general.action"

// Define the type for search result items
interface SearchResultItem {
  id: string
  type: string
  title: string
  // Add other properties as needed
}

const GlobalResult = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const global = searchParams.get("global")
  const [result, setResult] = useState<SearchResultItem[]>([])
  const type = searchParams.get("type")
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    const fetchResult = async () => {
      setResult([])
      setIsLoading(true)
      try {
        const res = await globalSearch({
          query: global,
          type,
        })
        setResult(JSON.parse(res))
      } catch (error) {
        console.log(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }
    if (global) {
      fetchResult()
    }
  }, [global, type])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < result.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < result.length) {
        const item = result[selectedIndex]
        const url = renderLink(item.type, item.id)
        router.push(url)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [result, selectedIndex, router])

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`
      case "answer":
        return `/question/${id}`
      case "user":
        return `/profile/${id}`
      case "tag":
        return `/tags/${id}`
      default:
        return "/"
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "question":
        return "/assets/icons/tag.svg"
      case "answer":
        return "/assets/icons/tag.svg"
      case "user":
        return "/assets/icons/tag.svg"
      case "tag":
        return "/assets/icons/tag.svg"
      default:
        return "/assets/icons/tag.svg"
    }
  }

  return (
    <Suspense>
      <div className="rounded-xl card-wrapper overflow-hidden border border-light-700 dark:border-dark-400 custom-scrollbar">
        <GlobalFilters />
        <div className="my-3 h-[1px] bg-light-700 dark:bg-dark-400" />

        <div className="space-y-2 pb-2">
          <p className="text-dark-100 dark:text-light-900 font-medium text-xs uppercase tracking-wider px-5 py-2">
            Search Results
          </p>

          {isLoading ? (
            <div className="flex-center flex-col px-5 py-10">
              <div className="h-10 w-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin-slow" />
              <p className="text-dark-100 dark:text-light-800 text-sm mt-4 text-center">Searching for matches...</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {result.length > 0 ? (
                result.map((item: SearchResultItem, index: number) => (
                  <Link
                    href={renderLink(item.type, item.id)}
                    key={item.type + item.id + index}
                    className={`flex w-full cursor-pointer items-start gap-3 px-5 py-3 transition-colors duration-200
                      ${
                        selectedIndex === index
                          ? "bg-primary-100 dark:bg-dark-300"
                          : "hover:bg-light-800 dark:hover:bg-dark-400"
                      }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        selectedIndex === index ? "bg-primary-100 dark:bg-dark-300" : "bg-light-800 dark:bg-dark-400"
                      }`}
                    >
                      <Image
                        src={getIconForType(item.type) || "/placeholder.svg"}
                        alt={item.type}
                        width={16}
                        height={16}
                        className="object-contain invert-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p
                        className={`line-clamp-1 font-medium ${
                          selectedIndex === index ? "primary-text-gradient" : "text-dark-100 dark:text-light-900"
                        }`}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-light-800 dark:bg-dark-300 text-dark-100 dark:text-light-900 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex-center flex-col px-5 py-10">
                  <div className="rounded-full bg-light-800 dark:bg-dark-300 p-3">
                    <p className="text-2xl">🔍</p>
                  </div>
                  <p className="text-dark-100 dark:text-light-800 text-sm mt-4 text-center">
                    No results found. Try a different search term.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default GlobalResult

