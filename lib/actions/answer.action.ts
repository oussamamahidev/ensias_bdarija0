"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";



export async function createAnswer(params: CreateAnswerParams){

    try{
        connectToDatabase();

        const {content, author, question,path}= params
        
        const newAnswer= await Answer.create({
            content,author,question
        });
        console.log('creating',author)
        
        await Question.findByIdAndUpdate(question,{
            $push: {answer: newAnswer._id}
        })

        //to do
        // newAnswer.save();
        revalidatePath(path);
        console.log({newAnswer});
    }catch(err){
        console.log(err);
        throw err;
    }
}

export async function getAnswers(params:GetAnswersParams) {

    try{
        await connectToDatabase();
        const {questionId}= params;
        const answers = await Answer.find({question: questionId})
        .populate("author", "_id clerkId name picture")
        .sort({createdAt :-1})
        console.log({answers});
        return {answers};
        

    }catch(err){
        console.log(err);
        throw err;
    }

}


export async function upvoteAnswer(params: AnswerVoteParams){

    try {
      connectToDatabase();
      const { answerId, userId, hasAlreadyUpvoted, hasAlreadyDownvoted, path } =
        params;
      let updateQuery = {};
      if (hasAlreadyUpvoted) {
        updateQuery = { $pull: { upvotes: userId } };
      } else if (hasAlreadyDownvoted) {
        updateQuery = {
          $pull: { downvotes: userId },
          $push: { upvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { upvotes: userId } };
      }
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
        new: true,
      });
      if (!answer) {
        throw new Error("Answer not found");
      }
        //increment author repatition by -10for upvoting a question
  
        revalidatePath(path);
    } catch(err){
      console.log(err);
      throw err;
    }
  }
  
  
  export async function downvoteAnswer(params: AnswerVoteParams){
  
    try {
      connectToDatabase();
      const { answerId, userId, hasAlreadyUpvoted, hasAlreadyDownvoted, path } =
        params;
      let updateQuery = {};
      if (hasAlreadyDownvoted) {
        updateQuery = { $pull: { downvote: userId } };
      } else if (hasAlreadyUpvoted) {
        updateQuery = {
          $pull: { upvotes: userId },
          $push: { downvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { downvotes: userId } };
      }
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
        new: true,
      });
      if (!answer) {
        throw new Error("Answer not found");
      }
      
        //increment author repatition by -10for upvoting a question
  
        revalidatePath(path);
    } catch(err){
      console.log(err);
      throw err;
    }
  }
  
    
