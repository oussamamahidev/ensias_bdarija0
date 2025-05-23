/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";
import { getEvents } from "@/lib/actions/expert.action";
import { Card } from "@/components/ui/card";

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

interface Event {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  country: string;
  technologies: string[];
  eventType: string;
  isVirtual: boolean;
}

export default function EventCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch all approved events
        const result = await getEvents({
          pageSize: 100, // Get a larger number for the calendar view
          status: "approved",
        });

        // Format events for the calendar
        const formattedEvents = result.events.map((event: Event) => ({
          id: event._id,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          resource: event,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (event: any) => {
    router.push(`/events/${event.id}`);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3174ad";
    const isExpired = new Date() > new Date(event.end);

    // Different colors based on event type
    switch (event.resource.eventType.toLowerCase()) {
      case "conference":
        backgroundColor = "#4f46e5"; // indigo
        break;
      case "webinar":
        backgroundColor = "#10b981"; // emerald
        break;
      case "hackathon":
        backgroundColor = "#f59e0b"; // amber
        break;
      case "meetup":
        backgroundColor = "#8b5cf6"; // violet
        break;
      case "workshop":
        backgroundColor = "#ec4899"; // pink
        break;
      default:
        backgroundColor = "#6b7280"; // gray
    }

    const style = {
      backgroundColor: isExpired ? "#9ca3af" : backgroundColor, // Gray for expired events
      borderRadius: "6px",
      opacity: isExpired ? 0.7 : 0.9,
      color: "white",
      border: "0px",
      display: "block",
      fontWeight: "500",
      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
    };

    return {
      style,
    };
  };

  if (loading) {
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

  return (
    <Card className="h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-none">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day", "agenda"]}
        popup
        tooltipAccessor={(event: any) => event.resource.title}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </Card>
  );
}

// Custom toolbar component
function CustomToolbar({ label, onNavigate, onView, views }: any) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md dark:text-purple-400 dark:hover:bg-gray-700/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md dark:text-purple-400 dark:hover:bg-gray-700/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <span className="text-lg font-medium text-purple-700 dark:text-purple-300">
          {label}
        </span>
      </div>

      <div className="flex gap-1 mt-2 sm:mt-0">
        {views.map((view: string) => (
          <button
            key={view}
            type="button"
            onClick={() => onView(view)}
            className="px-3 py-1.5 capitalize text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
