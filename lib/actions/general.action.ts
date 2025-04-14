"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import type { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let result: any = [];

    // Define search functions for each model type
    const searchFunctions = {
      question: async () => {
        const questions = await Question.find({ title: regexQuery }).limit(5);
        return questions.map((item) => ({
          title: item.title,
          type: "question",
          id: item._id,
        }));
      },

      user: async () => {
        // Search by both name and username
        const users = await User.find({
          $or: [{ name: regexQuery }, { username: regexQuery }],
        }).limit(5);

        console.log(`Found ${users.length} users matching "${query}"`);

        // Debug the first few results
        if (users.length > 0) {
          console.log("First user found:", {
            id: users[0]._id,
            clerkId: users[0].clerkId,
            name: users[0].name,
          });
        }

        return users.map((item) => ({
          title: item.name || item.username || "Anonymous User",
          type: "user",
          id: item.clerkId, // Fixed: was "clerkid" (lowercase 'i')
          picture: item.picture,
        }));
      },

      answer: async () => {
        const answers = await Answer.find({ content: regexQuery }).limit(5);
        return answers.map((item) => ({
          title: `Answer containing "${query}"`,
          type: "answer",
          id: item.question,
        }));
      },

      tag: async () => {
        const tags = await Tag.find({ name: regexQuery }).limit(5);
        return tags.map((item) => ({
          title: item.name,
          type: "tag",
          id: item._id,
        }));
      },
    };

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // Search across everything
      const [questions, users, answers, tags] = await Promise.all([
        searchFunctions.question(),
        searchFunctions.user(),
        searchFunctions.answer(),
        searchFunctions.tag(),
      ]);

      result = [...questions, ...users, ...answers, ...tags];
    } else {
      // Search specific type
      if (typeLower === "question") {
        result = await searchFunctions.question();
      } else if (typeLower === "user") {
        result = await searchFunctions.user();
      } else if (typeLower === "answer") {
        result = await searchFunctions.answer();
      } else if (typeLower === "tag") {
        result = await searchFunctions.tag();
      }
    }

    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
