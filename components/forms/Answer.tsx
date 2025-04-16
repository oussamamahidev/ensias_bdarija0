"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"

import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import { useMemo, useRef, useState } from "react"
import { useTheme } from "@/context/ThemeProvider"
import { Button } from "../ui/button"
import Image from "next/image"
import { createAnswer } from "@/lib/actions/answer.action"
import { usePathname } from "next/navigation"
import { AnswerSchema } from "@/lib/validation"

import { toast } from "../ui/use-toast"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Sparkles, Code, ImageIcon, Link, Send, Loader2 } from "lucide-react"

interface Props {
  question: string
  questionId: string
  authorId: string
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingAI, setSetIsSubmittingAI] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const { mode } = useTheme()
  const editorRef = useRef(null)

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  })

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true)
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      })
      form.reset()
      if (editorRef.current) {
        const editor = editorRef.current as any
        editor.setContent("")
      }
      toast({
        title: "Answer submitted successfully",
        description: "Your answer has been posted. Thank you for contributing!",
        variant: "default",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Failed to submit answer",
        description: "There was an error submitting your answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateAIAnswer = async () => {
    if (!authorId) return
    setSetIsSubmittingAI(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        method: "POST",
        body: JSON.stringify({ question }),
      })
      const aiAnswer = await response.json()

      // Check if there's an error
      if (aiAnswer.error) {
        console.error("AI Answer Error:", aiAnswer.error)
        toast({
          title: "AI Generation Failed",
          description: "Could not generate an AI answer. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Only proceed if we have a valid reply
      if (aiAnswer.reply) {
        // Convert plain text to HTML format
        const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />")

        if (editorRef.current) {
          const editor = editorRef.current as any
          editor.setContent(formattedAnswer)
        }
      }
      toast({
        title: "AI Answer Generated",
        description: "The AI has suggested an answer. Feel free to edit it before submitting.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating AI answer:", error)
      toast({
        title: "Failed to generate AI answer",
        description: "There was an error connecting to the AI service. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSetIsSubmittingAI(false)
    }
  }

  const isDarkMode = useMemo(() => mode === "dark", [mode])

  if (!authorId) {
    return (
      <Card className="card-wrapper border-none">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Image
              src="/assets/icons/lock.svg"
              alt="Login required"
              width={48}
              height={48}
              className="mb-4 opacity-70"
            />
            <h4 className="paragraph-semibold text-dark400_light800 mb-2">Please login to answer this question</h4>
            <p className="text-dark500_light700 text-sm max-w-md">
              Join our community to share your knowledge and help others with their questions
            </p>
            <Button className="mt-6 primary-gradient text-white">Sign In</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-5 sm:items-center sm:gap-2 mb-6">
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500 hover:bg-primary-500/10 transition-colors"
          onClick={generateAIAnswer}
          disabled={isSubmittingAI}
        >
          {isSubmittingAI ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form className="mt-6 flex w-full flex-col gap-10" onSubmit={form.handleSubmit(handleCreateAnswer)}>
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-2 bg-light-800 dark:bg-dark-300">
                    <TabsTrigger value="write" onClick={() => setPreviewMode(false)}>
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="mt-0">
                    <FormControl className="mt-3.5">
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                        onInit={(evt, editor) => {
                          // @ts-ignore
                          editorRef.current = editor
                        }}
                        onBlur={field.onBlur}
                        onEditorChange={(content) => field.onChange(content)}
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
                            "undo redo | " +
                            "codesample | bold italic forecolor | alignleft aligncenter |" +
                            "alignright alignjustify | bullist numlist",
                          content_style: "body { font-family:Inter; font-size:16px }",
                          skin: isDarkMode ? "oxide-dark" : "oxide",
                          content_css: isDarkMode ? "dark" : "light",
                        }}
                      />
                    </FormControl>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[350px] w-full border rounded-xl p-4 overflow-y-auto bg-light-850 dark:bg-dark-300">
                      {previewMode && (
                        <div
                          className="prose dark:prose-invert max-w-full"
                          dangerouslySetInnerHTML={{ __html: form.getValues().answer }}
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
                        const editor = editorRef.current as any
                        editor.execCommand("mceInsertContent", false, "<pre><code>// Your code here</code></pre>")
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
                        const editor = editorRef.current as any
                        editor.execCommand("mceImage")
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
                        const editor = editorRef.current as any
                        editor.execCommand("mceLink")
                      }
                    }}
                  >
                    <Link size={14} />
                    <span>Add Link</span>
                  </Button>
                </div>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white flex items-center gap-2 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Answer

