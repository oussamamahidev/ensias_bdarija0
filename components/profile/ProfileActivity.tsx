"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts"
import { Calendar, BarChart2, TrendingUp } from "lucide-react"

interface ProfileActivityProps {
  userId: string
}

const ProfileActivity = ({ userId }: ProfileActivityProps) => {
  const [activeView, setActiveView] = useState("bar")
  const [isHovering, setIsHovering] = useState(false)

  // Mock data - in a real app, you would fetch this from your API
  const monthlyData = [
    { month: "Jan", posts: 5, answers: 3, reputation: 25 },
    { month: "Feb", posts: 8, answers: 5, reputation: 40 },
    { month: "Mar", posts: 12, answers: 8, reputation: 60 },
    { month: "Apr", posts: 7, answers: 10, reputation: 45 },
    { month: "May", posts: 15, answers: 12, reputation: 75 },
    { month: "Jun", posts: 20, answers: 15, reputation: 100 },
    { month: "Jul", posts: 18, answers: 20, reputation: 90 },
    { month: "Aug", posts: 25, answers: 18, reputation: 125 },
    { month: "Sep", posts: 22, answers: 25, reputation: 110 },
    { month: "Oct", posts: 30, answers: 22, reputation: 150 },
    { month: "Nov", posts: 28, answers: 30, reputation: 140 },
    { month: "Dec", posts: 35, answers: 28, reputation: 175 },
  ]

  const weeklyData = [
    { day: "Mon", activity: 10 },
    { day: "Tue", activity: 15 },
    { day: "Wed", activity: 8 },
    { day: "Thu", activity: 12 },
    { day: "Fri", activity: 20 },
    { day: "Sat", activity: 5 },
    { day: "Sun", activity: 3 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-2 w-48">
            <TabsTrigger value="monthly" className="tab">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="weekly" className="tab">
              Weekly
            </TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView("bar")}
              className={`p-1.5 rounded-md transition-colors ${
                activeView === "bar"
                  ? "bg-primary-100 text-primary-500 dark:bg-gray-700 dark:text-primary-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveView("line")}
              className={`p-1.5 rounded-md transition-colors ${
                activeView === "line"
                  ? "bg-primary-100 text-primary-500 dark:bg-gray-700 dark:text-primary-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <TabsContent value="monthly" className="animate-fade-in">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeView === "bar" ? (
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="posts"
                    name="Posts"
                    fill="#FF7000"
                    radius={[4, 4, 0, 0]}
                    className={`transition-opacity duration-300 ${isHovering ? "opacity-80" : "opacity-100"}`}
                  />
                  <Bar
                    dataKey="answers"
                    name="Answers"
                    fill="#FFB27D"
                    radius={[4, 4, 0, 0]}
                    className={`transition-opacity duration-300 ${isHovering ? "opacity-80" : "opacity-100"}`}
                  />
                </BarChart>
              ) : (
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="reputation"
                    name="Reputation"
                    stroke="#FF7000"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#FF7000", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#FF7000", strokeWidth: 0 }}
                    className={`transition-opacity duration-300 ${isHovering ? "opacity-80" : "opacity-100"}`}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="animate-fade-in">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="activity"
                  name="Activity"
                  fill="#FF7000"
                  radius={[4, 4, 0, 0]}
                  className={`transition-opacity duration-300 ${isHovering ? "opacity-80" : "opacity-100"}`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Calendar Teaser */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
          <Calendar className="h-4 w-4" />
          <span>View Full Activity Calendar</span>
        </button>
      </div>
    </div>
  )
}

export default ProfileActivity

