"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import { serialize } from "../utils";

export async function getTopInterectedTags(params : GetTopInteractedTagsParams ){

    try{
        await connectToDatabase();
        const { userId}=params;

        const user = await User.findById(userId);
        if(!user) throw new Error(`User not found`);

        return [{_id: "1", name: 'Tag1'}, {_id: "2", name: 'Tag2'}]
    }catch(err){
        console.log(err);
        throw err;
}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllTags(params : GetAllTagsParams ){

  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 4 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 }; 
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }
    if (filter === "popular") {
      const totalTags = await Tag.aggregate([
        {
          $match: query,
        },
        {
          $project: {
            name: 1,
            description: 1,
            followers: 1,
            createdOn: 1,
            questions: 1,
            questionsCount: { $size: "$questions" }, // Counting the number of questions for each tag
          },
        },
        {
          $sort: { questionsCount: -1 }, // Sorting based on the number of questions in descending order
        },
        {
          $skip: skipAmount,
        },
        {
          $limit: pageSize,
        },
      ]);
      const isNext = totalTags.length > skipAmount + pageSize;
      return { tags: totalTags, isNext };
    } else {
      const totalTags = await Tag.countDocuments(query);
      const tags = await Tag.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
      const isNext = totalTags > skipAmount + tags.length;
      return { tags, isNext };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function  getQuestionByTagId(params : GetQuestionsByTagIdParams ){

  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 5, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    const isNext = tag.questions.length > pageSize;
    const questions = tag.questions;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getTopPopularTags() {
  try {
    connectToDatabase()
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ])

    // Return serialized data
    return serialize(popularTags)
  } catch (error) {
    console.error(error)
    throw error
  }
}