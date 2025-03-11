"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SignedIn } from "@clerk/nextjs"
import { getJoinedDate } from "@/lib/utils"
import { MapPin, Globe, Calendar, Edit, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface ProfileHeaderProps {
  user: any
  clerkId: string | null
}

const ProfileHeader = ({ user, clerkId }: ProfileHeaderProps) => {
  const [mounted, setMounted] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${user.name}'s Profile`,
          text: `Check out ${user.name}'s profile on D2sOverflow!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Profile link copied to clipboard!",
        description: "You can now share it with others.",
      })
    }
  }

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
        <Image src="/assets/images/profile-cover.jpg" alt="Cover" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="flex flex-col-reverse items-start justify-between sm:flex-row relative">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-4 lg:flex-row mt-4 sm:mt-0 sm:-mt-16 z-10 w-full"
        >
          <div className="relative">
            <Image
              src={user.picture || "/placeholder.svg"}
              alt="profile picture"
              width={140}
              height={140}
              className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
            />
            {user.badge && (
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-1.5 shadow-lg">
                <Image src={`/assets/icons/badges/${user.badge}.svg`} alt="badge" width={24} height={24} />
              </div>
            )}
          </div>

          <div className="mt-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>

              <div className="flex items-center gap-2">
                <SignedIn>
                  {clerkId === user.clerkId && (
                    <Link href="/profile/edit">
                      <Button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Edit size={16} />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </Button>
                    </Link>
                  )}
                </SignedIn>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-lg border-gray-200 dark:border-gray-700"
                        onClick={handleShareProfile}
                      >
                        <Share2 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Location and Website */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {user.location && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 py-1 px-2 bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                >
                  <MapPin size={14} className="text-gray-500" />
                  <span>{user.location}</span>
                </Badge>
              )}

              {user.portfolioWebsite && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 py-1 px-2 bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                >
                  <Globe size={14} className="text-gray-500" />
                  <Link
                    href={user.portfolioWebsite}
                    target="_blank"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Portfolio
                  </Link>
                </Badge>
              )}

              <Badge
                variant="outline"
                className="flex items-center gap-1 py-1 px-2 bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
              >
                <Calendar size={14} className="text-gray-500" />
                <span>Joined {getJoinedDate(user.joinedAt)}</span>
              </Badge>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showBio ? "expanded" : "collapsed"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className={`text-gray-700 dark:text-gray-300 ${!showBio && "line-clamp-2"}`}>{user.bio}</p>
                  </motion.div>
                </AnimatePresence>

                {user.bio.length > 150 && (
                  <button
                    onClick={() => setShowBio(!showBio)}
                    className="text-primary-500 hover:text-primary-600 text-sm mt-1 transition-colors"
                  >
                    {showBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileHeader

