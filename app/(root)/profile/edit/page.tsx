
import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

interface EditPageProps {
    params: Promise<{ id: string }>;
  }
const Page = async ({ params }: EditPageProps) => {
  const { userId } =await auth();
  const { id } = await params;
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile 
        clerkId={userId}
        user={JSON.stringify(mongoUser)}/>
      </div>
    </>
  );
};

export default Page;