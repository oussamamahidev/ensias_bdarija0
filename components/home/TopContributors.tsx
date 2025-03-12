import Link from "next/link"
import { Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getTopContributors } from "@/lib/actions/user.action"

async function TopContributors() {
  // Fetch top contributors
  const contributors = await getTopContributors()

  // Properly serialize the MongoDB documents to plain JavaScript objects
  // This removes any methods like toJSON that can't be passed to client components
  

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-dark200_light900">Top Contributors</h2>
        </div>
        <Link href="/community" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
          View all members →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contributors.map((contributor:any, index:any) => (
          <Link key={contributor._id} href={`/profile/${contributor.clerkId}`} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-light-700 dark:border-dark-400 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={contributor.picture} alt={contributor.name} />
                    <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${
                      index === 0
                        ? "bg-yellow-500" // gold
                        : index === 1
                          ? "bg-gray-400" // silver
                          : "bg-amber-700" // bronze
                    } border-2 border-white dark:border-gray-800`}
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-dark200_light900 group-hover:text-primary-500 transition-colors">
                    {contributor.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    @{contributor.username || contributor.name.toLowerCase().replace(/\s+/g, "")}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-primary-500 font-semibold">{contributor.reputation?.toLocaleString() || "0"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">rep</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-500 font-semibold">{Math.floor((contributor.reputation || 0) / 50)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">answers</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TopContributors

