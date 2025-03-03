"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";



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
        const {questionId,sortBy}= params;
        let sortOptions = {};
        switch (sortBy) {
          case "highestUpvotes":
            sortOptions = { upvotes: -1 };
            break;
          case "lowestUpvotes":
            sortOptions = { upvotes: 1 };
            break;
          case "recent":
            sortOptions = { createdAt: -1 };
            break;
          case "old":
            sortOptions = { createdAt: 1 };
            break;
          default:
            break;
        }
        const answers = await Answer.find({question: questionId})
        .populate("author", "_id clerkId name picture")
        .sort(sortOptions);
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
  
    
  export async function deleteAnswer(params : DeleteAnswerParams){

    try{
      connectToDatabase();
      const { answerId, path } = params;
      const answer = await Answer.findById(answerId);
      if (!answer) {
        throw new Error("Answer not found");
      }
      await answer.deleteOne({ _id: answerId });
      await Question.updateMany(
        { _id: answer.question },
        { $pull: { answers: answerId } }
      );
      await Interaction.deleteMany({ answer: answerId });
      revalidatePath(path);
    }catch(err){
      console.log(err);
      throw err;
    }
  }