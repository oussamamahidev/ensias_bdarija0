"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteKnowledgeBaseArticle } from "@/lib/actions/expert.action";
import KnowledgeBaseEditor from "./KnowledgeBaseEditor";
import { useToast } from "../ui/use-toast";

interface KnowledgeBaseArticle {
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
}

interface KnowledgeBaseManagerProps {
  mongoUserId: string;
  initialArticles: KnowledgeBaseArticle[];
}

const KnowledgeBaseManager = ({
  mongoUserId,
  initialArticles,
}: KnowledgeBaseManagerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [articles, setArticles] =
    useState<KnowledgeBaseArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<KnowledgeBaseArticle | null>(null);

  // Filter articles based on search query and active tab
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "published") return matchesSearch && article.published;
    if (activeTab === "drafts") return matchesSearch && !article.published;

    return matchesSearch;
  });

  const handleDelete = async (articleId: string) => {
    try {
      await deleteKnowledgeBaseArticle(articleId, "/expert");

      // Update local state
      setArticles(articles.filter((article) => article._id !== articleId));

      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (article: KnowledgeBaseArticle) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCurrentArticle(null);
    setIsEditing(false);
  };

  const handleUpdateSuccess = (updatedArticle: KnowledgeBaseArticle) => {
    // Update local state
    setArticles(
      articles.map((article) =>
        article._id === updatedArticle._id ? updatedArticle : article
      )
    );

    setIsEditing(false);
    setCurrentArticle(null);

    toast({
      title: "Article updated",
      description: "The article has been successfully updated.",
    });
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "getting-started": "Getting Started",
      tutorials: "Tutorials",
      "best-practices": "Best Practices",
      troubleshooting: "Troubleshooting",
      "api-reference": "API Reference",
    };

    return categories[category] || category;
  };

  if (isEditing && currentArticle) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Article</h2>
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
        <KnowledgeBaseEditor
          mongoUserId={mongoUserId}
          isEditing={true}
          articleToEdit={currentArticle}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Knowledge Base</h2>
        <Button onClick={() => router.push("/expert?tab=knowledge-base")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Article
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredArticles.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "We couldn't find any articles matching your search criteria."
                  : activeTab === "drafts"
                  ? "You don't have any draft articles yet."
                  : activeTab === "published"
                  ? "You haven't published any articles yet."
                  : "You haven't created any articles yet."}
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/expert?tab=knowledge-base")}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Article
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map((article) => (
            <Card key={article._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={article.published ? "default" : "outline"}
                    className="mb-2"
                  >
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryLabel(article.category)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{article.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDistanceToNow(new Date(article.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-3 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/knowledge-base/${article.slug}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the article "{article.title}" and remove it from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(article._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseManager;
