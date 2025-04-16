"use server";

import type { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import type {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

import type { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserById(params: GetUserByIdParams) {
  try {
    console.log("user being called");
    await connectToDatabase(); // FIX: Await database connection

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.error("🔴 Error fetching user by ID:", error);
    throw error;
  }
}

export async function createUser(userParam: CreateUserParams) {
  try {
    console.log("Creating user");
    await connectToDatabase(); // FIX: Await database connection

    const newUser = await User.create(userParam);
    return newUser;
  } catch (error) {
    console.error("🔴 Error creating user:", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    console.log("Updating user");
    await connectToDatabase(); // FIX: Await database connection

    const { clerkId, updateData, path } = params;
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error("🔴 Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userParam: DeleteUserParams) {
  try {
    await connectToDatabase(); // FIX: Await database connection

    const { clerkId } = userParam;
    const user = await User.findOneAndDelete({ clerkId }); // FIX: Use findOneAndDelete instead of findByIdAndDelete

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all questions associated with this user
    await Question.deleteMany({ author: user._id });

    console.log("✅ User and related questions deleted successfully.");
    return user;
  } catch (error) {
    console.error("🔴 Error deleting user:", error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("🔴 Error fetching all users:", error);
    throw error;
  }
}

export async function generateUniqueUsername(
  firstName: string | null,
  lastName: string | null
) {
  // Create base username from full name
  const baseUsername = `${firstName}${lastName ? lastName : ""}`
    .toLowerCase()
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters

  let username = baseUsername;
  let counter = 1;

  // Keep checking until we find a unique username
  while (true) {
    // Check if username exists in database
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return username;
    }

    // If username exists, append counter and try again
    username = `${baseUsername}${counter}`;
    counter++;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const isQuestionSeved = user.saved.includes(questionId);
    if (isQuestionSeved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 1 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isNext = user.saved.length > pageSize;
    const savedQuestions = user.saved;
    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;
    console.log("Fetching user info for:", userId);

    // First check if the user exists
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log("User not found with clerkId:", userId);
      throw new Error("User not Found");
    }

    console.log("Found user:", user._id);

    // Run these queries in parallel for better performance
    const [
      totalQuestions,
      totalAnswers,
      questionUpvotesResult,
      answerUpvotesResult,
      questionViewsResult,
    ] = await Promise.all([
      Question.countDocuments({ author: user._id }),
      Answer.countDocuments({ author: user._id }),
      Question.aggregate([
        { $match: { author: user._id } },
        { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
        { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
      ]),
      Answer.aggregate([
        { $match: { author: user._id } },
        { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
        { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
      ]),
      Question.aggregate([
        { $match: { author: user._id } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
      ]),
    ]);

    const questionUpvotes =
      questionUpvotesResult.length > 0
        ? questionUpvotesResult[0].totalUpvotes
        : 0;
    const answerUpvotes =
      answerUpvotesResult.length > 0 ? answerUpvotesResult[0].totalUpvotes : 0;
    const questionViews =
      questionViewsResult.length > 0 ? questionViewsResult[0].totalViews : 0;

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      { type: "QUESTION_UPVOTES" as BadgeCriteriaType, count: questionUpvotes },
      { type: "ANSWER_UPVOTES" as BadgeCriteriaType, count: answerUpvotes },
      { type: "TOTAL_VIEWS" as BadgeCriteriaType, count: questionViews },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (err) {
    console.error("Error in getUserInfo:", err);
    throw err;
  }
}

export async function getUserQuestion(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    console.log("Getting questions for user:", userId);

    if (!userId) {
      console.error("No userId provided to getUserQuestion");
      return { totalQuestions: 0, questions: [], isNext: false };
    }

    const skipAmount = (page - 1) * pageSize;

    // First check if user exists and has any questions
    const totalQuestions = await Question.countDocuments({ author: userId });

    if (totalQuestions === 0) {
      return { totalQuestions: 0, questions: [], isNext: false };
    }

    try {
      const userQuestions = await Question.find({ author: userId })
        .sort({ createdAt: -1, views: -1, upvotes: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .populate("tags", "_id name")
        .populate("author", "_id clerkId name picture")
        .populate({
          path: "answers",
          model: "Answer",
          select: "_id",
        });

      console.log(`Found ${userQuestions.length} questions for user ${userId}`);

      const isNext = totalQuestions > skipAmount + userQuestions.length;
      return { totalQuestions, questions: userQuestions, isNext };
    } catch (error) {
      console.error("Error fetching user questions:", error);
      return { totalQuestions, questions: [], isNext: false };
    }
  } catch (error) {
    console.error("Error in getUserQuestion:", error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;

    if (!userId) {
      console.error("No userId provided to getUserAnswers");
      return { totalAnswers: 0, answers: [], isNext: false };
    }

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    if (totalAnswers === 0) {
      return { totalAnswers: 0, answers: [], isNext: false };
    }

    try {
      const userAnswers = await Answer.find({ author: userId })
        .sort({ upvotes: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .populate("question", "_id title")
        .populate("author", "_id clerkId name picture");

      const isNext = totalAnswers > skipAmount + userAnswers.length;
      return { totalAnswers, answers: userAnswers, isNext };
    } catch (error) {
      console.error("Error fetching user answers:", error);
      return { totalAnswers, answers: [], isNext: false };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopContributors() {
  try {
    await connectToDatabase();

    // Find top 3 users with highest reputation
    const topContributors = await User.find({})
      .sort({ reputation: -1 })
      .limit(3)
      .select("_id clerkId name picture reputation");

    return JSON.parse(JSON.stringify(topContributors));
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    throw error;
  }
}

export async function getCommunityStats() {
  try {
    await connectToDatabase();

    // Run all queries in parallel for better performance
    const [
      totalUsersCount,
      questionsAnsweredCount,
      topContributorsCount,
      newUsersThisWeekCount,
    ] = await Promise.all([
      // Total users
      User.countDocuments({}),

      // Total answers (questions answered)
      Answer.countDocuments({}),

      // Count users with reputation > 50 (considered top contributors)
      User.countDocuments({ reputation: { $gt: 50 } }),

      // Count users who joined in the last 7 days
      User.countDocuments({
        joinedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    return {
      totalUsers: totalUsersCount,
      questionsAnswered: questionsAnsweredCount,
      topContributors: topContributorsCount,
      newThisWeek: newUsersThisWeekCount,
    };
  } catch (error) {
    console.error("Error fetching community stats:", error);

    // Return fallback data in case of error
    return {
      totalUsers: 0,
      questionsAnswered: 0,
      topContributors: 0,
      newThisWeek: 0,
    };
  }
}

export async function getUserStats(userId: string) {
  try {
    await connectToDatabase();

    // Run all queries in parallel for better performance
    const [questionsCount, answersCount, user] = await Promise.all([
      // Count questions by this user
      Question.countDocuments({ author: userId }),

      // Count answers by this user
      Answer.countDocuments({ author: userId }),

      // Get user data for reputation
      User.findById(userId),
    ]);

    return {
      posts: questionsCount,
      answers: answersCount,
      reputation: user?.reputation || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);

    // Return fallback data in case of error
    return {
      posts: 0,
      answers: 0,
      reputation: 0,
    };
  }
}
