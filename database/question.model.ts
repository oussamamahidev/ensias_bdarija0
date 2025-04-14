import { Schema, models, model, type Document } from "mongoose";

export interface Iquestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[]; //another model
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  // Fixed: Changed 'anwers' to 'answers'
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: { type: String, required: true }, // Fixed: Changed 'require' to 'required'
  content: { type: String, required: true }, // Fixed: Changed 'require' to 'required'
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  createdAt: { type: Date, default: Date.now },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
