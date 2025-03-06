import Link from 'next/link';
import React from 'react'
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { getTimestamp, formatAndDivideNumber } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';
import { IAnswer } from '@/database/answer.model';

interface Props {
    _id: string;
    clerkId?: string | undefined | null;
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
    }
    upvotes: string[];
    downvotes: string[];
    views: number;
    answers?: IAnswer[];
    createdAt: Date;
}

const QuestionCard = ({
    _id,
    clerkId,
    title,
    tags,
    author,
    upvotes,
    views,
    answers,
    createdAt
}: Props) => {
    const showActionButtons = clerkId && clerkId === author.clerkId;

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
                <div>
                    <span className='text-gray-500 dark:text-gray-400 text-sm flex sm:hidden'>
                        {getTimestamp(createdAt)}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3 className='sm:text-lg font-semibold text-gray-900 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors line-clamp-1'>
                            {title}
                        </h3>
                    </Link>
                </div>
                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="Question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>
            <div className='mt-4 flex flex-wrap gap-2'>
                {tags?.map(tag => (
                    <RenderTag
                        key={tag._id}
                        _id={tag._id}
                        name={tag.name}
                        
                    />
                ))}
            </div>
            <div className='flex justify-between mt-6 flex-wrap gap-3 text-gray-700 dark:text-gray-300'>
                <Metric
                    imgUrl={author?.picture || '/assets/icons/avatar.svg'}
                    alt="user"
                    value={author?.name}
                    title={` - asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author?._id}`}
                    isAuthor
                    textStyles='text-sm'
                />
                <Metric
                    imgUrl="/assets/icons/like.svg"
                    alt="Upvotes"
                    value={formatAndDivideNumber(upvotes.length)}
                    title="Votes"
                    textStyles='text-sm'
                />
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="Message"
                    value={formatAndDivideNumber(answers?.length || 0)}
                    title="Answers"
                    textStyles="text-sm"
                />
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="Views"
                    value={formatAndDivideNumber(views)}
                    title="Views"
                    textStyles='text-sm'
                />
            </div>
        </div>
    )
}

export default QuestionCard;