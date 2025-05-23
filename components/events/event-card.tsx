import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    country: string;
    technologies: string[];
    website: string;
    organizer: string;
    isVirtual: boolean;
    eventType: string;
    bookmarks: string[];
    ratings: { score: number }[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  // Calculate average rating
  const avgRating =
    event.ratings.length > 0
      ? event.ratings.reduce((sum, rating) => sum + rating.score, 0) /
        event.ratings.length
      : 0;

  // Truncate description
  const truncatedDescription =
    event.description.length > 120
      ? `${event.description.substring(0, 120)}...`
      : event.description;

  // Check if event has expired
  const isExpired = new Date() > new Date(event.endDate);

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "conference":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "webinar":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "hackathon":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "meetup":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "workshop":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80",
        isExpired && "opacity-75"
      )}
    >
      <div
        className={cn("h-2 w-full", getEventTypeColor(event.eventType))}
      ></div>
      <CardContent className="flex-grow p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn("font-medium", getEventTypeColor(event.eventType))}
            >
              {event.eventType}
            </Badge>
            {isExpired && (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              >
                <Clock className="h-3 w-3 mr-1" />
                Expired
              </Badge>
            )}
          </div>
          {avgRating > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {truncatedDescription}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>
              {format(new Date(event.startDate), "MMM d, yyyy")}
              {event.endDate !== event.startDate &&
                ` - ${format(new Date(event.endDate), "MMM d, yyyy")}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {event.isVirtual ? (
              <>
                <Globe className="h-4 w-4 text-purple-500" />
                <span>Virtual Event</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-purple-500" />
                <span>
                  {event.location}, {event.country}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span>{event.organizer}</span>
          </div>
        </div>

        {event.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {event.technologies.slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-700"
              >
                {tech}
              </Badge>
            ))}
            {event.technologies.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-700"
              >
                +{event.technologies.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-0 pb-5 px-5 mt-auto">
        <Button
          asChild
          className={cn(
            "transition-colors",
            isExpired
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          <Link href={`/events/${event._id}`}>
            {isExpired ? "View Archive" : "View Details"}
          </Link>
        </Button>

        {event.website && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-gray-700"
          >
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Website
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
