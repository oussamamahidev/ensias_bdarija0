/* eslint-disable @typescript-eslint/no-explicit-any */
import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHtml from '@/components/shared/ParseHtml';
import RenderTag from '@/components/shared/RenderTag';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';

import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


interface URLProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [q: string]: string | undefined }>;
}


const Page = async ({ params, searchParams }: URLProps) => {

 const {id} = await params;
 const {page,filter}= await searchParams;
   const result = await getQuestionById({ questionId: id });
  const { userId  : clerkId } = await auth();
  
    let mongoUser;
   
    if (clerkId) {
      mongoUser = await getUserById({ userId : clerkId});
    }
    console.log("mongo user",mongoUser);
   

    return (
      <>
        <div className="flex-start w-full flex-col">
          <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <Link
              href={`/profile/${result?.author?.clerkId}`}
              className="flex items-center justify-start gap-1">
              <Image
                src={result?.author?.picture ?? "/assets/icons/avatar.svg" }
                className="rounded-full"
                width={22}
                height={22}
                alt="profile"
              />
              <p className="paragraph-semibold text-dark300_light700">
                {result?.author?.name}
              </p>
            </Link>
            <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result.upvotes.length}
              hasAlreadyUpvoted={result.upvotes.includes(mongoUser?._id)}
              downvotes={result.downvotes.length}
              hasAlreadyDownvoted={result.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
            </div>
          </div>
          <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
            {result?.title}
          </h2>
        </div>
  
        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimestamp(result?.createdAt)}`}
            title=""
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(result?.answer?.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(result?.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
  
        <ParseHtml data={result.content } />
  
        <div className="mt-8 flex flex-wrap gap-2">
          {result?.tags.map((tag : any) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))}
        </div>  

        <AllAnswers 
          questionId={(result._id)}
          userId={(mongoUser._id)}
          totalANswers={result?.answer?.length}
          page={page}
          filter={filter}
        />
        <Answer
          question={result.content}
          questionId={JSON.stringify(result._id)}
          authorId={JSON.stringify(mongoUser._id)}
        />
      </>
    );
  };
  
  export default Page;