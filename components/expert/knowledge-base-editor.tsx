"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Editor } from "@tinymce/tinymce-react";
import { FileText, Save, Loader2, AlertCircle } from "lucide-react";
import {
  createKnowledgeBaseArticle,
  updateKnowledgeBaseArticle,
} from "@/lib/actions/expert.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

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

const KnowledgeBaseEditor = ({
  mongoUserId,
  isEditing = false,
  articleToEdit,
  onUpdateSuccess,
}: KnowledgeBaseEditorProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(articleToEdit?.title || "");
  const [category, setCategory] = useState(articleToEdit?.category || "");
  const [content, setContent] = useState(articleToEdit?.content || "");
  const [published, setPublished] = useState(articleToEdit?.published || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [error, setError] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // Check for TinyMCE API key on component mount
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY;
    if (!apiKey) {
      setEditorError(
        "TinyMCE API key is missing. Please add it to your environment variables."
      );
    }
  }, []);

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

  const handleEditorInit = (editor: any) => {
    editorRef.current = editor;
    setEditorLoaded(true);
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

  const renderMarkdownPreview = () => {
    // For TinyMCE, we can just return the HTML content directly
    return content;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-2 border-primary-500/20">
        <CardHeader className="bg-primary-500/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-500" />
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

          {editorError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Editor Error</AlertTitle>
              <AlertDescription>{editorError}</AlertDescription>
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
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-2">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_, editor) => handleEditorInit(editor)}
                  value={content}
                  onEditorChange={(newContent) => setContent(newContent)}
                  init={{
                    height: 500,
                    menubar: true,
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
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Inter,sans-serif; font-size:16px }",
                    images_upload_handler: (blobInfo, progress) =>
                      new Promise((resolve, reject) => {
                        // In a real app, you would upload to your server or a service like Cloudinary
                        const reader = new FileReader();
                        reader.onload = () => {
                          resolve(reader.result as string);
                        };
                        reader.onerror = () => {
                          reject("Failed to read file");
                        };
                        reader.readAsDataURL(blobInfo.blob());
                      }),
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
                <div className="min-h-[500px] p-4 border rounded-md overflow-auto">
                  {content ? (
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdownPreview(),
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground italic flex items-center justify-center h-full">
                      Preview will appear here...
                    </div>
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
};

export default KnowledgeBaseEditor;
