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
  Code,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Search,
  Tag,
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

import CodeChallengeCreator from "./CodeChallengeCreator";
import { CodeChallenge } from "@/types/code-challenge";
import { useToast } from "../ui/use-toast";
import { deleteCodeChallenge } from "@/lib/actions/expert.action";

interface CodeChallengeManagerProps {
  mongoUserId: string;
  initialChallenges: CodeChallenge[];
}

export default function CodeChallengeManager({
  mongoUserId,
  initialChallenges,
}: CodeChallengeManagerProps) {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [challenges, setChallenges] =
    useState<CodeChallenge[]>(initialChallenges);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentChallenge, setCurrentChallenge] =
    useState<CodeChallenge | null>(null);

  // Filter challenges based on search query and active tab
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "published") return matchesSearch && challenge.published;
    if (activeTab === "drafts") return matchesSearch && !challenge.published;

    return matchesSearch;
  });

  // Handle challenge deletion
  const handleDelete = async (challengeId: string) => {
    try {
      await deleteCodeChallenge(challengeId, "/expert-dashboard");

      // Update local state
      setChallenges(
        challenges.filter((challenge) => challenge._id !== challengeId)
      );

      toast({
        title: "Challenge deleted",
        description: "The coding challenge has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting challenge:", error);
      toast({
        title: "Error",
        description: "Failed to delete the challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle challenge editing
  const handleEdit = (challenge: CodeChallenge) => {
    setCurrentChallenge(challenge);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setCurrentChallenge(null);
    setIsEditing(false);
  };

  const handleUpdateSuccess = (updatedChallenge: CodeChallenge) => {
    // Update local state
    setChallenges(
      challenges.map((challenge) =>
        challenge._id === updatedChallenge._id ? updatedChallenge : challenge
      )
    );

    setIsEditing(false);
    setCurrentChallenge(null);

    toast({
      title: "Challenge updated",
      description: "The coding challenge has been successfully updated.",
    });
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-500 text-white",
      intermediate: "bg-blue-500 text-white",
      advanced: "bg-orange-500 text-white",
      expert: "bg-red-500 text-white",
    };

    return colors[difficulty] || "bg-gray-500 text-white";
  };

  // If in editing mode, show the editor
  if (isEditing && currentChallenge) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Challenge</h2>
          <Button variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
        <CodeChallengeCreator
          mongoUserId={mongoUserId}
          isEditing={true}
          challengeToEdit={currentChallenge}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Code Challenges</h2>
        <Button onClick={() => router.push("/expert-dashboard?tab=challenges")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Challenge
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Challenges</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredChallenges.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Code className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No challenges found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? "We couldn't find any challenges matching your search criteria."
                  : activeTab === "drafts"
                  ? "You don't have any draft challenges yet."
                  : activeTab === "published"
                  ? "You haven't published any challenges yet."
                  : "You haven't created any challenges yet."}
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/expert-dashboard?tab=challenges")}
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge
                    variant={challenge.published ? "default" : "outline"}
                    className="mb-2"
                  >
                    {challenge.published ? "Published" : "Draft"}
                  </Badge>
                  <Badge
                    className={`border-none ${getDifficultyColor(
                      challenge.difficulty
                    )}`}
                  >
                    {challenge.difficulty.charAt(0).toUpperCase() +
                      challenge.difficulty.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{challenge.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag: any, index: any) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(challenge.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div>{challenge.submissions?.length || 0} submissions</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/code-challenges/${challenge.slug}`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(challenge)}
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
                        delete the challenge "{challenge.title}" and remove it
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(challenge._id)}
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
}
