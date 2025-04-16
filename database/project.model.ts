/* import { Schema, model, models, type Document } from "mongoose"

export interface IProject extends Document {
  name: string
  description: string
  isPrivate: boolean
  owner: Schema.Types.ObjectId
  stars: Schema.Types.ObjectId[]
  forks: Schema.Types.ObjectId[]
  watchers: Schema.Types.ObjectId[]
  technologies: string[]
  contributors: Schema.Types.ObjectId[]
  readme: string
  repositoryUrl: string
  demoUrl?: string
  completionPercentage: number
  issues: Schema.Types.ObjectId[]
  pullRequests: Schema.Types.ObjectId[]
  parentProject?: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stars: [{ type: Schema.Types.ObjectId, ref: "User" }],
  forks: [{ type: Schema.Types.ObjectId, ref: "User" }],
  watchers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  technologies: [{ type: String }],
  contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  readme: { type: String, default: "" },
  repositoryUrl: { type: String, default: "" },
  demoUrl: { type: String },
  completionPercentage: { type: Number, default: 0 },
  issues: [{ type: Schema.Types.ObjectId, ref: "Issue" }],
  pullRequests: [{ type: Schema.Types.ObjectId, ref: "PullRequest" }],
  parentProject: { type: Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Project = models.Project || model<IProject>("Project", ProjectSchema)

export default Project

 */