/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "./event-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getEvents } from "@/lib/actions/expert.action";

export default function EventList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  const fetchEvents = async (pageNum: number) => {
    setLoading(true);
    try {
      // Build filter params from URL search params
      const params: any = {
        page: pageNum,
        pageSize: 12,
        status: "approved",
      };

      if (searchParams.get("q")) params.searchQuery = searchParams.get("q");
      if (searchParams.get("country"))
        params.country = searchParams.get("country");
      if (searchParams.get("type")) params.eventType = searchParams.get("type");
      if (searchParams.get("start"))
        params.startDate = new Date(searchParams.get("start")!);
      if (searchParams.get("end"))
        params.endDate = new Date(searchParams.get("end")!);
      if (searchParams.get("tech"))
        params.technologies = searchParams.get("tech")!.split(",");

      // Add showExpired parameter
      if (searchParams.get("showExpired") !== "true") {
        // If not showing expired events, only get events with end dates >= today
        params.minEndDate = new Date();
      }

      const result = await getEvents(params);

      if (pageNum === 1) {
        setEvents(result.events);
      } else {
        setEvents((prev) => [...prev, ...result.events]);
      }

      setHasMore(result.isNext);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchEvents(1);
  }, [searchParams]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-600 font-medium">
            Loading
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          No events found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your filters or check back later for new events.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}
