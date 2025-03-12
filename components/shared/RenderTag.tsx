import Link from "next/link"
import { Tag } from "lucide-react"

interface Props {
  _id: string
  name: string
  totalQuestions?: number
  showCount?: boolean
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="group">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 group-hover:bg-primary-500/10 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-all duration-200 transform group-hover:scale-105 shadow-sm group-hover:shadow-md">
          <Tag
            size={14}
            className="opacity-70 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200"
          />
          {name}
        </div>

        {showCount && (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-md transition-all duration-200 group-hover:bg-primary-500/5 group-hover:text-primary-500/70">
            {totalQuestions}
          </div>
        )}
      </div>
    </Link>
  )
}

export default RenderTag

