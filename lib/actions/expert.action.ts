"use server";

import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import type { FilterQuery } from "mongoose";
import { generateSlug as generateUniqueSlug } from "../utils";
import User from "@/database/user.model";
import {
  KnowledgeBaseArticle,
  CodeChallenge,
  CodeSubmission,
  ConsultingSession,
  ExpertAvailability,
  ExpertProfile,
} from "@/database/expert.model";
import type {
  CreateKnowledgeBaseArticleParams,
  UpdateKnowledgeBaseArticleParams,
  GetKnowledgeBaseArticlesParams,
  GetKnowledgeBaseArticleBySlugParams,
  CreateCodeChallengeParams,
  UpdateCodeChallengeParams,
  GetCodeChallengesParams,
  GetCodeChallengeBySlugParams,
  SubmitCodeChallengeParams,
  UpdateExpertAvailabilityParams,
  GetExpertAvailabilityParams,
  BookConsultingSessionParams,
  GetConsultingSessionsParams,
  UpdateConsultingSessionParams,
  CreateExpertProfileParams,
  UpdateExpertProfileParams,
  GetExpertProfileParams,
  GetExpertsParams,
} from "./shared.types";

// ==================== KNOWLEDGE BASE ACTIONS ====================

export async function createKnowledgeBaseArticle(
  params: CreateKnowledgeBaseArticleParams
) {
  try {
    await connectToDatabase();

    const {
      title,
      content,
      category,
      author,
      path,
      published = false,
    } = params;

    // Generate a slug from the title
    const slug = await generateUniqueSlug(title);

    // Create the article
    const newArticle = await KnowledgeBaseArticle.create({
      title,
      content,
      category,
      author,
      published,
      slug,
    });

    // Update user's reputation
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newArticle));
  } catch (error) {
    console.error("Error creating knowledge base article:", error);
    throw error;
  }
}

export async function updateKnowledgeBaseArticle(
  params: UpdateKnowledgeBaseArticleParams
) {
  try {
    await connectToDatabase();

    const { articleId, title, content, category, published, path } = params;

    // Prepare update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (published !== undefined) updateData.published = published;
    updateData.updatedAt = new Date();

    // If title is updated, generate a new slug
    if (title) {
      updateData.slug = await generateUniqueSlug(title);
    }

    // Update the article
    const updatedArticle = await KnowledgeBaseArticle.findByIdAndUpdate(
      articleId,
      updateData,
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error("Article not found");
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedArticle));
  } catch (error) {
    console.error("Error updating knowledge base article:", error);
    throw error;
  }
}

