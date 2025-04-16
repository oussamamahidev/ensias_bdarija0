"use client";

import { useState } from "react";
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
import { Code, Play, Plus, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useToast } from "../ui/use-toast";

const CodeChallengeCreator = () => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "", id: Date.now() },
  ]);
  const [starterCode, setStarterCode] = useState("// Your code here");
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", expectedOutput: "", id: Date.now() },
    ]);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((testCase) => testCase.id !== id));
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

  const handlePublish = async () => {
    if (!title || !difficulty || !description || tags.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields before publishing.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Challenge created!",
        description: "Your coding challenge has been published successfully.",
      });
      setIsPublishing(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary-500/20">
        <CardHeader className="bg-primary-500/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Code className="h-6 w-6 text-primary-500" />
            Create Coding Challenge
          </CardTitle>
          <CardDescription>
            Design coding challenges for the community to solve and learn from
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  placeholder="E.g., Binary Search Implementation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
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

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Challenge Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem, constraints, and expected output..."
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Test Cases</Label>
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
                    <Label htmlFor={`input-${testCase.id}`}>Input</Label>
                    <Textarea
                      id={`input-${testCase.id}`}
                      placeholder="Input values"
                      value={testCase.input}
                      onChange={(e) =>
                        updateTestCase(testCase.id, "input", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`output-${testCase.id}`}>
                      Expected Output
                    </Label>
                    <Textarea
                      id={`output-${testCase.id}`}
                      placeholder="Expected output"
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        updateTestCase(
                          testCase.id,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => removeTestCase(testCase.id)}
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

            <div className="space-y-2">
              <Label htmlFor="starter-code">Starter Code</Label>
              <Tabs defaultValue="code">
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
                  <div className="bg-muted p-4 rounded-md min-h-[200px] font-mono whitespace-pre-wrap">
                    {starterCode}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
          <Button variant="outline">Save Draft</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Test Challenge
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isPublishing ? "Publishing..." : "Publish Challenge"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodeChallengeCreator;
