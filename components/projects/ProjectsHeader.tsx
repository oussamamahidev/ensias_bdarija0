/* "use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Grid3x3, List, Star, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FeaturedProject } from "@/lib/actions/project.action"
import ProjectCreateModal from "./ProjectCreateModal"
import { useRouter } from "next/navigation"


interface ProjectsHeaderProps {
  totalProjects: number
  view: string
  featured: FeaturedProject | null
}

const ProjectsHeader = ({ totalProjects, view, featured }: ProjectsHeaderProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const [showAnimation, setShowAnimation] = useState(false)
  const [lastProjectCount, setLastProjectCount] = useState(totalProjects)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    // Check if a new project was added
    if (totalProjects > lastProjectCount && lastProjectCount > 0) {
      setShowAnimation(true)
      toast({ title: "New project added!" })

      // Reset animation after 3 seconds
      setTimeout(() => {
        setShowAnimation(false)
      }, 3000)
    }

    setLastProjectCount(totalProjects)
  }, [totalProjects, lastProjectCount, toast])

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative">
          <h1 className="h1-bold text-dark100_light900 flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span>My Projects</span>

            <AnimatePresence>
              {showAnimation && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -right-12 -top-12"
                >
                  <Sparkles className="h-10 w-10 text-yellow-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </h1>
          <p className="text-muted-foreground mt-1">
            You have {totalProjects} project{totalProjects !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" className="rounded-md" asChild>
            <a href={`/projects?view=grid`}>
              <Grid3x3 className="h-5 w-5" />
            </a>
          </Button>
          <Button variant={view === "list" || !view ? "default" : "outline"} size="icon" className="rounded-md" asChild>
            <a href={`/projects?view=list`}>
              <List className="h-5 w-5" />
            </a>
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary-500 to-orange-400 hover:from-primary-600 hover:to-orange-500"
          >
            <Code2 className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 rounded-xl border border-primary/20"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-dark100_light900">Featured Project</h3>
                <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                  <Star className="h-3 w-3 mr-1 fill-primary" /> Featured
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-dark100_light900">{featured.name}</h2>
              <p className="text-muted-foreground mt-1 line-clamp-2">{featured.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {featured.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-background">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/projects/${featured.id}`)
                    }}
                  >
                    View Project
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open project details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {featured.contributors.map((contributor, index) => (
                  <img
                    key={index}
                    src={contributor.image || "/placeholder.svg?height=32&width=32"}
                    alt={contributor.name}
                    className="h-6 w-6 rounded-full border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {featured.contributors.length} contributor{featured.contributors.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{featured.stars || 0}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated {new Date(featured.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          router.refresh()
        }}
      />
    </>
  )
}

export default ProjectsHeader

 */