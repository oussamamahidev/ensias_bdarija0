"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Editor } from "@tinymce/tinymce-react"
import { z } from "zod"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Check, Code, ImageIcon, Lightbulb, Link, Sparkles, X, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { createQuestion } from "@/lib/actions/question.action"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/context/ThemeProvider"

// Popular tags for suggestions
const POPULAR_TAGS = [
  "javascript",
  "react",
  "nextjs",
  "node.js",
  "typescript",
  "css",
  "html",
  "tailwindcss",
  "api",
  "database",
  "mongodb",
  "prisma",
  "authentication",
  "deployment",
  "performance",
]

// Question schema with validation
const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(130, { message: "Title must be less than 130 characters" }),
  explanation: z.string().min(20, { message: "Explanation must be at least 20 characters" }),
  tags: z.array(z.string()).min(1, { message: "Add at least 1 tag" }).max(5, { message: "You can add up to 5 tags" }),
})

// AI suggestions for question improvement
const AI_SUGGESTIONS = [
  "Add code examples to illustrate your problem",
  "Describe what you've already tried",
  "Include error messages if applicable",
  "Specify your environment (browser, OS, etc.)",
  "Explain your expected outcome",
]

interface AskQuestionFormProps {
  mongoUserId: string
  userReputation?: number
  userImage?: string
  userName?: string
  type?: string
  questionDetails?: any
}

