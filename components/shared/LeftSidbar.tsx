"use client"

import { sidebarLinks } from "@/constants"
import { SignedOut, useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Clock, Users, BookMarked } from "lucide-react"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const LeftSidebar = () => {
  const { userId } = useAuth()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showRecentActivity, setShowRecentActivity] = useState(false)

  // Mock data for recent activity
  const recentActivities = [
    { id: 1, type: "question", title: "How to implement authentication in Next.js?", time: "2 hours ago" },
    { id: 2, type: "answer", title: "Best practices for React state management", time: "5 hours ago" },
    { id: 3, type: "upvote", title: "Your answer was upvoted", time: "1 day ago" },
  ]

  useEffect(() => {
    setIsMounted(true)

    // Check if sidebar state is saved in localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  useEffect(() => {
    // Update the main content margin when sidebar is collapsed/expanded
    const mainContent = document.querySelector("section.flex.min-h-screen")
    if (mainContent) {
      ;(mainContent as HTMLElement).style.marginLeft = isCollapsed ? "5rem" : "266px"
    }
  }, [isCollapsed])

  if (!isMounted) {
    return null
  }

  return (
    <motion.section
      className="custom-scrollbar fixed left-0 top-0 flex h-screen w-[266px] flex-col justify-between overflow-y-auto overflow-x-hidden border-r border-r-light-700/50 dark:border-r-dark-300/50 bg-white dark:bg-gray-900/80 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden z-10 transition-all duration-200"
      animate={{
        width: isCollapsed ? "6rem" : "266px",
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
    >
      <div className="flex flex-1 flex-col gap-4 px-6">
        {sidebarLinks.map((item) => {
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route

          if (item.route === "/profile") {
            if (userId) {
              item.route = `${item.route}/${userId}`
            } else {
              return null
            }
          }

          // Add badges for specific items
          const hasBadge = item.label === "Questions" || item.label === "Tags"
          const badgeCount = item.label === "Questions" ? 5 : 3

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-200 ${
                isActive
                  ? "primary-gradient text-light-900"
                  : "text-dark300_light900 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
              }`}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Image
                  src={item.imgURL || "/placeholder.svg"}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
              </motion.div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }} // Added shorter duration
                    className={`${isActive ? "base-bold" : "base-medium"}`}
                  >
                    {item.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {hasBadge && !isCollapsed && (
                <Badge className="ml-auto bg-primary-500/10 text-primary-500 hover:bg-primary-500/20">
                  {badgeCount}
                </Badge>
              )}

              {hasBadge && isCollapsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 p-0 text-xs text-white">
                        {badgeCount}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {badgeCount} new {item.label.toLowerCase()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Link>
          )
        })}

        <div className="mt-4 border-t border-light-700/50 dark:border-dark-300/50 pt-4">
          <button
            onClick={() => setShowRecentActivity(!showRecentActivity)}
            className={`group flex w-full items-center gap-4 rounded-xl p-4 transition-all duration-200 text-dark300_light900 hover:bg-light-700/50 dark:hover:bg-dark-500/50`}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Clock size={20} className="invert-colors" />
            </motion.div>

            {!isCollapsed && (
              <>
                <p className="base-medium">Recent Activity</p>
                <ChevronRight
                  size={16}
                  className={`ml-auto transition-transform duration-200 ${showRecentActivity ? "rotate-90" : ""}`}
                />
              </>
            )}
          </button>

          <AnimatePresence>
            {showRecentActivity && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }} // Added shorter duration
                className="overflow-hidden"
              >
                <div className="ml-9 mt-2 flex flex-col gap-3 border-l border-light-700/50 dark:border-dark-300/50 pl-4">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.1 }} // Added shorter duration
                      className="flex items-start gap-2 text-sm text-dark300_light900"
                    >
                      {activity.type === "question" && <BookMarked size={14} className="mt-0.5 text-blue-500" />}
                      {activity.type === "answer" && <Users size={14} className="mt-0.5 text-green-500" />}
                      {activity.type === "upvote" && <Star size={14} className="mt-0.5 text-yellow-500" />}
                      <div>
                        <p className="line-clamp-1">{activity.title}</p>
                        <p className="text-xs text-dark400_light700">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-6 pb-6">
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="btn-secondary text-dark400_light900 min-h-[41px] w-full rounded-xl px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/account.svg"
                  alt="Login"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                {!isCollapsed && <span className="primary-text-gradient">Log In</span>}
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-xl px-4 py-3 shadow-none">
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="Sign Up"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                {!isCollapsed && <span>Sign Up</span>}
              </Button>
            </Link>
          </div>
        </SignedOut>

        <Button
          onClick={toggleSidebar}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-light-700/50 dark:border-dark-300/50 p-4 hover:bg-light-700/50 dark:hover:bg-dark-500/50 transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </Button>
      </div>
    </motion.section>
  )
}

export default LeftSidebar

