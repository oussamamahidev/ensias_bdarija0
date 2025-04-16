import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeBaseListProps {
  articles: any[];
  categories: { value: string; label: string }[];
  currentCategory?: string;
  searchQuery?: string;
}

export default function KnowledgeBaseList({
  articles,
  categories,
  currentCategory,
  searchQuery,
}: KnowledgeBaseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          href={`/knowledge-base/${article.slug}`}
          key={article._id}
          className="block h-full transition-transform hover:scale-[1.02]"
        >
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">
                  {categories.find((cat) => cat.value === article.category)
                    ?.label || article.category}
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views}
                </div>
              </div>
              <CardTitle className="text-xl line-clamp-2">
                {article.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2">
                {article.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                ...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                  {article.author.picture ? (
                    <img
                      src={article.author.picture || "/placeholder.svg"}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary-500" />
                  )}
                </div>
                <span className="text-sm">{article.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ThumbsUp className="h-4 w-4 text-primary-500" />
                <span>{article.likes?.length || 0}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
