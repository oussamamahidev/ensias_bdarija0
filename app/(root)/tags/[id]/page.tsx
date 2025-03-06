import { Suspense } from "react"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import { getQuestionByTagId } from "@/lib/actions/tag.actions"
import LocalSearch from "@/components/shared/search/LocalSearch"
import Pagination from "@/components/shared/search/Pagination"

// Loading fallbacks
function SearchbarLoading() {
  return <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
}

function QuestionsLoading() {
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-48 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
      ))}
    </div>
  )
}

interface URLProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [q: string]: string | undefined }>;
}


const Page = async ({ params, searchParams }: URLProps) => {

 const {id} = await params;
 const {q,page}= await searchParams;
  const result = await getQuestionByTagId({
    tagId: id,
    searchQuery: q,
    page: parseInt(String(page? + page:1))

  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <Suspense fallback={<SearchbarLoading />}>
          <LocalSearch
            route={`/tags/${id}`}
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for tag questions"
            otherClasses="flex-1"
          />
        </Suspense>
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
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers || []}
              createdAt={question.createdAt} downvotes={[]}            />
          ))
        ) : (
          <NoResult
            title="There's no tag questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-light-700 dark:bg-dark-500 rounded-lg" />}>
          <Pagination pageNumber={page ? + page : 1} isNext={result.isNext} />
        </Suspense>
      </div>
    </>
  )
}

export default Page
