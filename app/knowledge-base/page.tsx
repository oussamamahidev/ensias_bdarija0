import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Eye, FileText, Search, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { getKnowledgeBaseArticles } from "@/lib/actions/expert.action";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeBasePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function KnowledgeBasePage({
  searchParams,
}: KnowledgeBasePageProps) {
  const { category, q, page } = await searchParams;
  const currentPage = page ? Number.parseInt(page) : 1;

  const { articles, isNext } = await getKnowledgeBaseArticles({
    category,
    searchQuery: q,
    page: currentPage,
    pageSize: 9,
  });

  const categories = [
    { value: "getting-started", label: "Getting Started" },
    { value: "tutorials", label: "Tutorials" },
    { value: "best-practices", label: "Best Practices" },
    { value: "troubleshooting", label: "Troubleshooting" },
    { value: "api-reference", label: "API Reference" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Expert-written guides, tutorials, and documentation to help you
          succeed.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <form>
            <Input
              name="q"
              placeholder="Search knowledge base..."
              className="pl-10"
              defaultValue={q}
            />
          </form>
        </div>
        <Tabs defaultValue={category || "all"} className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all" asChild>
              <Link href="/knowledge-base">All</Link>
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} asChild>
                <Link href={`/knowledge-base?category=${cat.value}`}>
                  {cat.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No articles found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any articles matching your search criteria. Try
            adjusting your search or browse all articles.
          </p>
          <Button asChild className="mt-4">
            <Link href="/knowledge-base">View All Articles</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Card
              key={article._id}
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
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
                  <Link
                    href={`/knowledge-base/${article.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
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
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {currentPage > 1 && (
          <Button variant="outline" asChild>
            <Link
              href={`/knowledge-base?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(q ? { q } : {}),
                page: (currentPage - 1).toString(),
              })}`}
            >
              Previous
            </Link>
          </Button>
        )}
        {isNext && (
          <Button variant="outline" asChild>
            <Link
              href={`/knowledge-base?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(q ? { q } : {}),
                page: (currentPage + 1).toString(),
              })}`}
            >
              Next
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
