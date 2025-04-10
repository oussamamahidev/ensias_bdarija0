import { Schema, models, model, type Document } from "mongoose"

export interface ISession extends Document {
  request: Schema.Types.ObjectId // Reference to MentorshipRequest
  mentor: Schema.Types.ObjectId // Reference to Mentor
  mentee: Schema.Types.ObjectId // Reference to User
  startTime: Date
  endTime: Date
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  meetingLink?: string // URL for video call
  notes?: string // Session notes
  rating?: {
    score: number // 1-5
    feedback: string
  }
  createdAt: Date
}

const SessionSchema = new Schema({
  request: { type: Schema.Types.ObjectId, ref: "MentorshipRequest", required: true },
  mentor: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
  mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "in-progress", "completed", "cancelled"],
    default: "scheduled",
  },
  meetingLink: { type: String },
  notes: { type: String },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
})

const Session = models.Session || model("Session", SessionSchema)

export default Session
