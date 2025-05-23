import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/components/events/event-form";

export default async function SubmitEventPage() {
  // Get the user's Clerk ID
  const { userId: clerkId } = await auth();

  // If not logged in, redirect to sign in
  if (!clerkId) {
    redirect("/sign-in");
  }

  // Get the MongoDB user document
  const mongoUser = await getUserById({ userId: clerkId });

  // If user not found, redirect to home
  if (!mongoUser) {
    redirect("/");
  }

  // Get the MongoDB ObjectId as a string
  const mongoUserId = mongoUser._id.toString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">
              Submit a New Event
            </CardTitle>
            <CardDescription>
              Share a tech event with the community. All submissions will be
              reviewed before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EventForm userId={mongoUserId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
