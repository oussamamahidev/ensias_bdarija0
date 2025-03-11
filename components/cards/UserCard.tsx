"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import RenderTag from "../shared/RenderTag"
import { getTopInterectedTags } from "@/lib/actions/tag.actions"

interface Props {
  user: {
    _id: string
    clerckId: string
    picture: string
    name: string
    username: string
  }
}

const UserCard = ({ user }: Props) => {
  const [interactedTags, setInteractedTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTopInterectedTags({
          userId: user._id,
        })
        setInteractedTags(tags)
      } catch (error) {
        console.error("Error fetching tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [user._id])

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Link href={`/profile/${user.clerckId}`} className="block w-full">
        <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={user.picture || "/placeholder.svg"}
                alt="user profile picture"
                width={80}
                height={80}
                className="rounded-full border-2 border-primary-500/20 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{user.username}</p>
            </div>
          </div>

          <div className="mt-6 flex-grow flex flex-col justify-end">
            {loading ? (
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            ) : interactedTags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {interactedTags.map((tag) => (
                  <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
              </div>
            ) : (
              <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border-none px-3 py-1 mx-auto">
                No tags yet
              </Badge>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-center gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">12</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">48</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Answers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">1.2k</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Reputation</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

export default UserCard

