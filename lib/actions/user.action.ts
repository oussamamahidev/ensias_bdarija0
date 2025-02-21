"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
  GetUserByIdParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: GetUserByIdParams) {
  try {
    console.log('user being called')
    await connectToDatabase(); // FIX: Await database connection

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.error("🔴 Error fetching user by ID:", error);
    throw error;
  }
}

export async function createUser(userParam: CreateUserParams) {
  try {
    console.log('Creating user')
    await connectToDatabase(); // FIX: Await database connection

    const newUser = await User.create(userParam);
    return newUser;
  } catch (error) {
    console.error("🔴 Error creating user:", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    console.log("Updating user")
    await connectToDatabase(); // FIX: Await database connection

    const { clerkId, updateData, path } = params;
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    revalidatePath(path);
    return updatedUser;
  } catch (error) {
    console.error("🔴 Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userParam: DeleteUserParams) {
  try {
    await connectToDatabase(); // FIX: Await database connection

    const { clerkId } = userParam;
    const user = await User.findOneAndDelete({ clerkId }); // FIX: Use findOneAndDelete instead of findByIdAndDelete

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all questions associated with this user
    await Question.deleteMany({ author: user._id });

    console.log("✅ User and related questions deleted successfully.");
    return user;
  } catch (error) {
    console.error("🔴 Error deleting user:", error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase(); // FIX: Await database connection

    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error("🔴 Error fetching all users:", error);
    throw error;
  }
}
