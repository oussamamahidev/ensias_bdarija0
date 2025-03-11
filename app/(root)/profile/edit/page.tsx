import { Suspense } from "react"
import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"
import ProfileForm from "@/components/forms/ProfileForm"

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

const Page = async () => {
  const { userId } = await auth()

  if (!userId) return null

  const mongoUser = await getUserById({ userId })

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Update your personal information and preferences</p>

      <div className="mt-9">
        <Suspense fallback={<ProfileFormLoading />}>
          <ProfileForm clerkId={userId} user={JSON.stringify(mongoUser)} />
        </Suspense>
      </div>
    </div>
  )
}

export default Page