export async function getKnowledgeBaseArticles(
  params: GetKnowledgeBaseArticlesParams
) {
  try {
    await connectToDatabase();

    const {
      page = 1,
      pageSize = 10,
      category,
      searchQuery,
      authorId,
      sortBy = "newest",
    } = params;

    // Calculate skip amount for pagination
    const skipAmount = (page - 1) * pageSize;

    // Prepare filter query
    const query: FilterQuery<typeof KnowledgeBaseArticle> = { published: true };

    if (category) {
      query.category = category;
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (authorId) {
      query.author = authorId;
    }

    // Prepare sort options
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { views: -1 };
        break;
      case "likes":
        sortOptions = { likes: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get articles with pagination
    const articles = await KnowledgeBaseArticle.find(query)
      .populate("author", "name username picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Get total articles count for pagination
    const totalArticles = await KnowledgeBaseArticle.countDocuments(query);

    // Check if there are more articles
    const isNext = totalArticles > skipAmount + articles.length;

    return { articles: JSON.parse(JSON.stringify(articles)), isNext };
  } catch (error) {
    console.error("Error getting knowledge base articles:", error);
    throw error;
  }
}

export async function getKnowledgeBaseArticleBySlug(
  params: GetKnowledgeBaseArticleBySlugParams
) {
  try {
    await connectToDatabase();

    const { slug } = params;

    // Find the article by slug
    const article = await KnowledgeBaseArticle.findOne({
      slug,
      published: true,
    }).populate("author", "name username picture");

    if (!article) {
      throw new Error("Article not found");
    }

    // Increment view count
    await KnowledgeBaseArticle.findByIdAndUpdate(article._id, {
      $inc: { views: 1 },
    });

    return JSON.parse(JSON.stringify(article));
  } catch (error) {
    console.error("Error getting knowledge base article by slug:", error);
    throw error;
  }
}

export async function likeKnowledgeBaseArticle(
  articleId: string,
  userId: string,
  path: string
) {
  try {
    await connectToDatabase();

    // Check if user has already liked the article
    const article = await KnowledgeBaseArticle.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    const hasLiked = article.likes.includes(userId);

    // Toggle like
    if (hasLiked) {
      await KnowledgeBaseArticle.findByIdAndUpdate(articleId, {
        $pull: { likes: userId },
      });
    } else {
      await KnowledgeBaseArticle.findByIdAndUpdate(articleId, {
        $addToSet: { likes: userId },
      });
    }

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error liking knowledge base article:", error);
    throw error;
  }
}

export async function deleteKnowledgeBaseArticle(
  articleId: string,
  path: string
) {
  try {
    await connectToDatabase();

    // Delete the article
    const deletedArticle = await KnowledgeBaseArticle.findByIdAndDelete(
      articleId
    );

    if (!deletedArticle) {
      throw new Error("Article not found");
    }

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error deleting knowledge base article:", error);
    throw error;
  }
}

// ==================== CODE CHALLENGE ACTIONS ====================

export async function createCodeChallenge(params: CreateCodeChallengeParams) {
  try {
    await connectToDatabase();

    const {
      title,
      description,
      difficulty,
      tags,
      author,
      starterCode,
      testCases,
      path,
      published = false,
    } = params;

    // Generate a slug from the title
    const slug = await generateUniqueSlug(title);

    // Create the challenge
    const newChallenge = await CodeChallenge.create({
      title,
      description,
      difficulty,
      tags,
      author,
      starterCode,
      testCases,
      published,
      slug,
    });

    // Update user's reputation
    await User.findByIdAndUpdate(author, { $inc: { reputation: 15 } });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newChallenge));
  } catch (error) {
    console.error("Error creating code challenge:", error);
    throw error;
  }
}

export async function updateCodeChallenge(params: UpdateCodeChallengeParams) {
  try {
    await connectToDatabase();

    const {
      challengeId,
      title,
      description,
      difficulty,
      tags,
      starterCode,
      testCases,
      published,
      path,
    } = params;

    // Prepare update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (starterCode !== undefined) updateData.starterCode = starterCode;
    if (testCases !== undefined) updateData.testCases = testCases;
    if (published !== undefined) updateData.published = published;
    updateData.updatedAt = new Date();

    // If title is updated, generate a new slug
    if (title) {
      updateData.slug = await generateUniqueSlug(title);
    }

    // Update the challenge
    const updatedChallenge = await CodeChallenge.findByIdAndUpdate(
      challengeId,
      updateData,
      { new: true }
    );

    if (!updatedChallenge) {
      throw new Error("Challenge not found");
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedChallenge));
  } catch (error) {
    console.error("Error updating code challenge:", error);
    throw error;
  }
}

