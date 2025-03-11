import { getHotQuestions } from "@/lib/actions/question.action"
import { getTopPopularTags } from "@/lib/actions/tag.actions"
import { getTopContributors } from "@/lib/actions/user.action"
import RightSidebarContent from "./search/right-sidebar-content"

const RightSidebar = async () => {
  // Fetch all data in parallel to avoid waterfalls
  const [rawHotQuestions, rawPopularTags, rawTopContributors] = await Promise.all([
    getHotQuestions(),
    getTopPopularTags(),
    getTopContributors(),
  ])

  // Serialize the Mongoose objects to plain JavaScript objects
  const hotQuestions = JSON.parse(JSON.stringify(rawHotQuestions))
  const popularTags = JSON.parse(JSON.stringify(rawPopularTags))
  const topContributors = JSON.parse(JSON.stringify(rawTopContributors))

  return <RightSidebarContent hotQuestions={hotQuestions} popularTags={popularTags} topContributors={topContributors} />
}

export default RightSidebar

