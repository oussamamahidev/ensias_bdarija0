"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, Save, Loader2, AlertCircle } from "lucide-react";
import {
  createKnowledgeBaseArticle,
  updateKnowledgeBaseArticle,
} from "@/lib/actions/expert.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeProvider";

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

interface KnowledgeBaseEditorProps {
  mongoUserId: string;
  isEditing?: boolean;
  articleToEdit?: KnowledgeBaseArticle;
  onUpdateSuccess?: (article: KnowledgeBaseArticle) => void;
}

export default function KnowledgeBaseEditor({
  mongoUserId,
  isEditing = false,
  articleToEdit,
  onUpdateSuccess,
}: KnowledgeBaseEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(articleToEdit?.title || "");
  const [category, setCategory] = useState(articleToEdit?.category || "");
  const [content, setContent] = useState(articleToEdit?.content || "");
  const [published, setPublished] = useState(articleToEdit?.published || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const { mode } = useTheme();
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      setError("Please fill in all required fields before saving.");
      return;
    }

    if (!mongoUserId) {
      setError(
        "User authentication error. Please try logging out and back in."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && articleToEdit) {
        // Update existing article
        const updatedArticle = await updateKnowledgeBaseArticle({
          articleId: articleToEdit._id,
          title,
          content,
          category,
          published,
          path: "/expert",
        });

        toast({
          title: published
            ? "Article updated and published!"
            : "Article draft updated!",
          description: "Your article has been successfully updated.",
        });

        if (onUpdateSuccess) {
          onUpdateSuccess(updatedArticle);
        }
      } else {
        // Create new article
        await createKnowledgeBaseArticle({
          title,
          content,
          category,
          author: mongoUserId,
          path: "/expert",
          published,
        });

        toast({
          title: published ? "Article published!" : "Draft saved!",
          description: published
            ? "Your article has been published successfully."
            : "Your article draft has been saved successfully.",
        });

        // Redirect to the knowledge base page or manager
        router.push("/knowledge-base");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setError("Failed to save article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        if (editorRef.current) {
          editorRef.current.execCommand(
            "mceInsertContent",
            false,
            `<img src="${imageUrl}" alt="${file.name}" />`
          );
        }
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

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {isEditing
              ? "Edit Knowledge Base Article"
              : "Create Knowledge Base Article"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your existing knowledge base article"
              : "Create and publish official documentation as an expert contributor"}
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

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">
                {published ? "Publish immediately" : "Save as draft"}
              </Label>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setPreviewMode(value === "preview");
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-2">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_, editor) => {
                    editorRef.current = editor;
                  }}
                  onEditorChange={(newContent) => {
                    setContent(newContent);
                  }}
                  initialValue={articleToEdit?.content || ""}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "codesample | image link | removeformat",
                    content_style:
                      "body { font-family:Inter,sans-serif; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "default",
                    file_picker_types: "image",
                    file_picker_callback: (cb, value, meta) => {
                      // Trigger file input click
                      fileInputRef.current?.click();

                      // Listen for file input change
                      if (fileInputRef.current) {
                        fileInputRef.current.onchange = () => {
                          const file = fileInputRef.current?.files?.[0];
                          if (!file) return;

                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const imageUrl = e.target?.result as string;
                            cb(imageUrl, { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                      }
                    },
                  }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={onImageSelected}
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-2">
                <div className="min-h-[500px] w-full border rounded-xl p-4 overflow-y-auto bg-background">
                  {previewMode && (
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
          <Button
            variant="outline"
            onClick={() =>
              isEditing && onUpdateSuccess
                ? onUpdateSuccess(articleToEdit!)
                : router.back()
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing
                  ? "Update Article"
                  : published
                  ? "Publish Article"
                  : "Save Draft"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
