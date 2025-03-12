import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Search } from "lucide-react"

interface JobsHeroProps {
  query: string
  jobCount: number
  location: string
}

const JobsHero = ({ query, jobCount, location }: JobsHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-background p-8 shadow-sm">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />

      <div className="relative z-10">
        <h1 className="h1-bold text-dark100_light900 mb-3">Find Your Dream Job</h1>

        <p className="body-regular text-dark500_light700 mb-6 max-w-lg">
          Discover opportunities that match your skills and career goals. We've curated the best positions for you.
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          {query && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-background/80 backdrop-blur-sm"
            >
              <Search size={14} />
              <span className="line-clamp-1">{query}</span>
            </Badge>
          )}

          {location && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-background/80 backdrop-blur-sm"
            >
              <MapPin size={14} />
              <span className="line-clamp-1">{location}</span>
            </Badge>
          )}

          {jobCount > 0 && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-background/80 backdrop-blur-sm"
            >
              <Briefcase size={14} />
              <span>{jobCount} positions</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobsHero

