/* "use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ProjectInterface } from "@/lib/actions/project.action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code2, Star, GitFork, Eye, MoreHorizontal, ExternalLink, Trash2, Edit, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useToast } from "../ui/use-toast"


interface ProjectCardProps {
  project: ProjectInterface
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { toast } = useToast()
  const [isStarred, setIsStarred] = useState(project.isStarred)
  const [starCount, setStarCount] = useState(project.stars)

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsStarred(!isStarred)
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1))

    toast({
      title: isStarred ? "Project removed from starred" : "Project added to starred",
      variant: isStarred ? "default" : "default",
    })
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "view":
        toast({ title: "Opening project details" })
        break
      case "edit":
        toast({ title: "Edit project functionality would open here" })
        break
      case "clone":
        toast({ title: "Project URL copied to clipboard", variant: "default" })
        break
      case "delete":
        toast({ title: "Project deleted", variant: "destructive" })
        break
    }
  }

  // Calculate completion percentage
  const completionPercentage = project.completionPercentage || Math.floor(Math.random() * 100)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-wrapper rounded-xl border border-light-300 dark:border-dark-300 p-6 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${project.languageColor || "bg-primary/20"}`}>
            <Code2 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-dark100_light900 hover:text-primary transition-colors">
              <a href={`/projects/${project.id}`}>{project.name}</a>
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{project.description}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction("view")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("clone")}>
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.technologies.slice(0, 3).map((tech) => (
          <Badge key={tech} variant="outline" className="bg-background">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 3 && (
          <Badge variant="outline" className="bg-background">
            +{project.technologies.length - 3} more
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Completion</span>
          <span className="text-xs font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-1.5" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-light-300 dark:border-dark-300">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" onClick={handleStar}>
                  <Star
                    className={`h-4 w-4 ${isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                  />
                  <span className="text-xs">{starCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isStarred ? "Unstar" : "Star"} this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{project.forks}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fork this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{project.watchers}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Watch this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-muted-foreground">Updated {project.lastUpdated}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard

 */