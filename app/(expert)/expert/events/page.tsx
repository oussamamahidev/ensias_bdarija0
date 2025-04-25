import { auth } from "@clerk/nextjs/server"
import { getUserById } from "@/lib/actions/user.action"
import { redirect } from "next/navigation"
import EventApproval from "@/components/events/event-approval"

export default async function ExpertEventsPage() {
  // Get the user's Clerk ID
  const { userId: clerkId } = await auth()

  // If not logged in, redirect to sign in
  if (!clerkId) {
    redirect("/sign-in")
  }

  // Get the MongoDB user document
  const mongoUser = await getUserById({ userId: clerkId })

  // If user not found or not an expert, redirect to home
  if (!mongoUser || !mongoUser.role.includes("expert")) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Event Management</h1>
      <EventApproval />
    </div>
  )
}
