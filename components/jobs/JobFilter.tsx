"use client"

import { FILTER_SEARCH_PARAMS_KEY } from "@/constants"
import { formUrlQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

interface Props {
  filters: string[]
  otherClasses?: string
  containerClasses?: string
}

const JobsFilter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramFilter = searchParams.get(FILTER_SEARCH_PARAMS_KEY)

  const handleUpdateParams = useCallback(
    (value: string) => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        Key: FILTER_SEARCH_PARAMS_KEY,
        Value: value,
      })
      router.push(newUrl, { scroll: false })
    },
    [router, searchParams],
  )

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramFilter || undefined}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 flex items-center gap-3 border px-4 py-2.5 rounded-lg`}
        >
          <MapPin className="h-5 w-5 text-primary-500" />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select Location" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300 rounded-lg shadow-md">
          <SelectGroup>
            {filters.length === 0 ? (
              <SelectItem value="No results found">No results found</SelectItem>
            ) : (
              filters.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="line-clamp-1 cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                >
                  {item}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default JobsFilter

