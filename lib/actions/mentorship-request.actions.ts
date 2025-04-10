// "use server";

// import { connectToDatabase } from "../mongoose";
// import MentorshipRequest from "@/database/mentorship-request.model";
// import Mentor from "@/database/mentor.model";
// import User from "@/database/user.model";
// import Session from "@/database/session.model";
// import { revalidatePath } from "next/cache";

// // Add these types to your shared.types.ts file

// export interface CreateMentorshipRequestParams {
//   menteeId: string; // Clerk ID
//   mentorId: string; // Mentor document ID
//   topic: string;
//   description: string;
//   proposedTimes: {
//     date: Date;
//     startTime: string;
//   }[];
//   duration: number;
//   path: string;
// }

// export interface GetMentorshipRequestsParams {
//   userId: string; // Clerk ID
//   role: "mentee" | "mentor";
//   status?: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
//   page?: number;
//   pageSize?: number;
// }

// export interface UpdateRequestStatusParams {
//   requestId: string;
//   status: "accepted" | "rejected" | "completed" | "cancelled";
//   selectedTime?: {
//     date: Date;
//     startTime: string;
//   };
//   path: string;
// }

// export interface AddMessageParams {
//   requestId: string;
//   senderId: string; // Clerk ID
//   content: string;
//   path: string;
// }

// export interface ScheduleSessionParams {
//   requestId: string;
//   startTime: Date;
//   endTime: Date;
//   meetingLink?: string;
//   path: string;
// }

// export async function createMentorshipRequest(
//   params: CreateMentorshipRequestParams
// ) {
//   try {
//     await connectToDatabase();

//     const {
//       menteeId,
//       mentorId,
//       topic,
//       description,
//       proposedTimes,
//       duration,
//       path,
//     } = params;

//     // Get the mentee user
//     const mentee = await User.findOne({ clerkId: menteeId });

//     if (!mentee) {
//       throw new Error("Mentee not found");
//     }

//     // Get the mentor
//     const mentor = await Mentor.findById(mentorId);

//     if (!mentor) {
//       throw new Error("Mentor not found");
//     }

//     // Create the mentorship request
//     const newRequest = await MentorshipRequest.create({
//       mentee: mentee._id,
//       mentor: mentor._id,
//       topic,
//       description,
//       proposedTimes,
//       duration,
//       status: "pending",
//       messages: [],
//     });

//     revalidatePath(path);
//     return newRequest;
//   } catch (error) {
//     console.error("Error creating mentorship request:", error);
//     throw error;
//   }
// }

// export async function getMentorshipRequests(
//   params: GetMentorshipRequestsParams
// ) {
//   try {
//     await connectToDatabase();

//     const { userId, role, status, page = 1, pageSize = 10 } = params;

//     const skipAmount = (page - 1) * pageSize;

//     // Get the user
//     const user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Build query based on role
//     const query: any = {};

//     if (role === "mentee") {
//       query.mentee = user._id;
//     } else {
//       // Find mentor profile first
//       const mentor = await Mentor.findOne({ user: user._id });

//       if (!mentor) {
//         throw new Error("Mentor profile not found");
//       }

//       query.mentor = mentor._id;
//     }

//     // Add status filter if provided
//     if (status) {
//       query.status = status;
//     }

//     // Get total count
//     const totalRequests = await MentorshipRequest.countDocuments(query);

//     // Get requests with pagination
//     const requests = await MentorshipRequest.find(query)
//       .populate({
//         path: "mentee",
//         model: User,
//         select: "_id clerkId name picture",
//       })
//       .populate({
//         path: "mentor",
//         model: Mentor,
//         populate: {
//           path: "user",
//           model: User,
//           select: "_id clerkId name picture",
//         },
//       })
//       .sort({ createdAt: -1 })
//       .skip(skipAmount)
//       .limit(pageSize);

//     const isNext = totalRequests > skipAmount + requests.length;

//     return { requests, isNext };
//   } catch (error) {
//     console.error("Error fetching mentorship requests:", error);
//     throw error;
//   }
// }

// export async function updateRequestStatus(params: UpdateRequestStatusParams) {
//   try {
//     await connectToDatabase();

//     const { requestId, status, selectedTime, path } = params;

//     const updateData: any = { status };

//     // If accepting and providing a selected time
//     if (status === "accepted" && selectedTime) {
//       updateData.selectedTime = selectedTime;
//     }

