import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { ReactNode } from "react"

interface TagCategorySectionProps {
  category: {
    name: string
    icon: ReactNode
    color: string
  }
  tags: any[]
}

export default function TagCategorySection({ category, tags }: TagCategorySectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 ${category.color} rounded-lg text-white`}>{category.icon}</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 5).map((tag) => (
          <Link key={tag._id} href={`/tags/${tag._id}`}>
            <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>

      <Link href={`/tags?category=${category.name}`} className="text-xs text-primary-500 hover:underline">
        View all {category.name} tags →
      </Link>
    </div>
  )
}

