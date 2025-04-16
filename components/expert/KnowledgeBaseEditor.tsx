"use client";

import type React from "react";

import { useState, useRef } from "react";
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
  FileCode,
  FileText,
  ImageIcon,
  LinkIcon,
  List,
  ListOrdered,
  Save,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Code,
  Quote,
} from "lucide-react";
import { createKnowledgeBaseArticle } from "@/lib/actions/expert.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";

const KnowledgeBaseEditor = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePublish = async () => {
    if (!title || !category || !content) {
      setError("Please fill in all required fields before publishing.");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      // Get the current user ID from localStorage or session
      // This is a placeholder - you should use your actual auth system
      const authorId = localStorage.getItem("userId") || "user_id_placeholder";

      await createKnowledgeBaseArticle({
        title,
        content,
        category,
        author: authorId,
        path: "/expert-dashboard",
        published: true,
      });

      toast({
        title: "Knowledge base article published!",
        description: "Your article has been published successfully.",
      });

      // Redirect to the knowledge base page
      router.push("/knowledge-base");
    } catch (error) {
      console.error("Error publishing article:", error);
      setError("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title) {
      setError("Please provide a title for your draft.");
      return;
    }

    try {
      // Get the current user ID from localStorage or session
      const authorId = localStorage.getItem("userId") || "user_id_placeholder";

      await createKnowledgeBaseArticle({
        title,
        content: content || "Draft content",
        category: category || "uncategorized",
        author: authorId,
        path: "/expert-dashboard",
        published: false,
      });

      toast({
        title: "Draft saved!",
        description: "Your article draft has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft. Please try again.");
    }
  };

  const insertToTextarea = (insertText: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setContent(before + insertText + after);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + insertText.length;
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // In a real implementation, you would upload the file to your server or a service like Cloudinary
      // For now, we'll create a data URL as a placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        insertToTextarea(`\n![${file.name}](${imageUrl})\n`);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image added",
        description: "Your image has been added to the article.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const insertCodeBlock = () => {
    insertToTextarea("\n```javascript\n// Your code here\n```\n");
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    const text = prompt("Enter link text:");
    if (url && text) {
      insertToTextarea(`[${text}](${url})`);
    }
  };

  const renderMarkdownPreview = () => {
    // Simple markdown to HTML conversion for preview
    // In a real app, you'd use a proper markdown parser like marked or remark
    const html = content
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gm, "<em>$1</em>")
      .replace(
        /!\[(.*?)\]$$(.*?)$$/gm,
        '<img alt="$1" src="$2" style="max-width: 100%;" />'
      )
      .replace(/\[(.*?)\]$$(.*?)$$/gm, '<a href="$2">$1</a>')
      .replace(/```([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/gm, "<code>$1</code>")
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gm, "<ul><li>$1</li></ul>")
      .replace(/^[0-9]+\. (.*$)/gm, "<ol><li>$1</li></ol>")
      .replace(/\n/gm, "<br />");

    return html;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary-500/20">
        <CardHeader className="bg-primary-500/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-500" />
            Knowledge Base Editor
          </CardTitle>
          <CardDescription>
            Create and publish official documentation as an expert contributor
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="getting-started">
                      Getting Started
                    </SelectItem>
                    <SelectItem value="tutorials">Tutorials</SelectItem>
                    <SelectItem value="best-practices">
                      Best Practices
                    </SelectItem>
                    <SelectItem value="troubleshooting">
                      Troubleshooting
                    </SelectItem>
                    <SelectItem value="api-reference">API Reference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <div className="border rounded-md mt-2 p-1">
                <div className="bg-muted p-1 rounded flex items-center gap-1 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("**Bold text**")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("*Italic text*")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("\n# Heading 1\n")}
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("\n## Heading 2\n")}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={insertCodeBlock}>
                    <FileCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleImageUpload}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onImageSelected}
                  />
                  <Button variant="ghost" size="sm" onClick={insertLink}>
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      insertToTextarea("\n- List item\n- Another item\n")
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      insertToTextarea("\n1. First item\n2. Second item\n")
                    }
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("\n> Blockquote text\n")}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertToTextarea("`Inline code`")}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
                <TabsContent value="write" className="mt-0">
                  <Textarea
                    placeholder="Write your article content here using Markdown..."
                    className="min-h-[400px] resize-none border-0 focus-visible:ring-0"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className="min-h-[400px] p-4 prose dark:prose-invert max-w-none overflow-auto">
                    {content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdownPreview(),
                        }}
                      />
                    ) : (
                      <div className="text-muted-foreground italic">
                        Preview will appear here...
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isPublishing ? "Publishing..." : "Publish Article"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KnowledgeBaseEditor;
