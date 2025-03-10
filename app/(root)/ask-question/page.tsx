import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"

import { Sparkles } from "lucide-react"
import AskQuestionForm from "@/components/forms/AskQuestionForm"

// Loading fallback with animated skeleton
function QuestionFormLoading() {
  return (
    <div className="mt-6 flex w-full flex-col gap-6">
      <div className="h-14 w-full rounded-xl bg-light-700 dark:bg-dark-400 animate-pulse" />
      <div className="h-64 w-full rounded-xl bg-light-700 dark:bg-dark-400 animate-pulse" />
      <div className="flex gap-3 mt-4">
        <div className="h-10 w-24 rounded-full bg-light-700 dark:bg-dark-400 animate-pulse" />
        <div className="h-10 w-32 rounded-full bg-light-700 dark:bg-dark-400 animate-pulse" />
      </div>
      <div className="h-14 w-full rounded-xl bg-light-700 dark:bg-dark-400 animate-pulse" />
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-light-700 dark:bg-dark-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🧩</span>
        </div>
        <h1 className="h2-bold text-dark100_light900 mb-2">Profile Not Found</h1>
        <p className="body-regular text-dark500_light700 text-center max-w-md mb-8">
          Please complete your profile setup before asking a question.
        </p>
        <a
          href="/profile/edit"
          className="primary-gradient text-light-900 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
        >
          Complete Profile
        </a>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/90 p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-100 dark:bg-primary-500/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-100 dark:bg-primary-500/10 rounded-full blur-3xl opacity-70"></div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="h1-bold text-dark100_light900 animate-fade-up">Ask a Question</h1>
            <div
              className="bg-primary-100 dark:bg-primary-500/20 text-primary-500 px-3 py-1 rounded-full text-sm font-medium animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center gap-1">
                <Sparkles size={14} />
                <span>AI Assisted</span>
              </div>
            </div>
          </div>
          <p className="text-dark500_light700 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Get help from the community and share your knowledge
          </p>
        </div>

        <div className="mt-8">
          <Suspense fallback={<QuestionFormLoading />}>
            <AskQuestionForm
              mongoUserId={mongoUser._id.toString()}
              userReputation={mongoUser.reputation || 0}
              userImage={mongoUser.picture || "/assets/images/default-profile.png"}
              userName={mongoUser.name || "Anonymous"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

