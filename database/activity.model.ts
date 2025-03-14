/* import { Schema, model, models, type Document } from "mongoose"

export interface IActivity extends Document {
  user: Schema.Types.ObjectId
  project: Schema.Types.ObjectId
  action: string
  details?: string
  createdAt: Date
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  action: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const Activity = models.Activity || model<IActivity>("Activity", ActivitySchema)

export default Activity

 */