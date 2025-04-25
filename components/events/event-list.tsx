"use client"

import { useState, useEffect } from "react"

import EventCard from "./event-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getEvents } from "@/lib/actions/expert.action"

export default function EventList() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const searchParams = useSearchParams()

  const fetchEvents = async (pageNum: number) => {
    setLoading(true)
    try {
      // Build filter params from URL search params
      const params: any = {
        page: pageNum,
        pageSize: 12,
        status: "approved",
      }

      if (searchParams.get("q")) params.searchQuery = searchParams.get("q")
      if (searchParams.get("country")) params.country = searchParams.get("country")
      if (searchParams.get("type")) params.eventType = searchParams.get("type")
      if (searchParams.get("start")) params.startDate = new Date(searchParams.get("start")!)
      if (searchParams.get("end")) params.endDate = new Date(searchParams.get("end")!)
      if (searchParams.get("tech")) params.technologies = searchParams.get("tech")!.split(",")

      const result = await getEvents(params)

      if (pageNum === 1) {
        setEvents(result.events)
      } else {
        setEvents((prev) => [...prev, ...result.events])
      }

      setHasMore(result.isNext)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchEvents(1)
  }, [searchParams])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchEvents(nextPage)
  }

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later for new events.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button onClick={loadMore} disabled={loading} className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
