"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface RelatedTagsListProps {
  tags: any[]
}

export default function RelatedTagsList({ tags }: RelatedTagsListProps) {
  // Fallback if no tags are provided
  if (!tags || tags.length === 0) {
    return <div className="text-center py-4 text-dark400_light700">No related tags found</div>
  }

  // Colors for tags
  const colors = [
    "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Link key={tag._id} href={`/tags/${tag._id}`}>
          <div className="transition-transform duration-300 hover:scale-105">
            <Badge className={`${colors[index % colors.length]} px-3 py-1.5 text-xs font-medium capitalize`}>
              {tag.name}
              <span className="ml-1 text-xs opacity-70">({tag.questionCount || 0})</span>
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}

