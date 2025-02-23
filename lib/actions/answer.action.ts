"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
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
    
