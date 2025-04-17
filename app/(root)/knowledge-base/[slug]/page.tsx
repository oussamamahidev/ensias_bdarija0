import { getKnowledgeBaseArticleBySlug } from "@/lib/actions/expert.action";

import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import KnowledgeBaseDetail from "@/components/expert/knowledge-base-detail";

interface KnowledgeBaseArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function KnowledgeBaseArticlePage({
  params,
}: KnowledgeBaseArticlePageProps) {
  const { slug } = await params;

  // Get the article
  const article = await getKnowledgeBaseArticleBySlug({ slug });

  // Get current user
  const { userId: clerkId } = await auth();
  let mongoUser;
  let isLiked = false;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
    isLiked = article.likes?.includes(mongoUser?._id);
  }

  return (
    <KnowledgeBaseDetail
      article={article}
      currentUserId={mongoUser?._id}
      isLiked={isLiked}
    />
  );
}
