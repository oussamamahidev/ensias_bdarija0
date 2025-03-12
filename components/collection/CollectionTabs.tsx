"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, Clock, BarChart3, Calendar, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import QuestionCard from "@/components/cards/QuestionCard"
import TimeCapsule from "@/components/collection/TimeCapsule"

interface CollectionTabsProps {
  questions: any[]
  recentlyViewed: any[]
  statistics: {
    total: number
    categories: Record<string, number>
    savedThisWeek: number
    mostViewed: string
  }
  view: string
}

const CollectionTabs = ({ questions, recentlyViewed, statistics, view }: CollectionTabsProps) => {
  const [activeTab, setActiveTab] = useState("questions")

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      name: "Collection Started",
      description: "Save your first question",
      completed: true,
      icon: <Bookmark className="h-5 w-5 text-primary" />,
    },
    {
      id: 2,
      name: "Organized Mind",
      description: "Create 3 folders",
      completed: true,
      icon: <Bookmark className="h-5 w-5 text-primary" />,
    },
    {
      id: 3,
      name: "Knowledge Hunter",
      description: "Save 10 questions",
      completed: statistics.total >= 10,
      icon: <Bookmark className="h-5 w-5 text-primary" />,
    },
    {
      id: 4,
      name: "Category Expert",
      description: "Save 5 questions in one category",
      completed: Object.values(statistics.categories).some((count) => count >= 5),
      icon: <Bookmark className="h-5 w-5 text-primary" />,
    },
    {
      id: 5,
      name: "Collection Master",
      description: "Save 50 questions",
      completed: statistics.total >= 50,
      icon: <Bookmark className="h-5 w-5 text-primary" />,
    },
  ]

  // Calculate achievement progress
  const completedAchievements = achievements.filter((a) => a.completed).length
  const achievementProgress = (completedAchievements / achievements.length) * 100

  return (
    <Tabs defaultValue="questions" className="mt-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="questions" className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          <span>Saved Questions</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Recently Viewed</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Statistics</span>
        </TabsTrigger>
        <TabsTrigger value="achievements" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span>Achievements</span>
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="questions" className="mt-5">
            {questions.length > 0 ? (
              <div
                className={`mt-5 ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}`}
              >
                {questions.map((question: any) => (
                  <QuestionCard
                    key={question._id}
                    _id={question._id}
                    title={question.title}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                    downvotes={question.downvotes || []}
                    currentUserId={question.author?.clerkId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-light-800/20 dark:bg-dark-400/20 rounded-lg">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">You haven't saved any questions yet</p>
                <Button className="mt-4" asChild>
                  <a href="/questions">Browse Questions</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="mt-5">
              <h2 className="h3-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Recently Viewed Questions</span>
              </h2>

              {recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyViewed.map((question: any) => (
                    <QuestionCard
                      key={question._id}
                      _id={question._id}
                      title={question.title}
                      tags={question.tags}
                      author={question.author}
                      upvotes={question.upvotes}
                      views={question.views}
                      answers={question.answers}
                      createdAt={question.createdAt}
                      downvotes={question.downvotes || []}
                      currentUserId={question.author?.clerkId}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-light-800/20 dark:bg-dark-400/20 rounded-lg">
                  <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-center">You haven't viewed any questions recently</p>
                </div>
              )}

              <TimeCapsule />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="mt-5">
              <h2 className="h3-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Your Collection Statistics</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-dark100_light900">Collection Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Saved Questions</span>
                      <span className="font-medium text-dark100_light900">{statistics.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saved This Week</span>
                      <span className="font-medium text-dark100_light900">{statistics.savedThisWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Most Viewed Question</span>
                      <span className="font-medium text-dark100_light900 truncate max-w-[200px]">
                        {statistics.mostViewed}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-dark100_light900">Categories</h3>
                  <div className="space-y-3">
                    {Object.entries(statistics.categories).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-muted-foreground capitalize">{category}</span>
                        </div>
                        <span className="font-medium text-dark100_light900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-dark100_light900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Saving Activity</span>
                  </h3>

                  <div className="grid grid-cols-7 gap-2 h-24">
                    {Array.from({ length: 28 }).map((_, i) => {
                      // Generate random activity for demo
                      const activity = Math.floor(Math.random() * 4)
                      let bgClass = "bg-gray-200 dark:bg-gray-700"

                      if (activity === 1) bgClass = "bg-primary/30"
                      if (activity === 2) bgClass = "bg-primary/60"
                      if (activity === 3) bgClass = "bg-primary"

                      return (
                        <div
                          key={i}
                          className={`${bgClass} rounded-sm h-4 w-full transition-colors hover:scale-110`}
                          title={`${activity} questions saved`}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your question saving activity over the past 4 weeks
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="mt-5">
              <h2 className="h3-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Your Achievements</span>
              </h2>

              <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-2 text-dark100_light900">Progress</h3>
                <Progress value={achievementProgress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  You've completed {completedAchievements} out of {achievements.length} achievements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border ${
                      achievement.completed
                        ? "border-primary/50 bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 bg-light-800/10 dark:bg-dark-400/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.completed ? "bg-primary/20" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark100_light900">
                          {achievement.name}
                          {achievement.completed && (
                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              Completed
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}

export default CollectionTabs

