import UserCard from "@/components/cards/UserCard"
import Filter from "@/components/shared/Filter"
import LocalSearchbar from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"
import { UserFilters } from "@/constants/filters"
import { getAllUsers } from "@/lib/actions/user.action"
import Link from "next/link"
import { Suspense } from "react"
import { Users, Award, TrendingUp, Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommunityStats from "@/components/community/CommunityStats"


interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function FilterLoading() {
  return <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

export default async function CommunityPage({ searchParams }: Props) {
  const { q, filter, page } = await searchParams
  const result = await getAllUsers({
    filter: filter,
    searchQuery: q,
    page: Number.parseInt(page || "1"),
  })

  // Serialize MongoDB documents to plain JavaScript objects
  const serializedUsers = JSON.parse(JSON.stringify(result.users))
  const isNext = result.isNext

  // Mock stats for the community
  const communityStats = {
    totalUsers: 8954,
    newThisWeek: 243,
    topContributors: 127,
    questionsAnswered: 32876,
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl primary-gradient text-white mb-8 animate-fade-in">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Community Hub</h1>
              </div>
              <p className="text-lg text-white/90 max-w-xl mb-6">
                Connect with brilliant minds, share knowledge, and build your reputation in our thriving community of
                developers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-primary-500 hover:bg-white/90 rounded-full px-6">
                  Join Community
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-6"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative w-full md:w-auto animate-slide-down">
              <div className="particle-container">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div
                    key={i}
                    className="absolute w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg animate-float"
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${5 + Math.random() * 5}s`,
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <Suspense
        fallback={<div className="h-24 w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-xl mb-8" />}
      >
        <CommunityStats stats={communityStats} />
      </Suspense>

      {/* Main Content */}
      <div className="card-wrapper rounded-xl p-8 border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Search className="h-5 w-5 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark100_light900">Find Community Members</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">
              {serializedUsers.length > 0 ? `Showing ${serializedUsers.length} members` : "No members found"}
            </span>
            <Button variant="ghost" size="sm" className="rounded-full">
              <TrendingUp className="h-4 w-4 mr-1" />
              View Leaderboard
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Suspense fallback={<SearchbarLoading />}>
            <LocalSearchbar
              route="/community"
              iconPosition="left"
              imgSrc="/assets/icons/search.svg"
              placeholder="Search for amazing minds"
              otherClasses="flex-1"
            />
          </Suspense>

          <Suspense fallback={<FilterLoading />}>
            <Filter filters={UserFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
          </Suspense>
        </div>

        <section className="mt-10">
          {serializedUsers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {serializedUsers.map((user: any) => (
                  <div key={user._id} className="h-full">
                    <UserCard user={user} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="p-4 primary-gradient rounded-full mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Users Found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                We couldn't find any community members matching your search criteria. Try adjusting your filters or be
                the first to join!
              </p>
              <Link href="/sign-in">
                <Button className="primary-gradient text-white rounded-full px-8 py-2.5">Join Our Community</Button>
              </Link>
            </div>
          )}
        </section>

        <div className="mt-10">
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
            <Pagination pageNumber={page ? +page : 1} isNext={isNext} />
          </Suspense>
        </div>
      </div>

      {/* Featured Members Section */}
      {serializedUsers.length > 0 && (
        <div className="mt-8 card-wrapper rounded-xl p-8 border border-gray-100 dark:border-gray-700 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-dark100_light900">Featured Members</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {serializedUsers.slice(0, 4).map((user: any) => (
              <div
                key={`featured-${user._id}`}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${0.2}s` }}
              >
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md mb-3">
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-1 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  @{user.username || user.name.toLowerCase().replace(/\s+/g, "")}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="primary-text-gradient font-medium">{user.reputation || 0} reputation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

