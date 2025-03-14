/* "use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  Star,
  GitFork,
  Eye,
  Calendar,
  Clock,
  Users,
  Link2,
  Folder,
  File,
  Plus,
  GitPullRequest,
  Share2,
  Download,
  Sparkles,
  Activity,
  BarChart2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Heart,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoResult from "@/components/shared/NoResult"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { getMockProjectDetails } from "@/lib/actions/project.action"

interface Props {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const { toast } = useToast()
  const [isStarred, setIsStarred] = useState(false)
  const [isWatching, setIsWatching] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)

        // Use the new mock data function
        const {
          project: projectData,
          activities: activityData,
          issues: issueData,
          pullRequests: prData,
          files: fileData,
          relatedProjects: relatedData,
        } = await getMockProjectDetails(params.id)

        setProject(projectData)
        setActivities(activityData)
        setIsStarred(projectData.isStarred)

        // You can add more state variables to store the other data
        // For example:
        // setIssues(issueData);
        // setPullRequests(prData);
        // setFiles(fileData);
        // setRelatedProjects(relatedData);
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id, toast])

  const handleStar = () => {
    setIsStarred(!isStarred)

    if (!isStarred) {
      // Trigger confetti when starring
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#FFD700", "#FFC107", "#FFEB3B"],
      })

      toast({
        title: "Project starred!",
        description: "This project has been added to your starred projects.",
      })
    } else {
      toast({
        title: "Project unstarred",
        description: "This project has been removed from your starred projects.",
      })
    }
  }

  const handleWatch = () => {
    setIsWatching(!isWatching)

    toast({
      title: isWatching ? "Unwatched project" : "Watching project",
      description: isWatching
        ? "You will no longer receive notifications for this project."
        : "You will receive notifications for new activities on this project.",
    })
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=Check out this awesome project&url=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Project link has been copied to clipboard.",
        })
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }

    setShowShareOptions(false)
  }

  const handleFork = () => {
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.5, x: 0.3 },
      colors: ["#4CAF50", "#8BC34A", "#CDDC39"],
    })

    toast({
      title: "Project forked!",
      description: "A copy of this project has been added to your repositories.",
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <NoResult
          title="Project Not Found"
          description="The project you're looking for doesn't exist or has been removed."
          link="/projects"
          linktitle="Back to Projects"
        />
      </div>
    )
  }

  // Calculate completion percentage
  const completionPercentage = project.completionPercentage || Math.floor(Math.random() * 100)

  // Mock project health metrics
  const healthMetrics = {
    codeQuality: 87,
    testCoverage: 72,
    performance: 94,
    security: 81,
    accessibility: 68,
  }

  // Mock commit activity data
  const commitActivity = [25, 15, 30, 22, 18, 35, 42, 30, 25, 20, 15, 28]

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
       
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`p-4 rounded-lg ${project.languageColor || "bg-primary/20"}`}
            >
              <Code2 className="h-8 w-8 text-primary" />
            </motion.div>

            <div>
              <h1 className="h1-bold text-dark100_light900">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.technologies.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="bg-background px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-2" onClick={handleStar}>
                    <Star className={`h-4 w-4 ${isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    {isStarred ? "Starred" : "Star"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isStarred ? "Remove from starred projects" : "Add to starred projects"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-2" onClick={handleFork}>
                    <GitFork className="h-4 w-4" />
                    Fork
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a copy of this project in your account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-2" onClick={handleWatch}>
                    <Eye className={`h-4 w-4 ${isWatching ? "text-blue-500" : ""}`} />
                    {isWatching ? "Watching" : "Watch"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isWatching ? "Stop watching this project" : "Get notified of new activity"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu open={showShareOptions} onOpenChange={setShowShareOptions}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Share Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="gap-2 bg-gradient-to-r from-primary-500 to-orange-400 hover:from-primary-600 hover:to-orange-500"
              onClick={() => {
                toast({
                  title: "Opening live demo",
                  description: "Redirecting to the project's live demo...",
                })
              }}
            >
              <Link2 className="h-4 w-4" />
              View Live
            </Button>
          </div>
        </div>

       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-xl"
        >
          <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-light-300 dark:border-dark-300">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{project.stars}</span>
            </div>
            <p className="text-sm text-muted-foreground">Stars</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-light-300 dark:border-dark-300">
            <div className="flex items-center gap-2 mb-2">
              <GitFork className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{project.forks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Forks</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-light-300 dark:border-dark-300">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{project.watchers}</span>
            </div>
            <p className="text-sm text-muted-foreground">Watchers</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-light-300 dark:border-dark-300">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{project.contributors.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </div>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="issues" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Issues</span>
                </TabsTrigger>
                <TabsTrigger value="pull-requests" className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4" />
                  <span className="hidden sm:inline">PRs</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="overview" className="space-y-6">
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        Project Overview
                      </h3>
                      <p className="text-muted-foreground">{project.description}</p>

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Completion</span>
                          <span className="text-sm">{completionPercentage}%</span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-2 bg-primary rounded-full"
                        />
                      </div>

                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Stars</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{project.stars}</span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Forks</span>
                          <div className="flex items-center gap-1 mt-1">
                            <GitFork className="h-4 w-4 text-primary" />
                            <span className="font-medium">{project.forks}</span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Watchers</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{project.watchers}</span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Updated</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{project.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                   
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Project Health
                      </h3>

                      <div className="space-y-4">
                        {Object.entries(healthMetrics).map(([key, value], index) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                              <span className="text-sm font-medium">{value}%</span>
                            </div>
                            <motion.div
                              className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <motion.div
                                className={`h-full rounded-full ${
                                  value > 80 ? "bg-green-500" : value > 60 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                              />
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>

                 
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Commit Activity
                      </h3>

                      <div className="flex items-end h-40 gap-1 mt-4">
                        {commitActivity.map((value, index) => (
                          <motion.div
                            key={index}
                            className="bg-primary/60 hover:bg-primary rounded-t-md w-full"
                            initial={{ height: 0 }}
                            animate={{ height: `${(value / Math.max(...commitActivity)) * 100}%` }}
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="w-full h-full" />
                                <TooltipContent>
                                  <p>
                                    {value} commits in month {index + 1}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Jan</span>
                        <span>Dec</span>
                      </div>
                    </div>

                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Contributors
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.contributors.map((contributor: any, index: number) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-background rounded-lg border border-light-300 dark:border-dark-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <img
                              src={contributor.image || "/placeholder.svg?height=40&width=40"}
                              alt={contributor.name}
                              className="h-10 w-10 rounded-full border-2 border-background"
                            />
                            <div>
                              <p className="font-medium text-dark100_light900">{contributor.name}</p>
                              <p className="text-xs text-muted-foreground">Contributor</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="files">
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <Folder className="h-5 w-5 text-primary" />
                        Project Files
                      </h3>
                      <p className="text-muted-foreground mb-6">Browse the project files and directories</p>

                      <div className="space-y-2">
                        {[
                          { name: "src", type: "directory", lastUpdated: "2 days ago", items: 12 },
                          { name: "public", type: "directory", lastUpdated: "1 week ago", items: 5 },
                          { name: "components", type: "directory", lastUpdated: "3 days ago", items: 24 },
                          { name: "pages", type: "directory", lastUpdated: "4 days ago", items: 8 },
                          { name: "styles", type: "directory", lastUpdated: "5 days ago", items: 3 },
                          { name: "package.json", type: "file", lastUpdated: "3 days ago", size: "2.4 KB" },
                          { name: "README.md", type: "file", lastUpdated: "2 days ago", size: "4.1 KB" },
                          { name: "tsconfig.json", type: "file", lastUpdated: "2 weeks ago", size: "1.2 KB" },
                          { name: ".env.example", type: "file", lastUpdated: "1 month ago", size: "0.5 KB" },
                          { name: ".gitignore", type: "file", lastUpdated: "1 month ago", size: "0.3 KB" },
                        ].map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ x: 5, backgroundColor: "rgba(var(--card-foreground-rgb), 0.05)" }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-light-700/50 dark:hover:bg-dark-500/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {file.type === "directory" ? (
                                <Folder className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <File className="h-5 w-5 text-blue-500" />
                              )}
                              <span className="font-medium text-dark100_light900">{file.name}</span>
                              {file.type === "directory" && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {file.items} items
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              {file.type === "file" && (
                                <span className="text-xs text-muted-foreground">{file.size}</span>
                              )}
                              <span className="text-xs text-muted-foreground">{file.lastUpdated}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="issues">
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-dark100_light900 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          Issues
                        </h3>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          New Issue
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: "Fix authentication bug on mobile",
                            status: "open",
                            priority: "high",
                            assignee: project.contributors[0],
                            createdAt: "3 days ago",
                            comments: 5,
                          },
                          {
                            id: 2,
                            title: "Improve loading performance",
                            status: "open",
                            priority: "medium",
                            assignee:
                              project.contributors.length > 1 ? project.contributors[1] : project.contributors[0],
                            createdAt: "1 week ago",
                            comments: 3,
                          },
                          {
                            id: 3,
                            title: "Update documentation",
                            status: "closed",
                            priority: "low",
                            assignee: project.contributors[0],
                            createdAt: "2 weeks ago",
                            comments: 2,
                          },
                          {
                            id: 4,
                            title: "Add dark mode support",
                            status: "open",
                            priority: "medium",
                            assignee:
                              project.contributors.length > 1 ? project.contributors[1] : project.contributors[0],
                            createdAt: "5 days ago",
                            comments: 7,
                          },
                          {
                            id: 5,
                            title: "Fix responsive layout on small screens",
                            status: "closed",
                            priority: "high",
                            assignee: project.contributors[0],
                            createdAt: "1 day ago",
                            comments: 0,
                          },
                        ].map((issue, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                              issue.status === "closed"
                                ? "border-green-500/20 bg-green-500/5"
                                : issue.priority === "high"
                                  ? "border-red-500/20 bg-red-500/5"
                                  : issue.priority === "medium"
                                    ? "border-yellow-500/20 bg-yellow-500/5"
                                    : "border-blue-500/20 bg-blue-500/5"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-dark100_light900 flex items-center gap-2">
                                  #{issue.id} {issue.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant={issue.status === "open" ? "destructive" : "default"}
                                    className="text-xs"
                                  >
                                    {issue.status}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      issue.priority === "high"
                                        ? "text-red-500"
                                        : issue.priority === "medium"
                                          ? "text-yellow-500"
                                          : "text-blue-500"
                                    }`}
                                  >
                                    {issue.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Opened {issue.createdAt}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{issue.comments}</span>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <img
                                          src={issue.assignee.image || "/placeholder.svg?height=24&width=24"}
                                          alt={issue.assignee.name}
                                          className="h-6 w-6 rounded-full border-2 border-background"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Assigned to {issue.assignee.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pull-requests">
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-dark100_light900 flex items-center gap-2">
                          <GitPullRequest className="h-5 w-5 text-primary" />
                          Pull Requests
                        </h3>
                        <Button size="sm" className="gap-2">
                          <GitPullRequest className="h-4 w-4" />
                          New PR
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: "Add dark mode support",
                            status: "open",
                            author: project.contributors[0],
                            createdAt: "3 days ago",
                            comments: 8,
                            commits: 5,
                            changedFiles: 12,
                          },
                          {
                            id: 2,
                            title: "Fix responsive layout issues",
                            status: "merged",
                            author: project.contributors.length > 1 ? project.contributors[1] : project.contributors[0],
                            createdAt: "1 week ago",
                            comments: 3,
                            commits: 2,
                            changedFiles: 4,
                          },
                          {
                            id: 3,
                            title: "Implement authentication with OAuth",
                            status: "open",
                            author: project.contributors[0],
                            createdAt: "2 days ago",
                            comments: 5,
                            commits: 7,
                            changedFiles: 15,
                          },
                          {
                            id: 4,
                            title: "Update dependencies to latest versions",
                            status: "merged",
                            author: project.contributors.length > 1 ? project.contributors[1] : project.contributors[0],
                            createdAt: "2 weeks ago",
                            comments: 1,
                            commits: 1,
                            changedFiles: 1,
                          },
                        ].map((pr, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                              pr.status === "merged"
                                ? "border-purple-500/20 bg-purple-500/5"
                                : pr.status === "open"
                                  ? "border-green-500/20 bg-green-500/5"
                                  : "border-red-500/20 bg-red-500/5"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-dark100_light900 flex items-center gap-2">
                                  #{pr.id} {pr.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant={
                                      pr.status === "merged"
                                        ? "secondary"
                                        : pr.status === "open"
                                          ? "default"
                                          : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {pr.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Opened {pr.createdAt} by {pr.author.name}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{pr.comments}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <GitFork className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{pr.commits}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{pr.changedFiles}</span>
                                  </div>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <img
                                          src={pr.author.image || "/placeholder.svg?height=24&width=24"}
                                          alt={pr.author.name}
                                          className="h-6 w-6 rounded-full border-2 border-background"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Created by {pr.author.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity">
                    <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                      </h3>

                      <div className="relative border-l-2 border-muted-foreground/20 pl-6 ml-3 space-y-8">
                        {activities.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative"
                          >
                            <div className="absolute -left-9 p-1 bg-background rounded-full border border-muted-foreground/20">
                              {activity.action.includes("created") ? (
                                <Plus className="h-4 w-4 text-green-500" />
                              ) : activity.action.includes("merged") ? (
                                <GitPullRequest className="h-4 w-4 text-purple-500" />
                              ) : activity.action.includes("fixed") ? (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              ) : activity.action.includes("opened") ? (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <Activity className="h-4 w-4 text-primary" />
                              )}
                            </div>

                            <div className="flex items-start gap-3">
                              <img
                                src={activity.user.image || "/placeholder.svg"}
                                alt={activity.user.name}
                                className="h-8 w-8 rounded-full border-2 border-background mt-1"
                              />
                              <div>
                                <p className="text-dark100_light900">
                                  <span className="font-medium">{activity.user.name}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                About
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-dark100_light900">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium text-dark100_light900">{project.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                    <p className="text-sm font-medium text-dark100_light900">{project.contributors.length}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <p className="text-sm font-medium text-dark100_light900">
                      {project.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Languages
              </h3>

              <div className="space-y-3">
                {[
                  { name: "TypeScript", percentage: 65, color: "bg-blue-500" },
                  { name: "JavaScript", percentage: 20, color: "bg-yellow-500" },
                  { name: "CSS", percentage: 10, color: "bg-purple-500" },
                  { name: "HTML", percentage: 5, color: "bg-orange-500" },
                ].map((language, index) => (
                  <motion.div
                    key={index}
                    className="space-y-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-dark100_light900">{language.name}</span>
                      <span className="text-xs text-muted-foreground">{language.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${language.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${language.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-light-800/20 dark:bg-dark-400/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-dark100_light900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Related Projects
              </h3>

              <div className="space-y-3">
                {[1, 2, 3].map((_, index) => {
                  const relatedProject =
                    project.id === "project-1"
                      ? {
                          id: `project-${index + 2}`,
                          name: ["AI Image Generator", "E-commerce Platform", "Weather Dashboard"][index],
                          description: [
                            "AI-powered image generation",
                            "Full-featured e-commerce platform",
                            "Real-time weather dashboard",
                          ][index],
                          languageColor: ["bg-green-500/20", "bg-purple-500/20", "bg-yellow-500/20"][index],
                        }
                      : {
                          id: index === 0 ? "project-1" : `project-${index + 3}`,
                          name:
                            index === 0 ? "DevOverflow Clone" : ["Task Management App", "Fitness Tracker"][index - 1],
                          description:
                            index === 0
                              ? "Stack Overflow clone"
                              : ["Collaborative task management", "Mobile-first fitness tracking"][index - 1],
                          languageColor:
                            index === 0 ? "bg-blue-500/20" : ["bg-emerald-500/20", "bg-red-500/20"][index - 1],
                        }

                  return (
                    <motion.a
                      key={index}
                      href={`/projects/${relatedProject.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-light-700/50 dark:hover:bg-dark-500/50 transition-colors block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ x: 5 }}
                    >
                      <div className={`p-2 rounded-md ${relatedProject.languageColor}`}>
                        <Code2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-dark100_light900">{relatedProject.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{relatedProject.description}</p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

*/