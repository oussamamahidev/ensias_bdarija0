"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SignedIn } from "@clerk/nextjs"
import { Edit3, Share2, MapPin, Calendar, ExternalLink, Award, Zap, Heart, Sparkles, Flame } from "lucide-react"

// Add this function if it doesn't exist in your utils
// const getJoinedDate = (date: string) => {
//   try {
//     return `${formatDistanceToNow(new Date(date))} ago`
//   } catch (error) {
//     return "recently"
//   }
// }

interface ProfileHeaderProps {
  user: {
    _id: string
    clerkId: string
    name: string
    username: string
    picture: string
    bio?: string
    location?: string
    portfolioWebsite?: string
    joinedAt: string
  }
  clerkId?: string | null
}

const ProfileHeader = ({ user, clerkId }: ProfileHeaderProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full">
      {/* Hero Banner with Parallax Effect */}
      <div
        className="relative w-full h-[250px] rounded-xl overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 transition-transform duration-700"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          style={{
            background: "linear-gradient(135deg, #FFF1E6 0%, #FFB27D 50%, #FF7000 100%)",
          }}
        />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 transition-opacity duration-700 group-hover:opacity-30" />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particle-container">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-float"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <Sparkles className="h-8 w-8 text-white/30 animate-float" style={{ animationDelay: "1s" }} />
        </div>
        <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
          <Flame className="h-10 w-10 text-white/20 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* User Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/90 dark:bg-gray-800/90 text-primary-500 backdrop-blur-sm px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            <span>Active Member</span>
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all duration-300 hover:scale-105"
                >
                  <Heart className="h-4 w-4 text-rose-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Follow {user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <SignedIn>
            {clerkId === user.clerkId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/profile/edit">
                      <Button className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-sm flex items-center gap-2 px-4 transition-all duration-300 hover:scale-105">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Customize Your Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </SignedIn>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row mt-4 relative">
        {/* Profile Picture */}
        <div className="absolute -top-20 left-8 z-10">
          <div className="relative group/avatar">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-orange-300 blur-sm opacity-70 animate-spin-slow group-hover/avatar:opacity-100" />
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg relative z-10">
              <Image
                src={user.picture || "/placeholder.svg"}
                alt="profile picture"
                width={128}
                height={128}
                className="rounded-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-16 ml-8 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <Badge className="bg-primary-500/20 text-primary-500 hover:bg-primary-500/30">
              <Award className="h-3 w-3 mr-1" />
              Contributor
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">@{user.username}</p>

          {user.bio && <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-4">{user.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center gap-1.5 group">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors" />
                <span className="group-hover:text-primary-500 transition-colors">{user.location}</span>
              </div>
            )}

            {user.portfolioWebsite && (
              <a
                href={user.portfolioWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary-500 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>Portfolio</span>
              </a>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span>
                Joined{" "}
                {user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "recently"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader

