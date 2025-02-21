"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getQuestions(params: GetQuestionsParams) {
    try {
        console.log("🔵 Connecting to database...");
        await connectToDatabase();
        console.log("🟢 Connected to database!");

        const questions = await Question.find({})
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .sort({createdAt: -1})
            ;
        return { questions }; // Ensure returning data
    } catch (err) {
        console.log("🔴 Error fetching questions:", err);
        return { questions: [] };
}}


export async function createQuestion(params: CreateQuestionParams) {
    try {
      connectToDatabase();
      const { title, content, tags, author, path } = params;
      // Create the question
      const question = await Question.create({
        title,
        content,
        author,
      });
      const tagDocuments = [];
      // Create the tags or get them if they already exist
      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $push: { questions: question._id } },
          { upsert: true, new: true }
        );
        tagDocuments.push(existingTag._id);
      }
      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });

      revalidatePath(path);

  } catch (err) {
    console.error("Error creating question:", err);
    throw err;
  }
}
