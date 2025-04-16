import { getCodeChallengeBySlug } from "@/lib/actions/expert.action";

import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import CodeChallengeDetail from "@/components/expert/CodeChallengeDetail";

interface CodeChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CodeChallengePage({
  params,
}: CodeChallengePageProps) {
  const { slug } = await params;

  // Get the challenge
  const challenge = await getCodeChallengeBySlug({ slug });

  // Get current user
  const { userId: clerkId } = await auth();
  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <CodeChallengeDetail challenge={challenge} currentUserId={mongoUser?._id} />
  );
}
