import { getUserQuestion } from "@/lib/actions/user.action";
import type { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./search/Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { page } = searchParams;

  try {
    const result = await getUserQuestion({
      userId,
      page: page ? Number(page) : 1,
    });

    console.log("User questions result:", result);

    return (
      <>
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              currentUserId={clerkId}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <div className="flex-center flex-col gap-2 mt-10">
            <p className="text-dark400_light700 body-regular">
              No questions found
            </p>
          </div>
        )}

        <div className="mt-10">
          <Pagination
            pageNumber={Number(page) || 1}
            isNext={result.isNext || false}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching user questions:", error);
    return (
      <div className="flex-center flex-col gap-2 mt-10">
        <p className="text-dark400_light700 body-regular">
          Error loading questions
        </p>
      </div>
    );
  }
};

export default QuestionTab;