export async function getCodeChallenges(params: GetCodeChallengesParams) {
  try {
    await connectToDatabase();

    const {
      page = 1,
      pageSize = 10,
      difficulty,
      tags,
      searchQuery,
      authorId,
      sortBy = "newest",
    } = params;

    // Calculate skip amount for pagination
    const skipAmount = (page - 1) * pageSize;

    // Prepare filter query
    const query: FilterQuery<typeof CodeChallenge> = { published: true };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (authorId) {
      query.author = authorId;
    }

    // Prepare sort options
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { "submissions.length": -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get challenges with pagination
    const challenges = await CodeChallenge.find(query)
      .populate("author", "name username picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Get total challenges count for pagination
    const totalChallenges = await CodeChallenge.countDocuments(query);

    // Check if there are more challenges
    const isNext = totalChallenges > skipAmount + challenges.length;

    return { challenges: JSON.parse(JSON.stringify(challenges)), isNext };
  } catch (error) {
    console.error("Error getting code challenges:", error);
    throw error;
  }
}

export async function getCodeChallengeBySlug(
  params: GetCodeChallengeBySlugParams
) {
  try {
    await connectToDatabase();

    const { slug } = params;

    // Find the challenge by slug
    const challenge = await CodeChallenge.findOne({
      slug,
      published: true,
    }).populate("author", "name username picture");

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    return JSON.parse(JSON.stringify(challenge));
  } catch (error) {
    console.error("Error getting code challenge by slug:", error);
    throw error;
  }
}

export async function submitCodeChallenge(params: SubmitCodeChallengeParams) {
  try {
    await connectToDatabase();

    const { challengeId, userId, code, path } = params;

    // Find the challenge
    const challenge = await CodeChallenge.findById(challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    // In a real implementation, you would run the code against test cases
    // For now, we'll simulate a successful submission
    const passed = true;
    const executionTime = Math.floor(Math.random() * 500); // Random execution time between 0-500ms

    // Create the submission
    const submission = await CodeSubmission.create({
      challenge: challengeId,
      user: userId,
      code,
      passed,
      executionTime,
    });

    // Update the challenge with the new submission
    await CodeChallenge.findByIdAndUpdate(challengeId, {
      $push: { submissions: submission._id },
    });

    // Update user's reputation if passed
    if (passed) {
      await User.findByIdAndUpdate(userId, { $inc: { reputation: 5 } });
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify({ submission, passed, executionTime }));
  } catch (error) {
    console.error("Error submitting code challenge:", error);
    throw error;
  }
}

export async function deleteCodeChallenge(challengeId: string, path: string) {
  try {
    await connectToDatabase();

    // Delete the challenge
    const deletedChallenge = await CodeChallenge.findByIdAndDelete(challengeId);

    if (!deletedChallenge) {
      throw new Error("Challenge not found");
    }

    // Delete all submissions for this challenge
    await CodeSubmission.deleteMany({ challenge: challengeId });

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error deleting code challenge:", error);
    throw error;
  }
}

// ==================== CONSULTING ACTIONS ====================

export async function updateExpertAvailability(
  params: UpdateExpertAvailabilityParams
) {
  try {
    await connectToDatabase();

    const { expertId, date, timeSlots, rate, path } = params;

    // Check if availability already exists for this date
    const existingAvailability = await ExpertAvailability.findOne({
      expert: expertId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    });

    if (existingAvailability) {
      // Update existing availability
      const updatedAvailability = await ExpertAvailability.findByIdAndUpdate(
        existingAvailability._id,
        {
          timeSlots,
          rate,
          updatedAt: new Date(),
        },
        { new: true }
      );

      revalidatePath(path);
      return JSON.parse(JSON.stringify(updatedAvailability));
    } else {
      // Create new availability
      const newAvailability = await ExpertAvailability.create({
        expert: expertId,
        date,
        timeSlots,
        rate,
      });

      revalidatePath(path);
      return JSON.parse(JSON.stringify(newAvailability));
    }
  } catch (error) {
    console.error("Error updating expert availability:", error);
    throw error;
  }
}

export async function getExpertAvailability(
  params: GetExpertAvailabilityParams
) {
  try {
    await connectToDatabase();

    const { expertId, startDate, endDate } = params;

    // Prepare date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = startDate;
    }
    if (endDate) {
      dateFilter.$lte = endDate;
    }

    // Prepare query
    const query: FilterQuery<typeof ExpertAvailability> = { expert: expertId };
    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    // Get availability
    const availability = await ExpertAvailability.find(query).sort({ date: 1 });

    return JSON.parse(JSON.stringify(availability));
  } catch (error) {
    console.error("Error getting expert availability:", error);
    throw error;
  }
}

export async function bookConsultingSession(
  params: BookConsultingSessionParams
) {
  try {
    await connectToDatabase();

    const { expertId, clientId, date, timeSlot, duration, topic, notes, path } =
      params;

    // Check if the expert is available at the requested time
    const expertAvailability = await ExpertAvailability.findOne({
      expert: expertId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      timeSlots: { $in: [timeSlot] },
    });

    if (!expertAvailability) {
      throw new Error("Expert is not available at the requested time");
    }

    // Create the consulting session
    const session = await ConsultingSession.create({
      expert: expertId,
      client: clientId,
      date,
      timeSlot,
      duration,
      rate: expertAvailability.rate,
      topic,
      notes: notes || "",
    });

    // Remove the booked time slot from availability
    await ExpertAvailability.findByIdAndUpdate(expertAvailability._id, {
      $pull: { timeSlots: timeSlot },
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(session));
  } catch (error) {
    console.error("Error booking consulting session:", error);
    throw error;
  }
}

export async function getConsultingSessions(
  params: GetConsultingSessionsParams
) {
  try {
    await connectToDatabase();

    const { userId, role, status, page = 1, pageSize = 10 } = params;

    // Calculate skip amount for pagination
    const skipAmount = (page - 1) * pageSize;

    // Prepare filter query
    const query: FilterQuery<typeof ConsultingSession> = {};

    if (role === "expert") {
      query.expert = userId;
    } else {
      query.client = userId;
    }

    if (status) {
      query.status = status;
    }

    // Get sessions with pagination
    const sessions = await ConsultingSession.find(query)
      .populate("expert", "name username picture")
      .populate("client", "name username picture")
      .sort({ date: 1 })
      .skip(skipAmount)
      .limit(pageSize);

    // Get total sessions count for pagination
    const totalSessions = await ConsultingSession.countDocuments(query);

    // Check if there are more sessions
    const isNext = totalSessions > skipAmount + sessions.length;

    return { sessions: JSON.parse(JSON.stringify(sessions)), isNext };
  } catch (error) {
    console.error("Error getting consulting sessions:", error);
    throw error;
  }
}

export async function updateConsultingSession(
  params: UpdateConsultingSessionParams
) {
  try {
    await connectToDatabase();

    const { sessionId, status, notes, path } = params;

    // Prepare update object
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updatedAt = new Date();

    // Update the session
    const updatedSession = await ConsultingSession.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true }
    );

    if (!updatedSession) {
      throw new Error("Session not found");
    }

    // If session is cancelled, add the time slot back to availability
    if (status === "cancelled") {
      const session = await ConsultingSession.findById(sessionId);
      if (session) {
        // Find or create availability for that date
        const existingAvailability = await ExpertAvailability.findOne({
          expert: session.expert,
          date: {
            $gte: new Date(session.date.setHours(0, 0, 0, 0)),
            $lt: new Date(session.date.setHours(23, 59, 59, 999)),
          },
        });

        if (existingAvailability) {
          // Add the time slot back
          await ExpertAvailability.findByIdAndUpdate(existingAvailability._id, {
            $addToSet: { timeSlots: session.timeSlot },
          });
        }
      }
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedSession));
  } catch (error) {
    console.error("Error updating consulting session:", error);
    throw error;
  }
}