const AskQuestionForm = ({
  mongoUserId,
  userReputation = 0,
  userImage = "/assets/images/default-profile.png",
  userName = "Anonymous",
  type = "create",
  questionDetails,
}: AskQuestionFormProps) => {
  const editorRef = useRef<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [questionQuality, setQuestionQuality] = useState(0)
  const [showAIHelp, setShowAIHelp] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [previewMode, setPreviewMode] = useState(false)
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const { mode } = useTheme()

  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Parse question details if editing
  const parsedQuestionDetails = questionDetails
    ? typeof questionDetails === "string"
      ? JSON.parse(questionDetails)
      : questionDetails
    : {}

  const groupedTags = parsedQuestionDetails?.tags?.map((tag: any) => (typeof tag === "object" ? tag.name : tag)) || []

  // Form definition with validation
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  })

  // Calculate question quality score based on form values
  useEffect(() => {
    const values = form.getValues()
    let score = 0

    // Title quality
    if (values.title.length > 20) score += 20
    else if (values.title.length > 10) score += 10

    // Content quality
    if (values.explanation.length > 200) score += 40
    else if (values.explanation.length > 100) score += 20
    else if (values.explanation.length > 50) score += 10

    // Tags quality
    score += values.tags.length * 10

    // Cap at 100
    setQuestionQuality(Math.min(score, 100))
  }, [form.watch("title"), form.watch("explanation"), form.watch("tags")])

  // Filter tag suggestions based on input
  useEffect(() => {
    if (tagInput.length > 0) {
      const filtered = POPULAR_TAGS.filter(
        (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !form.getValues().tags.includes(tag),
      ).slice(0, 5)
      setTagSuggestions(filtered)
      setShowTagSuggestions(filtered.length > 0)
    } else {
      setShowTagSuggestions(false)
    }
  }, [tagInput, form])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    try {
      setIsSubmitting(true)

      if (type === "edit" && parsedQuestionDetails?._id) {
        // Handle edit question logic here
        // await editQuestion({
        //   questionId: parsedQuestionDetails._id,
        //   title: values.title,
        //   content: values.explanation,
        //   path: pathname,
        // })
        // router.push(`/question/${parsedQuestionDetails._id}`)
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author:
            typeof mongoUserId === "string" && mongoUserId.startsWith("{") ? JSON.parse(mongoUserId) : mongoUserId,
          path: pathname,
        })

        toast({
          title: "Question posted successfully! 🎉",
          description: "Your question is now live. You'll be notified when someone answers.",
          variant: "default",
        })

        router.push("/")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Something went wrong",
        description: "Your question couldn't be posted. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle tag input keydown events
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Add a tag to the form
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !form.getValues().tags.includes(trimmedTag)) {
      if (trimmedTag.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be less than 15 characters",
        })
        return
      }

      if (form.getValues().tags.length >= 5) {
        form.setError("tags", {
          type: "manual",
          message: "You can add up to 5 tags",
        })
        return
      }

      form.setValue("tags", [...form.getValues().tags, trimmedTag])
      form.clearErrors("tags")
      setTagInput("")
      setShowTagSuggestions(false)
    }
  }

  // Remove a tag from the form
  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      form.getValues().tags.filter((t) => t !== tag),
    )
  }

  // Generate a title using AI (simulated)
  const generateTitle = () => {
    const explanation = form.getValues().explanation
    if (explanation.length < 30) {
      toast({
        title: "Not enough content",
        description: "Please write more about your question first",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingTitle(true)

    // Simulate AI processing
    setTimeout(() => {
      // This would be replaced with actual AI generation
      const aiTitles = [
        "How to implement authentication in Next.js with Clerk?",
        "Best practices for state management in React applications",
        "Optimizing MongoDB queries for better performance",
        "Implementing responsive design with Tailwind CSS",
        "Handling form validation in React with Zod",
      ]

      form.setValue("title", aiTitles[Math.floor(Math.random() * aiTitles.length)])
      setIsGeneratingTitle(false)

      toast({
        title: "Title generated!",
        description: "Feel free to edit it to better match your question",
        variant: "default",
      })
    }, 1500)
  }

  // Get AI help for improving the question (simulated)
  const getAIHelp = () => {
    setShowAIHelp(true)

    // Simulate AI processing
    setTimeout(() => {
      const randomSuggestion = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)]
      setAiSuggestion(randomSuggestion)
    }, 800)
  }

  // Apply AI suggestion to the editor
  const applySuggestion = () => {
    if (editorRef.current && aiSuggestion) {
      const currentContent = editorRef.current.getContent()
      const updatedContent = currentContent + `\n\n**AI Suggestion:** ${aiSuggestion}\n\n`
      editorRef.current.setContent(updatedContent)
      form.setValue("explanation", updatedContent)
      setShowAIHelp(false)
      setAiSuggestion("")

      toast({
        title: "Suggestion applied!",
        description: "Your question has been improved",
        variant: "default",
      })
    }
  }

  return (
    <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-3 mb-6">
        <Image
          src={userImage || "/placeholder.svg"}
          alt={userName}
          width={40}
          height={40}
          className="rounded-full border-2 border-primary-500"
        />
        <div>
          <p className="font-medium text-dark100_light900">{userName}</p>
          <div className="flex items-center gap-1 text-sm text-dark500_light700">
            <Zap size={14} className="text-primary-500" />
            <span>{userReputation} reputation</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
          {/* Question Quality Meter */}
          <div className="w-full bg-light-800 dark:bg-dark-300 rounded-full h-2.5 mb-2">
            <div
              className="h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${questionQuality}%`,
                background:
                  questionQuality < 40
                    ? "linear-gradient(90deg, #f87171, #fb923c)"
                    : questionQuality < 70
                      ? "linear-gradient(90deg, #fb923c, #facc15)"
                      : "linear-gradient(90deg, #4ade80, #22c55e)",
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-dark500_light700">
            <span>Question Quality</span>
            <span className="font-medium">{questionQuality}%</span>
          </div>

          {/* Question Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Title <span className="text-primary-500">*</span>
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                    onClick={generateTitle}
                    disabled={isGeneratingTitle || type === "edit"}
                  >
                    {isGeneratingTitle ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-primary-500 animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} className="text-primary-500" />
                        <span>Generate Title</span>
                      </>
                    )}
                  </Button>
                </div>
                <FormControl>
                  <Input
                    className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border rounded-xl"
                    placeholder="e.g. How do I use useEffect in React?"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Be specific and imagine you're asking a question to another person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Question Content Field */}
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Detailed explanation <span className="text-primary-500">*</span>
                  </FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-xs"
                          onClick={getAIHelp}
                          disabled={type === "edit"}
                        >
                          <Lightbulb size={14} className="text-primary-500" />
                          <span>Get AI Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get AI suggestions to improve your question</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-2">
                    <TabsTrigger value="write" onClick={() => setPreviewMode(false)}>
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-0">
                    <FormControl>
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                        onInit={(_, editor) => {
                          editorRef.current = editor
                        }}
                        onBlur={field.onBlur}
                        onEditorChange={(content) => {
                          field.onChange(content)
                        }}
                        initialValue={parsedQuestionDetails?.content || ""}
                        init={{
                          height: 350,
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
                            "codesample | removeformat",
                          content_style: "body { font-family:Inter,sans-serif; font-size:16px }",
                          skin: mode === "dark" ? "oxide-dark" : "oxide",
                          content_css: mode === "dark" ? "dark" : "default",
                        }}
                      />
                    </FormControl>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[350px] w-full border rounded-xl p-4 overflow-y-auto background-light800_dark300">
                      {previewMode && (
                        <div
                          className="markdown prose dark:prose-invert max-w-full"
                          dangerouslySetInnerHTML={{ __html: form.getValues().explanation }}
                        />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                    onClick={() => {
                      if (editorRef.current) {
                        editorRef.current.execCommand(
                          "mceInsertContent",
                          false,
                          "<pre><code>// Your code here</code></pre>",
                        )
                      }
                    }}
                  >
                    <Code size={14} />
                    <span>Add Code</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                    onClick={() => {
                      if (editorRef.current) {
                        editorRef.current.execCommand("mceImage")
                      }
                    }}
                  >
                    <ImageIcon size={14} />
                    <span>Add Image</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs"
                    onClick={() => {
                      if (editorRef.current) {
                        editorRef.current.execCommand("mceLink")
                      }
                    }}
                  >
                    <Link size={14} />
                    <span>Add Link</span>
                  </Button>
                </div>

                <FormDescription className="body-regular text-light-500">
                  Introduce the problem and expand on what you put in the title. Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col space-y-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Add tags like 'javascript', 'react', 'nextjs'..."
                      className="no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border rounded-xl"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                      disabled={type === "edit"}
                    />
                  </FormControl>

                  {/* Tag suggestions dropdown */}
                  <AnimatePresence>
                    {showTagSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-1 w-full rounded-xl border border-light-700 dark:border-dark-400 bg-light-850 dark:bg-dark-300 shadow-md"
                      >
                        <ul className="py-2 px-2 max-h-40 overflow-auto">
                          {tagSuggestions.map((tag) => (
                            <li
                              key={tag}
                              className="cursor-pointer px-3 py-2 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg text-dark300_light700 transition-colors duration-200"
                              onClick={() => addTag(tag)}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected tags */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {field.value.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 px-4 py-2 rounded-lg capitalize"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-primary-500 hover:text-primary-600 focus:outline-none"
                        onClick={() => removeTag(tag)}
                        disabled={type === "edit"}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>

                <FormDescription className="body-regular text-light-500">
                  Add up to 5 tags to describe what your question is about. Press Enter or comma to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* AI Help Dialog */}
          <AnimatePresence>
            {showAIHelp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full rounded-xl border border-primary-500/30 bg-primary-500/5 p-4 mb-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary-500" />
                    <h3 className="font-semibold text-dark200_light900">AI Suggestion</h3>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAIHelp(false)}
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {aiSuggestion ? (
                  <>
                    <p className="text-dark300_light700 mb-4">{aiSuggestion}</p>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAIHelp(false)}>
                        Ignore
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={applySuggestion}
                        className="bg-primary-500 text-white hover:bg-primary-600"
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-primary-500 animate-spin"></div>
                    <span className="ml-2 text-dark300_light700">Analyzing your question...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips Card */}
          <Card className="bg-light-900 dark:bg-dark-300 border-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-primary-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-dark200_light900 mb-2">Tips for a great question</h4>
                  <ul className="text-dark400_light700 text-sm space-y-1 list-disc pl-4">
                    <li>Summarize your problem in a clear title</li>
                    <li>Describe what you've tried and what you expected</li>
                    <li>Add code examples if applicable</li>
                    <li>Use proper formatting for code and errors</li>
                    <li>Proofread for clarity and completeness</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="primary-gradient w-fit !text-light-900 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>{type === "edit" ? "Updating..." : "Posting..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <span>{type === "edit" ? "Update Question" : "Post Question"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AskQuestionForm

