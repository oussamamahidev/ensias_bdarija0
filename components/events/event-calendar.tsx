"use client";

import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getEvents } from "@/lib/actions/expert.action";

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

    // Different colors based on event type
    switch (event.resource.eventType) {
      case "conference":
        backgroundColor = "#3174ad";
        break;
      case "webinar":
        backgroundColor = "#5cb85c";
        break;
      case "hackathon":
        backgroundColor = "#f0ad4e";
        break;
      case "meetup":
        backgroundColor = "#d9534f";
        break;
      case "workshop":
        backgroundColor = "#9370db";
        break;
      default:
        backgroundColor = "#777777";
    }

    const style = {
      backgroundColor,
      borderRadius: "4px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };

    return {
      style,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-white rounded-lg shadow p-4">
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
      />
    </div>
  );
}
