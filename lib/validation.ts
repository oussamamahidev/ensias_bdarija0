import { z } from "zod"


export const QuestionSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(100),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
    
  })

  export const AnswerSchema= z.object({
    answer: z.string().min(100)
  })



  export const ProfileSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    portfolioWebsite: z.string().url({ message: "Invalid url" }).optional().or(z.literal("")),
    location: z.string().min(5, { message: "String must contain at least 5 character(s)" }).optional().or(z.literal("")),
    bio: z.string().min(10, { message: "String must contain at least 10 character(s)" }).optional().or(z.literal("")),
  })
  