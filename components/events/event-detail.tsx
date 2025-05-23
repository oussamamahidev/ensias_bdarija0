/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Star,
  Bookmark,
  Share2,
  Loader2,
  MessageCircle,
  Clock,
  Tag,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addComment,
  addRating,
  bookmarkEvent,
} from "@/lib/actions/expert.action";
import { cn } from "@/lib/utils";

interface EventDetailProps {
  event: any;
  userId: string;
}

export default function EventDetail({ event, userId }: EventDetailProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [comments, setComments] = useState(event.comments || []);
  const [bookmarks, setBookmarks] = useState(event.bookmarks || []);
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);
  const router = useRouter();

  // Check if event has expired
  const isExpired = new Date() > new Date(event.endDate);

  const isBookmarked = bookmarks.some(
    (bookmark: any) => bookmark._id === userId
  );

  // Calculate average rating
  const avgRating =
    event.ratings && event.ratings.length > 0
      ? event.ratings.reduce(
          (sum: number, rating: any) => sum + rating.score,
          0
        ) / event.ratings.length
      : 0;

  // User's current rating
  const userRating = event.ratings?.find((r: any) => r.user._id === userId);

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

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComments = await addComment({
        eventId: event._id,
        userId,
        content: comment,
        path: `/events/${event._id}`,
      });

      setComments(newComments);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async (score: number) => {
    setIsSubmittingRating(true);
    try {
      await addRating({
        eventId: event._id,
        userId,
        score,
        path: `/events/${event._id}`,
      });

      setRating(score);
      router.refresh();
    } catch (error) {
      console.error("Error adding rating:", error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    setIsBookmarking(true);
    try {
      const result = await bookmarkEvent({
        eventId: event._id,
        userId,
        path: `/events/${event._id}`,
      });

      if (result.bookmarked) {
        setBookmarks([...bookmarks, { _id: userId }]);
      } else {
        setBookmarks(
          bookmarks.filter((bookmark: any) => bookmark._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Handle Google Calendar integration
  const addToGoogleCalendar = () => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatDate(startDate)}/${formatDate(
      endDate
    )}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(
      event.location + ", " + event.country
    )}&sf=true&output=xml`;

    window.open(url, "_blank");
  };

  // Handle share event
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {isExpired && (
        <div className="md:col-span-3 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-500 text-gray-700 dark:text-gray-300 p-4 rounded-r flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <h3 className="font-bold">This event has ended</h3>
                <p>
                  This event took place on{" "}
                  {format(new Date(event.endDate), "MMMM d, yyyy")} and is no
                  longer active.
                </p>
              </div>
            </div>
            {event.isRecorded && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Recording Available
              </Badge>
            )}
          </div>
        </div>
      )}
      <div className="md:col-span-2 space-y-6">
        <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <div
            className={cn("h-2 w-full", getEventTypeColor(event.eventType))}
          ></div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge
                  className={cn("mb-2", getEventTypeColor(event.eventType))}
                >
                  {event.eventType}
                </Badge>
                <CardTitle className="text-3xl font-bold">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Organized by {event.organizer}
                </CardDescription>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-yellow-600/70 dark:text-yellow-400/70">
                    ({event.ratings?.length || 0})
                  </span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-purple-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Date & Time
                    </h3>
                    <p className="text-sm">
                      {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                      {event.endDate !== event.startDate &&
                        ` - ${format(
                          new Date(event.endDate),
                          "EEEE, MMMM d, yyyy"
                        )}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {event.isVirtual ? (
                    <>
                      <Globe className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Location
                        </h3>
                        <p className="text-sm">
                          Virtual Event ({event.location})
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Location
                        </h3>
                        <p className="text-sm">
                          {event.location}, {event.country}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Organizer
                    </h3>
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-purple-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Duration
                    </h3>
                    <p className="text-sm">
                      {Math.ceil(
                        (new Date(event.endDate).getTime() -
                          new Date(event.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      day
                      {Math.ceil(
                        (new Date(event.endDate).getTime() -
                          new Date(event.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Type
                    </h3>
                    <p className="text-sm capitalize">{event.eventType}</p>
                  </div>
                </div>

                {event.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Website
                      </h3>
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-purple-600 dark:text-purple-400">
                About This Event
              </h3>
              <div className="prose prose-purple dark:prose-invert max-w-none">
                {event.description
                  .split("\n")
                  .map((paragraph: string, i: number) => (
                    <p
                      key={i}
                      className="text-gray-700 dark:text-gray-300 mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            {event.technologies.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-3 text-purple-600 dark:text-purple-400">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(showAllTechnologies
                    ? event.technologies
                    : event.technologies.slice(0, 12)
                  ).map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-gray-700 dark:text-purple-300 dark:border-gray-600 py-1.5"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {event.technologies.length > 12 && !showAllTechnologies && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllTechnologies(true)}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      +{event.technologies.length - 12} more
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between p-5 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex gap-2">
              <Button
                onClick={addToGoogleCalendar}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
              >
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>

              <Button
                onClick={shareEvent}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <Button
              onClick={handleBookmarkToggle}
              variant={isBookmarked ? "default" : "outline"}
              disabled={isBookmarking}
              className={cn(
                "flex items-center gap-2",
                isBookmarked
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
              )}
            >
              {isBookmarking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-xl">Comments</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5">
            {userId ? (
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-200 text-purple-700">
                    {userId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-gray-600"
                  />
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim() || isSubmittingComment}
                    className="bg-purple-600 hover:bg-purple-700 text-white ml-auto"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Post Comment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-purple-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300">
                  Please sign in to leave a comment
                </p>
              </div>
            )}

            <Separator className="my-6" />

            {comments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment: any) => (
                  <div key={comment._id} className="flex gap-4 group">
                    <Avatar>
                      <AvatarImage
                        src={comment.user.picture || "/placeholder.svg"}
                        alt={comment.user.name}
                      />
                      <AvatarFallback className="bg-purple-200 text-purple-700">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors">
                        <p className="text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1">
                          <Heart className="h-3 w-3" /> Like
                        </button>
                        <button className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-xl">Rate this Event</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            {userId ? (
              <>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingSubmit(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isSubmittingRating}
                      className="text-2xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          (
                            hoverRating
                              ? star <= hoverRating
                              : star <= (rating || userRating?.score || 0)
                          )
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {isSubmittingRating && (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  </div>
                )}

                {userRating && (
                  <div className="text-center mt-2 p-2 bg-purple-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      You rated this event {userRating.score} out of 5
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 bg-purple-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300">
                  Please sign in to rate this event
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-xl">Event Details</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5">
            <div>
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                Submitted by
              </h3>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={event.submitter.picture || "/placeholder.svg"}
                    alt={event.submitter.name}
                  />
                  <AvatarFallback className="bg-purple-200 text-purple-700">
                    {event.submitter.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.submitter.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{event.submitter.username}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                Bookmarked by
              </h3>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full px-3 py-1 text-sm font-medium">
                  {bookmarks.length}{" "}
                  {bookmarks.length === 1 ? "person" : "people"}
                </div>
                {bookmarks.length > 0 && (
                  <div className="flex -space-x-2">
                    {bookmarks
                      .slice(0, 3)
                      .map((bookmark: any, index: number) => (
                        <Avatar
                          key={index}
                          className="h-6 w-6 border-2 border-white dark:border-gray-800"
                        >
                          <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                            {index + 1}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {bookmarks.length > 3 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium border-2 border-white dark:border-gray-800">
                        +{bookmarks.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                Created on
              </h3>
              <p className="text-muted-foreground">
                {format(new Date(event.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white">
            <h3 className="font-bold text-lg">Interested in this event?</h3>
            <p className="text-white/80 text-sm mt-1">
              Share it with your network!
            </p>
          </div>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Check out this event: ${event.title}`
                    )}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  );
                }}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  );
                }}
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-gray-600 dark:text-purple-400 dark:hover:bg-gray-700"
                onClick={() => {
                  window.open(
                    `mailto:?subject=${encodeURIComponent(
                      `Check out this event: ${event.title}`
                    )}&body=${encodeURIComponent(
                      `I thought you might be interested in this event: ${event.title}\n\n${window.location.href}`
                    )}`,
                    "_blank"
                  );
                }}
              >
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
