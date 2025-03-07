import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilers";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Pagination from "@/components/shared/search/Pagination";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: 'Home | D2sFlow',
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { userId } = await auth();
  let result;
  
  const { q, filter, page } = await searchParams;

  if (filter === 'recommended') {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: q,
        page: parseInt(page || "1"),
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: q,
      filter: filter,
      page: parseInt(page || "1"),
    });
  }
   
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense fallback={<div className="flex-1 h-[56px] bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}>
          <LocalSearch
            route="/"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search questions..."
            otherClasses="flex-1"
          />
        </Suspense>
        <Suspense fallback={<div className="h-[56px] w-[170px] bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}>
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </Suspense>
      </div>
      <Suspense fallback={<div className="mt-10 h-14 w-full bg-light-700/50 dark:bg-dark-500/50 animate-pulse rounded-lg" />}>
        <HomeFilters />
      </Suspense>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
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
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link="/ask-question"
            linktitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Suspense fallback={<Loading />}>
          <Pagination pageNumber={page ? +page : 1} isNext={result.isNext || false} />
        </Suspense>
      </div>
    </>
  );
}