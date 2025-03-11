import { Suspense } from "react"
import AnswersTab from "@/components/shared/AnswersTab"
import QuestionTab from "@/components/shared/QuestionTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserInfo } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"

import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, MessageSquare, ThumbsUp, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


import AchievementBadges from "@/components/shared/AchievementBadges"
import ProfileSkills from "@/components/profile/ProfileSkills"
import Stats from "@/components/shared/Stats"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileInterests from "@/components/profile/ProfileInterests"
import ProfileActivity from "@/components/profile/ProfileActivity"

interface URLProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// Loading fallbacks
function ProfileHeaderLoading() {
  return (
    <div className="w-full">
      <div className="h-64 w-full bg-gradient-to-r from-primary-500/20 to-primary-500/5 rounded-xl animate-pulse"></div>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row mt-4">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-36 w-36 rounded-full" />
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  )
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

  let userInfo
  let error = null

  try {
    userInfo = await getUserInfo({ userId: id })
  } catch (err) {
    console.error("Error fetching user info:", err)
    error = "Failed to load user profile. Please try again later."

    // Provide default values to prevent UI errors
    userInfo = {
      user: {
        _id: "error",
        clerkId: id,
        name: "User Not Found",
        username: "user_not_found",
        picture: "/assets/images/user.svg",
        bio: "User information could not be loaded.",
        joinedAt: new Date().toISOString(),
      },
      reputation: 0,
      totalQuestions: 0,
      totalAnswers: 0,
      badgeCounts: { GOLD: 0, SILVER: 0, BRONZE: 0 },
    }
  }

  const { tabParam } = await searchParams
  const activeTab = tabParam || "top-posts"

  // Mock data for skills - in a real app, this would come from your database
  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "TypeScript", level: 75 },
    { name: "Next.js", level: 70 },
  ]

  // Mock data for interests
  const interests = ["Web Development", "UI/UX Design", "Machine Learning", "Open Source", "Cloud Computing"]

  return (
    <div className="flex flex-col gap-8 pb-10">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<ProfileHeaderLoading />}>
        <ProfileHeader user={userInfo.user} clerkId={clerkId} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1 space-y-6">
          <Suspense fallback={<StatsLoading />}>
            <Stats
              reputation={userInfo.reputation}
              totalQuestions={userInfo.totalQuestions}
              totalAnswers={userInfo.totalAnswers}
              badges={userInfo.badgeCounts}
            />
          </Suspense>

          {/* Skills Card */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
              <ProfileSkills skills={skills} />
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500" />
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interests</h3>
              <ProfileInterests interests={interests} />
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
              <AchievementBadges userId={userInfo.user._id} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2">
          <Suspense fallback={<TabsLoading />}>
            <div className="w-full">
              <Tabs defaultValue={activeTab} className="w-full">
                <TabsList className="background-light800_dark400 min-h-[48px] p-1 rounded-xl">
                  <TabsTrigger value="top-posts" className="tab rounded-lg text-base flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Top Posts
                  </TabsTrigger>
                  <TabsTrigger value="answers" className="tab rounded-lg text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Answers
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="tab rounded-lg text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
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
      </div>
    </div>
  )
}

export default Page

