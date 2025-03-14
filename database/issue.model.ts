/* import { Schema, model, models, type Document } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  project: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  assignees: Schema.Types.ObjectId[];
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const IssueSchema = new Schema<IIssue>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  labels: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

const Issue = models.Issue || model<IIssue>("Issue", IssueSchema);

export default Issue;
 */