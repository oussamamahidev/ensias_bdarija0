"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Eye, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeBaseDetailProps {
  article: {
    _id: string;
    title: string;
    content: string;
    category: string;
    published: boolean;
    views: number;
    likes: string[];
    createdAt: string;
    updatedAt: string;
    slug: string;
    author: {
      name: string;
      picture?: string;
    };
  };
  currentUserId?: string;
  isLiked?: boolean;
}

export default function KnowledgeBaseDetail({
  article,
  currentUserId,
  isLiked = false,
}: KnowledgeBaseDetailProps) {
  const [likeCount, setLikeCount] = useState(article.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(isLiked);
  const { toast } = useToast();

  // Format the category label
  const categoryLabels: Record<string, string> = {
    "getting-started": "Getting Started",
    tutorials: "Tutorials",
    "best-practices": "Best Practices",
    troubleshooting: "Troubleshooting",
    "api-reference": "API Reference",
  };

  const categoryLabel = categoryLabels[article.category] || article.category;

  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would call your API to like/unlike the article
      // const response = await likeArticle(article._id, currentUserId);

      // For now, we'll just toggle the state
      setHasLiked(!hasLiked);
      setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);

      toast({
        title: hasLiked ? "Article unliked" : "Article liked",
        description: hasLiked
          ? "You've removed your like"
          : "Thanks for your feedback!",
      });
    } catch (error) {
      console.error("Error liking article:", error);
      toast({
        title: "Something went wrong",
        description: "Could not process your like. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/knowledge-base" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Base
          </Link>
        </Button>

        <Badge variant="outline" className="mb-4">
          {categoryLabel}
        </Badge>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
              {article.author.picture ? (
                <img
                  src={article.author.picture || "/placeholder.svg"}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-primary-500" />
              )}
            </div>
            <span>{article.author.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(article.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.views} views</span>
          </div>

          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{likeCount} likes</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary-500" />
          <span className="text-sm text-muted-foreground">
            Last updated:{" "}
            {formatDistanceToNow(
              new Date(article.updatedAt || article.createdAt),
              { addSuffix: true }
            )}
          </span>
        </div>

        {currentUserId && (
          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{hasLiked ? "Liked" : "Like"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
