/* import { Schema, model, models, type Document } from "mongoose"

export interface IPullRequest extends Document {
  title: string
  description: string
  status: "open" | "merged" | "closed"
  project: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  reviewers: Schema.Types.ObjectId[]
  sourceBranch: string
  targetBranch: string
  createdAt: Date
  updatedAt: Date
  mergedAt?: Date
  closedAt?: Date
}

const PullRequestSchema = new Schema<IPullRequest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["open", "merged", "closed"], default: "open" },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reviewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sourceBranch: { type: String, default: "feature" },
  targetBranch: { type: String, default: "main" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  mergedAt: { type: Date },
  closedAt: { type: Date },
})

const PullRequest = models.PullRequest || model<IPullRequest>("PullRequest", PullRequestSchema)

export default PullRequest

 */