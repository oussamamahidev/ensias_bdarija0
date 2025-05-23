import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEventById } from "@/lib/actions/expert.action";
import EventDetail from "@/components/events/event-detail";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById({ eventId: id });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | DevEvents Calendar`,
    description: event.description.substring(0, 160),
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  // Get the event
  const event = await getEventById({ eventId: id });

  // If event not found, redirect to events page
  if (!event) {
    redirect("/events");
  }

  // Get the user's Clerk ID
  const { userId: clerkId } = await auth();

  // Default to empty string if not logged in
  let mongoUserId = "";

  // If logged in, get the MongoDB user document
  if (clerkId) {
    const mongoUser = await getUserById({ userId: clerkId });
    if (mongoUser) {
      mongoUserId = mongoUser._id.toString();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="container mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
        <EventDetail event={event} userId={mongoUserId} />
      </div>
    </div>
  );
}
