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
import { Code, Search, Tag, User } from "lucide-react";
import Link from "next/link";
import { getCodeChallenges } from "@/lib/actions/expert.action";
import { formatDistanceToNow } from "date-fns";

interface CodeChallengesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CodeChallengesPage({
  searchParams,
}: CodeChallengesPageProps) {
  const { difficulty, tag, q, page } = await searchParams;
  const currentPage = page ? Number.parseInt(page) : 1;

  const { challenges, isNext } = await getCodeChallenges({
    difficulty,
    tags: tag ? [tag] : undefined,
    searchQuery: q,
    page: currentPage,
    pageSize: 9,
  });

  const difficultyLevels = [
    { value: "beginner", label: "Beginner", color: "bg-green-500" },
    { value: "intermediate", label: "Intermediate", color: "bg-blue-500" },
    { value: "advanced", label: "Advanced", color: "bg-orange-500" },
    { value: "expert", label: "Expert", color: "bg-red-500" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    return (
      difficultyLevels.find((level) => level.value === difficulty)?.color ||
      "bg-gray-500"
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Code Challenges</h1>
        <p className="text-muted-foreground">
          Test your skills with expert-created coding challenges and improve
          your problem-solving abilities.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <form>
            <Input
              name="q"
              placeholder="Search challenges..."
              className="pl-10"
              defaultValue={q}
            />
          </form>
        </div>
        <Tabs defaultValue={difficulty || "all"} className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all" asChild>
              <Link href="/code-challenges">All</Link>
            </TabsTrigger>
            {difficultyLevels.map((level) => (
              <TabsTrigger key={level.value} value={level.value} asChild>
                <Link href={`/code-challenges?difficulty=${level.value}`}>
                  {level.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {challenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Code className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No challenges found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any challenges matching your search criteria. Try
            adjusting your search or browse all challenges.
          </p>
          <Button asChild className="mt-4">
            <Link href="/code-challenges">View All Challenges</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge: any) => (
            <Card
              key={challenge._id}
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge
                    variant="outline"
                    className={`mb-2 ${getDifficultyColor(
                      challenge.difficulty
                    )} text-white border-none`}
                  >
                    {difficultyLevels.find(
                      (level) => level.value === challenge.difficulty
                    )?.label || challenge.difficulty}
                  </Badge>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>
                      {challenge.submissions?.length || 0} submissions
                    </span>
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  <Link
                    href={`/code-challenges/${challenge.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {challenge.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3 mt-2">
                  {challenge.description.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                    {challenge.author.picture ? (
                      <img
                        src={challenge.author.picture || "/placeholder.svg"}
                        alt={challenge.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary-500" />
                    )}
                  </div>
                  <span className="text-sm">{challenge.author.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(challenge.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {currentPage > 1 && (
          <Button variant="outline" asChild>
            <Link
              href={`/code-challenges?${new URLSearchParams({
                ...(difficulty ? { difficulty } : {}),
                ...(tag ? { tag } : {}),
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
              href={`/code-challenges?${new URLSearchParams({
                ...(difficulty ? { difficulty } : {}),
                ...(tag ? { tag } : {}),
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
