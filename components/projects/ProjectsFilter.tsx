/* "use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, ArrowUpDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils"

const ProjectsFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const currentSort = searchParams.get("sort") || "newest"

  const handleSortChange = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      Key: "sort",
      Value: value,
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={isFilterOpen ? "bg-primary/10" : ""}
      >
        <Filter className="h-4 w-4" />
      </Button>

      <Select defaultValue={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-10">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="most-stars">Most Stars</SelectItem>
          <SelectItem value="most-forks">Most Forks</SelectItem>
          <SelectItem value="recently-updated">Recently Updated</SelectItem>
          <SelectItem value="most-complete">Most Complete</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ProjectsFilter

 */