import { Suspense } from "react"
import AnswersTab from "@/components/shared/AnswersTab"
import QuestionTab from "@/components/shared/QuestionTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserInfo } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileStats from "@/components/profile/ProfileStats"
import ProfileActivity from "@/components/profile/ProfileActivity"

interface URLProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// Loading fallbacks
function ProfileHeaderLoading() {
  return (
    <div className="w-full">
      <div className="h-48 w-full bg-gradient-to-r from-primary-500/20 to-primary-500/5 rounded-xl animate-pulse"></div>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row mt-4">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="mt-3">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="flex gap-3 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-20 w-full max-w-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsLoading() {
  return <Skeleton className="h-32 w-full mt-8" />
}

function TabsLoading() {
  return (
    <div className="mt-10 w-full">
      <Skeleton className="h-12 w-full mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  )
}

const Page = async ({ params, searchParams }: URLProps) => {
  const { id } = await params
  const { userId: clerkId } = await auth()
  const userInfo = await getUserInfo({ userId: id })

  const tabParam = await searchParams
  const activeTab = tabParam?.tab || "top-posts"

  return (
    <div className="flex flex-col gap-8 pb-10">
      <Suspense fallback={<ProfileHeaderLoading />}>
        <ProfileHeader user={userInfo.user} clerkId={clerkId} />
      </Suspense>

      <Suspense fallback={<StatsLoading />}>
        <ProfileStats
          reputation={userInfo.reputation}
          totalQuestions={userInfo.totalQuestions}
          totalAnswers={userInfo.totalAnswers}
          badges={userInfo.badgeCounts}
        />
      </Suspense>

      <Suspense fallback={<TabsLoading />}>
        <div className="mt-4 w-full">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="background-light800_dark400 min-h-[48px] p-1 rounded-xl">
              <TabsTrigger value="top-posts" className="tab rounded-lg text-base">
                Top Posts
              </TabsTrigger>
              <TabsTrigger value="answers" className="tab rounded-lg text-base">
                Answers
              </TabsTrigger>
              <TabsTrigger value="activity" className="tab rounded-lg text-base">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-6">
              <QuestionTab searchParams={searchParams} userId={userInfo.user._id} clerkId={clerkId} />
            </TabsContent>

            <TabsContent value="answers" className="flex w-full flex-col gap-6">
              <AnswersTab searchParams={searchParams} userId={userInfo.user._id} clerkId={clerkId} />
            </TabsContent>

            <TabsContent value="activity" className="flex w-full flex-col gap-6">
              <ProfileActivity userId={userInfo.user._id} />
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </div>
  )
}

export default Page

