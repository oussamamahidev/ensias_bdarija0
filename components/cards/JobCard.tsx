"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bookmark, Briefcase, Building, Clock, ExternalLink, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

interface JobCardProps {
  job: any
}

const JobCard = ({ job }: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(false)

  // Generate a random match score between 70-98
  const matchScore = Math.floor(Math.random() * 29) + 70

  // Format the date to show how many days ago
  const getPostedDate = () => {
    const days = Math.floor(Math.random() * 14) + 1
    return days === 1 ? "1 day ago" : `${days} days ago`
  }

  // Get company logo or placeholder
  const getCompanyLogo = () => {
    if (job.employerLogo) return job.employerLogo
    return `/placeholder.svg?height=40&width=40`
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-light-700 dark:border-dark-400 hover:shadow-md transition-all duration-300">
        <CardHeader className="p-4 bg-light-800/50 dark:bg-dark-300/50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-light-700 dark:bg-dark-400">
              <Image
                src={getCompanyLogo() || "/placeholder.svg"}
                alt={job.employerName || "Company logo"}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="font-semibold text-dark100_light900 line-clamp-1">{job.jobTitle}</h3>
              <p className="text-sm text-dark500_light700">{job.employerName}</p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? "Saved" : "Save job"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {job.jobEmploymentType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.jobEmploymentType}
              </Badge>
            )}

            {job.jobLocation && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.jobLocation}
              </Badge>
            )}

            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getPostedDate()}
            </Badge>

            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${
                matchScore > 90
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : matchScore > 80
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              <Star className="h-3 w-3 fill-current" />
              {matchScore}% Match
            </Badge>
          </div>

          <p className="text-dark500_light700 line-clamp-2 text-sm">
            {job.jobDescription ||
              "Join our team and work on exciting projects in a collaborative environment. We offer competitive compensation and benefits."}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{job.employerName}</span>
          </div>

          <Link href={job.jobApplyLink?.url || "#"} target="_blank">
            <Button size="sm" className="gap-1.5">
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default JobCard

