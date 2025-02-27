
import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

interface EditPageProps {
    params: Promise<{ id: string }>;
  }
const Page = async ({ params }: EditPageProps) => {
  const { userId } =await auth();
  const { id } = await params;
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({questionId: id})
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Question 
        type='edit' 
        mongoUserId={mongoUser._id}
        questionDetails={JSON.stringify(result)}/>
      </div>
    </>
  );
};

export default Page;