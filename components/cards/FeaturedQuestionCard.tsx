/* import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Sparkles, MessageSquare, Eye } from "lucide-react"

interface Tag {
  _id: string
  name: string
}

interface Author {
  _id: string
  name: string
  picture: string
}

interface FeaturedQuestionCardProps {
  _id: string
  title: string
  tags: Tag[]
  author: Author
  upvotes: string[]
  answers: any[]
  views: number
  createdAt: Date
}

const FeaturedQuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  answers,
  views,
  createdAt,
}: FeaturedQuestionCardProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full">
      
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          Featured
        </div>
      </div>

      
      <Link href={`/question/${_id}`} className="block h-full">
        <div className="p-6 pt-14 h-full flex flex-col">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 hover:text-primary-500 transition-colors">
            {title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Link
                href={`/tags/${tag.name}`}
                key={tag._id}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>

       
          <div className="flex-grow"></div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={author.picture || "/placeholder.svg?height=32&width=32"}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-200">{author.name}</span>
              {" - asked "}
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          </div>

       
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="text-orange-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-thumbs-up"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{upvotes.length}</span>
              <span className="text-gray-600 dark:text-gray-400">votes</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">{answers?.length}</span>
              <span className="text-gray-600 dark:text-gray-400">answers</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">{views.toLocaleString()}</span>
              <span className="text-gray-600 dark:text-gray-400">views</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FeaturedQuestionCard

*/