//     const updatedRequest = await MentorshipRequest.findByIdAndUpdate(
//       requestId,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!updatedRequest) {
//       throw new Error("Mentorship request not found");
//     }

//     revalidatePath(path);
//     return updatedRequest;
//   } catch (error) {
//     console.error("Error updating request status:", error);
//     throw error;
//   }
// }

// export async function addMessage(params: AddMessageParams) {
//   try {
//     await connectToDatabase();

//     const { requestId, senderId, content, path } = params;

//     // Get the sender
//     const sender = await User.findOne({ clerkId: senderId });

//     if (!sender) {
//       throw new Error("Sender not found");
//     }

//     // Add message to the request
//     const updatedRequest = await MentorshipRequest.findByIdAndUpdate(
//       requestId,
//       {
//         $push: {
//           messages: {
//             sender: sender._id,
//             content,
//             timestamp: new Date(),
//           },
//         },
//       },
//       { new: true }
//     ).populate({
//       path: "messages.sender",
//       model: User,
//       select: "_id clerkId name picture",
//     });

//     if (!updatedRequest) {
//       throw new Error("Mentorship request not found");
//     }

//     revalidatePath(path);
//     return updatedRequest.messages[updatedRequest.messages.length - 1];
//   } catch (error) {
//     console.error("Error adding message:", error);
//     throw error;
//   }
// }

// export async function scheduleSession(params: ScheduleSessionParams) {
//   try {
//     await connectToDatabase();

//     const { requestId, startTime, endTime, meetingLink, path } = params;

//     // Get the request
//     const request = await MentorshipRequest.findById(requestId)
//       .populate("mentor")
//       .populate("mentee");

//     if (!request) {
//       throw new Error("Mentorship request not found");
//     }

//     // Create a new session
//     const newSession = await Session.create({
//       request: request._id,
//       mentor: request.mentor,
//       mentee: request.mentee,
//       startTime,
//       endTime,
//       meetingLink,
//       status: "scheduled",
//     });

//     // Update request status to accepted if it's not already
//     if (request.status === "pending") {
//       await MentorshipRequest.findByIdAndUpdate(requestId, {
//         $set: { status: "accepted" },
//       });
//     }

//     revalidatePath(path);
//     return newSession;
//   } catch (error) {
//     console.error("Error scheduling session:", error);
//     throw error;
//   }
// }

// export async function getSessionById(sessionId: string) {
//   try {
//     await connectToDatabase();

//     const session = await Session.findById(sessionId)
//       .populate({
//         path: "mentor",
//         model: Mentor,
//         populate: {
//           path: "user",
//           model: User,
//           select: "_id clerkId name picture",
//         },
//       })
//       .populate({
//         path: "mentee",
//         model: User,
//         select: "_id clerkId name picture",
//       })
//       .populate("request");

//     if (!session) {
//       throw new Error("Session not found");
//     }

//     return session;
//   } catch (error) {
//     console.error("Error fetching session:", error);
//     throw error;
//   }
// }

// export async function rateSession(
//   sessionId: string,
//   rating: number,
//   feedback: string,
//   path: string
// ) {
//   try {
//     await connectToDatabase();

//     // Update the session with rating
//     const session = await Session.findByIdAndUpdate(
//       sessionId,
//       {
//         $set: {
//           rating: {
//             score: rating,
//             feedback,
//           },
//           status: "completed",
//         },
//       },
//       { new: true }
//     );

//     if (!session) {
//       throw new Error("Session not found");
//     }

//     // Update the mentor's average rating
//     const mentor = await Mentor.findById(session.mentor);

//     if (!mentor) {
//       throw new Error("Mentor not found");
//     }

//     // Get all completed sessions for this mentor with ratings
//     const completedSessions = await Session.find({
//       mentor: mentor._id,
//       status: "completed",
//       "rating.score": { $exists: true },
//     });

//     // Calculate new average rating
//     const totalRating = completedSessions.reduce(
//       (sum, session) => sum + (session.rating?.score || 0),
//       0
//     );

//     const averageRating = totalRating / completedSessions.length;

//     // Update mentor
//     await Mentor.findByIdAndUpdate(mentor._id, {
//       $set: {
//         averageRating,
//         totalSessions: completedSessions.length,
//       },
//     });

//     revalidatePath(path);
//     return session;
//   } catch (error) {
//     console.error("Error rating session:", error);
//     throw error;
//   }
// }
