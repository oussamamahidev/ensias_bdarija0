import { Suspense } from "react"

import { redirect } from "next/navigation"
import { getUserById } from "@/lib/actions/user.action"
import Question from "@/components/forms/Question"
import { auth } from "@clerk/nextjs/server"

// Loading fallback
function QuestionFormLoading() {
  return (
    <div className="mt-9 flex w-full flex-col gap-6">
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-64 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
    </div>
  )
}

export default async function AskQuestionPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const mongoUser = await getUserById({ userId })

  if (!mongoUser) {
    // Handle case where user exists in Clerk but not in MongoDB
    // You might want to create the user or show an error
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="h2-bold text-dark100_light900">User profile not found</h1>
        <p className="body-regular text-dark500_light700 mt-4">
          Please complete your profile setup before asking a question.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Suspense fallback={<QuestionFormLoading />}>
          <Question mongoUserId={mongoUser._id.toString()} />
        </Suspense>
      </div>
    </div>
  )
}

