"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageSquare, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TopContributorsProps {
  contributors: {
    id: string
    name: string
    image: string
    questions: number
    answers: number
  }[]
}

export default function TopContributors({ contributors }: TopContributorsProps) {
  if (!contributors || contributors.length === 0) {
    return <div className="text-center py-4 text-dark400_light700">No contributors found</div>
  }

  return (
    <div className="space-y-4">
      {contributors.map((contributor, index) => (
        <Link key={contributor.id} href={`/profile/${contributor.id}`}>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-light-800 dark:hover:bg-dark-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={contributor.image || "/placeholder.svg"}
                  alt={contributor.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs flex items-center justify-center rounded-full">
                  {index + 1}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-dark200_light900">{contributor.name}</h4>
                <div className="flex items-center gap-2 text-xs text-dark400_light700">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        <span>{contributor.questions}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Questions asked</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{contributor.answers}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Answers provided</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary-500">
                {contributor.questions + contributor.answers}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