// ==================== EXPERT PROFILE ACTIONS ====================

export async function createExpertProfile(params: CreateExpertProfileParams) {
  try {
    await connectToDatabase();

    const { userId, expertise, bio, consultingRate, path } = params;

    // Check if profile already exists
    const existingProfile = await ExpertProfile.findOne({ user: userId });
    if (existingProfile) {
      throw new Error("Expert profile already exists");
    }

    // Create the profile
    const newProfile = await ExpertProfile.create({
      user: userId,
      expertise,
      bio,
      consultingRate: consultingRate || 0,
    });

    // Update user's role to include "expert"
    await User.findByIdAndUpdate(userId, { $addToSet: { role: "expert" } });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    console.error("Error creating expert profile:", error);
    throw error;
  }
}

export async function updateExpertProfile(params: UpdateExpertProfileParams) {
  try {
    await connectToDatabase();

    const { userId, expertise, bio, consultingRate, path } = params;

    // Prepare update object
    const updateData: any = {};
    if (expertise !== undefined) updateData.expertise = expertise;
    if (bio !== undefined) updateData.bio = bio;
    if (consultingRate !== undefined)
      updateData.consultingRate = consultingRate;
    updateData.updatedAt = new Date();

    // Update the profile
    const updatedProfile = await ExpertProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      throw new Error("Expert profile not found");
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    console.error("Error updating expert profile:", error);
    throw error;
  }
}

export async function getExpertProfile(params: GetExpertProfileParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    // Find the profile
    const profile = await ExpertProfile.findOne({ user: userId }).populate(
      "user",
      "name username picture"
    );

    if (!profile) {
      throw new Error("Expert profile not found");
    }

    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    console.error("Error getting expert profile:", error);
    throw error;
  }
}

export async function getExperts(params: GetExpertsParams) {
  try {
    await connectToDatabase();

    const {
      page = 1,
      pageSize = 10,
      expertise,
      searchQuery,
      sortBy = "rating",
    } = params;

    // Calculate skip amount for pagination
    const skipAmount = (page - 1) * pageSize;

    // Prepare filter query
    const query: FilterQuery<typeof ExpertProfile> = { isVerified: true };

    if (expertise && expertise.length > 0) {
      query.expertise = { $in: expertise };
    }

    // Prepare sort options
    let sortOptions = {};
    switch (sortBy) {
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "reviewCount":
        sortOptions = { reviewCount: -1 };
        break;
      case "consultingRate":
        sortOptions = { consultingRate: 1 };
        break;
      default:
        sortOptions = { rating: -1 };
    }

    // Get experts with pagination
    const experts = await ExpertProfile.find(query)
      .populate("user", "name username picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // If searchQuery is provided, filter experts by name or username
    let filteredExperts = experts;
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      filteredExperts = experts.filter((expert: any) => {
        return regex.test(expert.user.name) || regex.test(expert.user.username);
      });
    }

    // Get total experts count for pagination
    const totalExperts = await ExpertProfile.countDocuments(query);

    // Check if there are more experts
    const isNext = totalExperts > skipAmount + filteredExperts.length;

    return { experts: JSON.parse(JSON.stringify(filteredExperts)), isNext };
  } catch (error) {
    console.error("Error getting experts:", error);
    throw error;
  }
}
