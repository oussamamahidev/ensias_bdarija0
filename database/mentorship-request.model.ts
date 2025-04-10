import { Schema, models, model, type Document } from "mongoose"

export interface IMentorshipRequest extends Document {
  mentee: Schema.Types.ObjectId // User requesting mentorship
  mentor: Schema.Types.ObjectId // Reference to Mentor model
  topic: string // What they want help with
  description: string // Detailed description of what they need help with
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  proposedTimes: {
    date: Date
    startTime: string
  }[]
  selectedTime?: {
    date: Date
    startTime: string
  }
  duration: number // Duration in minutes
  messages: {
    sender: Schema.Types.ObjectId
    content: string
    timestamp: Date
  }[]
  createdAt: Date
}

const MentorshipRequestSchema = new Schema({
  mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mentor: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  proposedTimes: [
    {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
    },
  ],
  selectedTime: {
    date: { type: Date },
    startTime: { type: String },
  },
  duration: { type: Number, default: 30 },
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

const MentorshipRequest = models.MentorshipRequest || model("MentorshipRequest", MentorshipRequestSchema)

export default MentorshipRequest
