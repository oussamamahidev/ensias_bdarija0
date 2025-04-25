import { auth } from "@clerk/nextjs/server"
import { getUserById } from "@/lib/actions/user.action"
import { redirect } from "next/navigation"
import EventForm from "@/components/events/event-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SubmitEventPage() {
  // Get the user's Clerk ID
  const { userId: clerkId } = await auth()

  // If not logged in, redirect to sign in
  if (!clerkId) {
    redirect("/sign-in")
  }

  // Get the MongoDB user document
  const mongoUser = await getUserById({ userId: clerkId })

  // If user not found, redirect to home
  if (!mongoUser) {
    redirect("/")
  }

  // Get the MongoDB ObjectId as a string
  const mongoUserId = mongoUser._id.toString()

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Submit a New Event</CardTitle>
          <CardDescription>
            Share a tech event with the community. All submissions will be reviewed before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm userId={mongoUserId} />
        </CardContent>
      </Card>
    </div>
  )
}
