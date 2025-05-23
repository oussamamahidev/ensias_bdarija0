import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, List, Sparkles } from "lucide-react";
import EventCalendar from "@/components/events/event-calendar";
import EventList from "@/components/events/event-list";
import EventFilters from "@/components/events/event-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function EventsPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
              DevEvents
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover global tech events, conferences, webinars, and hackathons
            </p>
            <div className="absolute -top-6 -right-6 text-yellow-400 animate-pulse hidden md:block">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          {userId && (
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Link href="/events/submit" className="flex items-center gap-2">
                <span>Submit Event</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </Link>
            </Button>
          )}
        </div>

        <EventFilters />

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 p-1 bg-purple-100 dark:bg-gray-800">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 transition-all duration-300"
            >
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 transition-all duration-300"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-600 font-medium">
                      Loading
                    </div>
                  </div>
                </div>
              }
            >
              <EventList />
            </Suspense>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-600 font-medium">
                      Loading
                    </div>
                  </div>
                </div>
              }
            >
              <EventCalendar />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
