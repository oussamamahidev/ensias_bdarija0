"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Search, Filter, X, SlidersHorizontal } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getEventCountries, getEventTechnologies } from "@/lib/actions/expert.action"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-mobile"
import { FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

export default function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [country, setCountry] = useState(searchParams.get("country") || "")
  const [eventType, setEventType] = useState(searchParams.get("type") || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("start") ? new Date(searchParams.get("start")!) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("end") ? new Date(searchParams.get("end")!) : undefined,
  )
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    searchParams.get("tech") ? searchParams.get("tech")!.split(",") : [],
  )
  const [showExpired, setShowExpired] = useState(searchParams.get("showExpired") === "true")

  const [countries, setCountries] = useState<string[]>([])
  const [technologies, setTechnologies] = useState<string[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const countriesList = await getEventCountries()
        const techList = await getEventTechnologies()

        setCountries(countriesList)
        setTechnologies(techList)
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (country) params.set("country", country)
    if (eventType) params.set("type", eventType)
    if (startDate) params.set("start", startDate.toISOString())
    if (endDate) params.set("end", endDate.toISOString())
    if (selectedTechnologies.length > 0) params.set("tech", selectedTechnologies.join(","))
    if (showExpired) params.set("showExpired", "true")

    router.push(`/events?${params.toString()}`)
    if (isMobile) setIsDrawerOpen(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCountry("")
    setEventType("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedTechnologies([])
    setShowExpired(false)
    router.push("/events")
    if (isMobile) setIsDrawerOpen(false)
  }

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country" className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Country
          </Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger
              id="country"
              className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600"
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="event-type" className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Event Type
          </Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger
              id="event-type"
              className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="hackathon">Hackathon</SelectItem>
              <SelectItem value="meetup">Meetup</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600",
                  !startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">Technologies</Label>
        <div className="mt-2 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
          {technologies.slice(0, 30).map((tech) => (
            <Badge
              key={tech}
              variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                selectedTechnologies.includes(tech)
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white hover:bg-purple-50 text-purple-700 border-purple-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-purple-300 dark:border-gray-600",
              )}
              onClick={() => toggleTechnology(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 dark:border-gray-600 p-4 bg-purple-50 dark:bg-gray-700/30">
        <div className="space-y-0.5">
          <FormLabel className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Show Expired Events
          </FormLabel>
          <p className="text-sm text-muted-foreground">Include events that have already taken place</p>
        </div>
        <Switch checked={showExpired} onCheckedChange={setShowExpired} className="data-[state=checked]:bg-purple-600" />
      </FormItem>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
        >
          Clear All
        </Button>
        <Button onClick={applyFilters} className="bg-purple-600 hover:bg-purple-700 text-white">
          Apply Filters
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-purple-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
            <Input
              id="search"
              placeholder="Search events..."
              className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
        </div>

        {isMobile ? (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">Filter Events</h3>
                <FiltersContent />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isFiltersOpen ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button onClick={applyFilters} className="bg-purple-600 hover:bg-purple-700 text-white">
              Apply Filters
            </Button>
          </>
        )}
      </div>

      {isFiltersOpen && !isMobile && (
        <div className="mt-4 p-4 bg-purple-50 dark:bg-gray-700/30 rounded-lg">
          <FiltersContent />
        </div>
      )}

      {(searchQuery ||
        country ||
        eventType ||
        startDate ||
        endDate ||
        selectedTechnologies.length > 0 ||
        showExpired) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium mr-1">Active filters:</span>
          {searchQuery && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {country && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Country: {country}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setCountry("")} />
            </Badge>
          )}
          {eventType && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Type: {eventType}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setEventType("")} />
            </Badge>
          )}
          {startDate && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              From: {format(startDate, "PP")}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setStartDate(undefined)} />
            </Badge>
          )}
          {endDate && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              To: {format(endDate, "PP")}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setEndDate(undefined)} />
            </Badge>
          )}
          {selectedTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {tech}
              <X
                className="h-3 w-3 cursor-pointer ml-1"
                onClick={() => setSelectedTechnologies((prev) => prev.filter((t) => t !== tech))}
              />
            </Badge>
          ))}
          {showExpired && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Show Expired
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setShowExpired(false)} />
            </Badge>
          )}

          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-gray-700"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
