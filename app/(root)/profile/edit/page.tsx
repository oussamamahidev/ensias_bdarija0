import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"

import { Card } from "@/components/ui/card"
import { Edit3, Sparkles } from "lucide-react"
import EnhancedProfileForm from "@/components/forms/ProfileForm"

const Page = async () => {
  const { userId } = await auth()

  if (!userId) return null

  const mongoUser = await getUserById({ userId })

  return (
    <>
      <div className="relative mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-orange-300 flex items-center justify-center">
            <Edit3 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Your Profile</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-14">
          Customize your profile to showcase your skills and interests
        </p>

        {/* Decorative element */}
        <div className="absolute -top-2 right-0">
          <Sparkles className="h-6 w-6 text-primary-500/30 animate-float" />
        </div>
      </div>

      <Card className="card-wrapper border-none overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-500 to-orange-300" />
        <EnhancedProfileForm clerkId={userId} user={JSON.stringify(mongoUser)} />
      </Card>
    </>
  )
}

export default Page

