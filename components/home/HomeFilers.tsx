"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HomePageFilters } from "@/constants/filters"
import { Button } from "@/components/ui/button"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"

const HomeFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [active, setActive] = useState("")

  useEffect(() => {
    const filterParam = searchParams.get("filter")
    if (filterParam) {
      setActive(filterParam)
    } else {
      setActive("")
    }
  }, [searchParams])

  const handleFilterClick = (value: string) => {
    if (active === value) {
      setActive("")
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        Keys: ["filter"],
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(value)
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: "filter",
        Value: value,
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => handleFilterClick(filter.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  )
}

export default HomeFilters

