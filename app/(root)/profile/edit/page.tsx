import { Suspense } from "react"

import { redirect } from "next/navigation"
import { getUserById } from "@/lib/actions/user.action"
import { auth, currentUser } from "@clerk/nextjs/server"
import Profile from "@/components/forms/Profile"


// Loading fallback
function ProfileFormLoading() {
  return (
    <div className="mt-9 flex w-full flex-col gap-6">
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-40 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
    </div>
  )
}

export default async function EditProfile() {
  const { userId } =await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  const mongoUser = await getUserById({ userId })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Suspense fallback={<ProfileFormLoading />}>
          <Profile clerkId={userId} user={mongoUser} />
        </Suspense>
      </div>
    </>
  )
}

