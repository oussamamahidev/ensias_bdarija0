"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SignedIn } from "@clerk/nextjs"
import { getJoinedDate } from "@/lib/utils"
import { MapPin, Globe, Calendar, Edit, Share2, Twitter, Github, Linkedin, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import confetti from "canvas-confetti"

interface ProfileHeaderProps {
  user: any
  clerkId: string | null
}

const ProfileHeader = ({ user, clerkId }: ProfileHeaderProps) => {
  const [mounted, setMounted] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const { toast } = useToast()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const triggerConfetti = () => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: ["#FF7000", "#FFB800", "#FF3D00"],
      })
    }
  }

  if (!mounted) return null

  // Mock social links - in a real app, these would come from the user data
  const socialLinks = {
    twitter: user.twitter || "https://twitter.com/username",
    github: user.github || "https://github.com/username",
    linkedin: user.linkedin || "https://linkedin.com/in/username",
  }

  // Mock badges - in a real app, these would come from the user data
  const userBadges = [
    { id: 1, name: "Early Adopter", icon: "/assets/icons/badges/early-adopter.svg" },
    { id: 2, name: "Problem Solver", icon: "/assets/icons/badges/problem-solver.svg" },
    { id: 3, name: "Helpful", icon: "/assets/icons/badges/helpful.svg" },
  ]

  return (
    <div className="w-full" ref={headerRef}>
      {/* Cover Image with Parallax Effect */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden group">
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image src="/assets/images/profile-cover.jpg" alt="Cover" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </motion.div>

        {/* Floating social links */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href={socialLinks.twitter} target="_blank">
            <motion.div
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full"
            >
              <Twitter size={20} className="text-white" />
            </motion.div>
          </Link>
          <Link href={socialLinks.github} target="_blank">
            <motion.div
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full"
            >
              <Github size={20} className="text-white" />
            </motion.div>
          </Link>
          <Link href={socialLinks.linkedin} target="_blank">
            <motion.div
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full"
            >
              <Linkedin size={20} className="text-white" />
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col-reverse items-start justify-between sm:flex-row relative">
        {/* Profile Picture and Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-4 lg:flex-row mt-4 sm:mt-0 sm:-mt-16 z-10 w-full"
        >
          <div className="relative">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={triggerConfetti}>
              <Avatar className="h-36 w-36 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={user.picture || "/placeholder.svg"} alt="profile picture" className="object-cover" />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
            {user.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-1.5 shadow-lg"
              >
                <Image src={`/assets/icons/badges/${user.badge}.svg`} alt="badge" width={24} height={24} />
              </motion.div>
            )}
          </div>

          <div className="mt-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {user.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  @{user.username}
                </motion.p>
              </div>

              <div className="flex items-center gap-2">
                <SignedIn>
                  {clerkId === user.clerkId && (
                    <Link href="/profile/edit">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md">
                          <Edit size={16} />
                          <span className="hidden sm:inline">Edit Profile</span>
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </SignedIn>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg border-gray-200 dark:border-gray-700"
                          onClick={handleShareProfile}
                        >
                          <Share2 size={16} />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Location and Website */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
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
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {userBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-100 dark:bg-gray-800 rounded-full p-2"
                      >
                        <Image
                          src={badge.icon || "/placeholder.svg"}
                          alt={badge.name}
                          width={24}
                          height={24}
                          className="dark:invert-[0.8]"
                        />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badge.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>

            {/* Bio */}
            {user.bio && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
              >
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
                    className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm mt-2 transition-colors"
                  >
                    {showBio ? (
                      <>
                        <ChevronUp size={16} />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span>Show more</span>
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileHeader

