
import { SearchParamsProps, SearchParamsPropss } from '@/types';
import React from 'react'
import QuestionCard from '../cards/QuestionCard';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './search/Pagination';
interface Props extends SearchParamsPropss {
  userId: string;
  clerkId?: string | null;
}
const AnswersTab =async ({searchParams,userId,clerkId} : Props) => {
  const {page}= await searchParams;
  const result = await getUserAnswers({
    userId,
    page: parseInt(String(page? + page:1))
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
    <div className="mt-10">
      <Pagination 
        pageNumber={page ? + page :1}
        isNext={result.isNext|| false}
      />
      </div>
    </>
    )
}

export default AnswersTab