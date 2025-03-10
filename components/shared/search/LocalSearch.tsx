"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface LocalSearchbarProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherClasses?: string
}

const LocalSearchbar = ({ route, iconPosition, imgSrc, placeholder, otherClasses }: LocalSearchbarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const query = searchParams.get("q")
  const [search, setSearch] = useState(query || "")
  const [isSearching, setIsSearching] = useState(false)

  // Increase debounce time to reduce API calls
  const DEBOUNCE_TIME = 500 // ms

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (search) {
      setIsSearching(true)
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: "q",
        Value: search,
      })
      router.push(newUrl)

      // Reset page number when searching
      if (searchParams.has("page")) {
        const resetPageUrl = removeKeysFromQuery({
          params: newUrl,
          Keys: ["page"],
        })
        router.push(resetPageUrl, { scroll: false })
      }
    }
  }

  const handleClear = () => {
    setSearch("")
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      Keys: ["q", "page"],
    })
    router.push(newUrl, { scroll: false })
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        setIsSearching(true)
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          Key: "q",
          Value: search,
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            Keys: ["q"],
          })
          router.push(newUrl, { scroll: false })
        }
      }
      setIsSearching(false)
    }, DEBOUNCE_TIME)

    return () => clearTimeout(delayDebounceFn)
  }, [search, router, pathname, searchParams, query])

  return (
    <div
      ref={searchContainerRef}
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ${otherClasses}`}
    >
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        {iconPosition === "left" && <Search size={24} className="text-dark-400 dark:text-light-500" />}

        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />

        {search && (
          <Button type="button" onClick={handleClear} size="icon" variant="ghost" className="h-8 w-8 rounded-full p-0">
            <X size={18} className="text-dark-400 dark:text-light-500" />
          </Button>
        )}

        <Button type="submit" size="sm" className="ml-1 hidden h-9 rounded-xl sm:flex text-dark200_light800" disabled={isSearching}>
          Search
        </Button>
      </form>
    </div>
  )
}

export default LocalSearchbar

