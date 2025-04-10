// database/mentor.model.ts
import { Schema, models, model, type Document } from "mongoose";

export interface IMentor extends Document {
  user: Schema.Types.ObjectId; // Reference to User model
  specializations: string[]; // Areas of expertise (e.g., "JavaScript", "DevOps")
  bio: string; // Mentor-specific bio
  hourlyRate: number; // Optional if you want to monetize
  availability: {
    day: string; // "Monday", "Tuesday", etc.
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
  isVerified: boolean; // Whether admin has approved mentor status
  averageRating: number; // Average of all ratings
  totalSessions: number; // Count of completed sessions
  isActive: boolean; // Whether mentor is currently accepting requests
  createdAt: Date;
}

const MentorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specializations: [{ type: String, required: true }],
  bio: { type: String, required: true },
  hourlyRate: { type: Number, default: 0 },
  availability: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  isVerified: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Mentor = models.Mentor || model("Mentor", MentorSchema);

export default Mentor;
