"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    picture?: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface ArticleCommentsProps {
  articleId: string;
  currentUserId?: string;
  initialComments?: Comment[];
}

export default function ArticleComments({
  articleId,
  currentUserId,
  initialComments = [],
}: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on articles",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would call an API to save the comment
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a new comment object
      const comment: Comment = {
        id: `temp-${Date.now()}`,
        content: newComment,
        author: {
          id: currentUserId,
          name: "Current User", // In a real app, you'd get the user's name
          picture: undefined,
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
      };

      // Add the new comment to the list
      setComments([comment, ...comments]);
      setNewComment("");

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Something went wrong",
        description: "Could not add your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }

    // Update the comment likes
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      })
    );
  };

  const handleDislikeComment = (commentId: string) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to dislike comments",
        variant: "destructive",
      });
      return;
    }

    // Update the comment dislikes
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, dislikes: comment.dislikes + 1 };
        }
        return comment;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    // Remove the comment from the list
    setComments(comments.filter((comment) => comment.id !== commentId));

    toast({
      title: "Comment deleted",
      description: "Your comment has been deleted successfully",
    });
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
      </div>

      {currentUserId && (
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}

      {!currentUserId && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p>Please sign in to join the discussion</p>
          </CardContent>
        </Card>
      )}

      {comments.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment.author.picture || "/placeholder.svg"}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {comment.author.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {currentUserId === comment.author.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pl-14">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
              <CardFooter className="pt-2 pl-14 flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDislikeComment(comment.id)}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span>{comment.dislikes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground ml-auto"
                >
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Report</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
