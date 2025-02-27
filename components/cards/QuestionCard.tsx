import Link from 'next/link';
import React from 'react'
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';

import { getTimestamp, formatAndDivideNumber } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface Props{
    _id: string;
    clerkId?: string| undefined| null;
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
    views: number
    answers: Array<object>;
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
    downvotes,
    answers,
    createdAt
}: Props) => {
    const showActionButtons= clerkId && clerkId=== author.clerkId;
  return (
   
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className='subtle-reglar text-dark400_light700
                line-clamp-1 flex sm:hidden'>
                    {getTimestamp(createdAt)}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                            {title}
                        </h3>
                    </Link>
            </div>
            <SignedIn>
                {showActionButtons &&(
                    <EditDeleteAction
                        type= "Question"
                        itemId={JSON.stringify(_id)}
                    />
                )}
            </SignedIn>
        </div>
        <div className='mt-3.5 flex flex-wrap gap-2 rounded-sm'>
                {tags?.map(tag =>(
                    <RenderTag 
                    key={tag._id}
                    _id={tag._id}
                    name={tag.name}
                    />
                ))}
            </div>
            <div className='flex-between mt-6 w-full flex-wrap gap-3'>

            <Metric
                    imgUrl={author?.picture ? author.picture: '/assets/icons/avatar.svg'}
                    alt="user"
                    value={author?.name}
                    title={` - asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author?._id}`}
                    isAuthor
                    textStyles='small-medium text-dark400_light800'
                />
                <Metric
                    imgUrl="/assets/icons/like.svg"
                    alt="Upvotes"
                    value={formatAndDivideNumber(upvotes.length)}
                    title="Votes"
                    textStyles='small-medium text-dark400_light800'
                />
                <Metric
    imgUrl="/assets/icons/message.svg"
     alt="Message"
     value={formatAndDivideNumber((answers ?? []).length)} // Default to an empty array
    title=" Answers"
     textStyles="small-medium text-dark400_light800"
/>

                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatAndDivideNumber(views)}
                    title="views"
                    textStyles='small-medium text-dark400_light800'
                />
                

            </div>
        

    </div>
  )
}

export default QuestionCard