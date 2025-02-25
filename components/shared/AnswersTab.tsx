
import { SearchParamsProps, SearchParamsPropss } from '@/types';
import React from 'react'
import QuestionCard from '../cards/QuestionCard';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
interface Props extends SearchParamsPropss {
  userId: string;
  clerkId?: string | null;
}
const AnswersTab =async ({searchParams,userId,clerkId} : Props) => {
  const result = await getUserAnswers({
    userId
  })
  console.log(result);
  return (
    <>
    {result.answers.map(item =>(
      <AnswerCard 
      key={item._id}
      clerkId={clerkId}
      _id={item._id}
      question={item.question}
      author={item.author}
      upvotes={item.upvotes.length}
      createdAt={item.createdAt}
      />
    ))}
    </>
    )
}

export default AnswersTab