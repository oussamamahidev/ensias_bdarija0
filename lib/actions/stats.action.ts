import Question from "@/database/question.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";

export async function getStats() {
  try {
    await connectToDatabase();

    // Run all queries in parallel for better performance
    const [questionsCount, answersCount, usersCount, tagsCount] =
      await Promise.all([
        Question.countDocuments({}),
        Answer.countDocuments({}),
        User.countDocuments({}),
        Tag.countDocuments({}),
      ]);

    return {
      questions: questionsCount,
      answers: answersCount,
      users: usersCount,
      tags: tagsCount,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);

    // Return fallback data in case of error
    return {
      questions: 0,
      answers: 0,
      users: 0,
      tags: 0,
    };
  }
}
