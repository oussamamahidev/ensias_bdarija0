"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import RenderTag from "../RenderTag"


// Define proper interfaces that match your database models
interface IQuestion {
  _id: string
  title: string
}

interface ITag {
  _id: string
  name: string
  questions: string[] // Array of question IDs
}

interface IUser {
  _id: string
  name: string
  picture?: string
  reputation?: number
}

interface RightSidebarContentProps {
  hotQuestions: IQuestion[]
  popularTags: ITag[]
  topContributors: IUser[]
}

const RightSidebarContent = ({ hotQuestions, popularTags, topContributors }: RightSidebarContentProps) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Any client-side effects can go here
    setLoading(false)
  }, [])

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {loading ? (
            <div>Loading questions...</div>
          ) : (
            hotQuestions.map((question) => (
              <Link
                href={`/question/${question._id}`}
                key={question._id.toString()}
                className="flex cursor-pointer items-center justify-between gap-7"
              >
                <p className="body-medium text-dark500_light700">{question.title}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {loading ? (
            <div>Loading tags...</div>
          ) : (
            popularTags.map((tag) => (
              <RenderTag
                key={tag._id.toString()}
                _id={tag._id.toString()}
                name={tag.name}
                totalQuestions={tag.questions.length}
                showCount
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Top Contributors</h3>
        <div className="mt-7 flex flex-col gap-4">
          {loading ? (
            <div>Loading contributors...</div>
          ) : (
            topContributors.map((contributor) => (
              <Link
                href={`/profile/${contributor._id}`}
                key={contributor._id.toString()}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={contributor.picture || "/assets/icons/avatar.svg"}
                    alt={contributor.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <p className="body-medium text-dark500_light700">{contributor.name}</p>
                </div>
                <p className="body-medium text-dark500_light700">{contributor.reputation || 0}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default RightSidebarContent

