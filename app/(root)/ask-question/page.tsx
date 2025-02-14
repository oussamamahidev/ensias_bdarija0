import React from 'react'
import Question from "@/components/forms/Question";


const AskQuestion = () => {
  return (
    <section className="container mx-auto px-4" aria-label="Ask a question">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Ask a Question
      </h1>
      <div className="mt-9">
        <Question />
      </div>
    </section>
  )
}

export default AskQuestion
