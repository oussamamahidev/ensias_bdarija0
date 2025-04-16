"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formUrlQuery } from "@/lib/utils"
import type { IFilterOptions } from "@/types"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterIcon } from "lucide-react"

interface Props {
  filters: IFilterOptions[]
  otherClasses?: string
  containerClasses?: string
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paramFilter = searchParams.get("filter")

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      Key: "filter",
      Value: value,
    })
    router.push(newUrl, { scroll: false })
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramFilter || undefined}>
        <SelectTrigger
          className={`${otherClasses} flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:ring-2 focus:ring-primary-500/30 shadow-sm`}
        >
          <FilterIcon size={16} className="text-gray-500 dark:text-gray-400" />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-fade-in">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="cursor-pointer text-sm py-2.5 px-3.5 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-primary-500 dark:focus:text-primary-400 transition-colors duration-150"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Filter

