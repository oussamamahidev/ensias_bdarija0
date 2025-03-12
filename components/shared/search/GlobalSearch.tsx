"use client"

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

  return (
    <Suspense>
      <div className="relative w-full" ref={searchContainerRef}>
        <div
          className={`relative flex items-center gap-1 rounded-xl px-4 py-2.5 bg-gray-100 dark:bg-gray-800 ${
            isFocused ? "ring-2 ring-primary-500/50" : ""
          } transition-all duration-200`}
        >
          <Search size={18} className="text-gray-500 dark:text-gray-400 min-w-[18px]" />

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
            className="border-none bg-transparent shadow-none outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
          />

          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 rounded-full p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={14} className="text-gray-500 dark:text-gray-400" />
            </Button>
          )}
        </div>

        {isOpen && search && (
          <div className="absolute top-full left-0 right-0 mt-1 z-10">
            <GlobalResult />
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default GlobalSearch

