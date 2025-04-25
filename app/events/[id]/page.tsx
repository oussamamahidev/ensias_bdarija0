import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import EventDetail from "@/components/events/event-detail";
import type { Metadata } from "next";
import { getEventById } from "@/lib/actions/expert.action";

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
    <div className="container mx-auto py-8">
      <EventDetail event={event} userId={mongoUserId} />
    </div>
  );
}
