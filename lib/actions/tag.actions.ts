
"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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