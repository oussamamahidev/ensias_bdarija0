import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, ThumbsUp } from "lucide-react"

interface RelatedArticle {
  _id: string
  title: string
  slug: string
  category: string
  views: number
  likes: string[]
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  categories: { value: string; label: string }[]
  currentArticleId: string
}

export default function RelatedArticles({ articles, categories, currentArticleId }: RelatedArticlesProps) {
  // Filter out the current article
  const filteredArticles = articles.filter((article) => article._id !== currentArticleId)

  if (filteredArticles.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.slice(0, 4).map((article) => (
          <Link
            href={`/knowledge-base/${article.slug}`}
            key={article._id}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">
                    {categories.find((cat) => cat.value === article.category)?.label || article.category}
                  </Badge>
                </div>
                <CardTitle className="text-base line-clamp-2 mt-2">{article.title}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{article.likes?.length || 0}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
