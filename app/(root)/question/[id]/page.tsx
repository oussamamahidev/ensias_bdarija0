import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHtml from '@/components/shared/ParseHtml';
import RenderTag from '@/components/shared/RenderTag';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { URLProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

const Page = async ({ params, searchParams }: URLProps) => {
  try {
    // Get question data
    const result = await getQuestionById({ questionId: params.id });
    
    if (!result) {
      throw new Error('Question not found');
    }

    // Get user data
    const { userId: clerkId } = await auth();
    let mongoUser;

    if (clerkId) {
      mongoUser = await getUserById({ userId: clerkId });
    }

    if (!mongoUser) {
      throw new Error('User not found');
    }

    return (
      <>
        <div className="flex-start w-full flex-col">
          <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <Link
              href={`/profile/${result.author?.clerkId}`}
              className="flex items-center justify-start gap-1">
              <Image
                src={result.author?.picture ?? "/assets/icons/avatar.svg"}
                className="rounded-full"
                width={22}
                height={22}
                alt="profile"
              />
              <p className="paragraph-semibold text-dark300_light700">
                {result.author?.name}
              </p>
            </Link>
            <div className="flex justify-end">
              VOTING
            </div>
          </div>
          <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
            {result.title}
          </h2>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimestamp(result.createdAt)}`}
            title=""
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(result.answers?.length || 0)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(result.views || 0)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>

        <ParseHtml data={result.content} />

        <div className="mt-8 flex flex-wrap gap-2">
          {result.tags?.map((tag: any) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))}
        </div>

        <AllAnswers
          questionId={result._id}
          userId={mongoUser._id.toString()}
          totalANswers={result.answers?.length || 0}
        />

        <Answer
          question={result.content}
          questionId={result._id.toString()}
          authorId={mongoUser._id.toString()}
        />
      </>
    );
  } catch (error) {
    console.error('Error in question page:', error);
    return (
      <div className="flex-center w-full h-full">
        <p className="text-dark200_light900">Something went wrong</p>
      </div>
    );
  }
};

export default Page;