import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import { Suspense } from "react";
import {
  TagIcon,
  TrendingUp,
  Zap,
  Hash,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PopularTagCloud from "@/components/tags/PopularTagCloud";
import TagCard from "@/components/tags/TagCard";
import TagCategorySection from "@/components/tags/TagCategorySection";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function TagsPage({ searchParams }: Props) {
  const { q, filter } = await searchParams;
  const result = await getAllTags({
    searchQuery: q,
    filter,
    pageSize: 1000, // Set a very large number to effectively show all tags
  });

  // Serialize MongoDB documents to plain JavaScript objects
  const serializedTags = JSON.parse(JSON.stringify(result.tags));

  // Mock categories for demonstration
  const categories = [
    {
      name: "Frontend",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      name: "Backend",
      icon: <Hash className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      name: "Database",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    {
      name: "DevOps",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-orange-500",
    },
  ];

  // Group tags by first letter for alphabetical display
  const groupedByLetter = serializedTags.reduce((acc: any, tag: any) => {
    const firstLetter = tag.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {});

  // Sort letters alphabetically
  const sortedLetters = Object.keys(groupedByLetter).sort();

  // Get trending tags (top 5 by question count)
  const trendingTags = [...serializedTags]
    .sort((a, b) => b.questions.length - a.questions.length)
    .slice(0, 5);

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl primary-gradient text-white mb-8 animate-fade-in">
        <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <TagIcon className="h-8 w-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Explore Tags</h1>
              </div>
              <p className="text-lg text-white/90 max-w-xl mb-6">
                Discover topics that interest you. Tags help categorize
                questions and make it easier to find relevant content.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-primary-500 hover:bg-white/90 rounded-full px-6">
                  Browse Popular Tags
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-6"
                >
                  Create New Tag
                </Button>
              </div>
            </div>

            {/* Tag Cloud Animation */}
            <div className="relative w-full md:w-auto animate-slide-down">
              <PopularTagCloud tags={trendingTags.slice(0, 15)} />
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Tags Section */}
      <div className="card-wrapper rounded-xl p-8 border border-gray-100 dark:border-gray-700 mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark100_light900">
              Trending Tags
            </h2>
          </div>

          <Button variant="ghost" size="sm" className="text-primary-500">
            View All Trends
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {trendingTags.map((tag: any) => (
            <TagCard
              key={tag._id}
              tag={tag}
              isPopular={true}
              trendPercentage={Math.floor(Math.random() * 200) - 50} // Random trend between -50% and +150%
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="card-wrapper rounded-xl p-8 border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark100_light900">All Tags</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {serializedTags.length} tags available
          </span>
        </div>

        <div className="mt-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <Suspense
            fallback={
              <div className="h-14 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
            }
          >
            <LocalSearchbar
              route="/tags"
              iconPosition="left"
              imgSrc="/assets/icons/search.svg"
              placeholder="Search for tags"
              otherClasses="flex-1"
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-10 w-full rounded-lg bg-light-700 dark:bg-dark-500 animate-pulse" />
            }
          >
            <Filter
              filters={TagFilters}
              otherClasses="min-h-[56px] sm:min-w-[170px]"
            />
          </Suspense>
        </div>

        {/* Tag Categories */}
        <div className="mt-8 mb-10">
          <h3 className="text-lg font-semibold text-dark100_light900 mb-4">
            Browse by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <TagCategorySection
                key={category.name}
                category={category}
                tags={serializedTags.slice(index * 3, index * 3 + 3)}
              />
            ))}
          </div>
        </div>

        {/* Alphabetical Tag List */}
        {serializedTags.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-dark100_light900 mb-4">
              Browse Alphabetically
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              {sortedLetters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-500 hover:text-white transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>

            {sortedLetters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full primary-gradient text-white font-bold">
                    {letter}
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {groupedByLetter[letter].map((tag: any) => (
                    <TagCard key={tag._id} tag={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags matching your search. Try a different keyword or create a new tag."
            link="/ask-question"
            linktitle="Ask a question"
          />
        )}
      </div>
    </>
  );
}
