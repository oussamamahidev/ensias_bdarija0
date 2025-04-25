import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, List } from "lucide-react";
import EventCalendar from "@/components/events/event-calendar";
import EventList from "@/components/events/event-list";
import EventFilters from "@/components/events/event-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function EventsPage() {
  const { userId } = await auth();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">DevEvents Calendar</h1>
          <p className="text-muted-foreground">
            Discover global tech events, conferences, webinars, and hackathons
          </p>
        </div>

        {userId && (
          <Button asChild>
            <Link href="/events/submit">Submit Event</Link>
          </Button>
        )}
      </div>

      <EventFilters />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Suspense fallback={<div>Loading events...</div>}>
            <EventList />
          </Suspense>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Suspense fallback={<div>Loading calendar...</div>}>
            <EventCalendar />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
