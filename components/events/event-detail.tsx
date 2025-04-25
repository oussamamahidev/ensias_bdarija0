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
import { addComment, addRating, bookmarkEvent } from "@/lib/actions/expert.action";

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
  const router = useRouter();

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
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge className="mb-2">{event.eventType}</Badge>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <CardDescription>
                  Organized by {event.organizer}
                </CardDescription>
              </div>
              {avgRating > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />{" "}
                  {avgRating.toFixed(1)} ({event.ratings?.length || 0})
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                  {event.endDate !== event.startDate &&
                    ` - ${format(
                      new Date(event.endDate),
                      "EEEE, MMMM d, yyyy"
                    )}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {event.isVirtual ? (
                  <>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Virtual Event ({event.location})</span>
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
                <span>Organized by {event.organizer}</span>
              </div>

              {event.website && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <div className="whitespace-pre-line text-muted-foreground">
                {event.description}
              </div>
            </div>

            {event.technologies.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.technologies.map((tech: string) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                onClick={addToGoogleCalendar}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>

              <Button
                onClick={shareEvent}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <Button
              onClick={handleBookmarkToggle}
              variant={isBookmarked ? "default" : "outline"}
              disabled={isBookmarking}
              className="flex items-center gap-2"
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comments</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>

            <Separator />

            {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment._id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={comment.user.picture || "/placeholder.svg"}
                        alt={comment.user.name}
                      />
                      <AvatarFallback>
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rate this Event</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingSubmit(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isSubmittingRating}
                  className="text-2xl focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (
                        hoverRating
                          ? star <= hoverRating
                          : star <= (rating || userRating?.score || 0)
                      )
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {isSubmittingRating && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {userRating && (
              <p className="text-center text-sm text-muted-foreground">
                You rated this event {userRating.score} out of 5
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Submitted by</h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar>
                  <AvatarImage
                    src={event.submitter.picture || "/placeholder.svg"}
                    alt={event.submitter.name}
                  />
                  <AvatarFallback>
                    {event.submitter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{event.submitter.name}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Bookmarked by</h3>
              <p className="text-muted-foreground mt-1">
                {bookmarks.length}{" "}
                {bookmarks.length === 1 ? "person" : "people"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Created on</h3>
              <p className="text-muted-foreground mt-1">
                {format(new Date(event.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
