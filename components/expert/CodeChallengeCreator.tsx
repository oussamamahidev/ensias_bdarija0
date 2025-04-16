"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Code,
  Loader2,
  Play,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import these from your API actions
import {
  createCodeChallenge,
  updateCodeChallenge,
} from "@/lib/actions/expert.action";
import { CodeChallenge, TestCase } from "@/types/code-challenge";
import { useToast } from "../ui/use-toast";

interface CodeChallengeCreatorProps {
  mongoUserId: string;
  isEditing?: boolean;
  challengeToEdit?: CodeChallenge;
  onUpdateSuccess?: (updatedChallenge: CodeChallenge) => void;
  onCancel?: () => void;
}

export default function CodeChallengeCreator({
  mongoUserId,
  isEditing = false,
  challengeToEdit,
  onUpdateSuccess,
  onCancel,
}: CodeChallengeCreatorProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "", id: Date.now() },
  ]);
  const [starterCode, setStarterCode] = useState("// Your code here");

  // UI state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("code");

  // Initialize form with challenge data if editing
  useEffect(() => {
    if (isEditing && challengeToEdit) {
      setTitle(challengeToEdit.title);
      setDifficulty(challengeToEdit.difficulty);
      setDescription(challengeToEdit.description);
      setTags([...challengeToEdit.tags]); // Create a new array to avoid reference issues
      setStarterCode(challengeToEdit.starterCode);

      // Convert test cases to include id for UI management
      if (challengeToEdit.testCases && challengeToEdit.testCases.length > 0) {
        const formattedTestCases = challengeToEdit.testCases.map(
          (tc, index) => ({
            ...tc,
            id: Date.now() + index,
          })
        );
        setTestCases(formattedTestCases);
      }
    }
  }, [isEditing, challengeToEdit]);

  // Form validation
  const validateForm = (isPublishing: boolean) => {
    // For publishing, we need all fields
    if (isPublishing) {
      if (!title.trim()) {
        setError("Please provide a title for your challenge.");
        return false;
      }
      if (!difficulty) {
        setError("Please select a difficulty level.");
        return false;
      }
      if (!description.trim()) {
        setError("Please provide a description for your challenge.");
        return false;
      }
      if (tags.length === 0) {
        setError("Please add at least one tag.");
        return false;
      }

      // Validate test cases
      const invalidTestCases = testCases.filter(
        (tc) => !tc.input.trim() || !tc.expectedOutput.trim()
      );
      if (invalidTestCases.length > 0) {
        setError("All test cases must have both input and expected output.");
        return false;
      }
    }
    // For drafts, we only need a title
    else if (!title.trim()) {
      setError("Please provide a title for your draft.");
      return false;
    }

    return true;
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Test case management
  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", expectedOutput: "", id: Date.now() },
    ]);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((testCase) => testCase.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one test case.",
        variant: "destructive",
      });
    }
  };

  const updateTestCase = (
    id: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    setTestCases(
      testCases.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      )
    );
  };

  // Handle form submission for publishing
  const handlePublish = async () => {
    if (!validateForm(true)) return;
    if (!mongoUserId) {
      setError(
        "User authentication error. Please try logging out and back in."
      );
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      // Prepare test cases for submission (remove UI-specific id)
      const submissionTestCases = testCases.map(
        ({ input, expectedOutput }) => ({
          input,
          expectedOutput,
        })
      );

      if (isEditing && challengeToEdit) {
        // Update existing challenge
        const updatedChallenge = await updateCodeChallenge({
          challengeId: challengeToEdit._id,
          title,
          description,
          difficulty: difficulty as
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert",
          tags,
          starterCode,
          testCases: submissionTestCases,
          path: "/expert",
          published: true,
        });

        toast({
          title: "Challenge updated!",
          description: "Your coding challenge has been updated and published.",
        });

        if (onUpdateSuccess) {
          onUpdateSuccess(updatedChallenge);
        }
      } else {
        // Create new challenge
        await createCodeChallenge({
          title,
          description,
          difficulty: difficulty as
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert",
          tags,
          author: mongoUserId,
          starterCode,
          testCases: submissionTestCases,
          path: "/expert",
          published: true,
        });

        toast({
          title: "Challenge created!",
          description: "Your coding challenge has been published successfully.",
        });

        router.push("/code-challenges");
      }
    } catch (error) {
      console.error("Error publishing challenge:", error);
      setError("Failed to publish challenge. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle form submission for saving as draft
  const handleSaveDraft = async () => {
    if (!validateForm(false)) return;
    if (!mongoUserId) {
      setError(
        "User authentication error. Please try logging out and back in."
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Prepare test cases for submission (remove UI-specific id)
      const submissionTestCases = testCases.map(
        ({ input, expectedOutput }) => ({
          input: input || "test input",
          expectedOutput: expectedOutput || "test output",
        })
      );

      if (isEditing && challengeToEdit) {
        // Update existing challenge as draft
        const updatedChallenge = await updateCodeChallenge({
          challengeId: challengeToEdit._id,
          title,
          description: description || "Draft description",
          difficulty:
            (difficulty as
              | "beginner"
              | "intermediate"
              | "advanced"
              | "expert") || "beginner",
          tags: tags.length > 0 ? tags : ["draft"],
          starterCode,
          testCases: submissionTestCases,
          path: "/expert",
          published: false,
        });

        toast({
          title: "Draft updated!",
          description: "Your challenge draft has been updated successfully.",
        });

        if (onUpdateSuccess) {
          onUpdateSuccess(updatedChallenge);
        }
      } else {
        // Create new draft
        await createCodeChallenge({
          title,
          description: description || "Draft description",
          difficulty:
            (difficulty as
              | "beginner"
              | "intermediate"
              | "advanced"
              | "expert") || "beginner",
          tags: tags.length > 0 ? tags : ["draft"],
          author: mongoUserId,
          starterCode,
          testCases: submissionTestCases,
          path: "/expert",
          published: false,
        });

        toast({
          title: "Draft saved!",
          description: "Your challenge draft has been saved successfully.",
        });

        router.push("/expert-dashboard");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Test the challenge (simulated)
  const handleTestChallenge = () => {
    // Validate test cases
    const invalidTestCases = testCases.filter(
      (tc) => !tc.input.trim() || !tc.expectedOutput.trim()
    );

    if (invalidTestCases.length > 0) {
      setError(
        "All test cases must have both input and expected output for testing."
      );
      return;
    }

    toast({
      title: "Testing challenge",
      description: "Your challenge is being tested. This is a simulated test.",
    });

    // In a real implementation, you would send the code to a server for execution
    setTimeout(() => {
      toast({
        title: "Tests passed!",
        description: "All test cases passed successfully.",
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary-500/20">
        <CardHeader className="bg-primary-500/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Code className="h-6 w-6 text-primary-500" />
            {isEditing ? "Edit Coding Challenge" : "Create Coding Challenge"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your existing coding challenge"
              : "Design coding challenges for the community to solve and learn from"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Title and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Challenge Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="E.g., Binary Search Implementation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">
                  Difficulty Level <span className="text-red-500">*</span>
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>
                Tags <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., algorithms, arrays, sorting)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  aria-label="Add tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Challenge Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the problem, constraints, and expected output..."
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Test Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  Test Cases <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  onClick={addTestCase}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Test Case
                </Button>
              </div>

              {testCases.map((testCase, index) => (
                <div
                  key={testCase.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`input-${testCase.id}`}>
                      Input <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id={`input-${testCase.id}`}
                      placeholder="Input values"
                      value={testCase.input}
                      onChange={(e) =>
                        updateTestCase(testCase.id!, "input", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`output-${testCase.id}`}>
                      Expected Output <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id={`output-${testCase.id}`}
                      placeholder="Expected output"
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        updateTestCase(
                          testCase.id!,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => removeTestCase(testCase.id!)}
                      variant="ghost"
                      size="sm"
                      disabled={testCases.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Starter Code */}
            <div className="space-y-2">
              <Label htmlFor="starter-code">Starter Code</Label>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="code">
                  <Textarea
                    id="starter-code"
                    className="font-mono min-h-[200px]"
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono whitespace-pre-wrap overflow-auto">
                    {starterCode}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating Draft..." : "Saving Draft..."}
                </>
              ) : isEditing ? (
                "Update as Draft"
              ) : (
                "Save Draft"
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleTestChallenge}
            >
              <Play className="h-4 w-4" />
              Test Challenge
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Update & Publish" : "Publish Challenge"}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
