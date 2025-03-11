"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface ProfileLinkProps {
  imgUrl: string
  href?: string
  title: string
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full"
    >
      <Image src={imgUrl || "/placeholder.svg"} alt="icon" width={16} height={16} className="dark:invert" />

      {href ? (
        <Link href={href} target="_blank" className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
          {title}
        </Link>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300">{title}</p>
      )}
    </motion.div>
  )
}

export default ProfileLink

