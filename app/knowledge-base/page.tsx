import { getKnowledgeBaseArticles } from "@/lib/actions/expert.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search } from "lucide-react";
import Link from "next/link";
import KnowledgeBaseList from "@/components/expert/knowledge-base-list";

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
        <KnowledgeBaseList
          articles={articles}
          categories={categories}
          currentCategory={category}
          searchQuery={q}
        />
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
