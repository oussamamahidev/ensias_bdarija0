// // actions/mentor.actions.ts
// "use server";

// import { connectToDatabase } from "@/lib/mongoose";
// import Mentor from "@/database/mentor.model";
// import User from "@/database/user.model";
// import { revalidatePath } from "next/cache";
// import { clerkClient } from "@clerk/nextjs/server";

// // Types for parameters
// interface CreateMentorParams {
//   userId: string; // Clerk ID
//   specializations: string[];
//   bio: string;
//   hourlyRate?: number;
//   availability: {
//     day: string;
//     startTime: string;
//     endTime: string;
//   }[];
//   path: string;
// }

// interface GetMentorsParams {
//   searchQuery?: string;
//   specialization?: string;
//   page?: number;
//   pageSize?: number;
//   sortBy?: string;
// }

// interface VerifyMentorParams {
//   mentorId: string;
//   isVerified: boolean;
//   path: string;
// }

// // Create a new mentor profile
// export async function createMentor(params: CreateMentorParams) {
//   try {
//     await connectToDatabase();

//     const {
//       userId,
//       specializations,
//       bio,
//       hourlyRate = 0,
//       availability,
//       path,
//     } = params;

//     // Get the user from the database
//     const user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Check if user already has a mentor profile
//     const existingMentor = await Mentor.findOne({ user: user._id });

//     if (existingMentor) {
//       throw new Error("Mentor profile already exists for this user");
//     }

//     // Create new mentor profile
//     const newMentor = await Mentor.create({
//       user: user._id,
//       specializations,
//       bio,
//       hourlyRate,
//       availability,
//       isVerified: false, // Requires admin verification
//       isActive: true,
//     });

//     // Update user metadata in Clerk to indicate pending mentor status
//     await clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: {
//         isMentorPending: true,
//       },
//     });

//     revalidatePath(path);
//     return newMentor;
//   } catch (error) {
//     console.error("Error creating mentor profile:", error);
//     throw error;
//   }
// }

// // Get all mentors with filtering and pagination
// export async function getMentors(params: GetMentorsParams) {
//   try {
//     await connectToDatabase();

//     const {
//       searchQuery,
//       specialization,
//       page = 1,
//       pageSize = 10,
//       sortBy = "rating",
//     } = params;

//     const skipAmount = (page - 1) * pageSize;

//     // Build query
//     const query: any = {};

//     if (specialization) {
//       query.specializations = { $in: [specialization] };
//     }

//     // Build sort options
//     let sortOptions: any = {};

//     switch (sortBy) {
//       case "rating":
//         sortOptions = { averageRating: -1 };
//         break;
//       case "experience":
//         sortOptions = { totalSessions: -1 };
//         break;
//       case "price-low":
//         sortOptions = { hourlyRate: 1 };
//         break;
//       case "price-high":
//         sortOptions = { hourlyRate: -1 };
//         break;
//       default:
//         sortOptions = { averageRating: -1 };
//     }

//     // If we have a search query, use aggregation to join with User model
//     if (searchQuery) {
//       const mentors = await Mentor.aggregate([
//         {
//           $lookup: {
//             from: "users",
//             localField: "user",
//             foreignField: "_id",
//             as: "userDetails",
//           },
//         },
//         { $unwind: "$userDetails" },
//         {
//           $match: {
//             $or: [
//               { "userDetails.name": { $regex: new RegExp(searchQuery, "i") } },
//               { specializations: { $in: [new RegExp(searchQuery, "i")] } },
//             ],
//           },
//         },
//         { $sort: sortOptions },
//         { $skip: skipAmount },
//         { $limit: pageSize },
//       ]);

//       const totalMentors = await Mentor.countDocuments(query);
//       const isNext = totalMentors > skipAmount + mentors.length;

//       return { mentors, isNext };
//     } else {
//       // Without search query, use regular find
//       const mentors = await Mentor.find(query)
//         .populate("user", "name picture")
//         .sort(sortOptions)
//         .skip(skipAmount)
//         .limit(pageSize);

//       const totalMentors = await Mentor.countDocuments(query);
//       const isNext = totalMentors > skipAmount + mentors.length;

//       return { mentors, isNext };
//     }
//   } catch (error) {
//     console.error("Error fetching mentors:", error);
//     throw error;
//   }
// }

// // Verify or reject a mentor
// export async function verifyMentor(params: VerifyMentorParams) {
//   try {
//     await connectToDatabase();

//     const { mentorId, isVerified, path } = params;

//     const mentor = await Mentor.findById(mentorId).populate("user");

//     if (!mentor) {
//       throw new Error("Mentor not found");
//     }

//     // Update mentor verification status
//     mentor.isVerified = isVerified;
//     await mentor.save();

//     // Get the user's clerkId
//     const user = await User.findById(mentor.user);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Update user metadata in Clerk
//     await clerkClient.users.updateUserMetadata(user.clerkId, {
//       publicMetadata: {
//         isMentorPending: false,
//         isMentor: isVerified,
//       },
//     });

//     revalidatePath(path);
//     return mentor;
//   } catch (error) {
//     console.error("Error verifying mentor:", error);
//     throw error;
//   }
// }

// // Get mentor by ID
// export async function getMentorById(mentorId: string) {
//   try {
//     await connectToDatabase();

//     const mentor = await Mentor.findById(mentorId).populate(
//       "user",
//       "name picture"
//     );

//     return mentor;
//   } catch (error) {
//     console.error("Error fetching mentor by ID:", error);
//     throw error;
//   }
// }

// // Get mentor by user ID (Clerk ID)
// export async function getMentorByUserId(userId: string) {
//   try {
//     await connectToDatabase();

//     // First get the user document
//     const user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       return null;
//     }

//     // Then find the mentor profile
//     const mentor = await Mentor.findOne({ user: user._id }).populate(
//       "user",
//       "name picture"
//     );

//     return mentor;
//   } catch (error) {
//     console.error("Error fetching mentor by user ID:", error);
//     return null;
//   }
// }

// // Check if user is a mentor
// export async function isMentor(userId: string) {
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     return user.publicMetadata.isMentor === true;
//   } catch (error) {
//     console.error("Error checking mentor status:", error);
//     return false;
//   }
// }