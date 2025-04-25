"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Search, Filter, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getEventCountries, getEventTechnologies } from "@/lib/actions/expert.action"


export default function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const [countries, setCountries] = useState<string[]>([])
  const [technologies, setTechnologies] = useState<string[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

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

    router.push(`/events?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCountry("")
    setEventType("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedTechnologies([])
    router.push("/events")
  }

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>

      {isFiltersOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
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
            <Label htmlFor="event-type">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger id="event-type">
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

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
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
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
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
      )}

      {isFiltersOpen && (
        <div className="mt-4">
          <Label>Technologies</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {technologies.slice(0, 20).map((tech) => (
              <Badge
                key={tech}
                variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTechnology(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {(searchQuery || country || eventType || startDate || endDate || selectedTechnologies.length > 0) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {country && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Country: {country}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setCountry("")} />
              </Badge>
            )}
            {eventType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {eventType}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setEventType("")} />
              </Badge>
            )}
            {startDate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                From: {format(startDate, "PP")}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setStartDate(undefined)} />
              </Badge>
            )}
            {endDate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                To: {format(endDate, "PP")}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setEndDate(undefined)} />
              </Badge>
            )}
            {selectedTechnologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedTechnologies((prev) => prev.filter((t) => t !== tech))}
                />
              </Badge>
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
