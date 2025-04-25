import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Globe, Users, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface EventCardProps {
  event: {
    _id: string
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
    country: string
    technologies: string[]
    website: string
    organizer: string
    isVirtual: boolean
    eventType: string
    bookmarks: string[]
    ratings: { score: number }[]
  }
}

export default function EventCard({ event }: EventCardProps) {
  // Calculate average rating
  const avgRating =
    event.ratings.length > 0 ? event.ratings.reduce((sum, rating) => sum + rating.score, 0) / event.ratings.length : 0

  // Truncate description
  const truncatedDescription =
    event.description.length > 150 ? `${event.description.substring(0, 150)}...` : event.description

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2">{event.eventType}</Badge>
            <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
          </div>
          {avgRating > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              ★ {avgRating.toFixed(1)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{truncatedDescription}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(event.startDate), "MMM d, yyyy")}
              {event.endDate !== event.startDate && ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {event.isVirtual ? (
              <>
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Virtual Event</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.location}, {event.country}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.organizer}</span>
          </div>
        </div>

        {event.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {event.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {event.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{event.technologies.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/events/${event._id}`}>View Details</Link>
        </Button>

        {event.website && (
          <Button asChild variant="ghost" size="sm">
            <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Website
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
