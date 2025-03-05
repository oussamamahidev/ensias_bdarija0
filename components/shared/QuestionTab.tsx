import { getUserQuestion } from '@/lib/actions/user.action';
import { SearchParamsProps, SearchParamsPropss } from '@/types';
import React from 'react'
import QuestionCard from '../cards/QuestionCard';
import Pagination from './search/Pagination';
interface Props extends SearchParamsPropss {
  userId: string;
  clerkId?: string | null;
  
}
const QuestionTab = async ({searchParams,userId,clerkId} : Props) => {

  const {page}= await searchParams;
  const result = await getUserQuestion({
    userId,
    page: parseInt(String(page? + page:1))
  })
  console.log(result);
  return (
    <>
    {result.questions.map(question =>(
      <QuestionCard 
      key={question._id}
      _id={question._id} 
      clerkId={clerkId}
      title={question.title}
      tags={question.tags}
      author={question.author}
      upvotes={question.upvotes}
      downvotes={question.downvotes}
      views={question.views}
      answers={question.answers}
      createdAt={question.createdAt}
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

export default QuestionTab