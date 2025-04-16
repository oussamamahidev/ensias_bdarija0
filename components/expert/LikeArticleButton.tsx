"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { likeKnowledgeBaseArticle } from "@/lib/actions/expert.action";
import { usePathname } from "next/navigation";

interface LikeArticleButtonProps {
  articleId: string;
  userId: string;
  initialLiked: boolean;
  likeCount: number;
}

const LikeArticleButton = ({
  articleId,
  userId,
  initialLiked,
  likeCount,
}: LikeArticleButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleLike = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      await likeKnowledgeBaseArticle(articleId, userId, pathname);

      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className="gap-2"
    >
      <ThumbsUp className="h-4 w-4" />
      <span>{isLiked ? "Liked" : "Like"}</span>
      <span className="ml-1">({likes})</span>
    </Button>
  );
};

export default LikeArticleButton;
