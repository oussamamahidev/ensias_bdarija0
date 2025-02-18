"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
    try {
      connectToDatabase();
      const { userId } = params;
      const user = await User.findOne({ clerkId: userId });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  export async function createUser(userParam: CreateUserParams){
    try {
      connectToDatabase();
      const newUser= await User.create(userParam);
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export async function updateUser(Params: UpdateUserParams){
    try {
      connectToDatabase();
      const {clerkId, updateData,path} = Params
      const newUser= await User.findOneAndUpdate({clerkId }, updateData,
        {new: true}
      );
      revalidatePath(path)
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export async function deleteUser(userParam: DeleteUserParams){
    try {
      connectToDatabase();
      const {clerkId}= userParam;
      const user = await User.findByIdAndDelete(
        {clerkId}
      )
      if(!user){
        throw new Error('User not found');
      }

      //delete question
      //delete user question ids
      const userQuestionIds = await Question.findById(
        {author: user._id }
      ).distinct('_id');

      await Question.deleteMany({author: user._id});

      const deleteUser= await User.findByIdAndDelete(user._id);
      return deleteUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }