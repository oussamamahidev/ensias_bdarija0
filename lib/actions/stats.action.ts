"use server"

import Question from "@/database/question.model"
import Answer from "@/database/answer.model"
import User from "@/database/user.model"
import Tag from "@/database/tag.model"
import { connectToDatabase } from "../mongoose"

export async function getGlobalStats() {
  try {
    await connectToDatabase()

    // Get counts from all collections in parallel
    const [questionsCount, answersCount, usersCount, tagsCount] = await Promise.all([
      Question.countDocuments({}),
      Answer.countDocuments({}),
      User.countDocuments({}),
      Tag.countDocuments({}),
    ])

    return {
      questions: questionsCount,
      answers: answersCount,
      users: usersCount,
      tags: tagsCount,
    }
  } catch (error) {
    console.error("Error fetching global stats:", error)
    // Return fallback values in case of error
    return {
      questions: 0,
      answers: 0,
      users: 0,
      tags: 0,
    }
  }
}

