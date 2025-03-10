"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, MessageSquare, Heart, User, Star, Settings, Check } from "lucide-react"

import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"


// Types for notifications
interface NotificationUser {
  name: string
  image: string
  id: string
}

interface Notification {
  id: number
  type: "answer" | "mention" | "upvote" | "badge" | "system"
  content: string
  time: string
  read: boolean
  user: NotificationUser
  link?: string
}

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const notificationRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "answer" as const,
      content: "John Doe answered your question about React hooks",
      time: "2 minutes ago",
      read: false,
      user: {
        name: "John Doe",
        image: "/assets/images/user.svg",
        id: "user-1",
      },
      link: "/question/123",
    },
    {
      id: 2,
      type: "mention" as const,
      content: "You were mentioned in a comment by Jane Smith",
      time: "1 hour ago",
      read: false,
      user: {
        name: "Jane Smith",
        image: "/assets/images/user.svg",
        id: "user-2",
      },
      link: "/question/456#comment-789",
    },
    {
      id: 3,
      type: "upvote" as const,
      content: "Your answer received 5 upvotes",
      time: "3 hours ago",
      read: true,
      user: {
        name: "Community",
        image: "/assets/images/site-logo.svg",
        id: "system",
      },
      link: "/question/789#answer-123",
    },
    {
      id: 4,
      type: "badge" as const,
      content: "You earned the 'Helpful' badge",
      time: "1 day ago",
      read: true,
      user: {
        name: "System",
        image: "/assets/images/site-logo.svg",
        id: "system",
      },
      link: "/profile/badges",
    },
    {
      id: 5,
      type: "system" as const,
      content: "Welcome to D2sOverflow! Complete your profile to get started.",
      time: "2 days ago",
      read: false,
      user: {
        name: "System",
        image: "/assets/images/site-logo.svg",
        id: "system",
      },
      link: "/profile/edit",
    },
    {
      id: 6,
      type: "answer" as const,
      content: "Alex Johnson answered your question about CSS Grid",
      time: "3 days ago",
      read: true,
      user: {
        name: "Alex Johnson",
        image: "/assets/images/user.svg",
        id: "user-3",
      },
      link: "/question/321",
    },
  ]

  useEffect(() => {
    // Simulate loading notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Close notifications when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "answer":
        return <MessageSquare size={16} className="text-blue-500" />
      case "mention":
        return <User size={16} className="text-purple-500" />
      case "upvote":
        return <Heart size={16} className="text-red-500" />
      case "badge":
        return <Star size={16} className="text-yellow-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  // Notification item component
  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Link
      href={notification.link || "#"}
      className={`mb-2 flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors ${
        notification.read
          ? "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50"
          : "bg-primary-50 dark:bg-gray-700/50 hover:bg-primary-100 dark:hover:bg-gray-700"
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={notification.user.image} alt={notification.user.name} />
        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p
          className={`text-sm ${notification.read ? "text-gray-700 dark:text-gray-300" : "font-medium text-gray-900 dark:text-white"}`}
        >
          {notification.content}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
      </div>
      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary-500"></div>}
    </Link>
  )

  // Desktop notification panel
  const NotificationPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }} // Added shorter duration
      className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      ref={notificationRef}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e:any) => {
                e.preventDefault()
                e.stopPropagation()
                markAllAsRead()
              }}
              className="text-xs text-primary-500 hover:text-primary-600"
            >
              <Check size={12} className="mr-1" />
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => setShowNotifications(false)}
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="answer" className="text-xs">
            Answers
          </TabsTrigger>
          <TabsTrigger value="mention" className="text-xs">
            Mentions
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="max-h-[350px] overflow-y-auto">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="mb-3 flex items-start gap-3 rounded-lg p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <Bell size={40} className="mb-2 text-gray-400" />
              <p className="text-center text-gray-500 dark:text-gray-400">
                {activeTab === "all"
                  ? "No notifications yet"
                  : activeTab === "unread"
                    ? "No unread notifications"
                    : `No ${activeTab} notifications`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
        <Link href="/settings/notifications">
          <Button variant="ghost" size="sm" className="w-full justify-center gap-2 text-gray-600 dark:text-gray-300">
            <Settings size={14} />
            <span>Notification Settings</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  )

  // Mobile notification drawer content
  const NotificationDrawerContent = () => (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
            <Check size={14} className="mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          <TabsTrigger value="answer">Answers</TabsTrigger>
          <TabsTrigger value="mention">Mentions</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="mb-3 flex items-start gap-3 rounded-lg p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-5 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Bell size={48} className="mb-3 text-gray-400" />
              <p className="text-center text-gray-500 dark:text-gray-400">
                {activeTab === "all"
                  ? "No notifications yet"
                  : activeTab === "unread"
                    ? "No unread notifications"
                    : `No ${activeTab} notifications`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Link href="/settings/notifications">
          <Button variant="outline" className="w-full justify-center gap-2">
            <Settings size={16} />
            <span>Notification Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  )

  // Render different components based on screen size
  return (
    <div className="relative">
      {isDesktop ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 p-0 text-xs text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <AnimatePresence>{showNotifications && <NotificationPanel />}</AnimatePresence>
        </>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 p-0 text-xs text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <NotificationDrawerContent />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

export default Notifications

