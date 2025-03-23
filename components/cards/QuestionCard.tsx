"use client";

import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { getTimestamp, formatAndDivideNumber } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import type { IAnswer } from "@/database/answer.model";
import { MessageSquare, Eye, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  _id: string;
  currentUserId?: string | null;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    clerkId: string;
    picture: string;
  };
  upvotes: string[];
  downvotes: string[];
  views: number;
  answers?: IAnswer[];
  createdAt: Date | string;
}

const QuestionCard = ({
  _id,
  currentUserId,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Props) => {
  const showActionButtons = currentUserId && currentUserId === author.clerkId;

  // Convert string date to Date object if needed
  const createdAtDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-4px] border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 dark:text-gray-400 text-sm flex sm:hidden mb-2">
              {getTimestamp(createdAtDate)}
            </span>
            <SignedIn>
              {showActionButtons && (
                <EditDeleteAction type="Question" itemId={_id} />
              )}
            </SignedIn>
          </div>
          <Link href={`/question/${_id}`} className="block group">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 mb-3">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex justify-between mt-6 flex-wrap gap-3 text-gray-600 dark:text-gray-300">
        <Metric
          imgUrl={author?.picture || "/assets/icons/avatar.svg"}
          alt="user"
          value={author?.name}
          title={` - asked ${getTimestamp(createdAtDate)}`}
          href={`/profile/${author?._id}`}
          isAuthor
          textStyles="text-sm font-medium"
        />

        <div className="flex items-center gap-4 max-sm:flex-wrap max-sm:justify-start">
          <div className="flex items-center gap-1 text-sm">
            <ThumbsUp size={16} className="text-primary-500" />
            <span>{formatAndDivideNumber(upvotes.length)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">votes</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <MessageSquare size={16} className="text-blue-500" />
            <span>{formatAndDivideNumber(answers?.length || 0)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              answers
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Eye size={16} className="text-green-500" />
            <span>{formatAndDivideNumber(views)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
