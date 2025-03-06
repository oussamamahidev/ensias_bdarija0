"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams){


    try {
        await connectToDatabase();
        const {query,type} = params;
        const regexQuery= {$regex:query,$options:"i"}
        let result:any=[];
        const modelsAndTypes=[
            { model: Question, searchField: "title", type: "question" },
            { model: User, searchField: "name", type: "user" },
            { model: Answer, searchField: "content", type: "answer" },
            { model: Tag, searchField: "name", type: "tag" },
        ]
        const typeLower= type?.toLowerCase();
        if(!typeLower || !SearchableTypes.includes(typeLower) ){
            //search across everyting

            for (const { model, searchField, type } of modelsAndTypes) {
                const queryResults = await model
                  .find({ [searchField]: regexQuery })
                  .limit(2);
                result.push(
                  ...queryResults.map((item) => ({
                    title:
                      type === "answer"
                        ? `Answer containing ${query}`
                        : item[searchField],
                    type,
                    id:
                      type === "user"
                        ? item.clerkid
                        : type === "answer"
                          ? item.question
                          : item._id,
                  }))
                );}
        }else{
            //specify model in click
            const modelInfo= modelsAndTypes.find((item)=>item.type==type);
            if(!modelInfo){
                throw new Error('invalid search type');
            }
            const queryResult= await modelInfo.model.find({[modelInfo.searchField]: regexQuery })
            .limit(8)

            result= queryResult.map((item)=>({
                title:
                type === "answer"
                  ? `Answer containing ${query}`
                  : item[modelInfo.searchField],
              type,
              id: 
                type === "user"
                  ? item.clerkId
                  : type === "answer"
                    ? item.question
                    : item._id,
            }))
        }
        return JSON.stringify(result);
    } catch (error) {
        console.log(error);
        throw error;
    }

}