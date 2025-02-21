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

// Connect to database once at the module level
let isConnected = false;
const ensureConnection = async () => {
  if (!isConnected) {
    await connectToDatabase();
    isConnected = true;
  }
};

export async function getUserById(params: GetUserByIdParams) {
  try {
    await ensureConnection();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("🔴 Error fetching user by ID:", error);
    throw error;
  }
}

export async function createUser(userParam: CreateUserParams) {
  try {
    await ensureConnection();

    const newUser = await User.create(userParam);
    
    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return newUser;
  } catch (error) {
    console.error("🔴 Error creating user:", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await ensureConnection();

    const { clerkId, updateData, path } = params;
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true, runValidators: true }
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
    await ensureConnection();

    const { clerkId } = userParam;
    
    // Use transaction to ensure atomicity
    const session = await User.startSession();
    let deletedUser;

    try {
      await session.withTransaction(async () => {
        const user = await User.findOneAndDelete({ clerkId }).session(session);
        
        if (!user) {
          throw new Error("User not found");
        }

        // Delete all questions associated with this user
        await Question.deleteMany({ author: user._id }).session(session);
        deletedUser = user;
      });
    } finally {
      await session.endSession();
    }

    if (!deletedUser) {
      throw new Error("Failed to delete user");
    }

    return deletedUser;
  } catch (error) {
    console.error("🔴 Error deleting user:", error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await ensureConnection();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password') // Exclude sensitive data
      .lean(); // Convert to plain JS objects for better performance

    return { users };
  } catch (error) {
    console.error("🔴 Error fetching all users:", error);
    throw error;
  }
}

export async function generateUniqueUsername(firstName: string | null, lastName: string | null) {
  try {
    await ensureConnection();

    // Handle empty/null names
    if (!firstName && !lastName) {
      throw new Error("Both first name and last name cannot be empty");
    }

    // Create base username from full name
    const baseUsername = `${firstName || ''}${lastName || ''}`
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
      .slice(0, 20); // Limit length
    
    if (baseUsername.length < 3) {
      throw new Error("Username is too short after sanitization");
    }

    let username = baseUsername;
    let counter = 1;
    const MAX_ATTEMPTS = 100; // Prevent infinite loops

    // Keep checking until we find a unique username
    while (counter <= MAX_ATTEMPTS) {
      // Check if username exists in database
      const existingUser = await User.findOne({ username }).lean();
      
      if (!existingUser) {
        return username;
      }

      // If username exists, append counter and try again
      username = `${baseUsername}${counter}`;
      counter++;
    }

    throw new Error("Could not generate unique username after maximum attempts");
  } catch (error) {
    console.error("🔴 Error generating unique username:", error);
    throw error;
  }
}