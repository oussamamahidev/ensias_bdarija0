"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Users, Eye } from "lucide-react"

interface TagStatisticsProps {
  stats: {
    totalQuestions: number
    questionsToday: number
    questionsThisWeek: number
    questionsThisMonth: number
    followers: number
    views: number
  }
}

export default function TagStatistics({ stats }: TagStatisticsProps) {
  const [activeTab, setActiveTab] = useState("activity")

  return (
    <div>
      <Tabs defaultValue="activity" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity" className="text-xs">
            Activity
          </TabsTrigger>
          <TabsTrigger value="growth" className="text-xs">
            Growth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-4 space-y-4 animate-fade-in">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-dark400_light700">
                <Clock className="h-4 w-4" />
                <span>Today</span>
              </div>
              <span className="font-medium text-dark200_light900">{stats.questionsToday} questions</span>
            </div>
            <Progress value={stats.questionsToday * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-dark400_light700">
                <Calendar className="h-4 w-4" />
                <span>This Week</span>
              </div>
              <span className="font-medium text-dark200_light900">{stats.questionsThisWeek} questions</span>
            </div>
            <Progress value={stats.questionsThisWeek * 3} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-dark400_light700">
                <Calendar className="h-4 w-4" />
                <span>This Month</span>
              </div>
              <span className="font-medium text-dark200_light900">{stats.questionsThisMonth} questions</span>
            </div>
            <Progress value={stats.questionsThisMonth} className="h-2" />
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-4 space-y-4 animate-fade-in">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-dark400_light700">
                <Users className="h-4 w-4" />
                <span>Followers</span>
              </div>
              <span className="font-medium text-dark200_light900">{stats.followers}</span>
            </div>
            <Progress value={stats.followers / 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-dark400_light700">
                <Eye className="h-4 w-4" />
                <span>Views</span>
              </div>
              <span className="font-medium text-dark200_light900">{stats.views}</span>
            </div>
            <Progress value={stats.views / 100} className="h-2" />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark400_light700">Growth Rate</span>
              <span className="text-sm font-medium text-green-500">+12% this month</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

