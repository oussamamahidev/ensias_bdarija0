"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

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

    try{
        await connectToDatabase();
        const tags = await Tag.find({});
        return {tags};
    }catch(err){
        console.log(err);
        throw err;
}
}


export async function getQuestionByTagId(params : GetQuestionsByTagIdParams ){

    try{
        await connectToDatabase();
        const {tagId, searchQuery} = params
        const tagFilter: FilterQuery<ITag> = { _id: tagId };
        console.log(tagFilter);
        const tag = await Tag.findOne(tagFilter).populate({
            path: "questions",
            model: Question,
            match: searchQuery
              ? { title: { $regex: searchQuery, $options: "i" } }
              : {},
            options: {
              sort: { createdAt: -1 },
            },
            populate: [
              { path: "tags", model: Tag, select: "_id name" },
              { path: "author", model: User, select: "_id clerkId name picture" },
            ],
          });
          if (!tag) {
            throw new Error("Tag not found");
          }
        console.log(tag);
      const questions= tag?.questions;
      console.log("tag fiha had ",questions);
      return {tagTitle: tag?.name, questions};
    }catch(err){
        console.log(err);
        throw err;
}
}