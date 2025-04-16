import { Schema } from "mongoose";

import { IUser } from "@/database/user.model";

export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasAlreadyUpvoted: boolean;
  hasAlreadyDownvoted: boolean;
  path: string;
}

export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface ViewQuestionParams {
  questionId: string;
  userId: string | undefined;
}

export interface JobFilterParams {
  query: string;
  page: string;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface GetQuestionByIdParams {
  questionId: string;
}

export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasAlreadyUpvoted: boolean;
  hasAlreadyDownvoted: boolean;
  path: string;
}
export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface GetUserByIdParams {
  userId: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface DeleteUserParams {
  clerkId: string;
}

// Add these types to your shared.types.ts file

export interface CreateNotificationParams {
  recipientId: string;
  senderId?: string;
  type: "answer" | "mention" | "upvote" | "badge" | "system";
  content: string;
  link: string;
}

// Add these types to your existing types.ts file

export type MentorshipStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";
export type SessionStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";
export type PaymentStatus = "pending" | "completed" | "refunded";

export interface MentorAvailability {
  monday: { start?: string; end?: string }[];
  tuesday: { start?: string; end?: string }[];
  wednesday: { start?: string; end?: string }[];
  thursday: { start?: string; end?: string }[];
  friday: { start?: string; end?: string }[];
  saturday: { start?: string; end?: string }[];
  sunday: { start?: string; end?: string }[];
}

export interface PreferredTimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface MentorshipPayment {
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
}

// Add these types to your existing shared.types.ts file

// Knowledge Base Article Types
export interface CreateKnowledgeBaseArticleParams {
  title: string;
  content: string;
  category: string;
  author: string;
  path: string;
  published?: boolean;
}

export interface UpdateKnowledgeBaseArticleParams {
  articleId: string;
  title?: string;
  content?: string;
  category?: string;
  published?: boolean;
  path: string;
}

export interface GetKnowledgeBaseArticlesParams {
  page?: number;
  pageSize?: number;
  category?: string;
  searchQuery?: string;
  authorId?: string;
  sortBy?: string;
}

export interface GetKnowledgeBaseArticleBySlugParams {
  slug: string;
}

// Code Challenge Types
export interface CreateCodeChallengeParams {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
  author: string;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  path: string;
  published?: boolean;
}

export interface UpdateCodeChallengeParams {
  challengeId: string;
  title?: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  tags?: string[];
  starterCode?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
  published?: boolean;
  path: string;
}

export interface GetCodeChallengesParams {
  page?: number;
  pageSize?: number;
  difficulty?: string;
  tags?: string[];
  searchQuery?: string;
  authorId?: string;
  sortBy?: string;
}

export interface GetCodeChallengeBySlugParams {
  slug: string;
}

export interface SubmitCodeChallengeParams {
  challengeId: string;
  userId: string;
  code: string;
  path: string;
}

// Consulting Types
export interface UpdateExpertAvailabilityParams {
  expertId: string;
  date: Date;
  timeSlots: string[];
  rate: number;
  path: string;
}

export interface GetExpertAvailabilityParams {
  expertId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface BookConsultingSessionParams {
  expertId: string;
  clientId: string;
  date: Date;
  timeSlot: string;
  duration: number;
  topic: string;
  notes?: string;
  path: string;
}

export interface GetConsultingSessionsParams {
  userId: string;
  role: "expert" | "client";
  status?: "scheduled" | "completed" | "cancelled";
  page?: number;
  pageSize?: number;
}

export interface UpdateConsultingSessionParams {
  sessionId: string;
  status?: "scheduled" | "completed" | "cancelled";
  notes?: string;
  path: string;
}

// Expert Profile Types
export interface CreateExpertProfileParams {
  userId: string;
  expertise: string[];
  bio: string;
  consultingRate?: number;
  path: string;
}

export interface UpdateExpertProfileParams {
  userId: string;
  expertise?: string[];
  bio?: string;
  consultingRate?: number;
  path: string;
}

export interface GetExpertProfileParams {
  userId: string;
}

export interface GetExpertsParams {
  page?: number;
  pageSize?: number;
  expertise?: string[];
  searchQuery?: string;
  sortBy?: string;
}
