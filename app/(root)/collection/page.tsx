
import LocalSearch from "@/components/shared/search/LocalSearch";

import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import Pagination from "@/components/shared/search/Pagination";

interface HomePageProps {
  searchParams: Promise<{ [q: string]: string | undefined }>;
}
export default async  function Home({searchParams}:HomePageProps) {
  
  const {q,filter,page}= await searchParams;
  const { userId } = await  auth();
  console.log(userId);
  if(!userId) return null;

  const result= await getSavedQuestions({
    clerkId: userId,
    searchQuery: q,
    filter:filter,
    page: parseInt(String(page? + page:1))

  });
  
  return (
    <>
    <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
    <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearch
        route="/collection"
        iconPosition="left"
        imgSrc="/assets/icons/search.svg"
        placeholder="Search for questions"
        otherClasses="flex-1"
      />
      <Filter
        filters={QuestionFilters}
        otherClasses="min-h-[56px] sm:min-w-[170px]"
      />
    </div>
    <div className="mt-10 flex w-full flex-col gap-6">
      {result.questions?.length > 0 ? (
      result.questions.map((question: any) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            downvotes={question.downvotes}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))
      ) : (
        <NoResult
          title="There’s no saved questions to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linktitle="Ask a Question"
        />
      )}
    </div>
    <div className="mt-10">
      <Pagination 
        pageNumber={page ? + page :1}
        isNext={result.isNext|| false}
      />
      </div>
  </>
  );
}



