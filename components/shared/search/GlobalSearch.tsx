"use client"

import type React from "react"

import { Suspense, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import GlobalResult from "./GlobalResult"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const GlobalSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchContainerRef = useRef(null)

  const query = searchParams.get("global")
  const [search, setSearch] = useState(query ?? "")
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        //@ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    setIsOpen(false)
    document.addEventListener("click", handleOutsideClick)

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [pathname])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          Key: "global",
          Value: search,
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            Keys: ["global", "type"],
          })
          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, router, pathname, searchParams, query])

  const handleClear = () => {
    setSearch("")
    setIsOpen(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setIsFocused(false)
    }
  }

  return (
    <Suspense>
      <div className="relative w-full" ref={searchContainerRef}>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-[2px] z-0 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={`relative flex items-center gap-1 rounded-xl px-4 py-2.5 
            ${
              isFocused
                ? "bg-white dark:bg-dark-400 shadow-light-100 dark:shadow-dark-100 ring-2 ring-primary-500/50 scale-[1.02]"
                : "bg-light-800 dark:bg-dark-400"
            } transition-all duration-300 ease-in-out z-10`}
        >
          <Search
            size={18}
            className={`${isFocused ? "text-primary-500" : "text-light-400 dark:text-gray-400"} min-w-[18px] transition-colors duration-200`}
          />

          <Input
            type="text"
            placeholder="Search globally..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (!isOpen && e.target.value) setIsOpen(true)
              if (e.target.value === "" && isOpen) setIsOpen(false)
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className="border-none bg-transparent shadow-none outline-none text-dark-100 dark:text-light-900 placeholder:text-light-400 dark:placeholder:text-gray-400 text-sm no-focus"
          />

          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 rounded-full p-0 hover:bg-light-700 dark:hover:bg-dark-300 transition-colors duration-200"
            >
              <X size={14} className="text-light-400 dark:text-gray-400" />
            </Button>
          )}
        </div>

        {isOpen && search && (
          <div className="absolute top-full left-0 right-0 mt-2 z-20 animate-slide-up">
            <GlobalResult />
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default GlobalSearch

