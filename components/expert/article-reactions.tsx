"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  Heart,
  Lightbulb,
  Rocket,
  Coffee,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ArticleReactionsProps {
  articleId: string;
  currentUserId?: string;
  initialReactions: {
    likes: number;
    hearts: number;
    insights: number;
    rockets: number;
    coffees: number;
  };
  initialUserReactions?: {
    liked: boolean;
    hearted: boolean;
    insighted: boolean;
    rocketed: boolean;
    coffeed: boolean;
    bookmarked: boolean;
  };
}

export default function ArticleReactions({
  articleId,
  currentUserId,
  initialReactions,
  initialUserReactions = {
    liked: false,
    hearted: false,
    insighted: false,
    rocketed: false,
    coffeed: false,
    bookmarked: false,
  },
}: ArticleReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const { toast } = useToast();

  const handleReaction = (type: keyof typeof initialUserReactions) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to react to articles",
        variant: "destructive",
      });
      return;
    }

    // Toggle the reaction
    const newUserReactions = { ...userReactions };
    newUserReactions[type] = !userReactions[type];
    setUserReactions(newUserReactions);

    // Update the reaction count
    const newReactions = { ...reactions };
    if (type === "liked") {
      newReactions.likes += newUserReactions.liked ? 1 : -1;
    } else if (type === "hearted") {
      newReactions.hearts += newUserReactions.hearted ? 1 : -1;
    } else if (type === "insighted") {
      newReactions.insights += newUserReactions.insighted ? 1 : -1;
    } else if (type === "rocketed") {
      newReactions.rockets += newUserReactions.rocketed ? 1 : -1;
    } else if (type === "coffeed") {
      newReactions.coffees += newUserReactions.coffeed ? 1 : -1;
    }
    setReactions(newReactions);

    // Show a toast
    if (type !== "bookmarked") {
      toast({
        title: newUserReactions[type] ? "Reaction added" : "Reaction removed",
        description: newUserReactions[type]
          ? "Thanks for your feedback!"
          : "Your reaction has been removed",
      });
    } else {
      toast({
        title: newUserReactions.bookmarked
          ? "Article bookmarked"
          : "Bookmark removed",
        description: newUserReactions.bookmarked
          ? "This article has been added to your bookmarks"
          : "This article has been removed from your bookmarks",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Article link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.liked ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("liked")}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{reactions.likes}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userReactions.liked ? "Unlike" : "Like"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.hearted ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("hearted")}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              <span>{reactions.hearts}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userReactions.hearted ? "Remove Love" : "Love"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.insighted ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("insighted")}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{reactions.insights}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {userReactions.insighted ? "Remove Insightful" : "Insightful"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.rocketed ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("rocketed")}
              className="flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              <span>{reactions.rockets}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userReactions.rocketed ? "Remove Rocket" : "Rocket"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.coffeed ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("coffeed")}
              className="flex items-center gap-2"
            >
              <Coffee className="h-4 w-4" />
              <span>{reactions.coffees}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userReactions.coffeed ? "Remove Coffee" : "Buy me a coffee"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userReactions.bookmarked ? "default" : "outline"}
              size="sm"
              onClick={() => handleReaction("bookmarked")}
              className="flex items-center gap-2"
            >
              <BookmarkPlus className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {userReactions.bookmarked
                ? "Remove from bookmarks"
                : "Add to bookmarks"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShare}>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                >
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                >
                  LinkedIn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this article</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
